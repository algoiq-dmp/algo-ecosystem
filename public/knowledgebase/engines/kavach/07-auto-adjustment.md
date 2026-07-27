# 07 — Auto-Adjustment Signals
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
When any Greek exposure drifts beyond its defined threshold, Kavach's **Adjustment Engine** computes the optimal hedge trade and generates an Auto-Adjustment Signal dispatched to the execution layer.
## Adjustment Trigger Conditions
| Trigger | Condition | Priority |
|---------|-----------|----------|
| Delta Drift | Neutrality < 60% | HIGH |
| Gamma Spike | Gamma risk > 80 | HIGH |
| Vega Crush Imminent | Net vega > 2x limit + event approaching | MEDIUM |
| Theta Decay Gap | Realized < 85% of expected | LOW |
## Adjustment Computation
For each drift, Kavach solves the optimization:
> Minimize: Adjustment_Cost + Remaining_Risk
> Subject to: Post-Adjustment Greeks within limits
### Hedge Instrument Selection
Priority order for hedge legs:
1. **Futures** — Cheapest, most liquid delta hedge
2. **ATM Options** — For gamma/vega adjustment
3. **OTM Options** — For tail risk coverage
4. **Underlying (Cash)** — For small delta adjustments
## Signal Format
~~~json
{
  "signal_id": "ADJ-NIFTY-20260724-001",
  "strategy_id": "IRON_CONDOR_NIFTY_AUG",
  "trigger": "delta_drift",
  "priority": "HIGH",
  "current_state": {"net_delta": 12500, "neutrality": 42},
  "target_state": {"net_delta": 2000, "neutrality": 95},
  "adjustment": {
    "action": "SELL",
    "instrument": "NIFTY-FUT-AUG",
    "quantity": 150,
    "estimated_cost": 3750,
    "estimated_slippage": 500
  },
  "alternatives": [
    {"action": "SELL", "instrument": "NIFTY-24800-CE-AUG", "quantity": 300, "cost": 5000},
    {"action": "BUY", "instrument": "NIFTY-24300-PE-AUG", "quantity": 250, "cost": 4500}
  ],
  "urgency": "execute_within_5_minutes",
  "expires_at": "2026-07-24T15:25:00Z"
}
~~~
## Signal Priority Levels
| Priority | Response Time | Auto-Execute |
|----------|--------------|-------------|
| CRITICAL | Immediate (< 1 min) | Yes (if enabled) |
| HIGH | < 5 min | Semi-auto (confirm) |
| MEDIUM | < 30 min | Manual review |
| LOW | < 2 hours | Advisory only |
## Auto-Execution Rules
Kavach can auto-execute adjustments when:
- Priority is CRITICAL and Rakshak integration confirms
- Adjustment cost < 0.05% of portfolio value
- Market is liquid (Manthan liquidity score > 70)
- No conflicting signals from other strategies
## Adjustment Cooldown
To prevent overtrading, Kavach enforces cooldown periods:
- Same strategy same leg: 15 minutes
- Same strategy different leg: 5 minutes
- Same underlying cross-strategy: 2 minutes
