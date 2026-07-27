# 18 — API Endpoints

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Base URL

```
https://manthan.internal.algoiq.io/api/v2
```

## Authentication

mTLS with service-level certificates. Header: `X-API-Key: <key>`, `X-Consumer-ID: <name>`.

## Endpoints

### 1. Get Full Intelligence

```
GET /intelligence?symbol={symbol}
```

Returns all analysis modules for a symbol on default timeframe.

### 2. Get Market Regime

```
GET /regime?symbol={symbol}&timeframe={tf}
```

### 3. Get Trend Analysis

```
GET /trend?symbol={symbol}&timeframes={tf_list}
```

Returns multi-timeframe trend matrix.

### 4. Get Breakout Probability

```
GET /breakout?symbol={symbol}
```

### 5. Get Volatility Regime

```
GET /volatility?symbol={symbol}&period={days}
```

### 6. Get Volume Analysis

```
GET /volume?symbol={symbol}
```

### 7. Get OI Analysis

```
GET /open-interest?symbol={symbol}
```

### 8. Get Liquidity Score

```
GET /liquidity?symbol={symbol}
```

### 9. Streaming (WebSocket)

```
wss://manthan.internal.algoiq.io/ws/v2/stream
```

Subscribe: `{"action":"subscribe","symbols":["NIFTY"],"modules":["regime","trend","confidence"]}`

### 10. Health

```
GET /health
→ {"status":"healthy","version":"2.0.0","uptime":"12d 8h","modules_active":8}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid parameters |
| 401 | Auth failed |
| 404 | Symbol not found |
| 429 | Rate limit |
| 500 | Analysis error |
| 503 | Degraded (partial modules) |
