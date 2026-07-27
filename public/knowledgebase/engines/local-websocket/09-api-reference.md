# 09 — API Reference

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## WebSocket Endpoint

```
wss://ws.lakshmi.internal:8443/ws
ws://ws.lakshmi.internal:8080/ws     (non-prod only)
```

## Connection Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <JWT_TOKEN>` |
| `X-Format` | No | `json` (default) or `msgpack` |
| `X-Client-Id` | No | Client identifier for logging (overrides JWT sub if admin) |
| `X-Compression` | No | `gzip` — enable per-message deflate |

## Client-to-Server Messages

### Subscribe

```json
{
  "type": "subscribe",
  "id": "string (optional, echoed in response)",
  "topics": ["feed.NSE.CM.tick", "feed.NSE.CM.quote"],
  "format": "json|msgpack"
}
```

### Unsubscribe

```json
{
  "type": "unsubscribe",
  "id": "string (optional)",
  "topics": ["feed.NSE.CM.tick"]
}
```

### Ping (Application-level)

```json
{"type": "ping"}
```

Expected response: `{"type": "pong"}`

## Server-to-Client Messages

### Subscription Confirmed

```json
{
  "type": "subscribed",
  "id": "req-001",
  "topics": ["feed.NSE.CM.tick"],
  "timestamp": "2026-07-25T09:15:00.000Z"
}
```

### Market Data Message (JSON)

```json
{
  "type": "message",
  "topic": "feed.NSE.CM.tick",
  "seq": 123456789,
  "ts": 1721888100000000000,
  "payload": {
    "symbol": "RELIANCE",
    "ltp": 2547.35,
    "change": 12.45,
    "volume": 152340,
    "oi": 4500000
  }
}
```

### Error

```json
{
  "type": "error",
  "id": "req-001",
  "code": "UNAUTHORIZED",
  "topic": "feed.NSE.FO.tick",
  "message": "Client does not have READ access to this topic"
}
```

### Pong

```json
{"type": "pong", "timestamp": "2026-07-25T09:15:30.000Z"}
```

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | JWT invalid or expired |
| `FORBIDDEN` | Client lacks permission for requested topic |
| `INVALID_REQUEST` | Malformed message (missing type, invalid JSON) |
| `RATE_LIMITED` | Client exceeded per-second message rate limit |
| `TOPIC_NOT_FOUND` | Requested topic does not exist in MQ |
| `INTERNAL_ERROR` | Server-side error |

## HTTP Endpoints

### Health Check

```
GET /health
GET /ready
```

Response:
```json
{
  "status": "healthy",
  "uptime_seconds": 123456,
  "connections": 1523,
  "subscriptions": 3456,
  "mq_connected": true,
  "version": "2.5.0"
}
```

### Prometheus Metrics

```
GET /metrics
```

Returns Prometheus text format metrics.

## Client SDK Usage

```javascript
import { LakshmiWSClient } from '@lakshmi/ws-client';

const client = new LakshmiWSClient({
  url: 'wss://ws.lakshmi.internal:8443/ws',
  token: 'eyJhbGciOi...',
  format: 'json',
  autoReconnect: true,
  reconnectInterval: 5000,
});

client.on('message', (topic, payload) => {
  console.log(`[${topic}]`, payload);
});

client.subscribe(['feed.NSE.CM.tick', 'feed.NSE.CM.quote']);
```
