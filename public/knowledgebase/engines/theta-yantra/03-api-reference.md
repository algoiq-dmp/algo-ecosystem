# Theta Yantra — API Reference

**Version:** 3.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Base URL

```
http://192.168.190.106:3180/api/v3
```

## Authentication

Bearer token via Suraksha. Include `Authorization: Bearer <token>` header.

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/greeks/advanced` | Higher-order Greeks (Vanna, Volga, Charm, etc.) |
| GET | `/pricing/theoretical` | Theoretical option prices by model |
| GET | `/pricing/compare` | Market vs theoretical price comparison |
| GET | `/volatility/surface` | Volatility surface data (SABR/SVI) |
| GET | `/volatility/smile` | Volatility smile per expiry |
| GET | `/greeks/standard` | Standard Greeks (Delta, Gamma, Theta, Vega, Rho) |
| GET | `/models/status` | Active pricing models and GPU metrics |

## Example Request

```
GET /api/v3/greeks/advanced?symbol=NIFTY&expiry=27JUL2026&strike=19600
Authorization: Bearer eyJhbG...
```

## Response Format

`{ "success": true, "data": { "delta": 0.56, "gamma": 0.0012, "vanna": 0.00034, "volga": 0.00008, ... } }`.
