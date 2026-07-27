# 14 — Consumer: DXCC

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Overview

**DXCC** consumes Manthan's market intelligence to optimize options strategy selection, strike placement, and volatility surface calibration.

## Data Consumed

| Manthan Output | DXCC Application |
|---------------|-----------------|
| Market Regime | Strategy filter (trending = directional, sideways = non-directional) |
| Volatility Regime | IV surface adjustment, vol cone calibration |
| Breakout Probability | Pre-earnings/event strategy positioning |
| OI Analysis | Strike selection based on OI concentration |
| Liquidity Score | Option spread width calibration |
| Confidence Score | Strategy conviction weighting |

## Integration

```
Manthan ──> Redis Stream ──> DXCC Intelligence Consumer
                                   │
                              ┌────┴──────────┐
                              │ Strategy Selector │
                              │ IV Calibrator     │
                              │ Strike Optimizer  │
                              └──────────────────┘
```

## Use Case: Strategy Selection

| Regime | Recommended Option Strategy |
|--------|---------------------------|
| STRONG_BULL | Bull call spreads, naked puts |
| SIDEWAYS_LOW | Iron condors, short strangles |
| TRANSITION | Calendar spreads, ratio spreads |
| Extreme Vol | Long straddles, VIX calls |

### Output

```json
{
  "regime": "STRONG_BULL",
  "volatility": "normal",
  "recommended_strategies": ["bull_call_spread", "covered_call"],
  "strike_bias": "OTM_calls",
  "confidence": 78
}
```
