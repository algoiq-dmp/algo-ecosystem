# 11 — Consumer: KuberAlpha
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
**KuberAlpha** consumes Kavach's delta neutrality data to enforce strategy-level constraints, prevent over-exposure, and execute adjustment orders.
## Data Consumed
| Kavach Output | KuberAlpha Application |
|---------------|----------------------|
| Live Delta | Real-time exposure limit enforcement |
| Neutrality % | Strategy health monitoring |
| Adjustment Signals | Auto/semi-auto hedge order generation |
| Risk Scores | Position sizing and strategy allocation |
| Rebalancing Recs | Portfolio-level rebalance execution |
## Execution Integration
When Kavach generates an adjustment signal, KuberAlpha:
1. Receives signal via Redis Pub/Sub
2. Validates against current positions
3. Checks risk limits (Rakshak integration)
4. Routes to Order Manager for execution
5. Confirms back to Kavach
### Flow
Kavach -> Signal -> KuberAlpha -> Validate -> Order Manager -> Exchange -> Fill Confirm -> Kavach (recompute Greeks)
## Strategy Constraints
KuberAlpha enforces Kavach-defined limits:
~~~yaml
strategy_constraints:
  delta_budget_pct: 1.0
  gamma_limit_pct: 2.0
  vega_limit_pct: 5.0
  neutrality_min: 75
  auto_adjust: true
  auto_adjust_max_cost: 5000
~~~
## Circuit Breaker
If neutrality drops below 25% AND adjustment fails 2 times, KuberAlpha triggers emergency position reduction with Rakshak.
