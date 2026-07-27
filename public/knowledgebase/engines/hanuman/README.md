# Hanuman — 2-Leg Algorithmic Execution Engine

> **Sub-component of:** Lakshmi  
> **Version:** v2.1.0  
> **Owner:** Execution  
> **Last Updated:** 2026-07-25

## Overview

Hanuman is a specialized 2-leg algorithmic execution engine that implements spread, pair, and arbitrage strategies via the Vega strategy framework. It monitors correlated instruments, detects execution opportunities, and dispatches paired orders to ODIN for exchange routing.

## Key Capabilities

- 2-leg execution strategies: calendar spreads, inter-commodity spreads, pair trades, cash-futures arbitrage
- Vega strategy framework integration for strategy lifecycle management
- Real-time spread monitoring with configurable entry/exit thresholds
- Pre-trade risk checks (position limits, margin validation) before order dispatch
- Leg-level fill tracking with partial fill handling and ratio maintenance
- Auto-hedging: leg failure triggers hedge order on the completed leg
- Market impact-aware execution: slices large spread orders into child orders
- P&L tracking per strategy instance with real-time mark-to-market

## Directory Structure

```
hanuman/
├── README.md
├── 01-overview.md
├── 02-business-requirements.md
├── 03-system-requirements.md
├── 04-high-level-architecture.md
├── 05-low-level-design.md
├── 06-components.md
├── 07-data-flow.md
├── 08-topology.md
├── 09-api-reference.md
├── 10-database.md
├── 11-configuration.md
├── 12-installation.md
├── 13-deployment.md
├── 14-monitoring.md
├── 15-security.md
├── 16-narad-integration.md
├── 17-suraksha-integration.md
├── 18-failover.md
├── 19-performance.md
├── 20-testing.md
├── 21-troubleshooting.md
├── 22-faq.md
├── 23-roadmap.md
├── 24-release-notes.md
├── 25-glossary.md
├── diagrams/
├── images/
└── api/
```

## Quick Links

| Document | Description |
|----------|-------------|
| [04-high-level-architecture](04-high-level-architecture.md) | Strategy engine architecture |
| [05-low-level-design](05-low-level-design.md) | Spread calculation and order dispatch |
| [07-data-flow](07-data-flow.md) | Signal → order lifecycle |

## Dependencies

- **Runtime:** C++20, Boost 1.84+
- **Internal Services:** Vega v4.x (strategy framework), MQ v5.x (market data + orders), ODIN v3.x (order routing)
- **Risk:** Pre-trade checks via Lakshmi Risk Engine

## SLOs

| Metric | Target |
|--------|--------|
| Signal-to-order latency | < 100 us |
| Spread calculation accuracy | < 0.01 tick |
| Strategy uptime | 99.99% |
| Max concurrent strategies | 500 per instance |
