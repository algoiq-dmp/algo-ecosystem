# 09 â€” API Reference

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Base URL

```
Production:  https://ganesh.algoiq.io/api/v1
Staging:     https://ganesh-staging.algoiq.io/api/v1
Local:       http://localhost:3002/api/v1
```

## Authentication

All endpoints require a Suraksha-issued JWT token passed in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Get Latest Bar

```
GET /bar/:symbol/:timeframe
```

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| symbol | string | Yes | Trading symbol (e.g., `RELIANCE`) |
| timeframe | enum | Yes | `1m`, `5m`, `15m`, `1H`, `1D` |

**Response:**

```json
{
  "symbol": "RELIANCE",
  "timeframe": "1m",
  "bar": {
    "time": "2026-07-24T10:30:00.000Z",
    "open": 2450.50,
    "high": 2455.75,
    "low": 2448.25,
    "close": 2453.10,
    "volume": 125000,
    "open_interest": 0,
    "adjusted": false
  }
}
```

### Get Bar at Specific Timestamp

```
GET /bar/:symbol/:timeframe/:timestamp
```

Returns the OHLC bar whose window contains the given timestamp.

### Get Bar Range

```
GET /bars/:symbol/:timeframe?from=<ISO>&to=<ISO>&limit=<int>
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| from | ISO-8601 | No | Start of range (inclusive) |
| to | ISO-8601 | No | End of range (inclusive) |
| limit | integer | No | Max bars to return (default: 1000, max: 10000) |

**Response:**

```json
{
  "symbol": "RELIANCE",
  "timeframe": "5m",
  "from": "2026-07-24T09:15:00.000Z",
  "to": "2026-07-24T10:00:00.000Z",
  "count": 10,
  "bars": [...]
}
```

### Multi-Timeframe Snapshot

```
GET /bars/multi/:symbol?timeframes=1m,5m,15m,1H,1D
```

Returns the latest bar for each requested timeframe.

### Health Check

```
GET /health
```

```json
{
  "status": "healthy",
  "version": "3.2.1",
  "uptime": 1234567
}
```

### Deep Health Check

```
GET /health/deep
```

```json
{
  "status": "healthy",
  "checks": {
    "redis": "connected",
    "postgresql": "connected",
    "rabbitmq": "connected",
    "bar_freshness": "ok",
    "latest_bar_age_ms": 1500
  }
}
```

## Error Responses

| HTTP Status | Code | Description |
|---|---|---|
| 400 | `INVALID_SYMBOL` | Symbol not recognized |
| 400 | `INVALID_TIMEFRAME` | Unsupported timeframe |
| 401 | `UNAUTHORIZED` | Missing or invalid JWT |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 429 | `RATE_LIMITED` | Consumer quota exceeded |
| 404 | `NOT_FOUND` | No bar for requested parameters |
| 500 | `INTERNAL_ERROR` | Server error |
| 503 | `SERVICE_UNAVAILABLE` | Degraded service |

## Rate Limiting

| Tier | Rate Limit | Burst |
|---|---|---|
| Real-time engines (Vega, Brahma) | 100 req/s | 200 |
| Simulator | 50 req/s | 100 |
| Web dashboards | 20 req/s | 50 |
| Internal services | 500 req/s | 1000 |
