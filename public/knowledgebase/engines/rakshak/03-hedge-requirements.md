# 03 — Hedge Requirements
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
The **Hedge Requirements** module calculates the optimal hedge size and instruments for each strategy, both pre-trade (before entry) and continuously (as market conditions change).
## Hedge Sizing Formula
Hedge_Size = Base_Hedge × Volatility_Factor × Tail_Factor × Regime_Factor
### Base Hedge
Base_Hedge = Position_Value × Delta_Exposure
### Volatility Factor
| Volatility Regime | Factor |
|------------------|--------|
| Low | 0.8x |
| Normal | 1.0x |
| Elevated | 1.3x |
| High | 1.6x |
| Extreme | 2.0x |
### Tail Factor
Based on historical tail risk for the instrument:
- Low tail risk (index): 1.0x
- Medium tail risk (large cap): 1.2x
- High tail risk (small cap, F&O): 1.5x
- Extreme tail risk (event-driven): 2.0x
### Regime Factor (from Manthan)
| Regime | Factor |
|--------|--------|
| STRONG_BULL/BEAR | 0.7x (trend is friend) |
| SIDEWAYS | 1.0x |
| TRANSITION | 1.3x |
## Hedge Instrument Selection
Priority ranking:
1. **Index Futures** — Cheapest, most liquid
2. **Index Options (protective puts/calls)** — Tail risk protection
3. **Inverse ETFs** — Simple, no margin complexity
4. **VIX Futures/Options** — Pure volatility hedge
5. **Cross-Asset Hedge** — Correlated assets
## Pre-Trade Hedge Check
Before any strategy enters a position, Rakshak validates:
~~~json
{
  "strategy_id": "STR-BNF-AUG",
  "proposed_position": {"type": "SHORT_STRANGLE", "capital": 500000, "max_loss": 150000},
  "required_hedge": {"cost": 25000, "reduction_in_max_loss": 80000},
  "hedge_efficiency": 3.2,
  "recommendation": "APPROVED_WITH_HEDGE"
}
~~~
Hedge_Efficiency = Reduction_in_Max_Loss / Hedge_Cost.
Minimum threshold: > 2.0.
