# 17 — Input: Manthan Intelligence
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
Kavach consumes **Manthan** for dynamic threshold calibration based on market conditions, regime, and volatility intelligence.
## Intelligence Consumed
| Manthan Output | Kavach Application |
|---------------|-------------------|
| Market Regime | Delta budget multiplier (wider in trends) |
| Volatility Regime | Gamma/Vega limit adjustment |
| Trend Score | Directional delta allowance |
| Breakout Probability | Pre-breakout hedge positioning |
| Liquidity Score | Hedge instrument selection |
| Confidence Score | Adjustment aggressiveness |
## Regime-Driven Thresholds
Kavach's Greek limits are multiplied by regime factors from Manthan:
| Regime | Delta Multiplier | Gamma Multiplier | Vega Multiplier |
|--------|-----------------|-----------------|----------------|
| STRONG_BULL/BEAR | 1.5x | 1.2x | 0.8x |
| SIDEWAYS | 0.5x | 0.7x | 1.2x |
| TRANSITION | 0.7x | 0.8x | 1.0x |
| Extreme Vol | 0.3x | 0.5x | 0.3x |
