# 13 — Consumer: Vega
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
**Vega** consumes Rakshak's protection intelligence for options-specific tail hedges, event-driven strategy adjustments, and volatility-based protection overlays.
## Data Consumed
| Rakshak Output | Vega Application |
|---------------|-----------------|
| Tail Risk Assessment | Options-based tail hedge selection |
| Event Risk Calendar | Pre-earnings strategy adjustment |
| Gap Risk | Protective put/call strike selection |
| Portfolio Protection | Cross-option-strategy correlation limits |
| Dynamic Hedging | Options hedge ratio optimization |
## Vega-Specific Protections
### Earnings Gap Protection
For stocks with upcoming earnings:
- Reduce short strangle width by 20%
- Buy OTM wings (convert to iron condor/butterfly)
- Reduce position size by 50%
### Expiry Risk Protection
As expiry approaches:
- Close ATM options 3 days before expiry (gamma pin risk)
- Roll positions to next expiry 5 days before
- Reduce gamma exposure linearly over last week
## Integration
Vega subscribes to akshak.protection.* Redis channels for real-time protection updates per strategy.
