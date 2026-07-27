# 23 — Best Practices

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Order Submission

### DO

- Use **idempotent signal IDs** (`signalId`) — the same signalId within 24 hours produces the same orderId
- Submit orders with **unique correlationId per attempt** for traceability
- Set **realistic price bands** — price will be validated against LTP ± priceBandPct (default 20%)
- Use **async mode** (202 Accepted) for production; use sync mode (201 Created) only for latency-sensitive testing
- Handle **all terminal states** in your strategy: FILLED, REJECTED, CANCELLED
- Listen for **state change notifications** via MQ or polling rather than tight-looped status queries

### DON'T

- Don't retry a rejected order with the same `signalId` — the idempotency layer will return the rejection
- Don't submit market orders during extreme volatility without circuit breaker logic
- Don't modify an order that's in a terminal state (FILLED, REJECTED, CANCELLED)
- Don't assume broker acknowledgment means exchange execution — monitor for FILLED state
- Don't hardcode symbol names — use instrument tokens from Ganesh for accuracy

---

## Broker Connectivity

### DO

- Design strategies for **multi-broker fallback** — specify primary and secondary broker
- Monitor **broker health status** before submitting orders (check `/api/v1/health`)
- Handle **FIX session resets** gracefully — orders are re-queued during session outages
- Test broker connectivity in **UAT environment** before production deployment

### DON'T

- Don't send orders outside exchange trading hours — they won't reach the exchange
- Don't open more FIX sessions than broker allows — typically 1-2 per firm
- Don't transmit credentials in URLs, query parameters, or unencrypted channels

---

## Kill Switch & Risk Management

### DO

- Set strategy-level **position limits** smaller than global kill switch threshold
- Monitor **running P&L** independently from Vega's kill switch
- Implement **soft limits** (alerts at 1.0%, halt at 1.5%)
- Have a **manual kill switch** (API or admin panel) for emergency halts
- Ensure strategies **respect the 403 response** when kill switch is active

### DON'T

- Don't attempt to bypass the kill switch — there is no override path
- Don't rely solely on Vega's kill switch — implement your own risk checks
- Don't change `thresholdPct` during market hours without Risk team approval

---

## Performance

### DO

- **Batch order submissions** when possible (e.g., a list of basket orders)
- Reuse **API connections** (keep-alive) rather than opening new connections per order
- Use **connection pooling** for database and Redis operations in custom integrations
- Cache **instrument tokens** locally to avoid repeated Ganesh lookups
- Set appropriate **prefetch counts** for MQ consumers based on processing capacity

### DON'T

- Don't poll for order status more than **once per second** per order
- Don't use synchronous mode (201) for bulk order placement — MQ backpressure will build
- Don't ignore `Retry-After` headers on 429 responses — respect rate limits

---

## Security

### DO

- Store API keys and secrets in **HashiCorp Vault** or encrypted environment files
- Rotate API keys **every 90 days** minimum
- Use **separate API keys** for development, staging, and production
- Encrypt **all secrets at rest** (AES-256-GCM minimum)
- Log **all credential access** to the audit trail
- Validate **TLS certificates** — never use `NODE_TLS_REJECT_UNAUTHORIZED=0` in production

### DON'T

- Don't log API keys, secrets, or credentials — even in debug mode
- Don't include secrets in code repositories, config files, or CI/CD pipelines
- Don't share API keys between users or strategies

---

## Error Handling

### DO

- Check the **error code** in API responses (not just HTTP status)
- Implement **exponential backoff** for transient errors (5xx, network errors)
- Log **correlationId** from error responses for support investigations
- Handle **`DUPLICATE_ORDER`** gracefully — return existing orderId to client

### DON'T

- Don't blindly retry 4xx errors — they indicate client-side issues
- Don't retry after receiving `KILL_SWITCH_ACTIVE` or `RATE_LIMIT_EXCEEDED` — wait for condition to clear
- Don't ignore partial fills — track `filledQuantity` vs `quantity`

---

## Development & Testing

### DO

- Test against the **FIX simulator** (included in `scripts/fix-simulator.js`)
- Write unit tests for **order state machine transitions**
- Run **integration tests** with Testcontainers (PostgreSQL, Redis, RabbitMQ)
- Use **anonymized production data** for performance testing
- Validate **FIX message schemas** before deployment

### DON'T

- Don't test against live brokers during development — use FIX simulator
- Don't deploy on Fridays or before market holidays
- Don't skip database migration testing in staging

---

## Deployment

### DO

- Deploy during **post-market window** (15:45–18:00 IST) for standard changes
- Use **blue-green deployment** strategy for zero-downtime rollouts
- Run **smoke tests** against the new deployment before switching traffic
- Keep the **previous version ready** for immediate rollback
- Verify **database migrations are backward-compatible** before deploying

### DON'T

- Don't deploy during market hours (09:15–15:30 IST) except for emergency hotfixes with CTO approval
- Don't apply database migrations that lock tables without assessing impact
- Don't assume staging behavior matches production — broker test endpoints differ

---

## Monitoring

### DO

- Set up **Grafana dashboards** for Vega metrics before going live
- Configure **PagerDuty alerts** for critical conditions (broker down, kill switch)
- Monitor **MQ consumer lag** — it indicates processing bottlenecks
- Track **order rejection reasons** to identify strategy or system issues
- Review **FIX session logs** daily for abnormal disconnections

### DON'T

- Don't ignore `warn` level logs — they often precede `error` conditions
- Don't set alert thresholds too tight — avoid alert fatigue
- Don't monitor only API-level metrics — end-to-end order flow matters
