# 23 — Roadmap

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Version History and Future Plans

### v2.5.0 (Current — Q2 2026)

- uWebSockets.js v20.49 with improved backpressure handling
- MessagePack serialization support for binary frames
- JWT-based authentication with Suraksha IAM
- Topic-level authorization with permission caching
- Sticky load balancing via HAProxy
- Prometheus metrics for connections, messages, and MQ lag
- Client SDK (`@lakshmi/ws-client`) with auto-reconnect

### v2.6.0 (Planned — Q3 2026)

**Theme: Enhanced Client Experience**

- WebSocket sub-protocol negotiation for Lakshmi-specific frames
- Server-side subscription batching (single MQ consumer for multiple WebSocket clients)
- Client heartbeat monitoring from server side with early disconnect
- Advanced throttling: per-topic rate limits in addition to per-connection
- Structured error frames with error codes and recovery hints
- Admin API for connection management (kick client, list subscriptions)

### v2.7.0 (Planned — Q4 2026)

**Theme: Observability and Diagnostics**

- W3C tracing integration with MQ trace context propagation
- Connection-level Prometheus metrics (per-client message rates)
- Real-time diagnostic mode: echo back latencies for latency monitoring
- Session resumption via Redis for mobile clients
- Rate limit alerts when clients approach their limits

### v3.0.0 (Planned — H1 2027)

**Theme: Enterprise Features**

- WebSocket connection migration (transfer connection between servers without reconnect)
- GraphQL-over-WebSocket subscription support
- Message filtering at server side (field-level subscription)
- Bandwidth-adaptive streaming (reduce resolution under poor network)
- Plugin architecture for custom serializers and authorizers

## Backlog

| Feature | Effort | Priority |
|---------|--------|----------|
| HTTP/2 → WebSocket upgrade | M | Low |
| Brotli compression for messages | S | Low |
| Multi-tenancy (namespace isolation) | L | Medium |
| WebSocket over HTTP/3 (WebTransport) | M | Low |
| Client SDK for Python | M | Medium |

## Deprecation Notices

- **Node.js 18:** Support ends with v2.7.0 (Q4 2026). Migrate to Node.js 22.
- **`ws` library (pure JS):** The built-in pure-JS fallback is deprecated in v2.5.0 and will be removed in v3.0.0.
