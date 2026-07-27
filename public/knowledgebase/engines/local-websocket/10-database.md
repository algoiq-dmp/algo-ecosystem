# 10 — Database

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Overview

The Local WebSocket server is a **stateless streaming gateway** and does not have a traditional database. It stores no message data, no client data, and no subscription state persistently. All state is in-memory and ephemeral.

## State Storage

### In-Memory Only

All state is held in process memory and lost on restart:

| State | Data Structure | Typical Size |
|-------|---------------|-------------|
| Active connections | `Map<connectionId, ConnectionState>` | ~5000 entries |
| Subscriptions | `Map<topic, Set<connectionId>>` | ~200 topics x ~5000 refs |
| MQ consumer pool | `Map<topic, MqConsumer>` | ~200 entries |
| Authorization cache | `Map<jwtHash, Permissions>` | ~500 entries (LRU, TTL 5min) |
| Rate limit counters | `Map<connectionId, TokenBucket>` | ~5000 entries |

### Redis (Optional, for Session Affinity)

In environments where clients need to reconnect to the same server and resume subscriptions, Redis is used as an optional session store:

```yaml
# config.yaml
redis:
  enabled: false       # Default: off
  host: "redis.internal"
  port: 6379
  session_ttl_sec: 3600
```

When enabled, server stores `{clientId → last subscriptions}` on disconnect and restores on reconnect. This is used primarily for mobile clients that may change IP addresses.

## Metrics Storage

Prometheus metrics are scraped by the central Prometheus server. No local metric storage beyond the in-process Prometheus registry.

## Log Storage

Structured logs are written to stdout/stderr and collected by the logging infrastructure (Fluentd → ClickHouse).

## Configuration Storage

Server configuration is file-based (`/etc/lakshmi/ws-server/config.yaml`). No database is used for configuration management.

## Why No Database?

1. **Stateless design:** Each WebSocket server instance is disposable. Client reconnect + re-subscribe handles failover.
2. **Performance:** Avoiding database queries on the message hot path keeps latency under 10ms.
3. **Simplicity:** No database means no connection pool management, no ORM, no schema migrations — the server codebase stays lean.
4. **Consistency with MQ:** Durability and state are the responsibility of MQ. The WebSocket server is a pure streaming proxy.
