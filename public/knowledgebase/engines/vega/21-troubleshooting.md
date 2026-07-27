# 21 — Troubleshooting Guide

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Diagnostic Tools

| Tool | Purpose | Command |
|---|---|---|
| Health endpoint | Overall system status | `curl https://vega-api.algoiq.com/api/v1/health` |
| Prometheus metrics | Component-level metrics | `curl http://localhost:9090/metrics` |
| RabbitMQ Management | Queue depths, consumer states | `https://mq.algoiq.com:15672` |
| Redis CLI | Key inspection, latency | `redis-cli -h redis.algoiq.internal` |
| PostgreSQL | Query analysis | `psql -h pg.algoiq.internal -d vega` |
| Jaeger UI | Distributed tracing | `https://jaeger.algoiq.com` |
| Kibana | Log search | `https://kibana.algoiq.com` |

---

## Common Issues & Resolutions

### Issue 1: Orders Not Reaching Broker

**Symptoms:**
- Order stuck in `ROUTED` state for > 5 seconds
- No broker order ID assigned

**Diagnosis:**

```bash
# Check FIX session status
redis-cli HGET broker:XTS:health status
# Expected: "connected"

# Check MQ queue depth
rabbitmqctl list_queues -p vega | grep routed
# If depth growing → Broker Integration not consuming

# Check Broker Integration logs
# Kibana: component:"BrokerIntegration" AND level:"error" AND @timestamp > now-15m
```

**Common Causes:**

| Cause | Check | Fix |
|---|---|---|
| FIX session disconnected | `vega_fix_session_state == 0` | Check broker network; reconnect |
| Sequence number mismatch | Logs show `SEQUENCE_MISMATCH` | Manual resend or sequence reset |
| Broker RMS block | Broker rejection with `RMS:Blocked` | Contact broker; adjust limits |
| FIX VM process crashed | `systemctl status vega-fix-xts` | Restart service |
| TCP connection timeout | `telnet fix.xtsbroker.com 9200` | Check firewall/VPN/lease line |

---

### Issue 2: High Order Rejection Rate

**Symptoms:**
- `vega_order_rejections_total` metric spiking
- Strategy users reporting unexpected rejections

**Diagnosis:**

```sql
-- Find top rejection reasons (last hour)
SELECT rejection_reason, COUNT(*) as count
FROM orders
WHERE state = 'REJECTED'
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY rejection_reason
ORDER BY count DESC;
```

**Common Causes:**

| Reason | Likely Cause | Resolution |
|---|---|---|
| `INVALID_SYMBOL` | Symbol ban list updated | Verify Ganesh symbol master; update ban list |
| `PRICE_BAND_EXCEEDED` | Market volatile; price moved > 20% | Adjust price band temporarily |
| `INSUFFICIENT_MARGIN` | User margin depleted | User must add funds |
| `RATE_LIMIT_EXCEEDED` | Strategy sending too many signals | Tune strategy; upgrade user tier |
| `KILL_SWITCH_ACTIVE` | User hit margin threshold | Risk team review → manual reset |
| `MARKET_CLOSED` | Order placed outside market hours | Queue order for next session |

---

### Issue 3: Kill Switch Falsely Activated

**Symptoms:**
- `vega_kill_switch_active == 1` but user margin is adequate
- PagerDuty alert received

**Diagnosis:**

```sql
-- Check kill switch activation details
SELECT * FROM kill_switch_events
WHERE user_id = 'USR-XXXX'
ORDER BY activated_at DESC
LIMIT 1;
```

**Common Causes:**

| Cause | Check | Fix |
|---|---|---|
| P&L data stale/incorrect | Verify Parikshak is publishing correct P&L | Correct Parikshak feed |
| Running P&L includes closed positions | Check P&L calculation logic | Fix P&L source |
| Threshold too tight (1.50% for volatile strategy) | Review strategy risk profile | Adjust per-strategy threshold |
| Redis pub/sub missed calculations | Check Redis memory; pub/sub channel | Flush stale data; restart pub/sub |

**Manual Reset:**

```bash
redis-cli DEL "vega:ks:USR-XXXX:halted"
# Then verify:
curl -X POST https://vega-api.algoiq.com/api/v1/admin/kill-switch/reset \
  -H "X-API-Key: admin_key" \
  -d '{"userId": "USR-XXXX"}'
```

---

### Issue 4: FIX Session Flapping

**Symptoms:**
- Frequent `FIX session connected` / `FIX session disconnected` log pairs
- `vega_fix_reconnect_total` counter increasing rapidly

**Diagnosis:**

```bash
# Check network stability
ping -c 100 fix.xtsbroker.com
# Look for packet loss > 1%

# Check heartbeat intervals
redis-cli GET "vega:fix:heartbeat:VEGA-PROD-01:XTS-BROKER"

# Check for sequence number resets
# Kibana: component:"BrokerIntegration" AND message:"SequenceReset"
```

**Common Causes:**

| Cause | Check | Fix |
|---|---|---|
| Network packet loss | `mtr fix.xtsbroker.com` | Contact network team; check lease line |
| Heartbeat interval mismatch | Compare Vega config vs broker config | Align heartbeat to 30s |
| Broker-side logout (MsgType=5) | FIX logs show `35=5` from broker | Check broker-side: RMS block, account issue |
| FIX VM resource exhaustion | `top`, `free -h` on FIX VM | Increase VM resources |
| TLS certificate expiry | `openssl s_client -connect fix.xtsbroker.com:9200` | Renew certificate |

---

### Issue 5: Database Connection Exhaustion

**Symptoms:**
- API returning 500 errors
- Logs show `too many clients` or `connection timeout`

**Diagnosis:**

```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'vega';
-- Compare to max_connections

-- Check long-running queries
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active' AND now() - query_start > interval '5 seconds';
```

**Resolution:**

```bash
# 1. Kill long-running queries (if safe)
SELECT pg_terminate_backend(pid) FROM pg_stat_activity
WHERE state = 'active' AND now() - query_start > interval '30 seconds';

# 2. Increase max_connections (requires restart)
# postgresql.conf: max_connections = 200

# 3. Check connection pool config in Vega:
# config.json → postgresql.poolMax (increase from 50 to 80)

# 4. Restart Vega services
systemctl restart vega-api vega-app vega-processor
```

---

### Issue 6: Rate Limiter Blocking Legitimate Traffic

**Symptoms:**
- 429 responses for valid users
- Rate limit counters not resetting

**Diagnosis:**

```bash
# Check current rate counter
redis-cli GET "vega:rate:USR-XXXX:counter"
# If stuck at high value → TTL issue

# Check TTL
redis-cli TTL "vega:rate:USR-XXXX:counter"
# Should be 1 second; if -1 → no TTL set
```

**Resolution:**

```bash
# Reset rate counter for user
redis-cli DEL "vega:rate:USR-XXXX:counter"

# If persistent, check rate limit tier
redis-cli GET "vega:user:USR-XXXX:tier"
# Update if needed: redis-cli SET "vega:user:USR-XXXX:tier" "premium"

# Check for bug in rate limiter Lua script
redis-cli SCRIPT DEBUG YES
```

---

## Emergency Procedures

### Emergency 1: Broker Connectivity Lost Mid-Market

```
1. Verify broker status:
   - Check broker health dashboard
   - Call broker's trading desk

2. If broker issue:
   - Orders automatically queue (not lost)
   - Once broker reconnects, queued orders processed in FIFO order
   - Monitor MQ depth → should decrease after reconnect

3. If Vega issue:
   - Check FIX VM: ssh fix-xts-01
   - Check FIX logs: tail -f /var/log/vega/fix-xts/current.log
   - Restart FIX service: systemctl restart vega-fix-xts
   - Verify reconnect: watch redis-cli HGET broker:XTS:health status

4. If extended outage (> 2 minutes):
   - Activate DR FIX session in Hyderabad
   - OR: Switch all users to Greeksoft (if Greeksoft is up)
```

### Emergency 2: Database Corruption

```
1. Halt ALL order processing:
   redis-cli SET "vega:global:halt" "true"

2. Failover to DR replica:
   pg_ctl promote -D /var/lib/postgresql/15/main (on Hyderabad replica)

3. Update config to point to Hyderabad DB

4. Restart services

5. Verify data integrity:
   SELECT count(*) FROM orders WHERE created_at > NOW() - INTERVAL '5 minutes';

6. Restore Mumbai DB from backup (off-hours)
```
