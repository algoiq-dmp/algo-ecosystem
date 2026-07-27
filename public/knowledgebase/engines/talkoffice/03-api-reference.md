# TalkOffice — API Reference

**Version:** 4.0.0 | **Owner:** Operations | **Last Updated:** 2026-07-24

## Base URL

```
http://192.168.190.119:3080/api/v4
```

## Authentication

Bearer token via Suraksha. Include `Authorization: Bearer <token>` header.

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/positions` | All open positions (filter by broker/strategy/client) |
| GET | `/positions/:id/mtm` | Live MTM for a specific position |
| GET | `/pnl` | Realized/unrealized P&L summary |
| GET | `/margin` | Margin utilization by broker and strategy |
| GET | `/exposure` | Current exposure across all positions |
| GET | `/trade-book` | Complete trade history with filters |
| GET | `/order-book` | Active and filled orders |
| GET | `/dashboard/stream` | WebSocket upgrade for live dashboard |

## Example Request

```
GET /api/v4/positions?broker=XTS&strategy=STRAT-042
Authorization: Bearer eyJhbG...
```
