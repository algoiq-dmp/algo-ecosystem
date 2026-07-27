# Delta XI — API Reference

**Version:** 3.2.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Base URL

```
http://192.168.190.104:3020/api/v3
```

## Authentication

Bearer token via Suraksha. Include `Authorization: Bearer <token>` header.

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/signals` | Current screening signals with rankings |
| GET | `/signals/:symbol` | Symbol-specific opportunity signals |
| GET | `/screeners` | List of active screener configurations |
| POST | `/screeners` | Create/update a screener configuration |
| GET | `/screeners/:id/status` | Real-time scanner status and match count |
| GET | `/alerts` | Recent market alerts and notifications |
| GET | `/history` | Historical signal performance data |

## Example Request

```
GET /api/v3/signals?type=breakout&min_score=0.7
Authorization: Bearer eyJhbG...
```

## Example Screener Config

```json
{ "name": "NIFTY Breakout", "symbols": ["NIFTY"], "conditions": [{ "indicator": "RSI", "operator": ">", "value": 70 }] }
```
