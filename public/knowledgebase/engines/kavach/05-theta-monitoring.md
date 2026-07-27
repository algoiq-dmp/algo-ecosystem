# 05 — Theta Monitoring
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
Theta measures the daily time decay of option value. For option sellers, positive theta is the primary profit engine. Kavach monitors theta to ensure consistent decay and flag early decay acceleration.
## Theta Calculation
Position_Theta = Option_Theta × Quantity × Lot_Size
Net_Theta = Sum(Position_Theta_i) across all legs
## Theta Targets
| Strategy Type | Theta Target (Daily) | Rationale |
|--------------|---------------------|-----------|
| Iron Condor | +0.5% to +1.5% of capital | Slow, steady decay |
| Short Strangle | +0.3% to +1.0% of capital | Moderate decay with higher tail risk |
| Butterfly | +0.2% to +0.5% of capital | Low decay, high precision |
| Calendar Spread | +0.3% to +0.8% of capital | Front-month decay |
## Theta Decay Tracking
Kavach tracks realized vs expected theta:
~~~json
{
  "date": "2026-07-24",
  "expected_theta": 25000,
  "realized_theta": 24800,
  "decay_efficiency": 99.2,
  "cumulative_decay": 175000,
  "projected_monthly": 500000
}
~~~
## Theta Anomalies
| Anomaly | Signal |
|---------|--------|
| Realized < 90% of expected | Hedges may need adjustment |
| Realized > 110% of expected | Options decaying faster (check IV drop) |
| Zero theta day | Possible holiday or settlement |
| Negative theta shift | New leg entered that consumes theta |
## Weekend Theta
Kavach adjusts theta for weekends and holidays:
- Friday close to Monday open: 1-day theta (not 3-day, as markets price this in)
- Holiday-adjusted theta for Indian market holidays
## Theta Efficiency Score
> Efficiency = Realized_Theta / Expected_Theta × 100
Target: > 95% efficiency.
