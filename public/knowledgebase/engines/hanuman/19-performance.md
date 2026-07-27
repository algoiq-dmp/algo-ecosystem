# 19 — Performance

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Performance Philosophy

Hanuman must be fast enough that spread opportunities are captured before the market moves. The primary performance metric is signal-to-order latency: the time from a tick arriving to paired orders being dispatched.

## Key Performance Indicators

| Metric | Target |
|--------|--------|
| Signal-to-order latency (p99) | < 100 us |
| Spread calculation time | < 5 us |
| Risk check latency (p99) | < 50 us |
| Strategy evaluation time (per tick) | < 10 us |
| Strategy load time | < 5 seconds |
| Checkpoint write time | < 50 ms |

## Latency Budget (100 us)

| Stage | Budget | Cumulative |
|-------|--------|------------|
| MQ message receive + deserialize | 15 us | 15 us |
| Order book update | 5 us | 20 us |
| Spread calculation | 3 us | 23 us |
| Signal evaluation | 5 us | 28 us |
| Risk check (gRPC to local Risk Engine) | 50 us | 78 us |
| Order generation + serialize | 10 us | 88 us |
| MQ publish | 10 us | 98 us |

## Performance Optimizations

### Memory
- Order book cache uses cache-line-aligned structures (no false sharing)
- Strategy state pre-allocated at load time (no dynamic allocation on hot path)
- Signal history uses pre-allocated circular buffer (no allocation on hot path)
- Lock-free SPSC queues for inter-thread communication

### Compute
- Spread calculation: simple subtraction + multiplication (no division, no sqrt on hot path)
- Z-score: running mean and variance using Welford's online algorithm (single-pass, no array storage)
- Signal evaluation: branch-predictor-friendly (conditions ordered by likelihood)
- Strategy evaluation runs inline on the market data thread (no context switch)

### I/O
- MQ consumer uses zero-copy protobuf deserialization
- Risk check uses gRPC unary call to local Risk Engine (localhost, no network)
- Order dispatch batched when possible (multiple strategies dispatching on same instrument)

## Performance Testing Results

Test: 500 strategies, NSE FO segment, 800K ticks/sec

| Metric | Result |
|--------|--------|
| p50 signal latency | 42 us |
| p99 signal latency | 78 us |
| p999 signal latency | 145 us |
| CPU utilization | 45% (32 cores) |
| Memory | 12 GB |

## Tuning Guidelines

| Bottleneck | Symptom | Mitigation |
|------------|---------|------------|
| Risk check slow | `hanuman_risk_check_latency_us` p99 > 80us | Check Risk Engine load; co-locate Risk Engine on same host |
| Order dispatch slow | `hanuman_order_latency_us` p99 > 20us | Batch orders; check MQ broker load |
| Spread calculation slow | CPU spike during high tick volume | Reduce strategy count on this server |
| Checkpoint slow | `hanuman_checkpoint_age_sec` > 120 | Reduce checkpoint frequency or data volume |
