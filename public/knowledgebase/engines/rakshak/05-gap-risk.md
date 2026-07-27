# 05 — Gap Risk
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
**Gap Risk** quantifies the potential loss from price gaps that occur when the market opens significantly different from the previous close — a scenario where stop-loss orders and continuous hedging fail.
## Gap Types
| Type | Description | Typical Magnitude |
|------|-------------|-------------------|
| Overnight Gap | News/events while market closed | 1-5% |
| Weekend Gap | Accumulated information over 2 days | 1.5-7% |
| Holiday Gap | Extended closure periods | 2-10% |
| Event Gap | Post-earnings, policy announcements | 3-15% |
## Gap Risk Calculation
Gap_Risk = Position_Delta × Expected_Gap × Gap_Probability
### Expected Gap
Historical analysis of gap distribution:
| Instrument | Avg Overnight Gap | Max Gap (1yr) | StdDev |
|------------|------------------|---------------|--------|
| NIFTY Index | 0.6% | 4.2% | 0.9% |
| BANKNIFTY | 0.8% | 6.5% | 1.2% |
| Individual Stocks | 1.5% | 12.0% | 2.5% |
### Gap Probability
Higher during: earnings season, budget week, RBI policy, FOMC, geopolitical events.
## Gap Risk Score
| Score | Max Allowable Overnight Exposure |
|-------|-------------------------------|
| 0-30 | 100% of normal position |
| 31-55 | 75% of normal |
| 56-75 | 50% of normal |
| > 75 | 25% of normal or fully hedged |
## Pre-Close Check
15 minutes before market close, Rakshak evaluates all open positions for overnight gap risk and recommends:
- Reduce position
- Add overnight hedge (buy protective options)
- Close entirely if gap risk > 75
## Output
~~~json
{
  "strategy": "STR-BNF-AUG",
  "gap_risk_score": 42,
  "expected_overnight_gap_pct": 0.8,
  "max_historical_gap_pct": 6.5,
  "potential_gap_loss": 32500,
  "recommended_action": "reduce_position_25%",
  "hedge_recommendation": "buy_otm_puts_2pct_otm"
}
~~~
