# 16 — Input: Manthan Intelligence
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
Rakshak consumes **Manthan's** market and volatility regime intelligence for dynamic hedge ratio calculation, tail risk calibration, and event impact assessment.
## Data Consumed
| Manthan Output | Rakshak Module |
|---------------|---------------|
| Market Regime | Hedge requirement regime factor |
| Volatility Regime | Volatility adjustment in dynamic hedging |
| Breakout Probability | Pre-breakout hedge positioning |
| Confidence Score | Hedge aggressiveness calibration |
| Liquidity Score | Emergency exit feasibility |
## Regime-Driven Hedge Factors
| Regime | Hedge Factor |
|--------|-------------|
| STRONG_BULL/BEAR | 0.7x |
| WEAK_BULL/BEAR | 0.85x |
| SIDEWAYS | 1.0x |
| TRANSITION | 1.3x |
| Extreme Vol | 1.5x |
## Integration
Manthan publishes to Redis channel manthan.intelligence; Rakshak consumes per symbol for real-time hedge calibration.
