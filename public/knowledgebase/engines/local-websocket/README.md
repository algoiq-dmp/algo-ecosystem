# Local WebSocket — Real-Time Web Streaming Server

> **Sub-component of:** Lakshmi  
> **Version:** v2.5.0  
> **Owner:** Infrastructure  
> **Last Updated:** 2026-07-25

## Overview

The Local WebSocket server provides real-time streaming of market data, order updates, and system events to HTML5 dashboards, monitoring tools, and lightweight trading clients. It bridges the high-performance MQ pub/sub backbone to browser-compatible WebSocket connections with JSON and binary (MessagePack) serialization.

## Key Capabilities

- WebSocket server (RFC 6455) with support for wss:// (TLS 1.3)
- Subscription-based topic filtering — clients subscribe to MQ topics via WebSocket control frames
- JSON and MessagePack serialization for market data payloads
- Connection multiplexing: single WebSocket connection supports multiple subscriptions
- Heartbeat/ping-pong for connection keep-alive and dead connection detection
- Per-connection throttling and message rate limiting
- Authentication via JWT tokens issued by Suraksha IAM
- Memory-efficient broadcast to thousands of concurrent clients
- Graceful degradation: drops oldest messages first under backpressure

## Directory Structure

```
local-websocket/
├── README.md
├── 01-overview.md
├── 02-business-requirements.md
├── 03-system-requirements.md
├── 04-high-level-architecture.md
├── 05-low-level-design.md
├── 06-components.md
├── 07-data-flow.md
├── 08-topology.md
├── 09-api-reference.md
├── 10-database.md
├── 11-configuration.md
├── 12-installation.md
├── 13-deployment.md
├── 14-monitoring.md
├── 15-security.md
├── 16-narad-integration.md
├── 17-suraksha-integration.md
├── 18-failover.md
├── 19-performance.md
├── 20-testing.md
├── 21-troubleshooting.md
├── 22-faq.md
├── 23-roadmap.md
├── 24-release-notes.md
├── 25-glossary.md
├── diagrams/
├── images/
└── api/
```

## Quick Links

| Document | Description |
|----------|-------------|
| [04-high-level-architecture](04-high-level-architecture.md) | Server architecture and connection model |
| [07-data-flow](07-data-flow.md) | MQ-to-WebSocket data pipeline |
| [09-api-reference](09-api-reference.md) | WebSocket protocol and subscription API |

## Dependencies

- **OS:** RHEL 9.x / Rocky Linux 9.x
- **Runtime:** Node.js 22 LTS (with `uWebSockets.js` for C++ WebSocket performance)
- **Message Format:** JSON + MessagePack
- **Internal Services:** MQ v5.x, Suraksha v2.x, Narad v3.x

## SLOs

| Metric | Target |
|--------|--------|
| MQ-to-WebSocket latency (p99) | < 10 ms |
| WebSocket connection time | < 100 ms |
| Max concurrent connections | 10,000 per instance |
| Message throughput per instance | 500K msgs/sec |
| Availability | 99.99% |
