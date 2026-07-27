# 09 — API Reference

## Base URL

| Environment | URL |
|---|---|
| Production | `https://lakshmi.algoiq.internal:3001` |
| Staging | `https://lakshmi-staging.algoiq.internal:3001` |
| Development | `http://localhost:3001` |

## Authentication

All REST endpoints require an API key passed via the `X-API-Key` header. API keys are validated against Suraksha at request time.

```
X-API-Key: lak-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Rate limit: 100 requests per minute per API key.

---

## REST Endpoints

### GET /api/v1/topics

List all active topics with subscriber counts.

**Response (200):**

```json
{
  "status": "ok",
  "count": 42,
  "topics": [
    {
      "name": "market.live.NSE.FUT",
      "subscribers": 12,
      "messagesPerSecond": 85000,
      "created": "2026-06-15T08:00:00Z"
    },
    {
      "name": "market.ohlc.NSE.EQ",
      "subscribers": 5,
      "messagesPerSecond": 4500,
      "created": "2026-06-15T08:00:00Z"
    }
  ]
}
```

### GET /api/v1/topics/:name

Get details for a specific topic.

**Parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `name` | path | yes | Topic name (dots escaped as `/`) |

**Response (200):**

```json
{
  "status": "ok",
  "topic": {
    "name": "market.live.NSE.FUT",
    "partitions": 4,
    "subscribers": ["vega-engine", "dashboard", "brahma-engine"],
    "throughput": { "1m": 85000, "5m": 84200, "15m": 83100 },
    "latencyP99": 1.8
  }
}
```

**Response (404):**

```json
{ "status": "error", "code": "TOPIC_NOT_FOUND", "message": "Topic 'market.live.NSE.FUT' not found" }
```

### POST /api/v1/publish

Publish a message to a topic.

**Request Body:**

```json
{
  "topic": "trade.confirm.NSE",
  "payload": {
    "orderId": "ORD-20260724-00001",
    "symbol": "NIFTY24JULFUT",
    "price": 24532.15,
    "quantity": 75,
    "status": "FILLED"
  },
  "options": {
    "persistent": true,
    "expiration": 30000
  }
}
```

**Response (201):**

```json
{
  "status": "published",
  "messageId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "topic": "trade.confirm.NSE",
  "timestamp": "2026-07-24T10:30:00.500Z"
}
```

**Error Codes:**

| Code | HTTP | Description |
|---|---|---|
| `TOPIC_NOT_FOUND` | 404 | Target topic does not exist |
| `INVALID_PAYLOAD` | 400 | Payload failed schema validation |
| `UNAUTHORIZED` | 401 | Missing or invalid API key |
| `FORBIDDEN` | 403 | API key lacks publish scope |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### GET /api/v1/subscribers

List all current subscribers.

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `topic` | string | — | Filter by topic (optional) |
| `page` | integer | 1 | Pagination page |
| `limit` | integer | 50 | Results per page (max 200) |

**Response (200):**

```json
{
  "status": "ok",
  "total": 87,
  "page": 1,
  "subscribers": [
    {
      "id": "sub-vega-01",
      "type": "engine",
      "topics": ["market.live.NSE.#", "market.ohlc.NSE.#"],
      "connectedSince": "2026-07-20T08:00:00Z",
      "messagesConsumed": 145000000
    }
  ]
}
```

### GET /api/v1/health

System health check.

**Response (200):**

```json
{
  "status": "healthy",
  "version": "2.1.0",
  "uptime": "14d 6h 32m",
  "checks": {
    "rabbitmq": { "status": "ok", "latencyMs": 0.2 },
    "redis": { "status": "ok", "latencyMs": 0.1 },
    "postgresql": { "status": "ok", "latencyMs": 1.5 },
    "influxdb": { "status": "ok", "latencyMs": 0.8 }
  },
  "metrics": {
    "throughput": 345000,
    "activeConnections": 1842,
    "errorRate": 0.001
  }
}
```

### GET /metrics

Prometheus metrics endpoint.

```text
# HELP lakshmi_messages_total Total messages handled
# TYPE lakshmi_messages_total counter
lakshmi_messages_total{topic="market.live.NSE.FUT"} 852000000
lakshmi_messages_total{topic="market.ohlc.NSE.EQ"} 45000000

# HELP lakshmi_latency_milliseconds Internal routing latency
# TYPE lakshmi_latency_milliseconds histogram
lakshmi_latency_milliseconds_bucket{le="0.5"} 0.45
lakshmi_latency_milliseconds_bucket{le="1"} 0.72
lakshmi_latency_milliseconds_bucket{le="2"} 0.94
lakshmi_latency_milliseconds_bucket{le="5"} 0.99
```

---

## WebSocket API

### Connection

```
ws://host:3001/stream
wss://host:3001/stream (TLS)
```

**Authentication:** Pass API key as query parameter or in first frame.

```
ws://localhost:3001/stream?apiKey=lak-xxxxxxxx
```

### Client → Server Messages

**Subscribe to topics:**

```json
{ "action": "subscribe", "topics": ["market.live.NSE.FUT.*", "market.ohlc.*"] }
```

**Unsubscribe:**

```json
{ "action": "unsubscribe", "topics": ["market.ohlc.*"] }
```

**Ping (keep-alive):**

```json
{ "action": "ping" }
```

### Server → Client Messages

**Market data tick:**

```json
{
  "type": "tick",
  "topic": "market.live.NSE.FUT.NIFTY",
  "data": {
    "symbol": "NIFTY24JULFUT",
    "ltp": 24532.15,
    "volume": 1250000,
    "timestamp": "2026-07-24T10:30:00.123Z"
  }
}
```

**Subscription confirmation:**

```json
{ "type": "subscribed", "topics": ["market.live.NSE.FUT.*", "market.ohlc.*"] }
```

**Pong:**

```json
{ "type": "pong", "timestamp": "2026-07-24T10:30:15.000Z" }
```

**Error:**

```json
{ "type": "error", "code": "UNAUTHORIZED", "message": "Invalid API key" }
```

---

## RabbitMQ Topic Reference

### Exchanges

| Exchange | Type | Durability | Description |
|---|---|---|---|
| `lakshmi.market` | topic | Durable | All market data messages |
| `lakshmi.trade` | topic | Durable | Trade confirmations and reports |
| `lakshmi.system` | topic | Durable | System events and alerts |
| `lakshmi.dlx` | topic | Durable | Dead-letter exchange |

### Standard Topics

| Topic Pattern | Publisher | Typical Subscribers | Message Rate |
|---|---|---|---|
| `market.live.NSE.EQ.*` | Ganesh | Vega, Brahma, Dashboard | 120K/s |
| `market.live.NSE.FUT.*` | Ganesh | Vega, Brahma | 80K/s |
| `market.live.BSE.*` | Ganesh | Garuda, Dashboard | 50K/s |
| `market.ohlc.*.` + interval | Surya | Kuber, Strategy Builder | 4.5K/s |
| `market.depth.*` | Surya | Vega | 40K/s |
| `trade.confirm.*` | Narad | Kuber, Dashboard | 500/s |
| `system.alert.*` | Lakshmi Monitoring | SRE, PagerDuty | < 1/s |
