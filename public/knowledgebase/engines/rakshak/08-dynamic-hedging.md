# 08 — Dynamic Hedging
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
**Dynamic Hedging** continuously adjusts hedge ratios based on real-time market conditions, going beyond static hedge calculations to reflect changing volatility, correlation, and tail risk.
## Dynamic Hedge Ratio
DH_Ratio(t) = Static_Hedge × Vol_Adjust(t) × Corr_Adjust(t) × Momentum_Adjust(t)
### Volatility Adjustment
As volatility increases, hedge ratio increases:
Vol_Adjust = 1 + ß × (Current_Vol / Base_Vol - 1)
ß = 0.5 (moderate sensitivity)
### Correlation Adjustment
If hedge instrument correlation to position weakens:
Corr_Adjust = 1 + (1 - Rolling_Correlation) × a
a = 1.0
### Momentum Adjustment
When momentum is against the position:
Momentum_Adjust = 1 + (Contrary_Momentum_Score / 100)
## Hedge Ratio Bands
| Band | Ratio | Condition |
|------|-------|-----------|
| Under-Hedged | < 0.8 | Low vol, high confidence |
| Normal | 0.8 - 1.2 | Standard conditions |
| Over-Hedged | 1.2 - 1.5 | Elevated risk |
| Maximum | 1.5 - 2.0 | Extreme conditions |
## Rebalancing Triggers
Dynamic hedge ratio is recalculated every 5 minutes or when:
- Volatility regime changes (Manthan)
- Correlation drops below 0.7
- Market regime transitions
- Neutrality drops below 75% (Kavach)
## Cost-Benefit Analysis
Each hedge adjustment has a cost. Rakshak ensures:
Hedge_Benefit = Risk_Reduction - Hedge_Cost > 0
If cost exceeds benefit, Rakshak recommends position reduction instead.
