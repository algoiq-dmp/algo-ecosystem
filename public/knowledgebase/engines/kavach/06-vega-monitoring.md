# 06 — Vega Monitoring
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
Vega measures sensitivity to changes in implied volatility. A 1% change in IV changes the option price by the vega amount. Kavach monitors vega exposure to prevent IV crush losses.
## Vega Calculation
Position_Vega = Option_Vega × Quantity × Lot_Size × 0.01
Net_Vega = Sum(Position_Vega_i) across all legs
## Vega Exposure Limits
| Market Condition | Max Vega / Capital | Rationale |
|-----------------|-------------------|-----------|
| Normal Vol | 5% | Standard limit |
| Events (Budget, RBI) | 2% | Reduced exposure pre-event |
| Earnings Season | 1% per stock | Stock-specific IV risk |
| Extreme Vol Regime | 0.5% | Near-flat vega |
## Vega Risk
### IV Crush Scenario
When IV drops sharply (post-event), all option prices fall. Kavach estimates IV crush impact:
> Crush_Impact = Net_Vega × Expected_IV_Drop × 100
### Vega Hedging
Kavach recommends vega hedges:
- **Net long vega:** Sell further-dated options to reduce
- **Net short vega:** Buy further-dated options to reduce
- **Cross-symbol hedge:** Hedge index vega with stock vega
## IV Surface Monitoring
Kavach tracks IV skew and term structure:
- **Skew:** OTM puts IV vs ATM IV vs OTM calls IV
- **Term Structure:** Near-month IV vs Far-month IV
### Skew Alerts
| Skew Condition | Alert |
|---------------|-------|
| Put skew > 1.5x normal | Fear elevated — reduce short puts |
| Call skew > 1.2x normal | Speculative frenzy — reduce short calls |
| Skew flattening | Regime shift possible |
## Output
~~~json
{
  "net_vega": 12500,
  "vega_percent_of_capital": 2.5,
  "vega_risk": "moderate",
  "iv_crush_risk": "low",
  "skew_alert": null,
  "term_structure": "contango"
}
~~~
