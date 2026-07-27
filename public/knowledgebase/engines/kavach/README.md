# Kavach Engine
> **Version:** 3.5.0 | **Owner:** Risk | **Health:** 99.95% | **Last Updated:** 2026-07-24
## Overview
Kavach (Sanskrit: "armor" / "shield") is the **Delta Neutral Management Engine** within the Strategy Intelligence Layer. It monitors and manages delta, gamma, theta, and vega exposures across all active strategies, generating auto-adjustment signals and rebalancing recommendations.
## Key Metrics
| Metric | Value |
|--------|-------|
| Greeks Monitored | Delta, Gamma, Theta, Vega |
| Data Sources | Lakshmi (live prices), Suchak (indicators), Manthan (regime intelligence) |
| Uptime SLA | 99.95% |
| Avg. Monitor Latency | < 25ms |
| Consumers | KuberAlpha, Vega, DXCC, Rakshak |
## Core Features
| # | Feature | Description |
|---|---------|-------------|
| 1 | Live Greek Monitoring | Real-time delta/gamma/theta/vega per strategy |
| 2 | Auto-Adjustment Signals | Automatic hedge signals when neutrality drifts |
| 3 | Rebalancing Recommendations | Suggested hedge legs and quantities |
| 4 | Risk Scoring | Composite risk score per strategy |
| 5 | Neutrality Percentage | How delta-neutral the portfolio currently is |
## Quick Links
- [Overview & Purpose](01-overview.md)
- [Architecture](02-architecture.md)
- [API Reference](20-api-endpoints.md)
- [Glossary](24-glossary.md)
