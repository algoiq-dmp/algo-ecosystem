# TalkDelta AI — API Reference

**Version:** 1.4.0 | **Owner:** AI/ML | **Last Updated:** 2026-07-24

## Base URL

```
http://192.168.190.104:3010/api/v1
```

## Authentication

Bearer token authentication via Suraksha. Include `Authorization: Bearer <token>` header.

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/signals` | AI-generated strategy signals with confidence scores |
| GET | `/signals/:strategy_id` | Strategy-specific AI recommendations |
| GET | `/risk/insights` | Portfolio-level risk analysis from AI models |
| POST | `/predict/opportunity` | On-demand opportunity scoring for a given context |
| GET | `/models/status` | Active ML model versions and performance metrics |
| GET | `/explanations/:trade_id` | AI-generated trade outcome explanation |

## Example Request

```
GET /api/v1/signals?strategy_id=STRAT-042
Authorization: Bearer eyJhbG...
```

## Response Format

`{ "success": true, "data": { "signals": [...], "confidence": 0.87, "timestamp": "..." } }`.
