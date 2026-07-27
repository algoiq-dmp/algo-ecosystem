# VYUH — API Reference

**Version:** 3.0.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Base URL

```
http://192.168.190.104:3021/api/v3
```

## Authentication

Bearer token via Suraksha. Include `Authorization: Bearer <token>` header.

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rankings` | Stock rankings with composite scores |
| GET | `/rankings/:symbol` | Detailed scoring breakdown for a symbol |
| GET | `/trends` | Trend detection signals across universe |
| GET | `/sectors` | Sector-level analysis and rotation data |
| GET | `/relative-strength` | Relative strength scores vs benchmark |
| GET | `/opportunities` | Top-ranked opportunity signals |
| GET | `/history/:symbol` | Historical score and ranking data |

## Example Request

```
GET /api/v3/rankings?limit=20&min_score=0.6
Authorization: Bearer eyJhbG...
```

## Response Format

`{ "success": true, "data": [{ "symbol": "RELIANCE", "score": 0.87, "factors": {...} }] }`.
