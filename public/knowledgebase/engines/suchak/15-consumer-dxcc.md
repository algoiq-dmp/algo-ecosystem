# 15 — Consumer: DXCC

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Overview

**DXCC** (Derivatives & Cross-Currency Complex) is the option chain and derivative pricing engine. It consumes Suchak indicators for implied volatility surface construction, option chain analytics, and derivative pricing models.

## Indicators Consumed

| Indicator | DXCC Application |
|-----------|-----------------|
| ATR | IV calibration; expected move calculation |
| Bollinger Bands | IV percentile; volatility cone |
| VWAP | Fair value anchor for options pricing |
| EMA/SMA | Trend skew adjustment for options |
| RSI | Momentum factor in pricing models |
| Pivot Levels | Strike selection for option writing |
| SuperTrend | Delta hedging direction bias |

## Integration Pattern

```
Suchak ──> Redis Pub/Sub ──> DXCC Indicator Consumer
                                    │
                               ┌────┴────┐
                               │ IV Model │
                               │ Greeks Calc │
                               │ Option Chain│
                               └─────────┘
```

## Data Contract

### Request

```json
{
  "consumer_id": "dxcc",
  "symbols": ["NIFTY", "BANKNIFTY"],
  "indicators": ["atr", "bollinger_bands", "vwap", "ema_20", "pivot", "supertrend"],
  "timeframe": "1h",
  "stream": true
}
```

### Response

```json
{
  "symbol": "NIFTY",
  "timestamp": "2026-07-24T11:30:00Z",
  "indicators": {
    "atr": 145.50,
    "bollinger_bands": {"upper": 24700, "lower": 24100, "width": 0.025},
    "vwap": 24500.00,
    "ema_20": 24480.00
  },
  "derived": {
    "expected_move_1sd": 145.50,
    "iv_rank_estimate": 0.65,
    "iv_percentile": 72,
    "volatility_regime": "elevated"
  }
}
```

## Use Cases

### 1. IV Surface Construction

DXCC uses ATR and Bollinger Band width as proxies for realized volatility, calibrating the IV surface against actual market movement.

### 2. Strike Selection

Pivot levels and support/resistance from Suchak feed into the option writing strategy engine within DXCC for optimal strike placement.

### 3. Delta Hedging

SuperTrend direction and EMA trend strength inform delta hedge ratios and adjustment frequency.

## SLA

| Metric | Target |
|--------|--------|
| Delivery latency | < 20ms |
| Delivery reliability | 99.99% |
| Data freshness | < 5s |
