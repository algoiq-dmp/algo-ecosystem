# 04 — Gamma Monitoring
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
Gamma measures the rate of change of Delta. High gamma means Delta changes rapidly with underlying price movement, creating hedging challenges.
## Gamma Calculation
Position_Gamma = Option_Gamma × Quantity × Lot_Size
Net_Gamma = Sum(Position_Gamma_i) across all legs
## Gamma Exposure Zones
| Net Gamma | Zone | Behavior |
|-----------|------|----------|
| > +2% of portfolio | High Long Gamma | Delta changes rapidly on moves (beneficial for long options) |
| +0.5% to +2% | Moderate Long Gamma | Controlled gamma risk |
| -0.5% to +0.5% | Near-Zero Gamma | Most delta-neutral |
| -2% to -0.5% | Moderate Short Gamma | Delta moves against position on big moves |
| < -2% | High Short Gamma | High risk of delta blowout |
## Gamma Risk Scoring
Gamma_Risk = |Net_Gamma| / Gamma_Limit × 100
| Score | Risk Level |
|-------|-----------|
| 0-30 | Low |
| 31-60 | Moderate |
| 61-85 | High — consider reducing exposure |
| > 85 | Critical — immediate reduction recommended |
## Gamma Scalping Opportunity
When long gamma is high, Kavach flags gamma scalping opportunities:
- Underlying moves up ? Delta increases ? sell underlying to rebalance ? profit
- Underlying moves down ? Delta decreases ? buy underlying to rebalance ? profit
## Gamma and Time Decay
As expiry approaches, ATM option gamma increases exponentially (gamma pin risk). Kavach monitors this and recommends:
- Close or roll ATM options within 3 days of expiry
- Reduce position size if gamma exposure exceeds limits
## Output
~~~json
{
  "net_gamma": 0.0125,
  "gamma_zone": "moderate_long",
  "gamma_risk_score": 35,
  "gamma_scalp_opportunity": true,
  "gamma_pin_risk": false,
  "near_expiry_warning": false
}
~~~
