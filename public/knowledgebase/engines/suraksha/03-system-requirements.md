# 03 â€” System Requirements

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## SR-01: Runtime Environment

| Requirement | Specification |
|---|---|
| Operating System | Ubuntu 22.04 LTS / Windows Server 2022 |
| Node.js | v20.x LTS |
| PostgreSQL | v15.x |
| Redis | v7.x (cluster mode) |
| HashiCorp Vault | v1.15.x |
| HSM (optional) | PKCS#11 compatible |

## SR-02: Hardware Requirements (Production)

| Resource | Minimum | Recommended |
|---|---|---|
| CPU Cores | 8 | 16 |
| RAM | 32 GB | 64 GB |
| Storage (SSD) | 500 GB | 1 TB |
| Network | 10 Gbps | 25 Gbps |
| HSM | Optional | Thales / Gemalto |

## SR-03: Network Ports

| Port | Service | Protocol | External |
|---|---|---|---|
| 3004 | REST API | HTTPS | Yes |
| 8200 | Vault API | HTTPS | Internal only |
| 5432 | PostgreSQL | TCP | Internal only |
| 6379 | Redis | TCP | Internal only |
| 9092 | Prometheus Metrics | HTTP | Internal only |
| 50052 | gRPC (internal auth) | gRPC/TLS | Internal only |

## SR-04: Dependencies

| Service | Purpose | Criticality |
|---|---|---|
| PostgreSQL | Persistent storage (RBAC, audit logs) | High |
| Redis | Token blacklist, rate limit counters, RBAC cache | High |
| HashiCorp Vault | Secrets storage and encryption | Critical |
| Narad | Service registry, health monitoring | Medium |
| SMTP / PagerDuty | Alerting delivery | Medium |
| Certificate Authority | TLS cert signing (Let's Encrypt / Internal CA) | Medium |

## SR-05: Reliability Requirements

| Metric | Target |
|---|---|
| Uptime | 99.99% |
| RTO | < 2 minutes |
| RPO | < 1 minute (RBAC data, audit logs) |
| Authorization check latency | < 1ms p99 |
| Token issuance throughput | 10,000 tokens/sec |

## SR-06: Security Requirements

- Suraksha secures itself â€” it uses its own authentication and authorization for its API.
- All inter-component communication uses mTLS.
- Vault is the root of trust; all encryption keys derived from Vault.
- Audit logs are write-once, append-only, and cryptographically chained.
- Root/admin access requires MFA.

## SR-07: Observability

- Prometheus metrics: token issuance rate, auth check latency, RBAC cache hit ratio, threat alerts.
- SIEM dashboard with real-time event stream.
- Structured JSON logging to ELK.
- Audit log export in JSON and CSV formats.
