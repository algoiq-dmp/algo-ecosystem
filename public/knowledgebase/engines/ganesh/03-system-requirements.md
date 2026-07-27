# 03 â€” System Requirements

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## SR-01: Runtime Environment

| Requirement | Specification |
|---|---|
| Operating System | Ubuntu 22.04 LTS / Windows Server 2022 |
| Node.js | v20.x LTS |
| Redis | v7.x (cluster mode) |
| PostgreSQL | v15.x (with TimescaleDB extension) |
| RabbitMQ Client | amqplib v0.10.x |

## SR-02: Hardware Requirements (Production)

| Resource | Minimum | Recommended |
|---|---|---|
| CPU Cores | 8 | 16 |
| RAM | 32 GB | 64 GB |
| Storage (SSD) | 500 GB | 2 TB NVMe |
| Network | 10 Gbps | 25 Gbps |

## SR-03: Database Sizing

| Component | Estimated Size (5,000 symbols, 10 years) |
|---|---|
| PostgreSQL (bars) | ~800 GB |
| PostgreSQL (indexes) | ~200 GB |
| Redis (hot cache) | ~64 GB |
| TimescaleDB chunks | 1-day intervals per symbol |

## SR-04: Network Ports

| Port | Service | Protocol | External |
|---|---|---|---|
| 3002 | REST API | HTTP/HTTPS | Yes |
| 6379 | Redis | TCP | Internal only |
| 5432 | PostgreSQL | TCP | Internal only |
| 9090 | Prometheus Metrics | HTTP | Internal only |
| 5672 | RabbitMQ | AMQP | Internal only |

## SR-05: Dependencies

| Service | Purpose | Criticality |
|---|---|---|
| Lakshmi (RabbitMQ) | Tick ingestion | High |
| Surya | Corporate action notifications | Medium |
| PostgreSQL | Persistent bar storage | High |
| Redis | Hot cache layer | High |
| Narad | Health & log monitoring | Medium |
| Suraksha | API authentication | High |

## SR-06: Reliability Requirements

| Metric | Target |
|---|---|
| Uptime | 99.9% |
| RTO (Recovery Time Objective) | 5 minutes |
| RPO (Recovery Point Objective) | 0 (zero data loss) |
| Mean Time Between Failures | > 30 days |
| Mean Time To Repair | < 5 minutes |

## SR-07: Security Requirements

- All API endpoints MUST require Suraksha-issued JWT tokens.
- Redis and PostgreSQL connections MUST use TLS 1.3.
- All secrets MUST be stored in Suraksha Vault, never in config files.
- API rate limiting: 100 requests/second per consumer.

## SR-08: Observability

- Prometheus metrics for: bar aggregation rate, API latency percentiles, cache hit ratio, disk usage.
- Structured JSON logging to stdout (ELK-compatible).
- Health-check endpoint at `/api/v1/health` with deep-check capability.
