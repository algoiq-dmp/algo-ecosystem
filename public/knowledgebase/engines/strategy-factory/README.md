# Strategy Factory

> **Version:** 3.0.0 | **Owner:** Strategy | **Health:** 99.7% | **Last Updated:** 2026-07-24

## Overview

Strategy Factory is the visual, modular strategy builder for the Algo-IQ ecosystem. It provides a drag-and-drop interface that empowers traders and quants to design, compose, and export algorithmic trading strategies without writing code. Every strategy born in Strategy Factory follows a rigorous lifecycle: **Build → Parikshak (test) → Simulator (backtest) → DXCC (approve) → Kuber Alpha (deploy)**.

## Core Capabilities

| Feature | Description |
|---|---|
| **Drag-and-Drop Builder** | Assemble strategies visually using pre-built logic blocks |
| **Entry Logic** | Define precise conditions for trade entry signals |
| **Exit Logic** | Configure stop-loss, take-profit, trailing, and time-based exits |
| **Risk Rules** | Set per-trade and portfolio-level risk constraints |
| **Position Sizing** | Choose from fixed, volatility-adjusted, or Kelly-based sizing models |
| **Portfolio Allocation** | Allocate capital across multiple strategies with weighting rules |
| **JSON Generation** | Export strategies as standardized JSON for downstream engines |

## Lifecycle

```
┌─────────┐    ┌───────────┐    ┌───────────┐    ┌──────┐    ┌─────────────┐
│  Build   │───▶│ Parikshak  │───▶│ Simulator  │───▶│ DXCC │───▶│ Kuber Alpha │
└─────────┘    └───────────┘    └───────────┘    └──────┘    └─────────────┘
```

1. **Build** — Compose the strategy using the visual builder.
2. **Parikshak** — Run the strategy through the enterprise testing engine for certification.
3. **Simulator** — Backtest against historical data to validate performance.
4. **DXCC** — Obtain compliance and risk approval for production deployment.
5. **Kuber Alpha** — Deploy as an active managed strategy in the central hub.

## Connected Engines

- **Parikshak** — Testing & certification gateway
- **Simulator** — Historical backtesting engine
- **DXCC** — Compliance & deployment approval
- **Kuber Alpha** — Production strategy hub (deployment target)
- **Ganesh** — Data quality & validation layer
- **MQ** — Message queue for inter-engine communication

## Quick Links

- [Architecture](01-architecture.md)
- [Quick Start Guide](02-quick-start.md)
- [Builder Interface](05-builder-interface.md)
- [Lifecycle Details](13-lifecycle.md)
- [Glossary](25-glossary.md)
