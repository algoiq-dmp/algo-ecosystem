# 19 — API Endpoints

> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24

## Base URL

```
https://kavach.internal.algoiq.io/api/v3
```

## Authentication

mTLS with service-level certificates. Header: `X-API-Key: <key>`, `X-Consumer-ID: <name>`.

## Endpoints

### 1. Get Strategy Greeks

```
GET /greeks?strategy_id={id}
```

Returns live Delta, Gamma, Theta, Vega for the specified strategy.

### 2. Get Neutrality

```
GET /neutrality?strategy_id={id}
```

Returns neutrality percentage and current zone (Green/Yellow/Orange/Red/Black).

### 3. Get Risk Score

```
GET /risk?strategy_id={id}
```

Returns composite risk score (0-100) with component breakdown.

### 4. Get Adjustment Signals

```
GET /adjustments?strategy_id={id}&status=pending
```

Returns pending adjustment signals with instrument, quantity, and cost estimates.

### 5. Get Rebalance Recommendation

```
GET /rebalance?portfolio_id={id}
```

Returns multi-strategy rebalance plan with netted trades.

### 6. Get Portfolio Overview

```
GET /portfolio?portfolio_id={id}
```

Returns all strategies' Greek summary in a single response.

### 7. Streaming (WebSocket)

```
wss://kavach.internal.algoiq.io/ws/v3/stream
```

Subscribe message:

```json
{"action":"subscribe","strategies":["IC-NIFTY-AUG","STR-BNF-AUG"]}
```

### 8. Acknowledge Adjustment

```
POST /adjustments/{signal_id}/ack
```

Marks an adjustment signal as acknowledged and optionally executed.

### 9. Health Check

```
GET /health
```

Response:

```json
{"status":"healthy","version":"3.5.0","strategies_active":12,"positions_monitored":234}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid parameters |
| 404 | Strategy not found |
| 409 | Conflicting adjustment signal |
| 429 | Rate limit exceeded |
| 500 | Greek computation error |
| 503 | Service degraded |

## SDKs

| Language | Package |
|----------|---------|
| Python | `pip install kavach-client` |
| Rust | `cargo add kavach-client` |
| Go | `go get algoiq.io/kavach-client` |
