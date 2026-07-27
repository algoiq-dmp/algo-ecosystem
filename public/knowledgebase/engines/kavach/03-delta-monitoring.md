# 03 — Delta Monitoring
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
Delta neutrality is Kavach's primary function. Each strategy has a defined delta budget, and Kavach monitors the net delta across all legs in real-time.
## Delta Calculation
### Position Delta
Position_Delta = Option_Delta × Quantity × Lot_Size
### Net Delta (Strategy Level)
Net_Delta = Sum(Position_Delta_i) for all legs in strategy
### Net Delta (Portfolio Level)
Portfolio_Delta = Sum(Strategy_Net_Delta_i) across all strategies
## Delta Neutrality Score
Neutrality_Score = 100 - (|Net_Delta| / Delta_Budget × 100)
| Score | Status | Action |
|-------|--------|--------|
| 95-100 | Fully Neutral | No action |
| 80-94 | Slight Drift | Monitor closely |
| 60-79 | Moderate Drift | Prepare adjustment |
| 40-59 | Significant Drift | Adjustment recommended |
| < 40 | Lost Neutrality | Immediate adjustment required |
## Delta Budgets by Strategy Type
| Strategy Type | Default Delta Budget | Adjustment Trigger |
|--------------|---------------------|-------------------|
| Iron Condor | ±1% of portfolio | > 0.8% drift |
| Short Strangle | ±2% of portfolio | > 1.5% drift |
| Butterfly | ±0.5% of portfolio | > 0.3% drift |
| Calendar Spread | ±1.5% of portfolio | > 1.0% drift |
| Covered Call | ±5% of portfolio | > 4.0% drift |
## Regime-Based Delta Adjustment
Manthan regime intelligence adjusts budgets dynamically:
| Regime | Budget Multiplier |
|--------|-------------------|
| STRONG_BULL / STRONG_BEAR | 1.5x (allow directional bias) |
| SIDEWAYS | 0.5x (tighter neutrality) |
| Extreme Volatility | 0.3x (very tight) |
## Delta Drift Alerts
- **Warning:** Neutrality < 85% for > 5 min
- **Critical:** Neutrality < 60%
- **Emergency:** Neutrality < 30% (auto-hedge triggered in Rakshak integration)
