# 08 — Rebalancing Recommendations
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
Beyond single-leg auto-adjustments, Kavach provides **portfolio-level rebalancing recommendations** when multiple strategies require adjustment simultaneously, optimizing for total cost and risk reduction.
## Rebalancing Triggers
| Trigger | Description |
|---------|-------------|
| Multi-Strategy Drift | 2+ strategies simultaneously beyond thresholds |
| Regime Change | Manthan detects regime transition |
| Expiry Rollover | Approaching expiry requires roll adjustments |
| Scheduled Rebalance | Time-based (daily, weekly) |
## Multi-Leg Optimization
Kavach solves for the optimal set of trades across all strategies:
> Minimize: Sum(Trade_Cost_i) + ? × Sum(Remaining_Risk_i)
> Subject to: Each strategy within limits post-rebalance
### Netting
Before recommending market trades, Kavach nets opposing adjustments:
- Strategy A needs +100 NIFTY futures, Strategy B needs -60 NIFTY futures
- Net recommendation: +40 NIFTY futures (avoid 2 trades, save costs)
## Rebalance Report
~~~json
{
  "rebalance_id": "REB-20260724-DAILY",
  "trigger": "scheduled",
  "strategies_analyzed": 12,
  "strategies_drifting": 3,
  "raw_trades_needed": 5,
  "netted_trades": 3,
  "total_estimated_cost": 12500,
  "cost_savings_from_netting": 3500,
  "estimated_risk_reduction": 85,
  "trades": [
    {"action": "SELL", "instrument": "NIFTY-FUT-AUG", "qty": 200, "strategies": ["IC-NIFTY", "STR-NIFTY"]},
    {"action": "BUY", "instrument": "BANKNIFTY-53000-CE-AUG", "qty": 100, "strategies": ["BUYFLY-BNF"]}
  ]
}
~~~
## Rebalance Schedule
| Frequency | Scope | Trigger |
|-----------|-------|---------|
| Real-time | Single strategy | Delta/gamma drift |
| Hourly | All active strategies | Drift check |
| Daily (EOD) | Portfolio wide | Scheduled |
| Event-driven | All strategies | Regime change |
## Rebalance Efficiency Metrics
Kavach tracks rebalance quality:
- **Risk Reduction %:** Risk before vs after rebalance
- **Cost Efficiency:** Cost / Risk_Reduced (lower is better)
- **Netting Benefit:** Trades saved by netting
- **Slippage Ratio:** Actual cost vs Estimated cost
