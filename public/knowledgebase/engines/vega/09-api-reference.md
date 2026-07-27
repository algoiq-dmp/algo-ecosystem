# 09 — API Reference

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Base URL

```
Production:  https://vega-api.algoiq.com/api/v1
Staging:     https://vega-api.staging.algoiq.com/api/v1
Local:       http://localhost:3003/api/v1
```

---

## Authentication

All API requests require:

| Header | Description |
|---|---|
| `X-API-Key` | Your API key issued by the Vega admin |
| `X-Timestamp` | Unix timestamp in milliseconds |
| `X-Signature` | HMAC-SHA256 signature of `requestBody + X-Timestamp + X-API-Key` |

### Signature Generation

```javascript
const crypto = require('crypto');

function generateSignature(body, timestamp, apiKey, secretKey) {
  const payload = JSON.stringify(body) + timestamp + apiKey;
  return crypto.createHmac('sha256', secretKey).update(payload).digest('hex');
}
```

---

## Endpoints

### Place Order

```
POST /api/v1/orders
```

**Request Body:**

```json
{
  "signalId": "SIG-7f3a2b1c",
  "symbol": "RELIANCE",
  "exchange": "NSE",
  "transactionType": "BUY",
  "orderType": "LIMIT",
  "quantity": 100,
  "price": 2450.75,
  "productType": "MIS",
  "validity": "DAY",
  "userId": "USR-0042",
  "strategyId": "STRAT-MACD-01",
  "disclosedQuantity": 0,
  "triggerPrice": null
}
```

**Response (202 Accepted):**

```json
{
  "status": "ACCEPTED",
  "correlationId": "b3f2c1d4-8a6e-4f3b-9c2d-1e5f7a8b3c4d",
  "timestamp": "2026-07-24T09:16:45.100Z"
}
```

**Response (201 Created — synchronous mode):**

```json
{
  "status": "ROUTED",
  "orderId": "VEGA-20260724-000001-AB12",
  "brokerOrderId": "XT-20260724-998877",
  "state": "ROUTED",
  "timestamp": "2026-07-24T09:16:45.234Z"
}
```

**Error Responses:**

| Code | Meaning |
|---|---|
| 400 | Invalid request body or schema violation |
| 401 | Missing or invalid authentication |
| 403 | Kill switch active for this user |
| 429 | Rate limit exceeded |
| 503 | Service unavailable (broker down) |

---

### Get Order Status

```
GET /api/v1/orders/{orderId}
```

**Response (200 OK):**

```json
{
  "orderId": "VEGA-20260724-000001-AB12",
  "brokerOrderId": "XT-20260724-998877",
  "state": "FILLED",
  "orderType": "LIMIT",
  "transactionType": "BUY",
  "symbol": "RELIANCE",
  "quantity": 100,
  "filledQuantity": 100,
  "averagePrice": 2450.50,
  "createdAt": "2026-07-24T09:16:45.123Z",
  "updatedAt": "2026-07-24T09:16:46.890Z",
  "version": 3
}
```

---

### Modify Order

```
PUT /api/v1/orders/{orderId}
```

**Request Body (partial update):**

```json
{
  "price": 2451.00,
  "quantity": 150,
  "triggerPrice": null
}
```

**Response (202 Accepted):**

```json
{
  "status": "MODIFICATION_ACCEPTED",
  "orderId": "VEGA-20260724-000001-AB12",
  "version": 2
}
```

**Constraints:**
- Only `price`, `quantity`, `triggerPrice`, `validity` modifiable
- Order must be in ACKNOWLEDGED or PARTIALLY_FILLED state
- Cannot modify a cancelled or rejected order

---

### Cancel Order

```
DELETE /api/v1/orders/{orderId}
```

**Response (202 Accepted):**

```json
{
  "status": "CANCELLATION_ACCEPTED",
  "orderId": "VEGA-20260724-000001-AB12"
}
```

---

### List Orders

```
GET /api/v1/orders?userId=USR-0042&state=FILLED&from=2026-07-20&to=2026-07-24&limit=50&offset=0
```

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `userId` | string | Filter by user ID (required) |
| `state` | string | Filter by order state |
| `symbol` | string | Filter by symbol |
| `from` | date | Start date (ISO format) |
| `to` | date | End date (ISO format) |
| `limit` | integer | Max records (default 50, max 200) |
| `offset` | integer | Pagination offset |

**Response:**

```json
{
  "data": [ /* order objects */ ],
  "pagination": {
    "total": 342,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### Get Positions

```
GET /api/v1/positions?userId=USR-0042
```

**Response:**

```json
{
  "userId": "USR-0042",
  "positions": [
    {
      "symbol": "RELIANCE",
      "exchange": "NSE",
      "quantity": 100,
      "averagePrice": 2450.50,
      "ltp": 2455.00,
      "pnl": 450.00,
      "productType": "MIS"
    }
  ]
}
```

---

### Health Check

```
GET /api/v1/health
```

**Response:**

```json
{
  "status": "healthy",
  "version": "6.3.0",
  "uptime": 1234567,
  "checks": {
    "database": "ok",
    "redis": "ok",
    "rabbitmq": "ok",
    "xts_fix": "connected",
    "greeksoft_fix": "connected"
  }
}
```

---

### Audit Query

```
GET /api/v1/audit/orders?orderId=VEGA-20260724-000001-AB12
```

**Response:**

```json
{
  "orderId": "VEGA-20260724-000001-AB12",
  "events": [
    {
      "eventType": "ORDER_CREATED",
      "timestamp": "2026-07-24T09:16:45.100Z",
      "actor": "STRAT-MACD-01",
      "data": { "signalId": "SIG-7f3a2b1c" }
    },
    {
      "eventType": "ORDER_VALIDATED",
      "timestamp": "2026-07-24T09:16:45.150Z",
      "actor": "TalkStrategy-App-02",
      "data": {}
    },
    {
      "eventType": "ORDER_ROUTED",
      "timestamp": "2026-07-24T09:16:45.200Z",
      "actor": "OrderProcessor-01",
      "data": { "broker": "XTS" }
    },
    {
      "eventType": "ORDER_FILLED",
      "timestamp": "2026-07-24T09:16:46.890Z",
      "actor": "XTS-Adapter-01",
      "data": { "filledQty": 100, "avgPrice": 2450.50 }
    }
  ]
}
```

---

## Rate Limits

| Tier | Rate | Burst |
|---|---|---|
| Standard | 500 requests/sec | 1000 |
| Premium | 1000 requests/sec | 2000 |
| Admin | 2000 requests/sec | 5000 |

Rate limit headers in every response:

```
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 487
X-RateLimit-Reset: 1765432020
```

---

## Versioning

API version is specified in the URL path (`/api/v1/`). Breaking changes will increment the version number. Non-breaking additions (new endpoints, optional fields) may be added without version bumps.
