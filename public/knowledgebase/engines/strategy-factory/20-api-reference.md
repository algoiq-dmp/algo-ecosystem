# 20 — API Reference

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Base URL

```
Production: https://api.algo-iq.com/strategy-factory/v3
Staging:    https://api-staging.algo-iq.com/strategy-factory/v3
```

## Authentication

All API requests require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Strategies

### Create Strategy

```
POST /strategies
Content-Type: application/json

{
  "name": "Trend Master",
  "description": "NIFTY 50 trend-following strategy",
  "market": "EQUITY",
  "timeframe": "1d",
  "template": null
}

Response 201:
{
  "id": "sf-abc123",
  "name": "Trend Master",
  "status": "DRAFT",
  "createdAt": "2026-07-24T10:00:00Z"
}
```

### Get Strategy

```
GET /strategies/{id}
Response 200: { Full strategy object }
```

### Update Strategy

```
PUT /strategies/{id}
Body: { Partial strategy fields }
Response 200: { Updated strategy }
```

### Delete Strategy

```
DELETE /strategies/{id}
Response 204: No Content
```

### List Strategies

```
GET /strategies?page=1&limit=20&status=DRAFT&sort=updatedAt
Response 200: { items: [], total: 42, page: 1, limit: 20 }
```

### Clone Strategy

```
POST /strategies/{id}/clone
Response 201: { id: "sf-xyz789", ... }
```

## Compilation

### Validate Strategy

```
POST /strategies/{id}/validate
Response 200:
{
  "valid": true,
  "errors": [],
  "warnings": [{ "block": "stop_loss", "message": "..." }]
}
```

### Export Strategy

```
POST /strategies/{id}/export
Body: { "options": { "prettyPrint": true, "includeMetadata": true } }
Response 200: { json: { }, version: "1.0.0" }
```

## Lifecycle Actions

### Submit to Parikshak

```
POST /strategies/{id}/submit/parikshak
Response 202: { submissionId: "sub-001", status: "SUBMITTED" }
```

### Submit to Simulator

```
POST /strategies/{id}/submit/simulator
Body: { "mode": "standard", "startDate": "2024-01-01", "endDate": "2025-12-31" }
Response 202: { backtestId: "bt-xyz789", status: "QUEUED" }
```

### Submit to DXCC

```
POST /strategies/{id}/submit/dxcc
Body: { "priority": "normal", "notes": "Ready for review" }
Response 202: { submissionId: "dxcc-sub-001", status: "PENDING" }
```

### Deploy to Kuber Alpha

```
POST /strategies/{id}/deploy
Body: { "mode": "PAPER", "capitalAllocation": { "budget": 500000 } }
Response 202: { deploymentId: "dep-001", status: "IN_PROGRESS" }
```

## Health & Metrics

### Health Check

```
GET /health
Response 200: { "status": "healthy", "version": "3.0.0", "uptime": 86400 }
```

### Metrics

```
GET /metrics
Response 200: { "strategies": { "total": 142, "active": 28 }, "mq": {} }
```

## Error Codes

| Code | Description |
|---|---|
| `400` | Bad request — invalid input |
| `401` | Unauthorized — missing/invalid token |
| `403` | Forbidden — insufficient permissions |
| `404` | Strategy not found |
| `409` | Conflict — strategy not in correct state |
| `422` | Validation failed |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
| `503` | Service unavailable — downstream engine down |

## Rate Limits

| Tier | Requests/minute |
|---|---|
| Free | 60 |
| Professional | 300 |
| Enterprise | 1000 |
