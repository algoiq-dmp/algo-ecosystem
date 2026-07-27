# 17 — API Reference

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Base URL

```
Production: https://api.algo-iq.com/kuber-alpha/v1
Staging:    https://api-staging.algo-iq.com/kuber-alpha/v1
```

## Authentication

```
Authorization: Bearer <jwt_token>
X-API-Key: <api_key>
```

## Strategies

### Deploy Strategy

```
POST /v1/strategies/deploy
Body: { "strategyId": "sf-abc123", "mode": "PAPER", "capital": {} }
Response 202: { "deploymentId": "dep-001", "status": "ACTIVE" }
```

### Get Strategy Status

```
GET /v1/strategies/{strategyId}/status
Response 200: { "strategyId": "sf-abc123", "status": "LIVE", "pnl": {}, "positions": [] }
```

### List Active Strategies

```
GET /v1/strategies?status=LIVE&page=1&limit=20
Response 200: { "items": [], "total": 5 }
```

### Change Strategy Mode

```
POST /v1/strategies/{strategyId}/mode
Body: { "mode": "LIVE" }
Response 200: { "strategyId": "sf-abc123", "mode": "LIVE" }
```

### Pause Strategy

```
POST /v1/strategies/{strategyId}/pause
Response 200: { "strategyId": "sf-abc123", "status": "PAUSED" }
```

### Resume Strategy

```
POST /v1/strategies/{strategyId}/resume
Response 200: { "strategyId": "sf-abc123", "status": "ACTIVE" }
```

### Retire Strategy

```
POST /v1/strategies/{strategyId}/retire
Response 200: { "strategyId": "sf-abc123", "status": "RETIRED" }
```

## Capital

### Get Capital Status

```
GET /v1/capital
Response 200: { "totalBudget": 10000000, "utilized": 7500000, "free": 2500000 }
```

### Get Strategy Capital

```
GET /v1/strategies/{strategyId}/capital
Response 200: { "allocated": 4000000, "deployed": 1800000, "pnl": 45000 }
```

## Orders

### Get Strategy Orders

```
GET /v1/strategies/{strategyId}/orders?status=OPEN&page=1&limit=50
Response 200: { "items": [], "total": 3 }
```

### Get Order Status

```
GET /v1/orders/{orderId}
Response 200: { "orderId": "ord-001", "status": "COMPLETE", "fills": [] }
```

### Cancel Order

```
DELETE /v1/orders/{orderId}
Response 202: { "orderId": "ord-001", "status": "CANCELLED" }
```

## Kill Switch

### Get Kill Switch Status

```
GET /v1/kill-switch
Response 200: { "status": "ARMED", "marginPct": 0.85, "threshold": 1.01 }
```

### Trigger Kill Switch (Admin)

```
POST /v1/kill-switch/trigger
Body: { "reason": "Manual emergency halt" }
Response 200: { "status": "TRIGGERED" }
```

### Disarm Kill Switch (Admin)

```
POST /v1/kill-switch/disarm
Body: { "reason": "Issue resolved" }
Response 200: { "status": "DISARMED" }
```

### Test Kill Switch

```
POST /v1/kill-switch/test
Response 200: { "testId": "ks-test-001", "result": "PASSED" }
```

## Health & Metrics

### Health Check

```
GET /v1/health
Response 200: { "status": "healthy", "version": "1.8.0", "strategiesActive": 5 }
```

### Metrics

```
GET /v1/metrics
Response 200: { "signals": {}, "orders": {}, "capital": {}, "strategies": {} }
```

## Error Codes

| Code | Description |
|---|---|
| `400` | Invalid request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Strategy/order not found |
| `409` | Invalid state transition (e.g., pause a RETIRED strategy) |
| `422` | Validation failed |
| `423` | Kill Switch is ARMED — operation blocked |
| `429` | Rate limited |
| `500` | Internal error |
| `503` | Vega unavailable |

## WebSocket API

```
ws://api.algo-iq.com/kuber-alpha/v1/ws?token=<jwt>
```

Events:
- `strategy.status` — Strategy state change
- `order.update` — Order status change
- `capital.update` — Capital allocation change
- `killswitch.alert` — Kill Switch status change
