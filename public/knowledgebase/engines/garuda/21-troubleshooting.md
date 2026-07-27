---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 21 — Troubleshooting

## 1. Authentication Failure — 401 Unauthorized

**Symptoms:** All API calls return HTTP 401 after successful login.

**Causes:**
- Access token expired (15-minute TTL)
- Token malformed or truncated
- Token revoked (logout, admin action, or security event)
- Clock skew between client and server

**Resolution:**
1. Refresh token via `POST /v3/auth/refresh`
2. If refresh fails, re-authenticate with username/password
3. Check `Date` response header for server time; adjust client clock if >30s skew
4. Verify account is not locked: check `failed_attempts` in user record

---

## 2. SPAN File Not Found — 422 Unprocessable Entity

**Symptoms:** `POST /margin/contract` returns 422 with message "SPAN file not loaded."

**Causes:**
- Exchange hasn't published the file yet (before 8:15 AM IST)
- SFTP download failed (network, credentials, disk full)
- File parser rejected file (format change, corruption)
- Cache expired and database lookup failed

**Resolution:**
1. Check `/health` → `span_parameters` status and `lastSpanFile` date
2. Verify current time vs exchange release schedule
3. Manually download and place SPAN file in `/data/exchange/files/`
4. Trigger re-ingestion: `POST /admin/exchange/NSE/refresh-span`
5. Check file download logs: `kubectl logs -l app=garuda-file-processor`

---

## 3. Margin Calculation Timeout — 504 Gateway Timeout

**Symptoms:** Request times out after 30 seconds, no response received.

**Causes:**
- Very large portfolio (>500 positions per request)
- SPAN parameters not cached (cold start)
- Database under heavy load
- Network latency between services

**Resolution:**
1. Split large portfolios into smaller batches
2. Increase client timeout to 60-120 seconds
3. Check database query performance: slow query log
4. Verify Redis is healthy and cache hit ratio >85%
5. Check `Kafka consumer lag` — if high, some components backlogged

---

## 4. Hedge Recommendation Returns Empty

**Symptoms:** `POST /intelligence/hedge` returns empty recommendations array.

**Causes:**
- Portfolio already well-hedged (delta near 0, gamma neutral)
- No eligible hedge instruments matching optimization goal
- All hedge candidates violate position limits
- Cost of all hedges exceeds configured `max_hedge_cost`
- Margin Intelligence model not loaded (first startup, model file missing)

**Resolution:**
1. Check portfolio Greeks in response: `net_delta`, `net_gamma`
2. If delta < tolerance (default 0.05), portfolio is already optimized
3. Try `MINIMIZE_MARGIN` goal instead of `DELTA_NEUTRAL`
4. Increase `max_hedge_cost` parameter
5. Verify model files exist: `/data/models/gradient_boosting_v2.model`
6. Check Intelligence Engine logs for model loading errors

---

## 5. Margin Discrepancy vs Broker Terminal

**Symptoms:** Garuda-computed margin differs from broker trading terminal display.

**Causes:**
- Different SPAN file date (Garuda using newer/older file)
- Price source difference: LTP vs EOD settlement price
- Broker terminal not applying all benefits (calendar, portfolio)
- Symbol mapping mismatch (different instrument types)
- Exchange segment configuration difference

**Resolution:**
1. Check `/health` → `lastSpanFile` date — must match broker's file date
2. Compare margin breakdown component by component
3. Use `?calculation_type=EOD` to match broker's EOD display
4. Verify symbol mapping in `contracts` table
5. Run reconciliation: `POST /admin/reconciliation/run`
6. Tolerance up to 0.01% is acceptable per SEBI guidelines

---

## 6. Redis Connection Failure

**Symptoms:** Errors like "No connection is available to service this operation" or "Redis timeout."

**Causes:**
- Redis server down or restarting
- Redis memory full (eviction policy triggered)
- Connection pool exhausted
- Network partition between app and Redis

**Resolution:**
1. Check Redis status: `redis-cli -h <host> -a <pass> PING`
2. Check memory: `redis-cli INFO memory | grep used_memory_human`
3. If memory >80%, increase `maxmemory` or scale Redis cluster
4. Check eviction policy: should be `volatile-lru` or `allkeys-lru`
5. Check `maxclients` setting; increase if connections maxed
6. Restart Redis if unresponsive
7. Application will function in degraded mode (DB fallback) while Redis recovers

---

## 7. Kafka Consumer Lag Buildup

**Symptoms:** Events processed with significant delay; real-time margin updates stale.

**Causes:**
- Consumer processing slower than production rate
- Insufficient consumer instances (partitions > consumers)
- Message size too large causing processing bottlenecks
- Poison pill messages blocking consumer

**Resolution:**
1. Check lag: `kafka-consumer-groups --describe --group garuda-consumer-group`
2. Scale consumer replicas: `kubectl scale deployment garuda-margin-engine --replicas=20`
3. Increase topic partitions to allow more parallelism
4. Check DLQ (Dead Letter Queue) for poison messages
5. Optimize consumer processing: batch operations, reduce DB round-trips
6. If single broker causing lag, isolate to separate consumer group

---

## 8. Database Connection Pool Exhausted

**Symptoms:** Errors: "Timeout waiting for connection from pool" or "Too many clients."

**Causes:**
- Connection leak (connections not returned to pool)
- Max connections reached (default: 200 per instance × instances)
- Long-running queries blocking connections
- PostgreSQL `max_connections` limit hit

**Resolution:**
1. Check active connections: `SELECT count(*) FROM pg_stat_activity`
2. Identify long-running queries: `SELECT * FROM pg_stat_activity WHERE state = 'active' AND query_start < now() - interval '5 minutes'`
3. Kill idle transactions: `SELECT pg_terminate_backend(pid)`
4. Increase `MaxPoolSize` in connection string
5. Increase PostgreSQL `max_connections` (default: 100)
6. Implement connection retry with exponential backoff

---

## 9. EOD Batch Processing Failure

**Symptoms:** EOD batch at 3:45 PM IST fails; reports not generated.

**Causes:**
- Exchange file not yet available on SFTP
- File format changed (parser failure)
- Database disk full
- Memory exhausted during large batch
- Deadlock with concurrent operations

**Resolution:**
1. Check file download status: exchange_files table
2. Try manual file upload and processing
3. Check database disk: `SELECT pg_database_size('garuda')`
4. Scale up Margin Engine replicas for batch window
5. Split batch by broker: process sequentially not parallel
6. Check EOD batch logs: `kubectl logs -l app=garuda-eod-worker`
7. Trigger manual EOD: `POST /admin/reconciliation/run`

---

## 10. Peak Margin Tracking Misalignment

**Symptoms:** Peak margin reported differs between Garuda and exchange.

**Causes:**
- Snapshot intervals misaligned (exchange uses random 4 snapshots; Garuda uses 15-min intervals)
- Missing snapshot due to service restart during market hours
- Rounding precision differences at scale
- Different price source for snapshot calculation

**Resolution:**
1. Verify snapshot timestamps in `margin_calculations` table
2. Compare snapshot-by-snapshot against exchange reference
3. Ensure no service restarts during market hours (9:15 AM – 3:30 PM)
4. Use `DECIMAL(18,4)` precision for all monetary values
5. Run reconciliation with 0.01% tolerance
6. Peak margin = MAX of all snapshots; verify all snapshots were captured

## Quick Diagnostic Checklist

```
□ Check /health endpoint — all components healthy?
□ Verify authentication — token valid and not expired?
□ Check error code — reference error codes documentation
□ Inspect X-Request-ID header — use for log tracing
□ Review recent changes — any deployments or config changes?
□ Check logs — application, database, Redis, Kafka
□ Test with minimal input — does simple single position work?
□ Try sandbox environment — reproduce issue there?
□ Contact support — request ID, timestamp, and error details ready
```

## Support Contact

When opening a ticket, include:
- **X-Request-ID** from response header
- **Timestamp** (IST timezone)
- **Endpoint** and HTTP method
- **HTTP status** and full error response body
- **Relevant IDs**: user_id, broker_id, client_code
- **Steps to reproduce** with example payload
