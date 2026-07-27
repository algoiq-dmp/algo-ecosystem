# 08 — Open Interest Analysis

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Overview

The **OI Analysis** module tracks open interest changes in futures and options to gauge market participant positioning, conviction, and potential reversals.

## OI Metrics

### 1. OI Change

```
OI_Change = (Current_OI - Previous_OI) / Previous_OI × 100
```

| OI Change | Interpretation |
|-----------|---------------|
| > 5% | Significant OI addition |
| 2%–5% | Moderate OI addition |
| -2%–2% | Stable OI |
| -5%–-2% | Moderate OI reduction |
| < -5% | Significant unwinding |

### 2. Price-OI Matrix

The classic Price vs OI analysis:

| Price | OI | Signal | Interpretation |
|-------|----|--------|---------------|
| Up | Up | Long Buildup | New money entering long |
| Up | Down | Short Covering | Shorts exiting, price rising |
| Down | Up | Short Buildup | New money entering short |
| Down | Down | Long Unwinding | Longs exiting, price falling |

### 3. OI Put/Call Ratio

```
PCR = Total Put OI / Total Call OI
```

| PCR | Sentiment |
|-----|-----------|
| > 1.5 | Extremely bearish (contrarian: potential bottom) |
| 1.2–1.5 | Bearish |
| 0.8–1.2 | Neutral |
| 0.5–0.8 | Bullish |
| < 0.5 | Extremely bullish (contrarian: potential top) |

### 4. OI Concentration

Tracks OI at key strike prices:

| Pattern | Signal |
|---------|--------|
| Heavy OI at ITM strikes | Strong directional conviction |
| Heavy OI at OTM strikes | Hedging activity, low conviction |
| OI shifting to higher strikes | Bullish repositioning |
| OI shifting to lower strikes | Bearish repositioning |

## Futures OI Analysis

### Rollover Analysis

```
Rollover% = Contracts rolled to next expiry / Total contracts
```

| Rollover | Interpretation |
|----------|---------------|
| > 70% | High conviction carry-forward |
| 50%–70% | Normal rollover |
| < 50% | Low conviction, positions being closed |

### Cost of Carry

```
CoC = (Futures Price - Spot Price) / Spot Price × (365 / Days_to_Expiry) × 100
```

| CoC | Signal |
|-----|--------|
| High positive (> Interest Rate + 5%) | Bullish (long-heavy futures) |
| Normal | Neutral |
| Negative | Bearish (short-heavy or dividend-adjusted) |

## OI Divergence

| Divergence | Signal |
|------------|--------|
| Price rising, OI falling | Weak rally (short covering, not new buying) |
| Price falling, OI falling | Weak decline (long unwinding, not new shorting) |
| Price rising, OI flat | Rally without conviction |
| Price making new high, OI making lower high | Bearish divergence in futures |

### Output Schema

```json
{
  "symbol": "BANKNIFTY",
  "timestamp": "2026-07-24T13:30:00Z",
  "open_interest": {
    "futures_oi": 2450000,
    "futures_oi_change_pct": 3.2,
    "price_oi_signal": "long_buildup",
    "pcr": 1.15,
    "pcr_sentiment": "neutral_slightly_bearish",
    "max_oi_call_strike": 53000,
    "max_oi_put_strike": 52000,
    "rollover_pct": 68,
    "cost_of_carry": 7.2,
    "oi_divergence": null
  },
  "signal": {"strength": 65}
}
```

### Performance

| Metric | Value |
|--------|-------|
| OI analysis | < 10ms (includes PCR computation) |
| Futures OI | < 3ms |
