# 01 — Overview & Purpose
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## What is Kavach?
Kavach is the Delta Neutral Management Engine that continuously monitors Greek exposures across all active trading strategies and provides real-time adjustment recommendations to maintain delta neutrality.
## Core Mission
Ensure every active strategy remains within its defined delta neutrality thresholds by monitoring live Greeks and generating actionable adjustment signals. Kavach acts as the automated shield protecting strategies from unwanted directional exposure.
## Design Philosophy
1. **Continuous Monitoring** — Greeks computed and checked every tick
2. **Preemptive Action** — Alerts before thresholds are breached, not after
3. **Strategy-Aware** — Each strategy has its own neutrality profile
4. **Cost-Conscious** — Adjustment recommendations consider transaction costs
5. **Manthan-Informed** — Regime intelligence adjusts neutrality targets dynamically
## Data Flow
> Lakshmi Live Prices + Suchak Indicators + Manthan Intelligence ---> Kavach Engine ---> Adjustment Signals + Risk Scores + Rebalancing Legs ---> KuberAlpha, Vega, DXCC, Rakshak
### Inputs
- **Lakshmi Live Data** — Real-time option prices for Greek calculation
- **Suchak Indicators** — Support/resistance levels for strike placement
- **Manthan Intelligence** — Market regime and volatility regime for neutrality targets
### Outputs
- Live Delta, Gamma, Theta, Vega per strategy
- Delta neutrality percentage (0-100%)
- Auto-adjustment signals (which leg, how much)
- Rebalancing recommendations with suggested hedge legs
- Composite risk scores
## Consumer Ecosystem
| Consumer | Use Case |
|----------|----------|
| **KuberAlpha** | Strategy execution with delta constraints |
| **Vega** | Options strategy management and adjustments |
| **DXCC** | Strike selection and hedge instrument pricing |
| **Rakshak** | Hedge protection trigger integration |
## Version History
| Version | Date | Changes |
|---------|------|---------|
| 3.5.0 | 2026-07-01 | Added auto-adjustment signals, Manthan integration |
| 3.0.0 | 2026-02-01 | Multi-strategy rebalancing engine |
| 2.0.0 | 2025-06-15 | Live Greek streaming (all 4 Greeks) |
| 1.0.0 | 2024-09-01 | Initial delta monitoring only |
