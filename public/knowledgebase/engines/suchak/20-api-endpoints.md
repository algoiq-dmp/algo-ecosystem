# 20 — API Endpoints

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Base URL

```
https://suchak.internal.algoiq.io/api/v4
```

## Authentication

All endpoints require **mTLS** authentication with service-level certificates.

```
Header: X-API-Key: <service_key>
Header: X-Consumer-ID: <consumer_name>
```

## Endpoints

### 1. Get Indicator Values

```
GET /indicators?symbol={symbol}&timeframe={tf}&indicators={indicator_list}
```

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `symbol` | string | Yes | Trading symbol (NIFTY, BANKNIFTY, etc.) |
| `timeframe` | string | Yes | Bar timeframe (1m, 5m, 15m, 1h, 1d) |
| `indicators` | string | No | Comma-separated indicator IDs; omit for all |
| `format` | string | No | `json` (default) or `protobuf` |

**Response:**

```json
{
  "symbol": "NIFTY",
  "timeframe": "1d",
  "timestamp": "2026-07-24T15:30:00+05:30",
  "indicators": {
    "ema_9": 24550.00,
    "ema_20": 24480.00,
    "rsi_14": 62.4,
    "macd": {"line": 45.2, "signal": 38.1, "histogram": 7.1},
    "signal_strength": 72.5
  }
}
```

### 2. Get Signal Strength

```
GET /signal-strength?symbol={symbol}&timeframe={tf}
```

Returns the composite signal strength score and category.

### 3. Get Support & Resistance

```
GET /support-resistance?symbol={symbol}&timeframe={tf}&methods={method_list}
```

**Methods:** `pivot`, `volume_profile`, `moving_average`, `fibonacci`, `round_number`

### 4. Get Momentum Analysis

```
GET /momentum?symbol={symbol}&timeframe={tf}
```

### 5. Get Multi-Timeframe Confluence

```
GET /confluence?symbol={symbol}&timeframes={tf_list}
```

Returns signal strength across all requested timeframes with confluence flag.

### 6. Historical Indicators

```
GET /historical?symbol={symbol}&timeframe={tf}&from={date}&to={date}&indicators={list}
```

**Rate Limit:** 100 requests/min per consumer. Historical endpoint: 10 requests/min.

### 7. Streaming (WebSocket)

```
wss://suchak.internal.algoiq.io/ws/v4/stream
```

Subscribe message:

```json
{
  "action": "subscribe",
  "symbols": ["NIFTY", "BANKNIFTY"],
  "timeframes": ["1m", "15m", "1h"],
  "indicators": ["all"]
}
```

Streams indicator updates as they are computed.

### 8. Indicator Catalog

```
GET /catalog
```

Returns metadata for all available indicators.

### 9. Health Check

```
GET /health
```

```json
{
  "status": "healthy",
  "version": "4.1.0",
  "uptime": "45d 12h 30m",
  "symbols_active": 256,
  "indicators_active": 15,
  "throughput_tps": 850,
  "latency_p95_ms": 35
}
```

### 10. Alert Configuration

```
POST /alerts/configure
```

Configures indicator-based alerts.

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid parameters |
| 401 | Authentication failed |
| 403 | Unauthorized consumer |
| 404 | Symbol not found |
| 429 | Rate limit exceeded |
| 500 | Internal computation error |
| 503 | Service degraded |

## SDKs

| Language | Package |
|----------|---------|
| Python | `pip install suchak-client` |
| Rust | `cargo add suchak-client` |
| JavaScript | `npm install @algoiq/suchak` |
| Go | `go get algoiq.io/suchak-client` |
