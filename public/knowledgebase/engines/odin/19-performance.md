# 19 — Performance

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Performance Philosophy

ODIN must be fast enough to not be the bottleneck in the order flow. While exchange latency (typically 1-10ms) dominates, ODIN's overhead must be minimal. The target is sub-5ms from MQ receive to exchange dispatch.

## Key Performance Indicators

| Metric | Target |
|--------|--------|
| Order routing latency (p99) | < 5 ms |
| Order validation latency (p99) | < 0.5 ms |
| Execution report processing | < 1 ms |
| Order throughput | 10,000/sec per instance |
| Concurrent in-flight orders | 50,000 |
| Modification latency (p99) | < 5 ms |
| Cancellation latency (p99) | < 5 ms |

## Latency Budget (5ms)

| Stage | Budget | Cumulative |
|-------|--------|------------|
| MQ receive + deserialize order | 0.5 ms | 0.5 ms |
| Structural validation | 0.1 ms | 0.6 ms |
| Price band check | 0.05 ms | 0.65 ms |
| Quantity check | 0.05 ms | 0.7 ms |
| RMS check (gRPC localhost) | 1.0 ms | 1.7 ms |
| Rate limiter check | 0.05 ms | 1.75 ms |
| Order routing decision | 0.1 ms | 1.85 ms |
| Protocol translation | 0.2 ms | 2.05 ms |
| Adapter dispatch (TCP send) | 0.1 ms | 2.15 ms |
| **Buffer (unpredictable)** | **2.85 ms** | **5.0 ms** |

## Performance Optimizations

### Order Path
- Lock-free concurrent hash map for order state store (Folly ConcurrentHashMap)
- Pre-allocated order objects from object pool (no heap allocation on hot path)
- RMS check response cached for 100ms (same client + symbol + side)
- Adapter connections pre-established and kept alive (no connect overhead)

### Database
- Order insert is asynchronous (write-behind via ring buffer → batch insert)
- Order state reads from in-memory cache (no DB query on hot path)
- DB used only for: startup recovery, audit queries, reconciliation

### Protocol Adapters
- ODIN Diet XML: pre-built XML templates with `sprintf` substitution (no XML builder overhead)
- NSE NEAT FIX: pre-serialized FIX message templates
- All adapters use non-blocking I/O with event-driven callbacks

## Throughput Capacity

| Scenario | Orders/sec |
|----------|-----------|
| Single adapter, single segment | 5,000 |
| 3 adapters, 3 segments (1 server) | 15,000 |
| 5 adapters, all segments (2 servers) | 25,000 |
| Peak tested | 30,000 |

## Performance Testing

```bash
# Benchmark order routing
odin-perf-test \
    --adapters nse_neat_primary \
    --order-rate 10000 \
    --duration 300 \
    --output /tmp/perf_results.json
```

Results from last benchmark (odin01-mum, 32 cores, 64GB):
- p50: 1.2 ms
- p99: 3.8 ms
- p999: 6.2 ms
- Throughput: 12,000 orders/sec sustained
