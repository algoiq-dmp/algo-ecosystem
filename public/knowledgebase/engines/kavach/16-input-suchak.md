# 16 — Input: Suchak Indicators
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
Kavach consumes **Suchak** for strike placement intelligence and volatility context in hedge recommendations.
## Indicators Consumed
| Suchak Indicator | Kavach Application |
|-----------------|-------------------|
| ATR | Gamma scalp range estimation |
| Bollinger Bands | Mean reversion zone for hedge timing |
| Support/Resistance | Strike selection for hedge legs |
| VWAP | Intraday fair value for delta adjustment |
| SuperTrend | Directional bias for delta budget calibration |
| Signal Strength | Confidence in adjustment signals |
## Strike Placement
When Kavach recommends an option-based hedge, Suchak S/R levels determine optimal strikes:
- Sell call hedge: Strike near resistance + buffer
- Buy put hedge: Strike near support
- Gamma hedge: ATM options centered on VWAP
