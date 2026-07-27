# TalkStrategy App — API Reference

**Version:** 2.5.0 | **Owner:** Frontend | **Last Updated:** 2026-07-24

## Base URL

```
http://192.168.190.106:3141/api/v2
```

## Authentication

Bearer token via Suraksha. Include `Authorization: Bearer <token>` header.

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/strategies` | List configured strategies |
| GET | `/strategies/:id` | Strategy configuration details |
| PUT | `/strategies/:id/config` | Update strategy execution config |
| GET | `/strategies/:id/orders` | Order history for a strategy |
| GET | `/strategies/:id/status` | Real-time execution status |
| GET | `/dashboard/stream` | WebSocket upgrade for live dashboard |
| GET | `/execution/stats` | Execution statistics and metrics |

## Example Request

```
GET /api/v2/strategies/STRAT-042/orders?status=filled&limit=50
Authorization: Bearer eyJhbG...
```
