# 16 â€” Performance Benchmarks

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Performance Targets

| Metric | Target | Measured (v3.0.0) |
|---|---|---|
| Service registry query | < 5ms | 1.2ms (p99) |
| Config fetch (cached) | < 5ms | 1.5ms (p99) |
| Config fetch (uncached) | < 20ms | 8ms (p99) |
| Health aggregation (100 services) | < 10s | 3.2s |
| Agent heartbeat RTT | < 50ms | 15ms (p99) |
| gRPC streams (concurrent) | 500 | 500 (stable) |
| Log collection throughput | 100K logs/s | 150K logs/s |
| Remote command RTT | < 500ms | 120ms (avg) |
| Self-monitoring interval | 10s | 10s |
| API requests (single instance) | 10,000/s | 12,500/s |

## Stress Test Results

| Scenario | Max Load | Result |
|---|---|---|
| 500 concurrent agents | 500 agents streaming | Stable, < 2% CPU |
| 100K log lines/s | 100K/s | Stable, disk buffer used |
| 10K API req/s | 12,500 req/s | Rate limiter at 10K |
| 100 concurrent deployments | 100 | Queued, executed sequentially |
| CP node failure | 1 of 3 nodes | 100% agents reconnected to remaining nodes |

## Scaling Limits

| Resource | Soft Limit | Hard Limit |
|---|---|---|
| Managed servers | 500 | 1,000 |
| Registered services | 200 | 500 |
| Concurrent gRPC streams | 500 | 1,000 per CP node |
| Config versions per service | Unlimited | Unlimited |
| Command history | 1M records | Archival after 1M |
| Audit log | 10M records | Archival after 10M |
