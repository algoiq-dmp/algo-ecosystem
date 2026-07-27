# 19 — Performance

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Performance Philosophy

The WebSocket server is optimized for high connection counts and low-latency message fan-out. Since it serves human-facing dashboards (not algorithm inputs), the latency bar is relaxed compared to Feed Server or MQ — sub-10ms MQ-to-WebSocket latency is sufficient.

## Key Performance Indicators

| Metric | Target |
|--------|--------|
| MQ-to-WebSocket latency (p99) | < 10 ms |
| Connections per instance | 10,000 (tested) / 15,000 (theoretical max) |
| Messages/sec per instance | 500,000 |
| Connection setup (incl. auth) | < 100 ms |
| Memory per connection | < 0.5 MB |
| Event loop lag (p99) | < 10 ms |

## Performance Optimizations

### uWebSockets.js

uWebSockets.js is a C++ library with Node.js bindings. It outperforms pure-JS WebSocket libraries by:
- **C++ event loop:** Handles TCP, TLS, and WebSocket frame parsing in C++, bypassing V8
- **Zero-copy:** Message payloads are passed as C++ buffers, avoiding JS string copies
- **Internal pub/sub:** In-process topic-based fan-out avoids per-connection JS iteration
- **Backpressure handling:** Built-in support for dropping oldest messages when socket buffer is full

### JSON vs MessagePack

| Format | Size (typical tick) | Encode Time | Decode Time |
|--------|--------------------|-------------|-------------|
| JSON | ~400 bytes | 15 us | 20 us |
| MessagePack | ~240 bytes (40% smaller) | 8 us | 12 us |
| MessagePack + gzip | ~180 bytes | 25 us | 30 us |

Recommendation: Use MessagePack for high-throughput clients (market watch with 200+ symbols). Use JSON for debugging and low-frequency dashboards.

### Node.js Optimizations

```bash
# Server startup flags
node \
  --max-old-space-size=6144 \      # 6 GB heap
  --optimize-for-size \            # Smaller code cache
  --max-semi-space-size=64 \       # Scavenge tuning
  server.js
```

### Connection Pooling to MQ

- One MQ consumer per unique topic (not per WebSocket client)
- MQ consumers use the `lakshmi-mq-js` library with native C++ binding for fast protobuf → JS conversion
- Consumer session timeout: 30s with 3s heartbeats
- Max fetch bytes: 1MB per consumer

## Performance Testing Results

Test configuration: 4 vCPU, 8 GB RAM, Node.js 22, uWebSockets.js 20.49

| Test | Result |
|------|--------|
| 10,000 idle connections | CPU: 2%, Memory: 800 MB |
| 5,000 connections, 100K msgs/sec | CPU: 25%, Memory: 1.2 GB |
| 10,000 connections, 200K msgs/sec | CPU: 55%, Memory: 2.1 GB |
| 10,000 connections, 500K msgs/sec | CPU: 85%, Memory: 3.5 GB |
| Connection ramp: 0 → 5000 in 10s | No connection failures, auth < 80ms |

## Tuning Guidelines

| Bottleneck | Symptom | Mitigation |
|------------|---------|------------|
| CPU bound | Event loop lag > 10ms, CPU > 80% | Add instance; reduce msgpack encoding overhead |
| Memory bound | Memory > 80%, GC pauses | Reduce max connections; increase heap size |
| Network bound | Send buffer full, message drops | Reduce message rate per client; add instance |
| MQ bound | Consumer lag grows | Check MQ health; reduce subscribe rate at peak |
