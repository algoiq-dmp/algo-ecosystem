# TalkStrategy API — API Reference

**Version:** 2.8.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

## Base URL

```
http://192.168.190.106:3140/api/v2
```

## Authentication

Bearer token via Suraksha. Include `Authorization: Bearer <token>` header. Each upstream engine has a unique API key with scoped permissions.

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/execute` | Submit a trade execution request |
| POST | `/execute/batch` | Submit batch execution requests |
| GET | `/execute/:id/status` | Query execution status |
| GET | `/execute/:id/result` | Get execution result and fill details |
| GET | `/symbols` | Get valid tradable symbols |
| GET | `/limits` | Get current position and exposure limits |
| GET | `/health` | API health and validator status |

## Example Request

```
POST /api/v2/execute
{
  "strategy_id": "STRAT-042",
  "symbol": "NIFTY",
  "action": "BUY",
  "quantity": 75,
  "product": "MIS",
  "price": 0,
  "order_type": "MARKET"
}
```

## Response Format

`{ "success": true, "data": { "execution_id": "EXEC-12345", "status": "accepted" } }`.
