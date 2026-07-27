# 19. Performance Benchmarks & Optimisation

**Version:** 2.1.0
**Owner:** Data Engineering
**Last Updated:** 2026-07-24

---

## Overview

Lakshmi is designed for high-frequency market data distribution. This document defines performance targets, presents benchmark results under representative load, and provides optimisation guidance for production deployments.

---

## Performance Targets

### Latency Targets

| Percentile | Target | Measurement | Scope |
|---|---|---|---|
| **p50** | ≤ 2ms | End-to-end message latency | Publish → Subscriber ack |
| **p95** | ≤ 4ms | End-to-end message latency | Publish → Subscriber ack |
| **p99** | ≤ 5ms | End-to-end message latency | Publish → Subscriber ack |
| **p99.9** | ≤ 8ms | End-to-end message latency | Publish → Subscriber ack |
| **Max** | ≤ 15ms | End-to-end message latency | Including network jitter |

### Throughput Targets

| Metric | Target | Unit |
|---|---|---|
| Sustained message publish rate | 350,000 | messages/sec |
| Sustained message delivery rate | 350,000 | messages/sec |
| Peak burst rate (10s window) | 500,000 | messages/sec |
| Concurrent WebSocket connections | 5,000 | connections |
| API request rate | 2,000 | requests/sec |

### Resource Targets

| Resource | Target | Limit (Alert) |
|---|---|---|
| **Memory (RSS)** | ≤ 4 GB typical | 6 GB warning / 8 GB max |
| **CPU per core** | ≤ 60% average | 80% warning / 95% critical |
| **Disk I/O** | ≤ 50 MB/s | 100 MB/s warning |
| **Network bandwidth** | ≤ 200 Mbps per node | 500 Mbps warning |
| **GC pause (p99)** | ≤ 50ms | 100ms warning |

---

## Benchmark Results

### Test Environment

| Component | Specification |
|---|---|
| **CPU** | Intel Xeon Gold 6248R (3.0 GHz, 24 cores) |
| **Memory** | 64 GB DDR4-2933 ECC |
| **Network** | 10 Gbps Ethernet |
| **OS** | Ubuntu 22.04 LTS |
| **Node.js** | v20.11.0 LTS |
| **RabbitMQ** | 3.12 (3-node cluster) |
| **Redis** | 7.2 (1 primary + 2 replicas) |

### Latency Benchmarks

| Message Size | p50 | p95 | p99 | p99.9 | Max |
|---|---|---|---|---|---|
| 128 bytes (tick) | 0.8ms | 1.9ms | 3.2ms | 5.1ms | 8.4ms |
| 512 bytes (OHLC bar) | 0.9ms | 2.1ms | 3.6ms | 5.8ms | 9.2ms |
| 1 KB (snapshot) | 1.1ms | 2.8ms | 4.5ms | 7.2ms | 12.1ms |
| 4 KB (depth data) | 1.8ms | 4.2ms | 6.9ms | 10.4ms | 14.8ms |

### Throughput Benchmarks

| Scenario | Publish Rate | Delivery Rate | Latency p99 | CPU % | Memory |
|---|---|---|---|---|---|
| Single topic, 1 publisher | 180,000 msg/s | 180,000 msg/s | 1.8ms | 32% | 2.1 GB |
| Single topic, 10 publishers | 350,000 msg/s | 350,000 msg/s | 3.4ms | 48% | 2.8 GB |
| 50 topics, 50 publishers | 350,000 msg/s | 350,000 msg/s | 4.1ms | 55% | 3.6 GB |
| 50 topics, 50 publishers, 500 WebSocket clients | 350,000 msg/s | 350,000 msg/s | 4.8ms | 58% | 4.1 GB |
| Burst (10s) | 512,000 msg/s | 508,000 msg/s | 7.2ms | 78% | 4.5 GB |

### Connection Benchmarks

| WebSocket Clients | Messages/sec (total) | Per-Client Latency p99 | CPU | Memory |
|---|---|---|---|---|
| 100 | 100,000 | 2.1ms | 28% | 1.8 GB |
| 500 | 350,000 | 3.2ms | 42% | 2.4 GB |
| 1,000 | 350,000 | 3.9ms | 48% | 3.1 GB |
| 2,500 | 350,000 | 4.6ms | 54% | 4.0 GB |
| 5,000 | 350,000 | 5.4ms | 59% | 5.2 GB |

---

## Resource Budget

| Component | Memory Allocation | Notes |
|---|---|---|
| **Node.js Heap** | 2 GB (default max-old-space-size) | Set via `--max-old-space-size=2048` |
| **Message Buffers** | ~1 GB | Variable; depends on queue depth |
| **WebSocket Frame Buffers** | ~500 MB | Per-connection frame buffers |
| **Redis Client Cache** | ~200 MB | Hot key cache |
| **JWT Cache** | ~50 MB | Decoded token cache |
| **Connection Pool** | ~100 MB | MQ + Redis connection pools |
| **OS Overhead** | ~150 MB | File descriptors, sockets, GC |
| **Headroom** | ~2 GB | Reserve for traffic spikes |

---

## Optimisation Tips

### 1. Node.js Tuning

```bash
# Start Lakshmi with optimised V8 flags
node --max-old-space-size=2048 \
     --optimize-for-size \
     --max-semi-space-size=128 \
     --gc-interval=50 \
     server.js
```

**Explanation:**
- `--max-old-space-size=2048`: Limits heap to 2 GB; prevents swap thrashing
- `--optimize-for-size`: Reduces JIT code cache; lower memory footprint
- `--max-semi-space-size=128`: Increases new-space; faster short-lived object collection
- `--gc-interval=50`: Forces GC after 50 allocations; smoother latency

### 2. RabbitMQ Optimisation

```yaml
# rabbitmq.conf
vm_memory_high_watermark.relative = 0.6
disk_free_limit.absolute = 2GB
queue_master_locator = min-masters
channel_max = 5000
tcp_listen_options.backlog = 4096
tcp_listen_options.nodelay = true
```

- **min-masters** queue locator: Distributes queue masters across cluster nodes
- **nodelay=true**: Disables Nagle's algorithm for lower latency
- **channel_max=5000**: Supports high concurrent publisher/subscriber count

### 3. Redis Optimisation

```conf
# redis.conf
maxmemory 2gb
maxmemory-policy volatile-lru
save ""  # Disable RDB snapshots for pure cache use
appendonly no
tcp-backlog 511
timeout 300
tcp-keepalive 60
```

- **volatile-lru eviction**: Evicts least-recently-used keys with TTL set
- **no persistence**: Redis used as pure cache; data retained in MQ

### 4. OS-Level Tuning

```bash
# /etc/sysctl.conf
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.tcp_fin_timeout = 15
net.ipv4.tcp_tw_reuse = 1
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
fs.file-max = 1000000
vm.swappiness = 10
```

- **Large socket backlog**: Handles connection bursts
- **TCP buffer sizes**: 16 MB — accommodates message bursts without throttling
- **Low swappiness**: Keeps JVM/Node heap in RAM; avoids swap latency

### 5. Application-Level Optimisation

| Technique | Impact | Implementation |
|---|---|---|
| **Message Batching** | 2–3× throughput increase | Batch 50 messages per MQ publish (configurable `batch_size`) |
| **Zero-Copy Buffers** | ~15% latency reduction | Use `Buffer.allocUnsafe()` + direct write for WebSocket frames |
| **Topic Index Pre-warming** | 20ms reduction on cold start | Load topic routing table from Redis on startup |
| **Connection Pooling** | Eliminates connect latency | Maintain persistent MQ/Redis connections (no per-request connect) |
| **JSON.parse Hoisting** | ~10% CPU reduction | Define JSON reviver functions once; reuse across messages |
| **Pipeline Mode (Redis)** | 5× Redis throughput | Batch Redis commands; no per-command round-trip |
| **Worker Threads** | Linear scaling for CPU-bound tasks | Offload serialisation to worker threads (up to 4 threads) |

### 6. Horizontal Scaling

When a single node approaches resource limits, scale horizontally:

| Scaling Dimension | Approach | When |
|---|---|---|
| **Topic Partitioning** | Split topics across Lakshmi nodes (e.g., Node-1: NFO, Node-2: BFO) | >300 topics per node |
| **Subscriber Offloading** | Dedicated WebSocket-only nodes | >2,500 WebSocket connections |
| **Geo-Distribution** | Lakshmi nodes in Mumbai + Singapore data centres | Cross-region latency >50ms for subscribers |
| **Queue Sharding** | Multiple RabbitMQ vhosts/queues per topic group | Single queue >100,000 messages |

---

## Performance Monitoring

### Key Grafana Panels

| Panel | Metric | Purpose |
|---|---|---|
| Latency Percentiles | `lakshmi_message_latency_ms` histogram | Track p50/p95/p99 vs targets |
| Throughput | `rate(lakshmi_messages_published_total[1m])` | Real-time message rate |
| Queue Depth | `lakshmi_queue_depth` | Detect consumer lag |
| CPU/Memory | `lakshmi_cpu_usage_percent`, `lakshmi_memory_usage_bytes` | Resource utilisation |
| GC Pause | `lakshmi_gc_pause_ms` | Node.js GC impact on latency |
| Connection Count | `lakshmi_websocket_connections` | Client connection trend |

### Performance Dashboard Quick Links

| Dashboard | URL |
|---|---|
| Lakshmi Performance Overview | `/d/lakshmi-perf` |
| Latency Deep Dive | `/d/lakshmi-latency` |
| Resource Utilisation | `/d/lakshmi-resources` |
| Throughput Trends | `/d/lakshmi-throughput` |

---

## Bottleneck Identification

| Symptom | Likely Bottleneck | Diagnosis |
|---|---|---|
| High latency, normal CPU | RabbitMQ broker saturation | Check `queue_depth`; check MQ CPU |
| High CPU, normal latency | Serialisation overhead | Profile with `--inspect`; check JSON.parse |
| High GC pause time | Memory pressure / heap fragmentation | Check `lakshmi_gc_pause_ms`; lower `max-old-space-size` |
| Increasing memory, stable throughput | Memory leak | Compare heap snapshots over 24h |
| Dropped messages | Queue TTL expiry; subscriber too slow | Check `lakshmi_topic_dropped_messages`; increase subscriber prefetch |
| Websocket connection churn | Client reconnect storms | Add jitter to client reconnect; increase `lakshmi_websocket_connections` capacity |
