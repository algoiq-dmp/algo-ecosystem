---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 19 — Performance

## Performance Targets

### API Throughput

| Endpoint | Target Throughput | P95 Latency | P99 Latency |
|---|---|---|---|
| `POST /margin/contract` (single position) | 15,000 req/sec | <100ms | <200ms |
| `POST /margin/contract` (100 positions) | 5,000 req/sec | <200ms | <500ms |
| `POST /margin/portfolio` | 5,000 req/sec | <200ms | <500ms |
| `GET /margin/user/{id}` (cached) | 20,000 req/sec | <20ms | <50ms |
| `POST /auth/login` | 5,000 req/sec | <200ms | <500ms |
| WebSocket margin push | 50,000 concurrent | <50ms delivery | — |

### Margin Engine Core

| Operation | P50 | P95 | P99 |
|---|---|---|---|
| SPAN Scan Risk (1 position) | 0.3ms | 0.8ms | 1.5ms |
| SPAN Scan Risk (10 positions) | 1.2ms | 3.0ms | 5.0ms |
| SPAN Scan Risk (100 positions) | 8.0ms | 18.0ms | 25.0ms |
| Exposure Calc (100 positions) | 1.5ms | 3.0ms | 5.0ms |
| Portfolio Aggregation (100 clients) | 25.0ms | 60.0ms | 90.0ms |
| Full EOD Batch (100K clients) | 8.0s | 15.0s | 22.0s |

### Data Processing

| Operation | Target |
|---|---|
| Position ingestion (bulk CSV) | 10,000 positions/sec |
| Market data tick processing | 50,000 ticks/sec |
| SPAN file parsing (10 MB) | <2 seconds |
| Kafka message production | 100,000 msgs/sec |
| Kafka message consumption | 80,000 msgs/sec per consumer group |

## Scaling Guide

### Horizontal Scaling (Primary Strategy)

| Service | Scaling Metric | Min | Max | Trigger |
|---|---|---|---|---|
| API Gateway | CPU > 60% OR Request Queue > 500 | 3 | 20 | CPU + Custom |
| Margin Engine | CPU > 65% OR Calc Queue > 100 | 5 | 50 | CPU + Queue Depth |
| Position Service | CPU > 60% | 3 | 15 | CPU |
| Intelligence Engine | CPU > 50% OR GPU > 50% | 2 | 10 | CPU/GPU |
| Reporting Service | CPU > 50% | 1 | 5 | CPU |
| WebSocket Hub | Connections > 40K | 3 | 15 | Connection Count |

### Vertical Scaling (Specialized Nodes)

| Node Type | Use For |
|---|---|
| Standard_D16s_v5 (16 vCPU, 64 GB) | Margin Engine, Portfolio Aggregator |
| Standard_F16s_v2 (16 vCPU, 32 GB) | Compute-optimized SPAN calculations |
| Standard_NC4as_T4_v3 (GPU) | Intelligence Engine ML inference |

## Load Test Results

### Test Environment
- 8 × Standard_D8s_v5 Kubernetes nodes
- 10 Margin Engine replicas (2 CPU / 4 GB each)
- 6 API Gateway replicas (1 CPU / 2 GB each)
- PostgreSQL: Standard_D4s_v3 (4 vCPU, 16 GB)
- Redis: Premium P2 (12 GB)
- Kafka: 5 brokers, Standard_D4s_v5

### Results

| Test | Target | Achieved | P95 Latency | Error Rate |
|---|---|---|---|---|
| 1K req/sec sustained (30 min) | Pass | Pass | 45ms | 0.00% |
| 5K req/sec sustained (30 min) | Pass | Pass | 78ms | 0.00% |
| 10K req/sec sustained (30 min) | Pass | Pass | 142ms | 0.01% |
| 15K req/sec sustained (10 min) | Pass | Pass | 285ms | 0.03% |
| 20K req/sec burst (2 min) | Pass | Pass | 520ms | 0.12% |
| 50K concurrent WebSockets | Pass | Pass | 18ms delivery | 0.01% drop |

## Performance Optimizations

### .NET Runtime
- Server GC mode for multi-core throughput
- `Span<T>` for stack allocation in hot paths
- `ArrayPool<decimal>` for risk array reuse (16-element arrays)
- SIMD-enabled vector operations for scenario P&L computation
- Async I/O throughout — no blocking calls

### Database
- Connection pooling: Min 10 / Max 200 per instance
- Read/write splitting: writes → primary, reads → replica
- Partial indexes for active data (`WHERE status = 'OPEN'`)
- Covering indexes with INCLUDE columns for frequent queries
- CLUSTER on primary access patterns
- Materialized views for dashboard aggregates (refreshed post-EOD)

### Caching (Three-Tier)
- L1: In-memory per pod (500 MB, LRU), <1µs access
- L2: Redis Cluster (6 nodes, 12 GB each), <1ms access
- L3: PostgreSQL as source of truth
- Market prices: 1s TTL. SPAN params: 24h TTL. Session: 15min sliding
- Target hit ratio: >95%

### Kafka Tuning
- 12-24 partitions per topic, keyed by `broker_id`
- Snappy compression with 5ms linger for batching
- Producer acks=1 with idempotence enabled
- Consumer: 500 max poll records, 10MB max partition fetch

### Memory Optimization
- Object pooling for hot-path arrays (`ArrayPool<decimal>`)
- `Span<decimal>` for computation loops (no heap allocation)
- L1 cache bounded to 500 MB per instance with LRU eviction
- GC tuned for <10ms pause target
- `RecyclableMemoryStream` for HTTP response buffering

## Performance Monitoring KPIs

| Metric | PromQL | Alert Threshold |
|---|---|---|
| API Error Rate | `rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])` | >1% |
| API P95 Latency | `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` | >500ms |
| Margin Calc P99 | `histogram_quantile(0.99, rate(margin_calculation_duration_ms_bucket[5m]))` | >250ms |
| Margin Calc Error Rate | `rate(margin_calculation_failures_total[5m]) / rate(margin_calculations_total[5m])` | >0.5% |
| DB Connection % | `npgsql_connection_pool_active / npgsql_connection_pool_max` | >80% |
| DB Query P95 | `histogram_quantile(0.95, rate(db_query_duration_ms_bucket[5m]))` | >100ms |
| Redis Hit Ratio | `redis_keyspace_hits / (hits + misses)` | <90% |
| Redis Avg Latency | `rate(redis_command_duration_ms_sum[5m]) / rate(redis_command_duration_ms_count[5m])` | >5ms |
| Kafka Consumer Lag | `kafka_consumer_group_lag` | >10,000 |
| CPU Usage | `container_cpu_usage_seconds_total` | >80% |
| Memory Usage | `container_memory_working_set_bytes / container_spec_memory_limit_bytes` | >85% |
| GC Pause Time | `rate(dotnet_gc_pause_seconds_sum[1m])` | >100ms/sec |

## Performance History Across Versions

| Metric | v3.0 | v4.0 | v5.0 (Current) |
|---|---|---|---|
| Single position calculation | 200µs | 120µs | 95µs |
| 100-position portfolio | 5ms | 3ms | 2ms |
| Max sustained API throughput | 10,000/s | 12,000/s | 15,000/s |
| SPAN file parse time | 8s | 5s | 3.5s |
| Cache hit ratio | 92% | 94% | 96% |
| P99 API latency | 18ms | 15ms | 12ms |
| Memory footprint (idle) | 2.1GB | 1.9GB | 1.8GB |
| Startup time | 22s | 18s | 14s |

## Strategies for Handling Peak Load

1. **Expiry Day Preparedness**: Auto-scale to 3x normal replicas on expiry Thursdays
2. **Burst Absorption**: Request queuing via Kafka when engine at 90% capacity
3. **Circuit Breakers**: Prevent cascading failures — fast-fail non-critical endpoints
4. **Graceful Degradation**: Intelligence/forecasting deprioritized during load spikes
5. **Pre-warming**: Cache pre-loaded with likely request data before market open
6. **Rate Limiting**: Enforced per API tier to prevent single-tenant overload
