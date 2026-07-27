# 10 — Neutrality Percentage
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
The **Neutrality Percentage** is Kavach's headline metric — a single number representing how delta-neutral a strategy or portfolio currently is. 100% = perfectly delta neutral.
## Calculation
### Strategy Neutrality
Strategy_Neutrality = max(0, 100 - (|Net_Delta| / Delta_Budget × 100))
### Portfolio Neutrality
Weighted by strategy capital allocation:
> Portfolio_Neutrality = S(w_i × Strategy_Neutrality_i)
## Neutrality Zones
| Zone | Percentage | Interpretation |
|------|-----------|---------------|
| Green | 90–100% | Optimally neutral |
| Yellow | 75–89% | Slight drift — monitor |
| Orange | 50–74% | Significant drift — adjust soon |
| Red | 25–49% | Large drift — adjust now |
| Black | < 25% | Lost neutrality — emergency |
## Historical Neutrality Tracking
Kavach records neutrality over time for performance analysis:
~~~json
{
  "strategy": "IC-NIFTY-AUG",
  "neutrality_history": {
    "avg_24h": 94.5,
    "min_24h": 82.0,
    "max_24h": 99.8,
    "time_in_green": "22h 15m",
    "time_in_yellow": "1h 30m",
    "time_in_orange": "15m",
    "time_in_red": "0m"
  }
}
~~~
## Neutrality Dashboard
Real-time display per strategy:
| Strategy | Delta | Budget | Neutrality | Zone |
|----------|-------|--------|-----------|------|
| IC-NIFTY-AUG | +125 | ±5000 | 97.5% | Green |
| STR-BNF-AUG | +3200 | ±5000 | 36.0% | Red |
| CALENDAR-NIFTY-AUG | -200 | ±2000 | 90.0% | Green |
## Alert Thresholds
- Neutrality drops below 90%: Warning notification
- Neutrality drops below 75%: Alert to strategy owner
- Neutrality drops below 50%: Alert + auto-adjustment signal
- Neutrality drops below 25%: Emergency escalation to Rakshak
