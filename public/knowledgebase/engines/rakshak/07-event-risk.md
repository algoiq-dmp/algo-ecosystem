# 07 — Event Risk
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
**Event Risk** monitors scheduled and unscheduled events that can cause sudden, large price movements. Rakshak maintains an event calendar and adjusts hedge requirements proactively.
## Event Categories
| Category | Examples | Typical Impact |
|----------|----------|---------------|
| Monetary Policy | RBI MPC, FOMC | ±2-4% |
| Fiscal Policy | Union Budget | ±3-8% |
| Elections | State/National results | ±5-15% |
| Corporate | Earnings, mergers, splits | ±3-20% (stock specific) |
| Geopolitical | Conflicts, sanctions | ±2-10% |
| Regulatory | SEBI changes, tax changes | ±1-5% |
| Macro Data | GDP, CPI, IIP, trade data | ±0.5-2% |
| Expiry | Monthly F&O expiry | ±1-3% (increased volatility) |
## Event Calendar
Rakshak maintains a PostgreSQL-backed event calendar:
~~~json
{
  "events": [
    {"date": "2026-08-05", "type": "monetary_policy", "name": "RBI MPC Decision", "impact": "high", "time": "10:00"},
    {"date": "2026-08-14", "type": "expiry", "name": "NIFTY AUG Expiry", "impact": "medium"},
    {"date": "2026-09-20", "type": "monetary_policy", "name": "FOMC Decision", "impact": "high", "time": "23:30 IST"}
  ]
}
~~~
## Pre-Event Hedge Protocol
| Impact Level | Days Before | Action |
|-------------|-------------|--------|
| High | T-3 | Reduce position 25% |
| High | T-1 | Reduce position 50%; add hedges |
| High | T-0 | Reduce to 25% or stay fully hedged |
| Medium | T-1 | Reduce 25%; add hedges |
| Low | T-1 | Review hedges; no mandatory reduction |
## Post-Event Protocol
- **First 15 minutes:** No new positions; monitor volatility
- **15-60 minutes:** Gradual position rebuilding if price stabilized
- **> 60 minutes:** Normal trading resumes
## Unscheduled Events
For unscheduled events (geopolitical, regulatory surprise), Rakshak monitors news feeds and social sentiment for early detection. Emergency protocol triggers at earliest indication.
