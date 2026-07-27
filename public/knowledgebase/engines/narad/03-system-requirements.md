# 03 â€” System Requirements

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## SR-01: Runtime Environment

| Requirement | Specification |
|---|---|
| Operating System | Ubuntu 22.04 LTS / Windows Server 2022 |
| Node.js | v20.x LTS |
| PostgreSQL | v15.x |
| Redis | v7.x |
| gRPC | For agent-server communication |
| WebSocket | For real-time health streaming |

## SR-02: Hardware Requirements (Production)

| Resource | Minimum | Recommended |
|---|---|---|
| CPU Cores | 8 | 16 |
| RAM | 32 GB | 64 GB |
| Storage (SSD) | 500 GB | 1 TB |
| Network | 10 Gbps | 25 Gbps |

## SR-03: Narad Agent Requirements

Every managed server MUST run the Narad Agent:

| Resource | Minimum |
|---|---|
| CPU | 0.5 core |
| RAM | 256 MB |
| Disk | 100 MB |
| Network | Outbound to Narad Control Plane on port 50051 (gRPC) |

## SR-04: Network Ports

| Port | Service | Protocol | External |
|---|---|---|---|
| 3003 | REST API | HTTP/HTTPS | Yes |
| 50051 | gRPC (Agent comms) | gRPC/TLS | Internal only |
| 3004 | WebSocket (health stream) | WSS | Yes |
| 9091 | Prometheus Metrics | HTTP | Internal only |
| 5432 | PostgreSQL | TCP | Internal only |
| 6379 | Redis | TCP | Internal only |

## SR-05: Dependencies

| Service | Purpose | Criticality |
|---|---|---|
| PostgreSQL | Persistent storage for registry, configs, audit logs | High |
| Redis | Real-time health data cache, service heartbeat | High |
| Suraksha | Authentication, certificates, RBAC | High |
| ELK Stack | Log storage and search | Medium |
| Prometheus | Metrics storage | Medium |
| SMTP / PagerDuty | Alerting delivery | Medium |

## SR-06: Reliability Requirements

| Metric | Target |
|---|---|
| Uptime | 99.99% |
| RTO | < 2 minutes |
| RPO | < 1 minute (configuration data) |
| Mean Time Between Failures | > 90 days |

## SR-07: Security Requirements

- All API endpoints require Suraksha-issued JWT or API key.
- gRPC agent communication uses mTLS with Suraksha-managed certificates.
- Remote command execution requires multi-factor approval for production.
- All secrets stored in Suraksha Vault.
- Full audit log for all administrative actions, retained 7 years.

## SR-08: Observability

- Self-monitoring: Narad monitors its own health and reports to itself.
- Prometheus metrics for: registry size, health aggregation latency, API latency, deployment status.
- Structured JSON logging to ELK.
- Dashboard for real-time infrastructure overview.
- Dead-man's switch: if Narad is down, agents cache data and replay on reconnect.
