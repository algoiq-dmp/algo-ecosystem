# AALAP Calls — API Reference

**Version:** 2.5.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Base URL

```
http://192.168.190.104:3030/api/v2  (signals aggregator)
http://192.168.190.104:3031-3044/    (individual strategy status)
```

## Authentication

Bearer token via Suraksha. Include `Authorization: Bearer <token>` header.

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/signals` | All active signals across strategies |
| GET | `/signals/:strategy_id` | Signals from a specific strategy |
| GET | `/strategies` | List of all 15 strategies with status |
| GET | `/strategies/:id/status` | Individual strategy health and last signal |
| GET | `/strategies/:id/config` | Strategy configuration and parameters |
| GET | `/history` | Historical signal performance |
| POST | `/strategies/:id/toggle` | Enable/disable a specific strategy |

## Example Request

```
GET /api/v2/signals?status=active&min_confidence=0.7
Authorization: Bearer eyJhbG...
```
