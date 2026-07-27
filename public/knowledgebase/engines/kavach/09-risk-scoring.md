# 09 — Risk Scoring
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
Kavach computes a composite **Risk Score** (0–100) per strategy, aggregating Greek exposures, market conditions, and historical strategy behavior.
## Risk Score Components
| Component | Weight | Description |
|-----------|--------|-------------|
| Delta Drift Risk | 30% | How far from neutrality (|Net Delta| / Budget) |
| Gamma Exposure Risk | 20% | |Net Gamma| / Gamma Limit |
| Vega Risk | 20% | |Net Vega| / Vega Limit + IV environment |
| Theta Efficiency Risk | 10% | 1 - (Realized / Expected Theta) |
| Market Risk (Manthan) | 15% | Volatility regime + breakout probability |
| Correlation Risk | 5% | Strategy correlation to other active strategies |
## Risk Categories
| Score | Category | Action |
|-------|----------|--------|
| 0–25 | Low Risk | Normal operation |
| 26–50 | Moderate Risk | Monitor; prepare hedges |
| 51–75 | High Risk | Reduce position; activate hedges |
| 76–100 | Critical Risk | Immediate reduction or exit |
## Strategy Risk Matrix
Kavach maintains a cross-strategy risk matrix:
| Strategy | Delta Risk | Gamma Risk | Vega Risk | Composite |
|----------|-----------|------------|-----------|-----------|
| IC-NIFTY | 25 | 18 | 15 | 22 (LOW) |
| STR-BNF | 55 | 40 | 35 | 48 (MODERATE) |
| CALENDAR-NIFTY | 10 | 8 | 12 | 10 (LOW) |
## Risk Trend
Kavach tracks risk direction:
- **Rising:** Score increasing last 3 checks (worsening)
- **Stable:** Score within ±5 points
- **Falling:** Score decreasing (improving)
## Output
~~~json
{
  "strategy": "IRON_CONDOR_NIFTY_AUG",
  "risk_score": 22,
  "category": "low",
  "trend": "stable",
  "components": {
    "delta_drift": 25,
    "gamma_exposure": 18,
    "vega_risk": 15,
    "theta_efficiency": 5,
    "market_risk": 20,
    "correlation_risk": 3
  }
}
~~~
