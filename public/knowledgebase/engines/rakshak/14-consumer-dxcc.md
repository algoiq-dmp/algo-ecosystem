# 14 — Consumer: DXCC
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
**DXCC** consumes Rakshak's hedge and protection data for derivative pricing adjustments, tail risk premium calculation, and strike selection for protective strategies.
## Data Consumed
| Rakshak Output | DXCC Application |
|---------------|-----------------|
| Tail Risk Scores | IV skew pricing; tail risk premium |
| Gap Risk Data | Overnight option pricing premium |
| Event Calendar | Event volatility premium in options |
| Hedge Requirements | Hedge flow anticipation for market making |
| Disaster Scenarios | Worst-case option pricing bounds |
## Tail Risk Premium
DXCC adjusts IV surfaces based on Rakshak's tail risk assessment:
- Higher tail risk -> wider IV skew -> OTM puts more expensive
- Event approaching -> IV term structure steepens -> near-term options more expensive
## Strike Selection for Hedges
When Rakshak recommends protective options, DXCC selects optimal strikes:
- Max OI strikes (best liquidity)
- Delta-optimized for hedge efficiency
- Cost-optimized (minimize theta cost of protection)
