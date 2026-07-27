---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 09 — API Reference

## Base URL

```
Production: https://api.garuda.dev/v3
Sandbox:    https://sandbox.garuda.dev/v3
```

## Authentication

All endpoints require `Authorization: Bearer <jwt_token>` header or `X-API-Key: <api_key>` header.

---

## Margin Calculation Endpoints

### POST /margin/contract

Calculate margin for a single contract or a list of independent contracts.

**Method:** `POST`
**Path:** `/v3/margin/contract`
**Auth:** Bearer JWT

**Request:**
```json
{
  "exchange": "NSE",
  "positions": [
    {
      "symbol": "NIFTY",
      "instrument_type": "OPTIDX",
      "option_type": "CE",
      "strike_price": 24600,
      "expiry": "2026-08-27",
      "quantity": 75,
      "buy_sell": "SELL"
    },
    {
      "symbol": "BANKNIFTY",
      "instrument_type": "FUTIDX",
      "expiry": "2026-08-27",
      "quantity": -30,
      "buy_sell": "BUY"
    }
  ],
  "broker_id": "BROKER_001",
  "user_id": "TRADER_1042",
  "span_file_date": "2026-07-25"
}
```

**Response (200):**
```json
{
  "computation_id": "calc_01ARZ3PXXQ",
  "timestamp": "2026-07-25T10:30:45.123Z",
  "total_margin": 245000.75,
  "margin_breakdown": {
    "span_margin": 142500.50,
    "exposure_margin": 87500.00,
    "premium": 32000.00,
    "net_option_value": -28000.00,
    "calendar_spread_benefit": 8500.00,
    "spread_benefit": 4500.00,
    "portfolio_benefit": 12000.00
  },
  "peak_margin_today": 268000.00,
  "utilization_percent": 91.4
}
```

**Error Responses:**

| Status | Code | Description |
|---|---|---|
| 400 | VALIDATION_ERROR | Invalid position data |
| 422 | MISSING_SPAN_FILE | SPAN file not available for date |
| 422 | CONTRACT_EXPIRED | Position references expired contract |

---

### POST /margin/strategy

Calculate margin for a recognized trading strategy with strategy-level benefits.

**Method:** `POST`
**Path:** `/v3/margin/strategy`
**Auth:** Bearer JWT

**Request:**
```json
{
  "broker_id": "BROKER_001",
  "user_id": "TRADER_1042",
  "strategy_name": "IRON_CONDOR",
  "legs": [
    {
      "symbol": "NIFTY", "instrument_type": "OPTIDX", "option_type": "PE",
      "strike_price": 24000, "expiry": "2026-08-27", "quantity": -50, "buy_sell": "SELL"
    },
    {
      "symbol": "NIFTY", "instrument_type": "OPTIDX", "option_type": "PE",
      "strike_price": 23800, "expiry": "2026-08-27", "quantity": 50, "buy_sell": "BUY"
    },
    {
      "symbol": "NIFTY", "instrument_type": "OPTIDX", "option_type": "CE",
      "strike_price": 25000, "expiry": "2026-08-27", "quantity": -50, "buy_sell": "SELL"
    },
    {
      "symbol": "NIFTY", "instrument_type": "OPTIDX", "option_type": "CE",
      "strike_price": 25200, "expiry": "2026-08-27", "quantity": 50, "buy_sell": "BUY"
    }
  ]
}
```

**Response (200):**
```json
{
  "strategy": "IRON_CONDOR",
  "recognized": true,
  "total_margin": 42000.00,
  "standalone_margin": 128000.00,
  "strategy_benefit": 86000.00,
  "max_profit": 28000.00,
  "max_loss": 22000.00,
  "breakeven_points": { "lower": 23944.00, "upper": 25056.00 },
  "greeks": { "delta": 2.3, "gamma": -0.15, "theta": 128.50, "vega": -45.20 }
}
```

---

### GET /margin/user/{id}

Retrieve latest margin calculation for a specific user.

**Method:** `GET`
**Path:** `/v3/margin/user/{id}`
**Auth:** Bearer JWT

**Query Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| `date` | string | No | Trading date YYYY-MM-DD. Default: today |
| `type` | string | No | INTRADAY or EOD. Default: INTRADAY |

**Example:** `GET /v3/margin/user/TRADER_1042?date=2026-07-25&type=EOD`

**Response (200):**
```json
{
  "user_id": "TRADER_1042",
  "as_of": "2026-07-25T15:30:00Z",
  "total_margin": 268000.00,
  "available_margin": 300000.00,
  "utilization_percent": 89.33,
  "segment_breakdown": {
    "equity_fno": { "span": 185000.00, "exposure": 62000.00 },
    "currency": { "span": 15500.00, "exposure": 5500.00 }
  },
  "peak_margin_today": 268000.00
}
```

---

### POST /margin/portfolio

Calculate margin for an entire portfolio across all segments with all benefits applied.

**Method:** `POST`
**Path:** `/v3/margin/portfolio`
**Auth:** Bearer JWT

**Request:**
```json
{
  "client_code": "CL001",
  "broker_id": "BROKER_001",
  "segments": ["equity_cash", "equity_fno", "currency"],
  "apply_netting": true,
  "calculation_type": "INTRADAY"
}
```

**Response (200):**
```json
{
  "client_code": "CL001",
  "total_margin": 245000.75,
  "segment_breakdown": {
    "equity_cash": { "exposure": 55000.00, "span": 0.00 },
    "equity_fno": { "span": 142500.50, "exposure": 32000.00, "nov": -2000.00 },
    "currency": { "span": 15500.25, "exposure": 0.00 }
  },
  "benefits_applied": {
    "calendar_spread_benefit": 8500.00,
    "portfolio_benefit": 12000.00
  },
  "peak_margin_today": 268000.00
}
```

---

## Margin Intelligence Endpoints

### POST /intelligence/hedge

Generate hedge recommendations for a portfolio.

**Method:** `POST`
**Path:** `/v3/intelligence/hedge`
**Auth:** Bearer JWT

**Request:**
```json
{
  "client_code": "CL001",
  "optimization_goal": "MINIMIZE_MARGIN",
  "max_hedge_cost": 50000.00,
  "allowed_instruments": ["FUTIDX", "OPTIDX"]
}
```

**Response (200):**
```json
{
  "current_portfolio": {
    "net_delta": 1450.5,
    "net_gamma": -25.3,
    "current_margin": 245000.75
  },
  "recommendations": [
    {
      "rank": 1,
      "action": "SELL",
      "instrument": "NIFTY 26AUG2026 FUT",
      "quantity": 15,
      "hedge_cost": 3250.00,
      "margin_after_hedge": 198500.00,
      "margin_saved": 46500.75,
      "savings_percent": 18.98,
      "cost_benefit_ratio": 14.3,
      "new_delta": 95.5,
      "confidence_score": 87.3
    }
  ],
  "optimal_recommendation": 1
}
```

---

### POST /intelligence/maxsaving

Find the maximum possible margin saving through optimal hedging.

**Method:** `POST`
**Path:** `/v3/intelligence/maxsaving`
**Auth:** Bearer JWT

**Request:**
```json
{
  "client_code": "CL001",
  "budget_constraint": 100000.00
}
```

**Response (200):**
```json
{
  "current_margin": 245000.75,
  "minimum_attainable_margin": 168000.00,
  "max_possible_saving": 77000.75,
  "saving_percent": 31.4,
  "optimal_hedge_plan": [
    {
      "action": "SELL",
      "instrument": "NIFTY FUT JUL",
      "quantity": 15,
      "cost": 3250.00,
      "margin_saved": 46500.75
    },
    {
      "action": "BUY",
      "instrument": "NIFTY 24500 PE",
      "quantity": 10,
      "cost": 12000.00,
      "margin_saved": 31000.00
    }
  ]
}
```

---

## Common Response Headers

| Header | Description |
|---|---|
| `X-Request-ID` | Unique request identifier for tracing |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | Unix timestamp when limit resets |
| `X-Response-Time-Ms` | Server-side processing time in ms |
| `X-Api-Version` | API version serving the request |

## Rate Limits

| Tier | Rate Limit | Daily Limit |
|---|---|---|
| BASIC | 100 req/sec | 10,000 req/day |
| STANDARD | 1,000 req/sec | 100,000 req/day |
| ENTERPRISE | 10,000 req/sec | Unlimited |
