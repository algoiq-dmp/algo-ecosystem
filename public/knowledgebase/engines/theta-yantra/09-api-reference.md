# Theta Yantra - API Reference

**Version:** 3.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25


## Base URL

All endpoints are served over HTTPS on the configured port. The base URL follows the pattern:

```
https://<server>:<port>/api/v1
```

## Authentication

All API requests require a valid Suraksha JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

## Core Endpoints

### Health & Status

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/health | Liveness probe (returns 200 if running) |
| GET | /api/v1/health/ready | Readiness probe (checks DB, MQ connectivity) |
| GET | /api/v1/status | Detailed component health summary |

### Configuration

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/config | Retrieve current running configuration |
| PUT | /api/v1/config | Update configuration (hot-reload) |
| GET | /api/v1/config/history | List configuration change history |

### Operations

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/restart | Gracefully restart the engine process |
| POST | /api/v1/reload | Reload strategies / rules without restart |
| GET | /api/v1/metrics | Prometheus-compatible metrics endpoint |

### Data Management

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/data/query | Run parameterized data queries |
| GET | /api/v1/data/export | Export data in CSV/JSON format |
| DELETE | /api/v1/data/purge | Purge old data (admin only) |

## Standard Response Format

```json
{
  "status": "success",
  "data": {},
  "meta": {
    "timestamp": "2026-07-25T12:00:00Z",
    "version": "2.5.0"
  }
}
```

## Error Codes

| Code | Meaning | Retryable |
|------|---------|-----------|
| 400 | Bad request / invalid input | No |
| 401 | Authentication required | No |
| 403 | Insufficient permissions | No |
| 429 | Rate limit exceeded | Yes |
| 500 | Internal server error | Yes |
| 503 | Service temporarily unavailable | Yes |

