# 22 — Changelog

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Version History

---

### [6.3.0] — 2026-07-15

#### Added
- HMAC-SHA256 signature-based API authentication for all REST endpoints
- Distributed tracing via OpenTelemetry with Jaeger backend
- Circuit breaker pattern for external broker REST API calls
- Idempotency key support with 24-hour Redis-based deduplication
- `POST /api/v1/orders` now returns `correlationId` in 202 response for async tracking
- Broker credential auto-rotation cron job (daily at 08:30 IST)

#### Changed
- Order Processor state machine refactored from custom FSM to XState 5.x
- FIX message serialization optimized; 40% faster (120 µs → 70 µs P95)
- Database connection pool increased from 20 to 50 default
- Redis key prefix standardized to `vega:*` (was mixed `vega:`, `order:`, `user:`)
- MQ prefetch increased from 20 to 50 per consumer

#### Fixed
- Race condition in Kill Switch where orders could slip through during activation window (< 3ms gap)
- FIX sequence number desync after broker-initiated logout during heavy load
- Order state stuck in PENDING_CANCEL when broker responded with unsolicited cancel
- Memory leak in TalkStrategy App due to unclosed Redis connections in error paths
- Greeksoft REST fallback not triggering when FIX heartbeat missed > 2 intervals

---

### [6.2.1] — 2026-06-20

#### Fixed
- Hotfix: Kill Switch not evaluating fractional margin percentages correctly (1.49% was treated as > 1.50%)
- XTS FIX session not handling `MsgType=4` (SequenceReset) with `GapFillFlag=Y` correctly
- API returning 500 instead of 409 for duplicate order submission in edge case

---

### [6.2.0] — 2026-06-01

#### Added
- Greeksoft REST API fallback when FIX session is unavailable
- Order modification support via `PUT /api/v1/orders/:id`
- Rate limiting per user with configurable tiers (standard/premium/admin)
- `GET /api/v1/audit/orders` endpoint for compliance querying
- Redis Cluster support (migrated from single-instance Redis)

#### Changed
- FIX heartbeat interval changed from 60s to 30s for faster broker disconnect detection
- Order rejection reasons standardized with machine-readable error codes
- PostgreSQL migrations managed via `node-pg-migrate` (was manual SQL scripts)

#### Fixed
- Orders could be modified after reaching terminal state (now properly rejected)
- Credential cache not invalidating after rotation in multi-node deployment
- MQ dead-letter queue not being monitored; added alert at depth > 50

---

### [6.1.0] — 2026-04-15

#### Added
- Greeksoft broker adapter (FIX 5.0 SP2 protocol)
- Multi-broker user mapping in `user_broker_mappings` table
- Broker failover routing in Order Processor (XTS → Greeksoft)
- Audit logging to TimescaleDB hypertables
- Synthetic order monitoring (every 30 seconds)

#### Changed
- Broker Integration refactored to plugin architecture (`src/broker/{broker}/`)
- Order Processor now handles broker routing decision
- Health endpoint includes per-broker status

---

### [6.0.0] — 2026-02-01

#### Added
- Complete rewrite of order execution pipeline from monolith to 4-component architecture
- TalkStrategy API (Express.js + gRPC)
- TalkStrategy App (MQ worker)
- Order Processor (state machine)
- XTS Broker Integration (FIX 4.4 engine)
- Kill Switch Layer 3 with 1.50% margin threshold
- RabbitMQ-based inter-component communication
- Redis caching layer for active orders

#### Removed
- Legacy monolithic order service (Vega v5.x)
- Direct exchange connectivity via vendor SDKs (replaced with FIX)
- File-based credential storage (migrated to Vault)

---

### [5.3.0] — 2025-11-10 (Legacy — Archived)

- Last release of monolithic architecture
- XTS broker connectivity via vendor REST SDK
- In-memory order state management (no persistence)
- No audit logging capability

---

## Upcoming Releases

### [6.4.0] — Planned Q3 2026

- Greeksoft FIX session redundancy (dual FIX sessions)
- Token rotation automation with zero-downtime session cutover
- Enhanced kill switch with per-strategy thresholds
- PostgreSQL order table partitioning automation

### [6.5.0] — Planned Q4 2026

- Order slicing algorithms: TWAP, VWAP
- Multi-leg order support (spreads, straddles)
- Order bracket type: Bracket Order with OCO legs
- Real-time order book WebSocket feed for Strategy Factory

### [7.0.0] — Planned Q1 2027

- gRPC streaming for real-time order state updates
- Pluggable broker SDK (3rd-party broker adapters)
- PostgreSQL sharding for orders table
- Multi-region active-active with conflict resolution

---

## Migration Notes

### Upgrading from 6.2.x to 6.3.0

1. **Database migration required:** Run `node scripts/migrate.js up`
2. **Redis key format changed:** Old keys will be invalidated on upgrade; ensure no critical state in old keys
3. **API authentication changed:** Clients must now include `X-Signature` header (HMAC-SHA256)
4. **Configuration changes:**
   - `auth.hmacAlgorithm` added (default: `sha256`)
   - `redis.keyPrefix` changed to `vega:`
   - `orderProcessor.idempotencyTtlSec` added

### Upgrading from 5.x to 6.0.0 (Major)

1. Complete architecture change — no in-place upgrade possible
2. Run Vega v5.x and v6.x in parallel during migration window
3. Migrate user-broker mappings to new `user_broker_mappings` table
4. Configure FIX broker endpoints (Vega v6 uses FIX, not vendor SDKs)
5. Set up new infrastructure: RabbitMQ, Redis Cluster, TimescaleDB

---

## Deprecation Schedule

| Feature | Deprecated In | Removal Planned |
|---|---|---|
| Legacy REST-only broker mode (XTS) | 6.0.0 | 7.0.0 |
| `config.json` broker credentials (plaintext) | 6.0.0 | 7.0.0 |
| Single-instance Redis (non-cluster) | 6.2.0 | 6.5.0 |
| PostgreSQL without TimescaleDB | 6.1.0 | 7.0.0 |
| Synchronous order mode (201 response) | 6.3.0 | 7.0.0 |
