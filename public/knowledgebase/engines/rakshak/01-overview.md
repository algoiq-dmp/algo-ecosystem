# 01 — Overview & Purpose
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## What is Rakshak?
Rakshak is the final layer of defense in the Strategy Intelligence Layer. While Suchak provides indicators, Manthan provides intelligence, and Kavach maintains neutrality, Rakshak ensures that no strategy experiences catastrophic losses from events that fall outside the normal Greek hedging framework.
## Core Mission
Protect the portfolio from tail events, gaps, overnight risk, and black swan scenarios by calculating required hedges, monitoring event calendars, and executing emergency exits when necessary.
## Design Philosophy
1. **Assume the Worst** — Plan for what Greek models cannot capture
2. **Pre-Trade Protection** — Hedge requirements calculated before position entry
3. **Event-Aware** — Calendar-driven risk monitoring
4. **Multi-Layer** — Hedge -> Dynamic Hedge -> Emergency Exit -> Disaster Protection
5. **Fast Execution** — Emergency exits execute in milliseconds
## Data Flow
> Kavach Greeks + Manthan Intelligence + Suchak S/R + Event Calendar ---> Rakshak Engine ---> Hedge Requirements + Risk Alerts + Emergency Triggers ---> KuberAlpha, Vega, DXCC
### Inputs
- **Kavach** — Live Greek exposures, risk scores, neutrality %
- **Manthan** — Market regime, volatility regime, confidence
- **Suchak** — Support/Resistance levels for stop placement
- **Event Calendar** — Earnings, RBI, FOMC, Budget, political events
### Outputs
- Hedge requirement sizing and instrument selection
- Tail risk and gap risk scores
- Overnight position limits
- Event-based hedge recommendations
- Emergency exit triggers
- Disaster protection activation signals
## Consumer Ecosystem
| Consumer | Use Case |
|----------|----------|
| **KuberAlpha** | Pre-trade hedge validation; emergency exit execution |
| **Vega** | Options-specific tail risk hedges |
| **DXCC** | Strike selection for protective puts/calls |
## Version History
| Version | Date | Changes |
|---------|------|---------|
| 2.3.0 | 2026-07-01 | Added dynamic hedging; improved event calendar integration |
| 2.0.0 | 2026-02-15 | Emergency exit and disaster protection modules |
| 1.0.0 | 2025-08-01 | Initial release: hedge requirements + tail + gap + overnight risk |
