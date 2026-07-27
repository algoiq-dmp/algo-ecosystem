# 24. Release Notes

**Owner:** Platform Engineering
**Last Updated:** 2026-07-24

---

## Overview

This document records the version history of Lakshmi, including features added, bugs fixed, breaking changes, and migration notes for each release. All dates are in UTC.

---

## v2.1.0 (Current)

**Release Date:** 2026-06-15
**Codename:** "Kuber" (Prosperity)
**Build:** `2.1.0-build.42`

### Features Added

| Feature | Description |
|---|---|
| **Redis Sentinel Support** | Lakshmi now uses Redis Sentinel for automated primary/replica detection and failover. No manual intervention required when Redis primary changes. Configured via `redis.sentinels` array in `config.json`. |
| **Dynamic Configuration Sync** | Configuration changes pushed via Narad are applied within 5 seconds without restart. Supported keys: topic rate limits, queue TTL, feature flags, log level, alert thresholds. |
| **Suraksha Sentinel Integration** | Real-time threat detection feed from Suraksha Sentinel. Lakshmi immediately blocks IPs, revokes tokens, and adjusts rate limits based on threat intelligence. |
| **WebSocket Graceful Drain** | `POST /api/v1/admin/drain` command gracefully closes WebSocket connections, allowing clients to reconnect to another node before shutdown. |
| **Parikshak Certification Pipeline** | Automated quality gate in CI/CD. Every release must pass unit coverage (>90%), integration, load, security, and dependency checks before deployment. |
| **JWT Token Cache with LRU Eviction** | Token validation results cached with LRU policy and 5-minute TTL. Prevents unbounded memory growth from token cache accumulation. |
| **Worker Threads for Serialisation** | JSON serialisation offloaded to worker threads (up to 4). Reduces event loop blocking and improves p99 latency under high load. |
| **Message Batching Config** | Configurable batch size for MQ publishes (`publisher.batch_size`). Batches up to 50 messages per MQ channel write for 2-3x throughput improvement. |

### Bugs Fixed

| Bug ID | Description | Impact |
|---|---|---|
| **LAK-1247** | WebSocket connection leak when client disconnects without close frame (event listeners not cleaned up) | Memory leak over days; RSS grew ~200 MB/day per 1,000 connections |
| **LAK-1283** | Topic ACLs not enforced for AMQP-direct publishers (publishers bypassing HTTP API could publish to any topic) | Security: ACL bypass via MQ protocol |
| **LAK-1291** | Queue depth metric reporting negative values during MQ reconnection | Monitoring: false alerts for queue depth |
| **LAK-1302** | JWT validation failure with Suraksha JWKS when `kid` contains special characters (URL-encoding issue) | Auth: legitimate tokens rejected intermittently |
| **LAK-1315** | Redis pipeline commands accumulating without callback, causing unhandled promise rejections | Stability: occasional crash on Redis reconnect |
| **LAK-1320** | Prometheus histogram buckets misconfigured (missing sub-ms buckets; all sub-ms latencies recorded as 0) | Monitoring: latency graphs inaccurate below 1ms |

### Breaking Changes

| Change | Migration Required |
|---|---|
| **Node.js minimum version: v20.11.0** (was v18.x) | Upgrade Node.js runtime before deploying v2.1.0 |
| **Config key rename:** `redis.host` / `redis.port` deprecated; use `redis.sentinels` array with `redis.master_name` | Update `config.json` to use Sentinel format; standalone Redis still supported via `redis.standalone` config |
| **WebSocket close code:** Lakshmi now sends code `4001` (going away) instead of `1000` on graceful drain | Update client reconnect logic to handle code `4001` as a reconnect signal |
| **Prometheus metric rename:** `lakshmi_msg_latency` renamed to `lakshmi_message_latency_ms` (added unit suffix) | Update Grafana dashboard queries and alert rules |
| **JWT claim:** `role` claim deprecated; use `scope` array with Suraksha v2 format | Update JWT generation in Suraksha to include `scope` array |

### Migration Notes

1. **Upgrade steps:**
   ```bash
   # 1. Stop v2.0.x
   systemctl stop lakshmi

   # 2. Update Node.js
   nvm install 20.11.0
   nvm use 20.11.0

   # 3. Install v2.1.0
   npm install -g @algo-iq/lakshmi@2.1.0

   # 4. Migrate config
   node scripts/migrate-config.js --from 2.0 --to 2.1

   # 5. Update Grafana dashboards
   grafana-dashboard import lakshmi-v2.1-dashboards.json

   # 6. Start v2.1.0
   systemctl start lakshmi
   ```

2. **Rollback procedure:** v2.1.0 config is backward-compatible if `redis` uses standalone format. Fall back to v2.0.x by reverting config and restarting. No data migration is required (all state is in MQ/Redis).

3. **Downtime:** In-place upgrade requires ~2 minutes of downtime per node. Zero-downtime upgrade is possible with blue-green deployment if running 2+ nodes with Narad routing.

---

## v2.0.0

**Release Date:** 2026-01-20
**Codename:** "Shakti" (Power)
**Build:** `2.0.0-build.18`

### Features Added

| Feature | Description |
|---|---|
| **Narad Service Mesh Integration** | Lakshmi registers with Narad for service discovery and dynamic routing. No more hard-coded host lists. |
| **Suraksha PKI Integration** | Automated certificate lifecycle management. TLS certs issued, renewed, and rotated via Suraksha PKI. |
| **HA Failover (Primary/Secondary)** | Automatic failover with heartbeat detection (3 missed = promote). Target failover time: <5 seconds. |
| **Dynamic Topic Management** | Create, update, and delete topics via Admin API without restart. Topic changes propagate within 5 seconds. |
| **Dead Letter Queue (DLQ)** | Failed messages routed to per-topic DLQ with metadata (error type, timestamp, retry count). |
| **Message Deduplication** | Redis-backed deduplication with configurable TTL. Prevents duplicate delivery during failover/reconnect. |
| **Structured JSON Logging** | All logs in JSON format for ELK ingestion. Includes `correlation_id` for tracing across services. |
| **Rate Limiting per Topic** | Configurable publish and subscribe rate limits per topic. Exceeded limits return HTTP 429 or apply backpressure. |
| **Admin API** | Full REST API for managing topics, users, ACLs, and operational commands. RBAC-protected with Admin role. |
| **WebSocket Authentication** | JWT-based WebSocket authentication during upgrade handshake. Token refresh without disconnect. |

### Bugs Fixed

| Bug ID | Description |
|---|---|
| **LAK-1001** | Memory leak in WebSocket frame buffer (frames >1 KB not released after send) |
| **LAK-1023** | Topic routing failing when topic name contains hyphens (regex recompilation missing escape) |
| **LAK-1045** | Race condition in health probe: `/api/v1/health/ready` could return false positive during startup |
| **LAK-1067** | Redis cluster mode: MOVED redirections not followed for multi-key commands |
| **LAK-1080** | Message TTL not enforced when queue has no consumers (messages accumulated indefinitely) |

### Breaking Changes

| Change | Migration Required |
|---|---|
| **Config format:** `config.json` restructured from flat keys to nested object hierarchy (`rabbitmq`, `redis`, `narad`, `suraksha`, `websocket` sections) | Run `node scripts/migrate-config.js --from 1.5 --to 2.0` to convert config |
| **Node.js minimum version:** v18.16.0 (was v16.x) | Upgrade Node.js to v18 LTS |
| **Health endpoint:** `/health` moved to `/api/v1/health` | Update monitoring probes and load balancer health checks |
| **Topic API:** `/topics` moved to `/api/v1/topics` | Update API consumers to use v1 path prefix |
| **WebSocket path:** `/stream` moved to `/ws` | Update WebSocket client URLs |
| **Authorization:** Role-based access moved from Lakshmi-local to Suraksha Policy Engine (or local `policy.json`) | Export existing roles to Suraksha or `policy.json` format |

### Migration Notes

v2.0.0 is a major version with breaking changes. Plan for a maintenance window. Key steps:

1. Export roles and ACLs from v1.5.0 config to Suraksha Policy Engine format
2. Run the config migration script; verify output
3. Set up Narad and Suraksha (or configure standalone fallback in `config.json`)
4. Deploy v2.0.0 to staging; verify all integrations
5. Production deployment: use blue-green strategy with Narad-based traffic shifting

---

## v1.5.0

**Release Date:** 2025-09-10
**Codename:** "Dhruv" (Stability)
**Build:** `1.5.0-build.31`

### Features Added

| Feature | Description |
|---|---|
| **Redis Cluster Support** | Lakshmi connects to Redis Cluster (3+ nodes) with automatic MOVED redirection and slot-aware commands. |
| **Prometheus Metrics** | `/metrics` endpoint exposing 30+ application-level metrics. Includes histograms for latency distribution. |
| **Grafana Dashboards** | Pre-built Grafana dashboards for Lakshmi Overview, MQ Health, and WebSocket Connections. Import from JSON. |
| **Health Probes** | Liveness (`/api/v1/health`) and readiness (`/api/v1/health/ready`) endpoints for Kubernetes/container orchestration. |
| **Retry Engine** | Failed message deliveries retried with exponential backoff (1s, 2s, 4s, 8s, 16s, 30s max). Configurable retry count. |
| **Configuration Hot-Reload** | Config changes applied on SIGHUP without restart. Supported: topic list, rate limits, log level, Redis hosts. |
| **Message Compression** | Configurable gzip compression for messages >1 KB. Reduces bandwidth by 60-80% for depth/snapshot messages. |

### Bugs Fixed

| Bug ID | Description |
|---|---|
| **LAK-820** | High CPU during Redis reconnection (spin-loop in connection retry logic) |
| **LAK-845** | Message ordering violation when publisher retries after timeout (messages delivered out of sequence) |
| **LAK-867** | RabbitMQ channel leak (channels not closed on consumer disconnect) |
| **LAK-890** | WebSocket close not propagated to subscriber callback (subscriber unaware of disconnect for up to 60s) |

### Breaking Changes

| Change | Migration |
|---|---|
| **Message format:** Added `msg_id` (UUID v4) and `timestamp_utc` as mandatory fields in all published messages | Publishers must include `msg_id` and `timestamp_utc` fields |
| **Config file:** `config.toml` → `config.json` (format change) | Run `node scripts/convert-config.js` |

### Migration Notes

1. Update publishing clients to include `msg_id` (UUID v4) and `timestamp_utc` (ISO 8601) in every message
2. Run config conversion script: `node scripts/convert-config.js config.toml > config.json`
3. Install Redis Cluster (or continue with standalone Redis; cluster mode is optional)

---

## v1.0.0

**Release Date:** 2025-03-01
**Codename:** "Aarambh" (The Beginning)
**Build:** `1.0.0-build.1`

### Features Added (Initial Release)

| Feature | Description |
|---|---|
| **Core Pub/Sub Engine** | Topic-based publish/subscribe on RabbitMQ. Publishers push to MQ exchanges; subscribers consume from bound queues. |
| **WebSocket Streaming** | Real-time message streaming to browser clients via WebSocket. Per-topic subscription with JSON message format. |
| **REST API** | REST endpoints for publishing messages, querying topic status, and listing active subscribers. |
| **Topic Manager** | Dynamic topic creation with exchange/queue binding. Topic metadata includes description, schema, and rate limit. |
| **Message Router** | Routes messages based on topic patterns (`lakshmi.<topic>.<message_type>`). Supports fanout and direct routing. |
| **Redis Cache** | Hot data cached in Redis with configurable TTL. Reduces repeated MQ lookups for frequently accessed data. |
| **Basic Authentication** | API key-based authentication for publishers and subscribers. Keys stored hashed in config. |
| **Docker Deployment** | Official Docker image + `docker-compose.yml` for local development and CI environments. |
| **Configuration Management** | TOML-based config file with environment variable overrides. |
| **Health Check** | Basic `/health` endpoint returning engine status (UP/DOWN). |

### Known Limitations (v1.0.0)

- No failover support (single-node only)
- No Narad/Suraksha integration
- No rate limiting
- No DLQ
- Redis standalone only (no cluster/sentinel)
- No Grafana dashboards (metrics via InfluxDB only)
- Manual topic management (config file + restart)
- No message deduplication
- WebSocket connections not authenticated

### Migration Notes

This was the initial public release. No migration required.

---

## Version Numbering Convention

Lakshmi follows Semantic Versioning 2.0.0:

```
MAJOR.MINOR.PATCH
  │     │     └── Backward-compatible bug fixes
  │     └──────── Backward-compatible new features
  └────────────── Breaking changes (config, API, protocol)
```

| Change Type | Version Bump |
|---|---|
| Bug fix, no API change | Patch (2.1.0 → 2.1.1) |
| New feature, backward-compatible | Minor (2.1.0 → 2.2.0) |
| Breaking API/config change | Major (2.x.x → 3.0.0) |

---

## Supported Versions

| Version | Status | Support Ends |
|---|---|---|
| **v2.1.0** | Current | — |
| **v2.0.0** | Supported | 2026-12-31 |
| **v1.5.0** | Security-only | 2026-06-15 |
| **v1.0.0** | End of Life (EOL) | 2025-12-31 |

3 years of support is guaranteed for each major version: 1 year full support + 1 year security patches + 1 year best-effort.
