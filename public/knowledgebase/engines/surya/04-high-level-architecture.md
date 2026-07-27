# 04 — High-Level Architecture

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Architecture Overview

Surya employs a **pipeline architecture** where exchange files flow through sequential stages: fetch, validate, normalize, store, and distribute. Each stage is implemented as an independent, testable module connected by an internal message queue.

---

## System Context Diagram

```
┌──────────────┐     ┌──────────────┐
│ NSE Extranet │     │ BSE MFTP API │
│   API v2.1   │     │    v1.8      │
└──────┬───────┘     └──────┬───────┘
       │                     │
       ▼                     ▼
┌──────────────────────────────────────────────────────┐
│                    SURYA ENGINE                        │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │Extranet  │  │  File    │  │Validator │            │
│  │API Client│─▶│ Fetcher  │─▶│ Pipeline │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                   │                    │
│                              ┌────┴────┐              │
│                              ▼         ▼              │
│                       ┌──────────┐ ┌──────────┐      │
│                       │Normalizer│ │  Version  │      │
│                       │ Pipeline │ │  Store    │      │
│                       └────┬─────┘ └────┬─────┘      │
│                            │            │             │
│                       ┌────┴────────────┴────┐       │
│                       │   Distribution API    │       │
│                       └───────────┬───────────┘      │
└───────────────────────────────────┼──────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              ┌──────────┐  ┌──────────┐  ┌──────────┐
              │ Lakshmi  │  │  Ganesh  │  │   Vega   │
              │(Mkt Data)│  │ (Symbol) │  │ (Orders) │
              └──────────┘  └──────────┘  └──────────┘
```

---

## Pipeline Architecture

### Stage 1: Extranet API Client

- Manages authenticated sessions with NSE and BSE extranet APIs
- NSE: Client certificate (X.509) stored in Vault; auto-refresh before expiry
- BSE: API key rotation every 30 days; IP whitelist managed with network team
- Rate limits: Max 10 requests/minute to NSE, 20 requests/minute to BSE
- Connection pooling with keep-alive (5 connections per exchange)
- Emits event: `EXTRANET_FILE_AVAILABLE` with file metadata

### Stage 2: File Fetcher

- Scheduler: node-cron based; file-type-specific schedules
- Parallel downloads: Up to 3 concurrent fetches (exchange rate limits)
- Download with resume: Range header support for large files
- Checksum verification: SHA-256 computed on download; compared with exchange-provided checksum
- Temporary staging: Files written to `/data/surya/staging/` before validation
- Retry logic: 5 attempts, exponential backoff (30s, 60s, 120s, 240s, 480s)
- Emits event: `FILE_DOWNLOADED` with staging path and checksum

### Stage 3: Validator Pipeline

- Three-layer validation (see BRQ-003)
- Layer 1 (Structural): Column count, header matching, parseability
- Layer 2 (Business): Row-level business rules from File Type Registry
- Layer 3 (Cross-File): Cross-reference with previously stored files
- Validation results logged; failures block progression to Normalizer
- Emits event: `FILE_VALIDATED` (pass) or `FILE_VALIDATION_FAILED` (fail)

### Stage 4: Normalizer Pipeline

- Column renaming: Exchange-specific → canonical (snake_case)
- Date normalization: Any format → ISO 8601
- Number cleaning: Currency symbols, commas, Indian number formats
- Null standardization: Exchange placeholders → SQL-compatible nulls
- Encoding: Transcode to UTF-8 from detected encoding (auto-detect via `chardet`)
- Output format: CSV (canonical) + Parquet (optimized for analytics)

### Stage 5: Version Store

- Object storage: MinIO (S3-compatible) for file blobs
- Metadata: PostgreSQL for file metadata and version history
- Deduplication: SHA-256 content hash; identical files share storage object
- Compression: gzip (CSV), Snappy (Parquet)
- Retention: 5 years online, indefinite archive in AWS S3 Glacier

### Stage 6: Distribution API

- REST API for downstream engine consumption
- Endpoints: list files, download file, get versions, get file types
- Authentication: Per-engine API keys with scope (which file types each engine can access)
- Caching: Redis cache for frequently accessed metadata and small files
- Streaming: Large file downloads streamed directly from MinIO via presigned URLs
- Notifications: Webhook callbacks when new files are available for subscribed engines

---

## Cross-Cutting Concerns

| Concern | Implementation |
|---|---|
| **Scheduling** | node-cron with distributed locking via Redis (Redlock) |
| **Audit Logging** | Every pipeline event written to `audit.file_events` TimescaleDB hypertable |
| **Monitoring** | Prometheus metrics on `:9090/metrics`; Grafana dashboard |
| **Alerting** | PagerDuty for file deadline misses; Slack for warnings |
| **File Type Registry** | PostgreSQL-backed; hot-reloadable without restart |
| **Distributed Locking** | Redis Redlock ensures only one scheduler instance triggers fetches |

---

## Deployment Topology

```
[Load Balancer (Nginx)]
        │
   ┌────┴────────────┐
   ▼                 ▼
[Surya-API-1]   [Surya-API-2]    ← Stateless (Distribution API + Scheduler)
   │                 │
   └────┬─────┬──────┘
        ▼     ▼
   [RabbitMQ]  [Redis Cluster]
        │
   ┌────┴────────────┐
   ▼                 ▼
[Worker-1]      [Worker-2]       ← Stateless (File pipeline workers)
   │                 │
   └────┬─────┬──────┘
        ▼     ▼
[PostgreSQL] [MinIO Cluster]
```
