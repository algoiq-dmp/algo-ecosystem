# 19 — Performance

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Performance Philosophy

The Feed Server is designed for deterministic, low-latency performance. All hot-path code avoids dynamic memory allocation, system calls, context switches, and cache misses. Performance is measured continuously in production and regressions block releases.

## Key Performance Indicators

### Latency

| Percentile | Target | Measurement Point |
|------------|--------|-------------------|
| p50 | < 15 µs | NIC hardware timestamp → MQ socket write |
| p99 | < 50 µs | NIC hardware timestamp → MQ socket write |
| p999 | < 100 µs | NIC hardware timestamp → MQ socket write |
| Max | < 250 µs | Upper bound even under GC/compaction |

Latency is measured via hardware timestamps from the NIC (IEEE 1588 PTP synchronized to exchange grandmaster clock) and recorded on the `CanonicalMessage.ptp_ts_ns` field. The MQ bridge records the socket write completion timestamp.

### Throughput

| Metric | Sustained | Burst |
|--------|-----------|-------|
| Per feed | 1M msgs/sec | 2M msgs/sec |
| Per server (4 feeds) | 4M msgs/sec | 8M msgs/sec |
| Per DC (3 servers) | 12M msgs/sec | 24M msgs/sec |

Throughput is primarily limited by NIC line rate and DPDK RX descriptor ring size, not by CPU. At 1M msgs/sec with average message size of 200 bytes, bandwidth is approximately 1.6 Gbps per feed.

## Performance Optimizations

### CPU and Memory

- **Thread pinning:** Each pipeline stage pinned to a dedicated CPU core via `pthread_setaffinity_np`
- **NUMA awareness:** Memory allocated from the NUMA node local to the NIC
- **HugePages:** All ring buffer and DPDK memory allocated from 1G hugepages to maximize TLB hit rate
- **Cache-line padding:** All hot structs padded to 64 bytes to prevent false sharing
- **Prefetching:** Software prefetch (`__builtin_prefetch`) on ring buffer read pointers

### Lock-Free Data Structures

- **SPSC queues:** All inter-stage communication uses bounded lock-free SPSC queues (no mutexes, no condition variables on hot path)
- **Ring buffer:** Lock-free MPMC ring buffer with atomic fetch_add for slot reservation
- **Memory pools:** DPDK mempool for packet buffers; custom slab allocator for normalized messages

### Zero-Copy

- **DPDK:** Packets DMA'd directly from NIC to hugepage memory
- **MQ bridge:** Messages passed to MQ via Unix domain socket with `SCM_RIGHTS` for zero-copy shared memory
- **Protobuf:** LCFM messages serialized directly into pre-allocated ring buffer slots (no intermediate buffer)

### Compiler Optimizations

- `-O3 -march=native -mtune=native`
- Link-Time Optimization (LTO) enabled
- Profile-Guided Optimization (PGO): production profiles collected weekly, fed back into CI builds

## Performance Regression Testing

Every CI build runs a performance test suite:
1. Simulated exchange feed at 1M msgs/sec for 5 minutes
2. Measure p50, p99, p999 latency
3. Measure CPU utilization and memory bandwidth
4. Compare against baseline (previous release)
5. Build fails if any KPI regresses > 5%

## Tuning Parameters

| Parameter | Default | Tuning Guidance |
|-----------|---------|-----------------|
| DPDK RX descriptor ring size | 4096 | Increase if NIC RX drops > 0 |
| SPSC queue size | 65536 | Increase if queue full events logged |
| Ring buffer slot size | 256 bytes | Increase if LCFM messages exceed 240 bytes avg |
| MQ publish batch size | 256 | Tune based on MQ broker latency profile |
| CPU isolation (`isolcpus`) | 0-7 for OS, 8-47 for feedd | Isolate all feedd cores from kernel scheduling |
