# 15 — Input: Kavach Greeks
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
Rakshak consumes **Kavach's** real-time Greek exposures and risk scores as the primary input for hedge requirement sizing and emergency exit triggers.
## Data Consumed
| Kavach Output | Rakshak Module |
|---------------|---------------|
| Net Delta per Strategy | Hedge sizing; gap risk; overnight risk |
| Net Gamma | Tail risk assessment; portfolio stress |
| Net Vega | Event risk hedge sizing |
| Neutrality % | Emergency exit trigger |
| Risk Score | Dynamic hedging; portfolio protection |
## Integration
Kavach publishes to kavach.greeks and kavach.risk Redis streams. Rakshak subscribes and processes every 1s for continuous protection assessment.
## Emergency Escalation
When Kavach reports neutrality < 25% or risk > 75, Rakshak immediately escalates:
1. Evaluate emergency exit criteria
2. If triggered, lock normal trading and initiate exit
3. If not triggered, enhance hedge requirements
