# 13 — Consumer: DXCC
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
**DXCC** consumes Kavach's Greek exposure data to refine option pricing models, calibrate IV surfaces, and optimize strike selection for option writing strategies.
## Data Consumed
| Kavach Output | DXCC Application |
|---------------|-----------------|
| Vega Exposure | IV surface calibration; skew pricing |
| Gamma Monitoring | Option gamma ladder pricing |
| Theta Tracking | Time decay curve fitting |
| Delta Neutrality | Strike selection for hedging flow |
| Adjustment Signals | Market impact estimation for large hedges |
## IV Surface Calibration
DXCC uses aggregate vega/hedge flow data from Kavach to anticipate IV surface movements:
- Heavy short gamma flow -> IV skew steepening expected
- Heavy delta hedging flow -> ATM IV compression expected
- Vega hedge demand -> Far-month IV relative pricing
## Strike Optimization
When Kavach reports vega exposure and suggests hedges, DXCC optimizes strikes:
- Minimum slippage strikes (high OI, tight spreads)
- Optimal delta for hedge efficiency
- Balance between gamma and vega impact
## Integration
DXCC consumes Kavach data through Redis Stream kavach.greeks.* for real-time Greek monitoring.
