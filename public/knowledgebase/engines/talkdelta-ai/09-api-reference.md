# TalkDelta AI — API Reference

**Version:** 1.4.0 | **Owner:** AI/ML | **Last Updated:** 2026-07-25

## Key REST Endpoints

TalkDelta AI exposes its primary API on port `3010` with the following endpoint categories.

## Authentication

All endpoints require a Bearer JWT token obtained from Suraksha:
```
Authorization: Bearer <jwt_token>
```

## Core Endpoints

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | `/api/v1/health` | Health check with component status | Unlimited |
| GET | `/api/v1/status` | Detailed service status and version | 60/min |
| GET | `/api/v1/metrics` | Prometheus-compatible metrics | 30/min |
| POST | `/api/v1/query` | Primary data query endpoint | 600/min |
| GET | `/api/v1/data/latest` | Latest computed analytics snapshot | 300/min |
| GET | `/api/v1/data/history` | Historical analytics with time range | 120/min |
| POST | `/api/v1/subscribe` | Register webhook for data events | 30/min |
| DELETE | `/api/v1/subscribe/{id}` | Remove webhook subscription | 30/min |

## Node-Specific Endpoints

AI-powered decision engine for strategy optimization. Processes trade data, market data, and analytics to generate AI-driven strategy signals and pattern recognition.

Key domain endpoints:
- `GET /api/v1/analytics` — Core analytics computation results
- `GET /api/v1/analytics/{symbol}` — Symbol-specific analytics
- `GET /api/v1/analytics/batch` — Bulk analytics for multiple symbols
- `POST /api/v1/analytics/compute` — On-demand computation request
- `GET /api/v1/export/{format}` — Export data in CSV/JSON/Parquet

## Response Format

```json
{
  "status": "success",
  "timestamp": "2026-07-25T10:30:00+05:30",
  "data": {},
  "meta": {
    "version": "1.4.0",
    "processing_time_ms": 12,
    "source": "talkdelta-ai"
  }
}
```

## Error Codes

| Code | Meaning | Retry |
|------|---------|-------|
| 200 | Success | No |
| 400 | Invalid parameters | No |
| 401 | Invalid/missing token | No |
| 429 | Rate limit exceeded | After Retry-After |
| 500 | Internal server error | Yes (exponential backoff) |
| 503 | Service degraded | Yes (with jitter) |
