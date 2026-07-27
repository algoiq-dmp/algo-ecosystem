# 16 â€” Performance Benchmarks

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Performance Targets

| Metric | Target | Measured (v3.2.1) |
|---|---|---|
| Tick ingestion rate | 350,000 msg/s | 385,000 msg/s |
| 1m bar aggregation latency | < 100ms | 42ms (p99) |
| Redis read latency | < 1ms | 0.3ms (avg) |
| Redis write latency | < 2ms | 0.8ms (avg) |
| PostgreSQL batch write | < 10ms | 4.5ms (avg) |
| API response (cache hit) | < 5ms | 2.1ms (p99) |
| API response (cache miss) | < 50ms | 28ms (p99) |
| Bar validation throughput | 50,000 bars/sec | 62,000 bars/sec |
| Event loop lag | < 10ms | 3.5ms (avg) |

## Benchmark Environment

| Resource | Specification |
|---|---|
| CPU | 16 vCPUs (AWS c5.4xlarge) |
| Memory | 64 GB |
| Redis | 4-node cluster, 16 GB per node |
| PostgreSQL | db.r6g.2xlarge, 500 GB gp3 |
| Network | 10 Gbps |
| Load | 5,000 symbols, all timeframes |

## Throughput Benchmarks

### Bar Aggregation Throughput

| Timeframe | Bars/sec (steady state) | Bars/sec (market open spike) |
|---|---|---|
| 1m | 300,000 | 5,000 (all at MM:00) |
| 5m | 60,000 | 5,000 (all at MM:00,05,...) |
| 15m | 20,000 | 5,000 (all at MM:00,15,...) |
| 1H | 5,000 | 5,000 (all at HH:00) |
| 1D | 5,000 | 5,000 (EOD) |

### API Throughput

| Endpoint | Requests/sec (single instance) | p99 Latency |
|---|---|---|
| GET /bar/:symbol/:tf | 15,000 | 2.1ms |
| GET /bars/:symbol/:tf (range=100) | 8,000 | 4.5ms |
| GET /bars/multi/:symbol | 5,000 | 6.2ms |
| GET /health | 50,000 | 0.5ms |

## Stress Test Results

| Scenario | Duration | Max Throughput | Failure Mode |
|---|---|---|---|
| Steady load (200K ticks/s) | 8 hours | Stable | None |
| Market open spike (500K ticks/s) | 5 minutes | Stable | 2% ring buffer drops |
| API DDoS simulation (100K req/s) | 1 minute | 30K req/s per instance | Rate limiter engaged |
| Redis node failure | 30 seconds | Auto-failover | 3% cache misses |
| PostgreSQL primary failure | 60 seconds | Auto-failover | 100% cache hits |

## Optimization Techniques

| Technique | Impact |
|---|---|
| Ring buffer for tick queue | Removes allocation overhead on hot path |
| Lock-free bar aggregation | Avoids mutex contention across worker threads |
| Batched PostgreSQL inserts | Reduces write amplification by 500x |
| Redis pipelining | Batches cache writes for lower network overhead |
| Connection pooling | Reuses DB connections, avoids TCP handshake per query |
| TimescaleDB chunking | Keeps query performance stable as data grows |
| JWT pre-validation cache | Caches validated tokens for 1 minute |

## Performance Regression Testing

```bash
node scripts/perf-test.js --duration 8h --symbols 5000 --output report.json
```

A regression of > 5% on any p99 metric blocks the release.
