# SpreadWatch — API Reference

**Version:** 2.8.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Base URL

```
http://192.168.190.104:3022/api/v2
```

## Authentication

Bearer token via Suraksha. Include `Authorization: Bearer <token>` header.

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/spreads` | Active spread signals with deviation metrics |
| GET | `/spreads/:pair_id` | Detailed spread analysis for a pair |
| GET | `/arbitrage` | Current arbitrage opportunities |
| GET | `/calendar-spreads` | Calendar spread mispricing data |
| GET | `/pairs` | Configured pair definitions and status |
| POST | `/pairs` | Register a new pair for monitoring |
| GET | `/alerts` | Recent spread threshold alerts |
| GET | `/history/:pair_id` | Historical spread and cointegration data |

## Example Request

```
GET /api/v2/spreads?type=calendar&min_deviation=1.5
Authorization: Bearer eyJhbG...
```

## Pair Configuration

```json
{ "leg1": "NIFTY-27JUL-CE-19600", "leg2": "NIFTY-27JUL-CE-19700", "ratio": "1:1", "entry_threshold": 5.0 }
```
