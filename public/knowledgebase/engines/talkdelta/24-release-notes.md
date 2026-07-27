# TalkDelta — Release Notes

**Version:** 5.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## Version History

Complete release history for TalkDelta.

## v5.1.0 (Current — 2026-07-25)

**Release Type:** Production Stable

### Changes
- Production deployment on ALGO IQ 4 (192.168.190.104)
- Full integration with Narad service registry (port 3100)
- Suraksha JWT authentication for all API endpoints
- MQ pub/sub integration for real-time data pipeline
- Connection pooling optimization (50-200 connections)

### Performance
- 99.8% uptime in production
- P99 latency: 312ms
- Throughput: 6,200 API requests/sec

---

## v5.1.-1 — Q2 2026

### Features
- Enhanced error handling with structured error responses
- Improved database connection resilience with retry logic
- Cache warming on startup to reduce cold-start latency
- Added `/api/v1/status` endpoint for detailed health information
- Rate limiting per client with configurable tiers

### Bug Fixes
- Fixed connection leak during MQ reconnection scenarios
- Resolved race condition in batch processing pipeline
- Fixed timestamp handling for IST timezone edge cases
- Corrected cache invalidation on symbol master updates

### Performance
- 15% improvement in P95 response time
- 30% reduction in memory footprint under load
- Connection pool utilization reduced from 92% to 65%

---

## v5.1.0 — Q1 2026

### Features
- Initial Suraksha integration for authentication
- Prometheus metrics endpoint (`/api/v1/metrics`)
- Structured JSON logging with correlation IDs
- Docker Compose-based deployment

### Bug Fixes
- Fixed startup race condition when Narad is slow to respond
- Resolved data corruption on unclean shutdown
- Fixed pagination offset bug for large result sets

---

## v5.1.0 — Q4 2025

### Features
- Initial Narad service registration and health heartbeat
- Core analytics computation engine
- REST API gateway with basic endpoints
- Database schema design and migration framework
- MQ consumer for real-time market data ingestion

### Known Limitations (Resolved in Later Versions)
- No rate limiting (added in subsequent release)
- No caching layer (cache hit rate was 0%)
- Single instance deployment (no HA)

---

## v5.0.0 — Q3 2025

Initial production release. Core functionality with REST API, MQ integration, and basic analytics computation.

### Initial Features
- Core computation engine
- REST API on ports 3005, 3006
- MQ consumer for market data
- Database integration with PostgreSQL, TimescaleDB, Redis
- Health check endpoint
- Basic error handling
