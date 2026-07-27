# 24 — Glossary
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## A
**Adjustment Signal:** Kavach-generated recommendation to add/remove hedge legs to restore neutrality.
**Auto-Execution:** Automatic order placement for adjustment signals meeting criteria (CRITICAL priority, low cost, liquid market).
## B
**Black-Scholes-Merton:** Option pricing model used by Kavach for Greek calculation, incorporating dividends.
## D
**Delta (?):** Rate of change in option price per 1-point change in underlying price.
**Delta Budget:** Maximum allowed net delta for a strategy (±X% of portfolio value).
**Delta Drift:** Deviation from neutral delta caused by underlying price movement.
## G
**Gamma (G):** Rate of change in Delta per 1-point change in underlying. Measures delta stability.
**Gamma Scalping:** Profiting from delta rebalancing when holding long gamma positions.
**Greeks:** Collective term for Delta, Gamma, Theta, Vega (and Rho) — risk sensitivities of options.
## H
**Hedge Leg:** An instrument position (futures, option, underlying) added to a strategy to restore Greek neutrality.
## I
**IV Crush:** Sharp decline in implied volatility (often post-event), causing vega losses.
## N
**Neutrality Percentage:** 0–100% measure of delta neutrality. 100% = perfectly delta neutral.
**Netting:** Combining opposing adjustment trades across strategies to reduce total trades and costs.
## R
**Rebalancing:** Portfolio-level multi-strategy adjustment to restore all Greek exposures within limits.
**Rho (?):** Sensitivity to interest rate changes (minor, often ignored).
## S
**Skew:** Difference in IV between OTM puts, ATM, and OTM calls.
**Strategy Monitor:** Kavach component that tracks Greek exposures per strategy and compares against limits.
## T
**Theta (T):** Daily time decay of option value. Positive theta benefits option sellers.
**Theta Efficiency:** Ratio of realized theta to expected theta. > 95% is target.
## V
**Vega (?):** Sensitivity to 1% change in implied volatility. Key risk for option sellers.
**Vega Hedge:** Trade that reduces net vega exposure.
