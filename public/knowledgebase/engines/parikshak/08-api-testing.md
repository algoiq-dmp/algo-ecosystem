# 08 — API Testing

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Overview

API testing validates all REST, WebSocket, and MQ interfaces exposed by Algo-IQ engines. Parikshak ensures APIs meet contract specifications, performance SLAs, and security requirements.

## API Test Types

### Contract Testing

Validates that API responses match the OpenAPI/Swagger specification.

```javascript
describe('Strategy Factory API Contract', () => {
  it('POST /strategies matches schema', async () => {
    const response = await api.createStrategy(validPayload);
    expect(response).toMatchOpenApiSchema('StrategyFactory', 'createStrategy');
  });

  it('GET /strategies/{id} response matches schema', async () => {
    const response = await api.getStrategy('sf-abc123');
    expect(response).toMatchOpenApiSchema('StrategyFactory', 'getStrategy');
  });
});
```

### Functional Testing

| Endpoint | Tests |
|---|---|
| CRUD operations | Create, Read, Update, Delete |
| Pagination | Page size, offset, total count |
| Filtering | Status filter, date range, search |
| Sorting | Ascending, descending, multi-field |
| Partial updates | PATCH semantics |
| Idempotency | Repeated PUT/DELETE |
| Error responses | 400, 401, 403, 404, 409, 422, 429, 500, 503 |

### Authentication & Authorization

| Test | Description |
|---|---|
| No token → 401 | Missing auth header |
| Expired token → 401 | Token validation |
| Invalid token → 401 | Tampered token |
| Viewer role → 403 on write | RBAC enforcement |
| Owner role → access own resources | Resource ownership |
| Admin role → full access | Superuser permissions |

### Load Testing

| Metric | Target |
|---|---|
| Sustained RPS | 1000 requests/second |
| Peak RPS | 5000 requests/second |
| P50 latency | < 100ms |
| P95 latency | < 500ms |
| P99 latency | < 1000ms |
| Error rate | < 0.1% |

### Rate Limiting

| Test | Description |
|---|---|
| Within limit → 200 | Normal operation |
| At limit → 429 | Rate limit headers present |
| After reset → 200 | Limit window reset |
| Per-user limits | Different users, independent limits |

### WebSocket Testing

| Test | Description |
|---|---|
| Connection | Upgrade handshake |
| Authentication | Token in query param |
| Message delivery | Pub/sub within latency SLA |
| Reconnection | Auto-reconnect on drop |
| Heartbeat | Ping/pong keepalive |
| Backpressure | Slow consumer handling |

### MQ API Testing

| Queue | Tests |
|---|---|
| Message schema | Payload matches contract |
| Routing | Correct queue receives message |
| Persistence | Survives broker restart |
| Ordering | FIFO where required |
| TTL | Expired messages to DLQ |
| Compression | gzip for large payloads |

## API Security Tests

| Test | Description |
|---|---|
| SQL Injection | Parameterized input fields |
| XSS | Reflected input in responses |
| CSRF | State-changing endpoints |
| CORS | Restricted origins |
| HTTPS | TLS 1.2+ enforced |
| Headers | CSP, HSTS, X-Frame-Options |
| Secrets in response | No passwords/tokens leaked |
