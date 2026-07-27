# 06 — Components

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Component Inventory

### Core Server Components

| Component | Module | Responsibility |
|-----------|--------|----------------|
| `server` | `src/server.js` | Main entry point; initializes HTTP(S) listener and WebSocket upgrade handler |
| `connection-manager` | `src/connection-manager.js` | Tracks all active connections, their subscriptions, and health |
| `subscription-aggregator` | `src/subscription-aggregator.js` | Maps MQ topics to subscriber sets; manages ref-counted MQ consumers |
| `mq-consumer-pool` | `src/mq-consumer-pool.js` | Creates and manages `lakshmi-mq-js` consumer instances |
| `serializer` | `src/serializer.js` | Converts LCFM protobuf messages to JSON and MessagePack |
| `authenticator` | `src/authenticator.js` | JWT validation against Suraksha IAM |
| `authorizer` | `src/authorizer.js` | Topic-level access control enforcement |
| `throttler` | `src/throttler.js` | Per-connection message rate limiting |
| `metrics` | `src/metrics.js` | Prometheus metrics collection and export |

### Configuration and Management

| Component | Module | Responsibility |
|-----------|--------|----------------|
| `config` | `src/config.js` | Loads and validates server configuration from YAML/env |
| `health` | `src/health.js` | Health check endpoint (`/health`, `/ready`) |
| `logger` | `src/logger.js` | Structured logging (pino) with correlation IDs |

### Client SDK (JavaScript)

| Component | Module | Responsibility |
|-----------|--------|----------------|
| `LakshmiWSClient` | `packages/client/src/client.js` | Browser/Node.js WebSocket client with auto-reconnect |
| `SubscriptionManager` | `packages/client/src/subscriptions.js` | Client-side subscription state management |

## Dependency Graph

```
server.js
  ├── config.js
  ├── connection-manager.js
  │     ├── authenticator.js ──► Suraksha IAM
  │     ├── authorizer.js ──► Suraksha IAM (cached)
  │     └── throttler.js
  ├── subscription-aggregator.js
  │     └── mq-consumer-pool.js ──► MQ Broker
  ├── serializer.js
  ├── health.js
  ├── metrics.js ──► Prometheus
  └── logger.js
```

## Component Lifecycle

```
1. server.js starts
2. config.js loads configuration
3. metrics.js initializes Prometheus registry
4. mq-consumer-pool.js connects to MQ broker
5. authenticator.js loads Suraksha public keys
6. HTTP listener starts on configured port
7. WebSocket upgrade handler registered
8. Server marked as "ready" (health check returns 200)
```

## Process Supervision

The WebSocket server is managed by systemd. Configuration:

```ini
[Service]
ExecStart=/usr/bin/node /opt/lakshmi/local-websocket/src/server.js
Restart=always
RestartSec=5
User=lakshmi
Group=lakshmi
Environment=NODE_ENV=production
Environment=UV_THREADPOOL_SIZE=16
LimitNOFILE=65536
```
