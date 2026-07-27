# 19 — Performance Benchmarks

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Performance Targets

Vega is designed for **high-throughput, low-latency** order execution. These benchmarks are validated on every release.

| Metric | Target | P95 | P99 |
|---|---|---|---|
| Internal latency (signal→route) | < 500 µs | < 1 ms | < 2 ms |
| API response time (202 async) | < 5 ms | < 10 ms | < 20 ms |
| API response time (201 sync) | < 20 ms | < 50 ms | < 100 ms |
| Order throughput (single node) | 5,000/sec | — | — |
| Order throughput (4-node cluster) | 20,000/sec | — | — |
| FIX message serialize | < 50 µs | < 100 µs | < 200 µs |
| FIX message parse | < 100 µs | < 200 µs | < 500 µs |
| Redis GET | < 1 ms | < 2 ms | < 5 ms |
| PostgreSQL insert | < 2 ms | < 5 ms | < 10 ms |
| Kill switch activation | < 100 ms | — | — |

---

## Benchmark Environment

```
Hardware:
  CPU: Intel Xeon Gold 6248R (3.0 GHz, 24 cores)
  RAM: 64 GB DDR4-2933
  Disk: NVMe SSD (3.5 GB/s read, 3.0 GB/s write)
  Network: 10 Gbps

Software:
  Node.js: 20.11.0 LTS
  PostgreSQL: 15.6
  Redis: 7.2.4
  RabbitMQ: 3.12.13
  OS: Ubuntu 22.04 LTS (kernel 6.5)

Configuration:
  API instances: 4
  App workers: 4 per instance
  Processor instances: 2
  DB pool: 50 connections
  Redis: local instance, no TLS (internal VLAN)
  MQ prefetch: 50
```

---

## Latency Breakdown (Happy Path)

Measured from signal receipt to broker acknowledgment (201 sync mode):

```
Component                    P50      P95      P99
─────────────────────────────────────────────────────
TalkStrategy API            0.5ms    1.2ms    2.5ms
  └─ Auth validation        0.1ms    0.3ms    0.8ms
  └─ Schema validation      0.1ms    0.2ms    0.5ms
  └─ Rate limit check       0.05ms   0.1ms    0.2ms
  └─ MQ publish             0.2ms    0.5ms    1.0ms

TalkStrategy App            1.0ms    2.5ms    5.0ms
  └─ MQ consume             0.2ms    0.5ms    1.0ms
  └─ Redis lookup           0.3ms    0.8ms    1.5ms
  └─ Enrichment logic       0.3ms    0.7ms    1.5ms
  └─ MQ publish             0.2ms    0.5ms    1.0ms

Order Processor             2.0ms    4.0ms    8.0ms
  └─ Idempotency check      0.5ms    1.0ms    2.0ms
  └─ Pre-trade validation   0.5ms    1.0ms    2.0ms
  └─ State machine          0.2ms    0.5ms    1.0ms
  └─ DB insert              0.5ms    1.0ms    2.0ms
  └─ MQ publish             0.3ms    0.5ms    1.0ms

Broker Integration          5.0ms   10.0ms   20.0ms
  └─ MQ consume             0.3ms    0.5ms    1.0ms
  └─ FIX serialize          0.05ms   0.1ms    0.2ms
  └─ TCP send               0.5ms    1.0ms    2.0ms
  └─ Broker ACK round-trip  4.0ms    8.0ms   16.0ms
  └─ FIX parse              0.1ms    0.2ms    0.5ms
  └─ MQ publish response    0.2ms    0.3ms    0.5ms
─────────────────────────────────────────────────────
TOTAL (end-to-end)          8.5ms   17.7ms   35.5ms
```

---

## Throughput Test Results

### Single Node — Order Submission

```
Concurrent Users  |  Requests/sec  |  Avg Latency  |  P95 Latency  |  Error Rate
─────────────────────────────────────────────────────────────────────────────
10                |  1,200         |  4ms           |  8ms          |  0%
50                |  3,100         |  8ms           |  15ms         |  0%
100               |  4,800         |  12ms          |  25ms         |  0.02%
200               |  5,200         |  22ms          |  45ms         |  0.05%
500               |  5,100         |  65ms          |  120ms        |  0.1%
1000              |  4,900         |  150ms         |  300ms        |  0.5%
```

### Cluster — Order Processing (4 API + 4 App + 2 Processor)

```
Total Orders/sec  |  MQ Lag (avg)  |  DB QPS        |  Redis QPS     |  CPU (avg)
──────────────────────────────────────────────────────────────────────────────
5,000             |  0             |  5,000         |  15,000        |  25%
10,000            |  10            |  10,000        |  30,000        |  40%
15,000            |  50            |  15,000        |  45,000        |  55%
20,000            |  200           |  20,000        |  60,000        |  70%
25,000            |  800           |  25,000        |  75,000        |  85%
30,000            |  2,500         |  28,000        |  80,000        |  95%
```

---

## Memory & GC Performance

```
Metric                          | Idle      | 5K ops/s  | 20K ops/s
────────────────────────────────────────────────────────────────
Heap Used                        | 120 MB    | 280 MB    | 520 MB
Heap Total                       | 256 MB    | 512 MB    | 1024 MB
RSS                              | 180 MB    | 420 MB    | 780 MB
GC Pause (avg)                   | 2ms       | 5ms       | 15ms
GC Pause (P99)                   | 5ms       | 15ms      | 40ms
Event Loop Lag (P99)             | 1ms       | 3ms       | 10ms
Event Loop Utilization (avg)     | 5%        | 35%       | 72%
```

---

## Optimization Techniques

### Database

- **Connection pooling:** pg-pool with min 10, max 50 connections
- **Prepared statements:** `ORDER_INSERT`, `ORDER_UPDATE_STATE` are prepared at startup
- **Batch inserts:** Audit events batched to 100 rows per `INSERT`
- **Read replicas:** All queries use read-replica via HAProxy; writes go to primary
- **Index optimization:** Composite indexes on `(user_id, created_at)` and `(state, updated_at)`

### Redis

- **Pipeline:** Multi-key operations batched via `pipeline()`
- **Connection pooling:** generic-pool with min 10, max 50
- **Key design:** Short key names (`vega:` prefix → compress to `v:` in future)
- **LUA scripting:** Complex atomic operations (e.g., rate limit check+increment) use Lua

### Node.js

- **Cluster mode:** Each API instance uses `cluster` module to fork 1 worker per CPU
- **Stream processing:** Large responses use Node.js streams
- **Buffer reuse:** FIX message buffers are pre-allocated
- **Avoid sync operations:** `fs.readFileSync` and `crypto.randomBytesSync` banned in production code
- **Heap snapshots:** Weekly heap analysis to detect memory leaks

### Message Queue

- **Prefetch tuning:** 50 messages per consumer (balance throughput vs fairness)
- **Persistent messages:** `deliveryMode=2` for critical order messages
- **Lazy queues:** Not used (adds latency); messages held in memory
- **Consumer concurrency:** 4 consumers per App node (matches CPU cores)

---

## Regression Detection

Performance is tracked per release in InfluxDB:

```
vega_benchmark
├── end_to_end_latency_p50
├── end_to_end_latency_p95
├── end_to_end_latency_p99
├── throughput_max_per_second
├── api_response_time_p95
└── fix_serialize_time_p95
```

Alert fires if any P95 latency metric exceeds 1.5x the previous release baseline for > 5 minutes in staging.
