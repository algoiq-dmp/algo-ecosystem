# 04 — Tail Risk
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
**Tail Risk** assessment identifies and quantifies exposure to rare, extreme market moves — the "fat tails" of the return distribution that standard models underestimate.
## Tail Risk Metrics
### 1. Value at Risk (VaR)
VaR_99 = Maximum expected loss at 99% confidence over 1 day
### 2. Conditional VaR (CVaR / Expected Shortfall)
CVaR_99 = Average loss beyond VaR_99
### 3. Maximum Adverse Excursion (MAE)
Largest historical intra-strategy loss in similar market conditions.
### 4. Stress Test Scenarios
Rakshak runs pre-defined stress scenarios:
| Scenario | Magnitude | Historical Reference |
|----------|-----------|---------------------|
| Flash Crash | -8% in 30 min | May 2024 elections |
| Gap Down Open | -5% at open | COVID crash |
| Circuit Breaker Hit | -10% (halt) | Circuit limit |
| Black Swan | -15% in 1 day | 2008-style event |
## Tail Risk Score
Tail_Risk = (0.4 ×  VaR_99%_Ratio) + (0.3 × CVaR_Ratio) + (0.2 × MAE_Ratio) + (0.1 × Stress_Loss_Ratio)
| Score | Level | Action |
|-------|-------|--------|
| 0-30 | Low Tail Risk | Normal hedging |
| 31-55 | Moderate | Enhanced hedging |
| 56-75 | High | Reduce position; add tail hedges |
| 76-100 | Extreme | Immediate reduction required |
## Tail Hedge Recommendations
| Tail Risk Level | Recommended Hedge |
|----------------|-------------------|
| High | Buy OTM puts 1.5-2x ATR below price |
| Extreme | Buy VIX calls + OTM puts + reduce position 50% |
