# Rakshak Engine
> **Version:** 2.3.0 | **Owner:** Risk | **Health:** 99.9% | **Last Updated:** 2026-07-24
## Overview
Rakshak (Sanskrit: "protector" / "guardian") is the **Hedge Protection Engine** within the Strategy Intelligence Layer. It provides comprehensive risk protection across strategies, including hedge requirement calculation, tail risk management, gap/overnight/event risk monitoring, and emergency exit protocols.
## Key Metrics
| Metric | Value |
|--------|-------|
| Protection Modules | 9 |
| Data Sources | Kavach (Greeks), Manthan (Regime), Suchak (S/R) |
| Uptime SLA | 99.9% |
| Avg. Assessment Latency | < 50ms |
| Consumers | KuberAlpha, Vega, DXCC |
## Protection Modules
| # | Module | Description |
|---|--------|-------------|
| 1 | Hedge Requirements | Recommended hedge size and instruments |
| 2 | Tail Risk | Fat-tail event risk assessment |
| 3 | Gap Risk | Overnight/weekend gap exposure |
| 4 | Overnight Risk | Position risk during closed markets |
| 5 | Event Risk | Scheduled/unscheduled event impact |
| 6 | Dynamic Hedging | Adaptive hedge ratio adjustments |
| 7 | Portfolio Protection | Cross-strategy risk aggregation |
| 8 | Emergency Exit | Rapid position liquidation protocols |
| 9 | Disaster Protection | Black swan scenario safeguards |
## Quick Links
- [Overview & Purpose](01-overview.md)
- [Architecture](02-architecture.md)
- [API Reference](20-api-endpoints.md)
- [Glossary](24-glossary.md)
