# 03 — System Requirements

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Hardware Requirements

| Component | Minimum | Recommended (per instance) |
|-----------|---------|----------------------------|
| CPU | 4 vCPUs (Intel Xeon / AMD EPYC) | 8 vCPUs |
| RAM | 8 GB | 16 GB |
| Network | 1 Gbps | 10 Gbps |
| Storage | 50 GB SSD (OS + logs) | 100 GB SSD |

Note: WebSocket servers can run on virtualized or containerized infrastructure unlike the Feed Server. No DPDK or bare-metal requirement.

## Software Requirements

| Component | Version |
|-----------|---------|
| OS | RHEL 9.x / Rocky Linux 9.x / Ubuntu 24.04 |
| Runtime | Node.js 22 LTS |
| WebSocket Library | uWebSockets.js v20.49+ |
| MQ Client | `lakshmi-mq-js` v5.x |
| MessagePack | `@msgpack/msgpack` v3.x |
| JWT Library | `jose` v5.x |
| Prometheus Client | `prom-client` v15.x |
| Compression | `zlib` (built-in) |

## Network Requirements

- Inbound: TCP port 8080 (WS) or 8443 (WSS) from client networks
- Outbound: TCP port 9092 to MQ broker cluster
- Outbound: TCP port 50071 to Suraksha IAM (JWT validation)
- Firewall: allow-list for allowed client origins (or internal-only)
- Load balancer with WebSocket support (HAProxy with `timeout tunnel 1h`)

## Performance Thresholds

| Metric | Threshold |
|--------|-----------|
| Max connections per instance | 10,000 |
| Message throughput per instance | 500K msgs/sec |
| MQ-to-WebSocket latency (p99) | < 10 ms |
| Connection setup time (incl. auth) | < 100 ms |
| Subscription change latency | < 100 ms |
| CPU utilization at 5000 connections | < 50% (4 vCPUs) |
| Memory per connection | < 1 MB |

## Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 110+ |
| Firefox | 120+ |
| Safari | 17+ |
| Edge | 110+ |
