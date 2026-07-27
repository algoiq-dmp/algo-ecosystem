# 19 — Performance

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Performance Philosophy

MQ is designed for consistent, predictable performance under high-throughput trading workloads. Performance is bounded primarily by disk I/O for writes and page cache hit rate for reads.

## Key Performance Indicators

### Throughput

| Metric | Per Broker | Per Cluster (3 brokers) |
|--------|-----------|------------------------|
| Produce (1KB msgs) | 12M msgs/sec | 36M msgs/sec |
| Produce (10KB msgs) | 3M msgs/sec | 9M msgs/sec |
| Consume (1KB msgs) | 15M msgs/sec | 45M msgs/sec |
| Fan-out (10 consumer groups) | 8M msgs/sec per group | 24M msgs/sec per group |

### Latency (p99, 1KB messages)

| Operation | Steady State | Under Load (80%) |
|-----------|-------------|------------------|
| Produce (ACK=1) | 0.3 ms | 0.8 ms |
| Produce (ACK=all, 3 replicas) | 1.2 ms | 2.5 ms |
| Consume (fetch from page cache) | 0.5 ms | 1.0 ms |
| Consume (fetch from disk) | 2.0 ms | 5.0 ms |
| End-to-end (produce → consume, cached) | 1.0 ms | 3.0 ms |

## Performance Optimizations

### Network Layer
- `io_uring` for async I/O (replaces epoll + read/write syscalls)
- Zero-copy `sendfile()` for consumer fetches from page cache
- TCP_NODELAY and TCP_QUICKACK enabled on all connections
- Connection pooling in client libraries (avoids TCP handshake overhead)

### Storage Layer
- RocksDB write-ahead log on dedicated NVMe (sequential write optimized)
- Large block cache (32 GB) to keep hot data in memory
- Direct I/O for reads (bypasses page cache double-buffering)
- Compaction off-peak scheduling (outside trading hours)
- Bloom filters configured with 10 bits per key (1% false positive rate)

### Replication
- Batching: Raft log entries batched into AppendEntries RPCs (up to 1MB/1000 entries)
- Pipeline replication: multiple AppendEntries in flight concurrently
- Snapshot transfer: incremental using rsync-like algorithm over Raft
- Zero-copy follower catch-up via `sendfile()` for snapshot segments

### Producer/Consumer
- Batching: producers batch up to `batch.size` messages or `linger.ms` time
- Compression: Zstandard level 3 (fast) on producer side; decompression on consumer side
- Partition stickiness: same producer instance always writes to same partition leader (reduces metadata refreshes)

### OS Tuning

```bash
# /etc/sysctl.d/99-mq-performance.conf
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 87380 134217728
net.ipv4.tcp_wmem = 4096 65536 134217728
net.ipv4.tcp_low_latency = 1
vm.swappiness = 1
vm.dirty_ratio = 5
vm.dirty_background_ratio = 2
kernel.numa_balancing = 0
```

## Performance Regression Testing

Every CI build runs a 30-minute benchmark:

```bash
# Run benchmark suite
mq-perf-test \
    --brokers mq01-mum:9092 \
    --topics 50 \
    --partitions 100 \
    --message-size 1024 \
    --producers 10 \
    --consumers 20 \
    --duration 1800 \
    --baseline v5.1.2
```

Build fails if:
- Produce latency p99 increases > 10%
- Throughput decreases > 5%
- Consumer lag cannot be drained within 60 seconds after producers stop

## Capacity Planning

| Component | Capacity Unit | Scaling Strategy |
|-----------|--------------|-----------------|
| Network throughput | 25 Gbps per NIC | Add NIC, LACP bond |
| Disk throughput | 3 GB/s per NVMe | Add NVMe drives |
| Disk capacity | 3.84 TB per NVMe | Add drives; increase retention |
| CPU (produce path) | 1 core per 2M msgs/sec | Add cores; NUMA pinning |
| CPU (consume path) | 1 core per 3M msgs/sec | Add cores |
| Consumer groups | ~100 groups/broker (metadata overhead) | Add brokers to cluster |
