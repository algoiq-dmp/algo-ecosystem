# TalkOptions — API Reference

**Version:** 4.7.2 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Base URL

```
http://192.168.190.118:8081/api/v4
https://192.168.190.118:8444/api/v4
```

## Authentication

Bearer token authentication. Include `Authorization: Bearer <token>` header with all requests. Tokens issued by Suraksha auth service.

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/option-chain` | Full option chain for symbol + expiry |
| GET | `/greeks` | Delta, Gamma, Theta, Vega, Rho per strike |
| GET | `/iv` | Implied volatility per strike |
| GET | `/oi-analysis` | Open interest buildup/change |
| GET | `/pcr` | Put-Call Ratio (symbol/expiry/index) |
| GET | `/max-pain` | Max Pain level calculation |
| GET | `/volatility-surface` | IV surface by strike/expiry |
| GET | `/expiry-analytics` | Expiry-day analytics and rollover |

## Example Request

```
GET /api/v4/option-chain?symbol=NIFTY&expiry=27JUL2026&type=CE
Authorization: Bearer eyJhbG...
```

## Response Format

All endpoints return JSON with standard wrapper: `{ "success": true, "data": {...}, "timestamp": "..." }`.
