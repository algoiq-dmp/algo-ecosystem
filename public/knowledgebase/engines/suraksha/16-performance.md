# 16 â€” Performance Benchmarks

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Performance Targets

| Metric | Target | Measured (v2.0.0) |
|---|---|---|
| JWT issuance | 10,000 tokens/sec | 12,500/sec |
| JWT validation | 50,000 validations/sec | 62,000/sec |
| Authorization check (cached) | < 1ms p99 | 0.4ms p99 |
| Authorization check (uncached) | < 5ms p99 | 2.8ms p99 |
| Vault secret read | < 10ms p99 | 3.5ms p99 |
| RBAC permission resolution | < 5ms p99 | 1.2ms p99 |
| Audit log write | < 2ms | 0.8ms |
| Certificate issuance | < 30s | 8s |
| Threat detection processing | < 10s from event | 3s |

## Benchmark Environment

| Resource | Specification |
|---|---|
| CPU | 16 vCPUs |
| Memory | 64 GB |
| Redis | 3-node cluster |
| PostgreSQL | db.r6g.2xlarge |
| Vault | Dedicated instance |
| Load | 100 services, 500 users |

## Throughput Benchmarks

### Authentication Throughput

| Flow | Operations/sec |
|---|---|
| Token issuance | 12,500 |
| Token validation (local, no network) | Unlimited (determined by service CPU) |
| Token validation (via Suraksha) | 60,000 |
| Token refresh | 8,000 |
| Token revocation | 25,000 |

### Authorization Throughput

| Condition | Operations/sec | p99 Latency |
|---|---|---|
| Cache hit | 80,000 | 0.4ms |
| Cache miss (simple role) | 15,000 | 2.8ms |
| Cache miss (deep hierarchy) | 5,000 | 12ms |

## Stress Test Results

| Scenario | Result |
|---|---|
| 500 concurrent token issuances/sec | Stable |
| 10,000 authZ checks/sec (all cache hits) | Stable, < 1% CPU |
| Vault unavailable for 30s | Cached secrets served, 0 failures |
| PostgreSQL unavailable for 60s | AuthZ cache only, 5% uncached checks failed |
| DDoS on auth endpoint (100K req/s) | Rate limiter engaged, core stable |

## Caching Architecture

| Cache | TTL | Hit Rate |
|---|---|---|
| RBAC decisions | 60s | 98% |
| User roles | 300s | 95% |
| JWT validation results | 60s | 85% |
| Service secrets | 300s | 99% |

## Optimization Techniques

| Technique | Impact |
|---|---|
| Local JWT validation (JWKS) | Services validate tokens without Suraksha call |
| Aggressive RBAC caching | 98% cache hit rate |
| Redis cluster for blacklist | Distributed replay prevention |
| Connection pooling (PG, Redis, Vault) | Reused connections |
| Permission pre-computation | Resolved at token issue time |
