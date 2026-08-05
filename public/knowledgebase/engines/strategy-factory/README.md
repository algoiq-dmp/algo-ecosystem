# Strategy Factory -- Phase 1: Strategy Research & Development

> **Version:** 3.0.0 | **Owner:** Strategy | **Health:** 99.7% | **Last Updated:** 2026-08-05

## Overview

The **Strategy Factory** is the Phase 1 research and development environment of the Algo IQ ecosystem, responsible for designing, building, validating, and optimizing trading strategies before they are deployed into the live trading environment.

Every strategy follows a controlled lifecycle to ensure reliability, stability, and risk compliance before reaching production. Each strategy is assigned a unique **Strategy ID** that remains its common identity throughout its entire lifecycle.

> **See Also:** [Algo IQ Strategy Ecosystem Overview](/knowledgebase/ecosystem-overview.md) -- End-to-end flow from Strategy Factory to Vega Execution.

---

## Strategy Development Lifecycle

```
PHASE 1                 PHASE 2                 PHASE 3
Strategy Factory  -->   Parikshak         -->   Kuber Alpha
(Creation)              (Testing & Validation)   (Deployment)
     |                       |                        |
     |  Unique Strategy ID persists throughout all 3 phases  |
     |                                                       |
     v                                                       v
  Pass? ---> Parikshak                             Vega Engine
  Fail? <--- (return to Factory)                    (Execution)
```

---

## Phase 1 -- Strategy Factory Capabilities

The Strategy Factory creates new trading strategies using predefined templates, quantitative models, AI algorithms, and market intelligence.

| Tool | Description |
|---|---|
| **Strategy Builder** | Visual interface for strategy composition |
| **Rule Engine** | Configurable logic for trade decisions |
| **Parameter Configuration** | Fine-tuned strategy parameters |
| **Entry & Exit Logic** | Precise conditions for trade signals |
| **Risk Management Rules** | Per-strategy risk controls and limits |
| **Position Sizing** | Fixed, volatility-adjusted, Kelly-based sizing |
| **Money Management** | Capital allocation strategies |
| **Portfolio Allocation** | Weight-based multi-strategy allocation |
| **Version Control** | Complete strategy version history |
| **Strategy Documentation** | Automated specification generation |

---

## End-to-End Workflow

```
Strategy Factory (Phase 1)
   |
   | Strategy Creation with unique Strategy ID
   v
Parikshak (Phase 2)
   |
   | Backtesting, Paper Trading, Validation, Certification
   | Pass? --> Proceed to Phase 3
   | Fail? --> Return to Phase 1 for modification
   v
Kuber Alpha (Phase 3)
   |
   | Strategy Deployment, Daily Strategy Combination
   | Trigger Management, Signal Orchestration
   v
Vega Engine
   |
   | Multi-Account Allocation, Order Processing, Broker APIs
   v
Exchange (NSE/BSE)
   |
   | Trade Execution
   v
Trade Confirmation & Position Updates
   |
   v
Back to Kuber Alpha for Monitoring, Analytics, and Performance Evaluation
```

---

## Strategy Trigger Sources

Strategies deployed to Kuber Alpha can be activated by multiple intelligent trigger sources:

| Trigger Category | Examples |
|---|---|
| **Time Series** | Market Open, Market Close, every N minutes, hourly, weekly, monthly |
| **Exit of Another Strategy** | Completion of scalping, hedging exit, profit booking, stop loss |
| **IV Alerts** | IV above/below threshold, IV rank, IV percentile, IV crush |
| **Market Movement** | Breakout, breakdown, gap up/down, trend reversal, momentum, volume spike |
| **Delta XI Alerts** | Delta imbalance, hedging opportunity, risk shift, gamma trigger |
| **Vyuh Alerts** | Stock selection, momentum, relative strength, sector rotation |
| **SpreadWatch Alerts** | Calendar spread, vertical spread, arbitrage, spread widening/narrowing |
| **Strategy-to-Strategy** | Entry/exit confirmation, position sync, risk alert, rebalancing trigger |

---

## Lifecycle Handoffs

| Handoff | Direction | Content |
|---|---|---|
| **Phase 1 → 2** | Strategy Factory → Parikshak | Strategy definition, rules, parameters, test data |
| **Phase 2 → 1** (Fail) | Parikshak → Strategy Factory | Failure report, specific test failures, optimization recommendations |
| **Phase 2 → 3** (Pass) | Parikshak → DXCC → Kuber Alpha | Certification report, DXCC go-live approval |
| **Phase 1 → 3** | Strategy Factory → Kuber Alpha | Deployment-ready strategy package |

---

## Connected Engines

- **Parikshak** -- Phase 2 testing & certification gateway
- **Simulator** -- Historical backtesting engine
- **DXCC** -- Compliance & go-live deployment approval
- **Kuber Alpha** -- Phase 3 production strategy hub (deployment target)
- **Ganesh** -- OHLC data for strategy development
- **MQ** -- Message queue for inter-engine communication

---

## Quick Links

- [Architecture](01-architecture.md)
- [Quick Start Guide](02-quick-start.md)
- [Builder Interface](05-builder-interface.md)
- [Entry Logic](07-entry-logic.md)
- [Exit Logic](08-exit-logic.md)
- [Risk Rules](09-risk-rules.md)
- [Position Sizing](10-position-sizing.md)
- [Lifecycle Details](13-lifecycle.md)
- [Parikshak Integration](14-parikshak-integration.md)
- [Kuber Alpha Deployment](17-kuber-alpha-deployment.md)
- [Glossary](25-glossary.md)
