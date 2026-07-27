# TalkDelta — API Reference

**Version:** 5.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Base URL

```
http://192.168.190.104:3005/api/v5
```

## Authentication

Bearer token via Suraksha. All API calls require `Authorization: Bearer <token>`.

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/strategies` | List all active strategies with positions |
| GET | `/strategies/:id/mtm` | Live MTM for a strategy |
| GET | `/strategies/:id/pnl` | P&L breakdown (realized/unrealized) |
| GET | `/strategies/:id/trades` | Trade history with execution stats |
| GET | `/delta/calculate` | Delta calculation API for signal engines |
| GET | `/portfolio/analytics` | Portfolio-level risk and exposure |
| GET | `/risk/exposure` | Strategy-wise and broker-wise exposure |
| GET | `/dashboard/stream` | WebSocket upgrade for real-time dashboard |

## Example Request

```
GET /api/v5/strategies/STRAT-042/mtm
Authorization: Bearer eyJhbG...
```

## Response Format

Standard JSON: `{ "success": true, "data": { "mtm": 12500.50, "timestamp": "..." } }`.
