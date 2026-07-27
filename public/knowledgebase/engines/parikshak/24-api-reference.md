# 24 — API Reference

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Base URL

```
Production: https://api.algo-iq.com/parikshak/v2
Staging:    https://api-staging.algo-iq.com/parikshak/v2
```

## Authentication

```
Authorization: Bearer <jwt_token>
X-API-Key: <api_key>  (alternative for CI/CD)
```

## Submissions

### Submit for Testing

```
POST /v2/submit
Content-Type: application/json

{
  "type": "strategy|engine|api|product",
  "source": "strategy-factory",
  "payload": { },
  "testSuites": ["full"],
  "priority": "normal|high|low",
  "callbackUrl": "https://example.com/webhook"
}

Response 202:
{ "submissionId": "sub-001", "status": "QUEUED" }
```

### Get Submission Status

```
GET /v2/submissions/{submissionId}
Response 200: { "status": "TESTING", "progress": { } }
```

### Cancel Submission

```
DELETE /v2/submissions/{submissionId}
Response 204: No Content
```

### List Submissions

```
GET /v2/submissions?page=1&limit=20&status=COMPLETED&type=strategy
Response 200: { "items": [], "total": 45 }
```

## Reports

### Get Report

```
GET /v2/submissions/{submissionId}/reports/{type}
```

| Type | Description |
|---|---|
| `test-report` | Detailed test case results |
| `checklist` | Mandatory verification checklist |
| `regression` | Version comparison analysis |
| `readiness` | Go/No-Go deployment recommendation |
| `performance` | Latency, throughput, resource metrics |
| `security` | Vulnerability and dependency scan |

### Download Report (PDF)

```
GET /v2/submissions/{submissionId}/reports/{type}/download?format=pdf
```

## Certificates

### Get Certificate

```
GET /v2/certificates/{certificateId}
Response 200: { "certificateId": "cert-001", "status": "ACTIVE" }
```

### Verify Certificate

```
GET /v2/certificates/{certificateId}/verify
Response 200: { "valid": true }
```

### Revoke Certificate

```
POST /v2/certificates/{certificateId}/revoke
Body: { "reason": "Security vulnerability discovered" }
Response 200: { "status": "REVOKED" }
```

## Test Suites

### List Available Suites

```
GET /v2/suites?type=strategy
Response 200: [ { "suiteId": "strategy-full", "name": "..." } ]
```

### Get Suite Definition

```
GET /v2/suites/{suiteId}
Response 200: { YAML definition }
```

## Health & Admin

### Health Check

```
GET /v2/health
Response 200: { "status": "healthy", "workers": 8, "queueDepth": 2 }
```

### Worker Status (Admin)

```
GET /v2/admin/workers
Response 200: { "total": 8, "busy": 3, "idle": 5, "details": [] }
```

### Metrics (Admin)

```
GET /v2/admin/metrics
Response 200: { "submissions": {}, "workers": {}, "queues": {} }
```

## Error Codes

| Code | Description |
|---|---|
| `400` | Invalid request payload |
| `401` | Missing or invalid authentication |
| `403` | Insufficient permissions |
| `404` | Submission/report not found |
| `409` | Cannot cancel (already completed) |
| `422` | Validation failed (schema, thresholds) |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
| `503` | Service overloaded (queue full) |

## Rate Limits

| Tier | Requests/min |
|---|---|
| Free | 30 |
| Professional | 120 |
| Enterprise | 600 |

## WebSocket API

```
ws://api.algo-iq.com/parikshak/v2/ws?token=<jwt>
```

### Events

| Event | Direction | Description |
|---|---|---|
| `submission.progress` | Server → Client | Real-time test progress |
| `submission.completed` | Server → Client | All tests finished |
| `report.ready` | Server → Client | Report available for download |
