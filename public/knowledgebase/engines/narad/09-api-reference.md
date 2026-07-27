# 09 â€” API Reference

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Base URL

```
Production:  https://narad.algoiq.io/api/v1
Staging:     https://narad-staging.algoiq.io/api/v1
Local:       http://localhost:3003/api/v1
```

## Authentication

All endpoints require a Suraksha-issued JWT token:

```
Authorization: Bearer <jwt_token>
```

## Service Registry

### Register Service

```
POST /registry/services
```

```json
{
  "name": "ganesh",
  "type": "engine",
  "version": "3.2.1",
  "owner": "data-engineering",
  "host": "10.0.1.50",
  "port": 3002,
  "healthUrl": "/api/v1/health",
  "metadata": { "timeframes": ["1m", "5m", "15m", "1H", "1D"] }
}
```

### List All Services

```
GET /registry/services?status=healthy&type=engine
```

### Get Service by Name

```
GET /registry/services/ganesh
```

### Send Heartbeat

```
PUT /registry/services/ganesh/heartbeat
```

### Deregister Service

```
DELETE /registry/services/ganesh
```

## Configuration Management

### Get Configuration

```
GET /config/:serviceName?env=production
```

### Set Configuration

```
POST /config/:serviceName
```

```json
{
  "environment": "production",
  "config": { "redis": { "ttl": 90 } },
  "reason": "Increased bar TTL for better cache hit rate"
}
```

### Get Config History

```
GET /config/:serviceName/history?env=production&limit=20
```

## Deployment Management

### Trigger Deployment

```
POST /deploy/:serviceName
```

```json
{
  "version": "3.2.1",
  "strategy": "rolling",
  "instances": ["ganesh-1", "ganesh-2", "ganesh-3"],
  "healthCheckTimeout": 300,
  "rollbackOnFailure": true
}
```

### Get Deployment Status

```
GET /deploy/:deploymentId
```

## Remote Command

### Execute Command

```
POST /command/execute
```

```json
{
  "targetServer": "ganesh-prod-1",
  "command": "systemctl status ganesh",
  "requireApproval": true,
  "reason": "Investigating high latency alert"
}
```

### Get Command Result

```
GET /command/:commandId
```

## Health

### Narad Health

```
GET /health
```

```json
{
  "status": "healthy",
  "version": "3.0.0",
  "uptime": 8765432,
  "connectedAgents": 42
}
```

### Ecosystem Health Summary

```
GET /health/ecosystem
```

```json
{
  "totalServices": 25,
  "healthy": 24,
  "unhealthy": 1,
  "offline": 0,
  "services": [
    { "name": "ganesh", "status": "HEALTHY", "uptime": 120000 },
    { "name": "lakshmi", "status": "UNHEALTHY", "error": "Redis disconnected" }
  ]
}
```

## Error Responses

| HTTP Status | Code | Description |
|---|---|---|
| 400 | `INVALID_REQUEST` | Malformed request body |
| 401 | `UNAUTHORIZED` | Missing or invalid JWT |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `SERVICE_NOT_FOUND` | Service not in registry |
| 409 | `PORT_CONFLICT` | Requested port already allocated |
| 409 | `VERSION_CONFLICT` | Config version mismatch |
| 422 | `VALIDATION_ERROR` | Schema validation failed |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |
| 503 | `AGENT_UNREACHABLE` | Target server agent offline |
