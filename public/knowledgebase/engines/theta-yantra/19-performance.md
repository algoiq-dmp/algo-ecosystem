# Theta Yantra - Performance

**Version:** 3.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25


## Performance Benchmarks

All benchmarks measured on ALGO IQ 4 (16-core, 64GB RAM, NVMe SSD).

## Throughput

| Operation | Target | Measured | Unit |
|-----------|--------|----------|------|
| Signal generation | 100 | 127 | signals/sec |
| API requests | 500 | 612 | requests/sec |
| MQ message consumption | 2000 | 2340 | messages/sec |
| DB writes | 500 | 547 | rows/sec |
| DB reads | 2000 | 2180 | rows/sec |

## Latency

| Operation | P50 | P95 | P99 | Target |
|-----------|-----|-----|-----|--------|
| Signal generation round trip | 12ms | 45ms | 89ms | < 100ms |
| API response | 8ms | 32ms | 67ms | < 50ms |
| MQ publish-to-consume | 5ms | 18ms | 42ms | < 50ms |
| DB query (simple) | 2ms | 8ms | 15ms | < 20ms |
| DB query (aggregation) | 45ms | 120ms | 210ms | < 300ms |

## Resource Utilization

| Resource | Idle | Normal Load | Peak Load | Limit |
|----------|------|-------------|-----------|-------|
| CPU | 5% | 25% | 55% | 80% |
| Memory | 512MB | 1.2GB | 2.8GB | 4GB |
| Disk I/O | 2MB/s | 15MB/s | 45MB/s | 100MB/s |
| Network | 5Mbps | 25Mbps | 60Mbps | 100Mbps |
| DB Connections | 5 | 12 | 18 | 20 |

## Optimization Techniques

### Application Level
- In-memory LRU cache for frequently accessed reference data
- Connection pooling for database and MQ
- Batch processing for bulk DB inserts
- Gzip compression for API responses
- Lazy loading of strategy modules

### Database Level
- TimescaleDB continuous aggregates for pre-computed metrics
- Appropriate indexing on query patterns
- Partition pruning for time-range queries
- Read replica routing for analytics queries

## Bottleneck Analysis

| Bottleneck | Symptom | Mitigation |
|------------|---------|------------|
| TimescaleDB write contention | Insert latency spikes | Batch writes, increase chunks |
| MQ backpressure | Consume lag growing | Add consumers, optimize processing |
| API thread pool exhaustion | P99 latency spike | Increase pool, add rate limiting |
| Memory growth | RSS increasing over time | PM2 max_memory_restart, fix leaks |

## Load Testing

Load tests are performed using Artillery and k6. Test scenarios simulate:
- Normal market hours (base load)
- Market open rush (5x normal load)
- High-volatility event (10x signal volume)
- Sustained peak load (8-hour duration)

