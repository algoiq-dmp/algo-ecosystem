# 24 — Release Notes

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Release v2.5.0 — "MessagePack & Backpressure"

**Release Date:** 2026-06-20
**Build:** `ws-server-2.5.0+build.412`
**Git Tag:** `ws-v2.5.0`

### Highlights

- MessagePack binary serialization for 40% bandwidth reduction
- Improved backpressure handling with configurable drop strategies
- Suraksha IAM native integration for JWT auth and topic authorization
- Sticky load balancing support for consistent WebSocket routing

### New Features

- **MessagePack Support:** Clients can request `X-Format: msgpack` for binary frame delivery. 40% smaller payloads and 2x faster serialization compared to JSON.
- **Backpressure Strategies:** Configurable behavior when client send buffer exceeds `max_buffer_size`: `drop_oldest` (default), `disconnect`, or `none`.
- **Authorization Caching:** Topic permission checks cached with 5-minute TTL, reducing Suraksha IAM calls by 95%.
- **Sticky Session Support:** Server exposes instance ID in headers for HAProxy sticky-table routing.
- **Health Endpoint Enhancement:** `/health` now includes MQ connection status and subscription counts.

### Improvements

- Connection setup latency reduced 30% (JWKS caching and parallelized auth steps)
- Memory per connection reduced 25% (uWebSockets.js v20.49 improvements)
- MQ consumer reconnect time reduced from 30s to 10s (aggressive retry)
- Structured JSON logging with correlation IDs (pino logger replacing console)

### Bug Fixes

- **WS-1820:** Memory leak in subscription aggregator when connections dropped without explicit unsubscribe (fixed: WeakRef-based cleanup)
- **WS-1812:** Race condition in JAAS refresh causing intermittent 401 errors (fixed: double-buffered key cache)
- **WS-1805:** MQ consumer not recreated after broker restart (fixed: consumer health check with recreation)
- **WS-1798:** CORS preflight failing for custom headers (fixed: proper OPTIONS handling during upgrade)
- **WS-1791:** Event loop stall when 1000+ clients unsubscribe simultaneously (fixed: batched subscription cleanup)

### Breaking Changes

- **Auth:** JWT issuer must be configured explicitly (`auth.jwt.issuer`). Previously defaulted to accepting any issuer.
- **Metrics:** `ws_connections` gauge renamed to `ws_connections_active`. `ws_connections_total` added as counter.
- **Config:** `throttling` section restructured. Old flat structure still supported but deprecated.

### Migration Guide

1. Update `config.yaml` to add `auth.jwt.issuer: "suraksha-iam.internal"`
2. Update Prometheus dashboards to use renamed metrics
3. Optional: migrate to new throttling config structure
4. Rolling restart behind HAProxy (no downtime)

### Known Issues

- **WS-1832:** MessagePack frames may be incorrectly framed on Safari 17.0-17.2. Fixed in Safari 17.3. Workaround: force JSON for Safari user agents.
- **WS-1835:** Backpressure `disconnect` strategy may close legitimate clients during market open burst (> 500 msgs/sec in first second). Workaround: use `drop_oldest` strategy; increase `max_buffer_size`.
