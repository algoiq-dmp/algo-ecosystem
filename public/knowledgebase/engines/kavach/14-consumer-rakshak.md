# 14 — Consumer: Rakshak
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
**Rakshak** consumes Kavach's risk scores and neutrality percentages as triggers for its hedge protection and emergency exit mechanisms.
## Data Consumed
| Kavach Output | Rakshak Application |
|---------------|--------------------|
| Risk Scores | Hedge requirement escalation |
| Neutrality % | Emergency exit trigger if < 25% |
| Delta Drift | Tail risk hedge sizing |
| Gamma/Vega Risk | Portfolio protection scaling |
| Adjustment Failure | Disaster protection activation |
## Emergency Escalation Flow
Kavach (Neutrality < 25%) -> Rakshak (Emergency Mode) -> KuberAlpha (Close Positions)
## Risk Threshold Mapping
| Kavach Risk Score | Rakshak Protection Level |
|------------------|------------------------|
| 0-25 (Low) | Normal hedging |
| 26-50 (Moderate) | Enhanced hedging |
| 51-75 (High) | Active protection mode |
| 76-100 (Critical) | Emergency exit (close all) |
## Integration
Kavach publishes to Kafka topic kavach.risk.events consumed by Rakshak for protection rule evaluation.
