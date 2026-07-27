# 17 — Input: Suchak S/R Levels
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
Rakshak consumes **Suchak's** support/resistance levels for stop-loss placement, hedge strike selection, and emergency exit trigger levels.
## Data Consumed
| Suchak Output | Rakshak Module |
|---------------|---------------|
| Support Levels | Stop-loss placement for longs; put strike selection |
| Resistance Levels | Stop-loss placement for shorts; call strike selection |
| ATR | Dynamic stop distance; gap risk estimation |
| Bollinger Bands | Mean reversion expectations; tail risk bounds |
| VWAP | Intraday fair value for exit timing |
| Signal Strength | Confidence in stop levels |
## Stop-Loss Calculation
Rakshak computes optimal stop-loss levels:
Long_Stop = Max(VWAP - 2×ATR, Nearest_Support - buffer)
Short_Stop = Min(VWAP + 2×ATR, Nearest_Resistance + buffer)
## Hedge Strike Selection
- Protective Put: Strike at or below nearest major support
- Protective Call: Strike at or above nearest major resistance
- Ensure strikes have adequate OI (from Manthan liquidity data)
