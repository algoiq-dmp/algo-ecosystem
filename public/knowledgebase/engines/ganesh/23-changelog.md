# 23 â€” Changelog & Release Notes

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Version 3.2.1 (2026-07-24)

### Added
- Gap detection service with automatic Prometheus alerting.
- `consumer_queries` hypertable for usage analytics.
- Multi-timeframe snapshot endpoint (`GET /bars/multi/:symbol`).

### Changed
- Redis bar TTL increased from 60 to 90 days.
- PostgreSQL batch flush interval reduced from 2s to 1s.
- JWT validation now caches validated tokens for 1 minute.

### Fixed
- Race condition in 1m bar finalization at market open (9:15 AM spike).
- Corporate action adjustment not invalidating Redis cache keys.
- Ring buffer overflow causing silent tick drops under > 400K msg/s load.

---

## Version 3.2.0 (2026-06-15)

### Added
- Corporate action engine integration with Surya.
- `corp_action_audit` table with full before/after logging.
- PostgreSQL TimescaleDB compression for chunks older than 7 days.
- Deep health check endpoint with dependency validation.

### Changed
- Bar aggregator rewritten with lock-free data structures (40% throughput improvement).
- API rate limit tier system: realtime (100/s), simulator (50/s), dashboard (20/s).
- Logging migrated to structured JSON format.

### Fixed
- Memory leak in ring buffer under sustained high load.
- PostgreSQL connection pool exhaustion during cache miss storms.
- Incorrect OHLC bar timestamps during daylight saving transitions.

---

## Version 3.1.0 (2026-04-20)

### Added
- Redis cluster mode support for horizontal scaling.
- Prometheus metrics for bar freshness, cache hit ratio, event loop lag.
- Kubernetes Helm chart for production deployment.
- Smoke test script for post-deployment verification.

### Changed
- Minimum Node.js version updated to 20.x LTS.
- RabbitMQ consumer prefetch increased from 100 to 250.
- Health endpoint now returns version and uptime.

### Fixed
- Bar alignment off-by-one-second for 5m and 15m timeframes.
- Redis cluster failover not detected by health check.
- API returning stale bars after corporate action adjustment.

---

## Version 3.0.0 (2026-02-10)

### Added
- Complete rewrite with event-driven architecture.
- Five-timeframe OHLC support (1m, 5m, 15m, 1H, 1D).
- Dual-layer storage: Redis (hot) + PostgreSQL/TimescaleDB (cold).
- Suraksha JWT authentication integration.
- Narad service registry and health monitoring integration.
- Ring buffer for high-throughput tick ingestion.
- Stateless REST API with horizontal scaling.

### Removed
- Legacy monolith architecture (v2.x).
- In-process tick storage (replaced by PostgreSQL).
- Custom authentication (replaced by Suraksha).
- Socket.io streaming (consumers use Lakshmi WebSocket).

---

## Version 2.2.0 (2025-11-05)

### Added
- 1-hour and 1-day timeframe support.
- CSV bulk export endpoint for backtesting.

### Fixed
- Volume aggregation incorrect for multi-leg trades.

---

## Version 2.1.0 (2025-08-15)

### Added
- 15-minute timeframe support.
- Redis caching layer for hot data.

### Changed
- MongoDB replaced with PostgreSQL for durable storage.

---

## Version 2.0.0 (2025-04-01)

### Added
- Multi-timeframe bar aggregation (1m, 5m).
- REST API for bar queries.
- MongoDB storage backend.

---

## Version 1.0.0 (2024-12-01)

### Added
- Initial release: 1-minute OHLC bar generation.
- Basic REST API.
- File-based bar storage.

---

## Release Cadence

| Type | Frequency | Scope |
|---|---|---|
| Major (X.0.0) | 6â€“12 months | Breaking changes, architecture shifts |
| Minor (X.Y.0) | 1â€“2 months | New features, non-breaking enhancements |
| Patch (X.Y.Z) | As needed | Bug fixes, security patches |
