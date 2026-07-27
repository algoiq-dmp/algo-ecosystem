# Kuber Alpha — Central Strategy Hub

> **Version:** 1.8.0 | **Owner:** Strategy | **Health:** 99.8% | **Last Updated:** 2026-07-24

## Overview

Kuber Alpha is the **Central Strategy Hub** — Layer 3 of the 5-layer Algo-IQ architecture. It receives trading signals from upstream engines (Aalap Calls, Delta XI, VYUH, TalkDelta AI), activates managed strategies, allocates capital intelligently, and dispatches orders to Vega for execution. Kuber Alpha does **not** generate signals — it converts opportunities into managed, risk-controlled strategies.

## 5-Layer Architecture Position

```
┌──────────────────────────────────────────┐
│ Layer 5: User Interface (Strategy Factory)│
├──────────────────────────────────────────┤
│ Layer 4: Signal Sources                  │
│ (Aalap Calls, Delta XI, VYUH, TalkDelta) │
├──────────────────────────────────────────┤
│ Layer 3: Kuber Alpha ← YOU ARE HERE      │
│ Central Strategy Hub                     │
├──────────────────────────────────────────┤
│ Layer 2: Execution (Vega)                │
├──────────────────────────────────────────┤
│ Layer 1: Kill Switch (1.01% margin)      │
└──────────────────────────────────────────┘
```

## Core Responsibilities

| Function | Description |
|---|---|
| **Signal Reception** | Ingests signals from Aalap Calls, Delta XI, VYUH, and TalkDelta AI |
| **Strategy Activation** | Reads signals, maps to active strategies, activates matching logic |
| **Capital Allocation** | Allocates capital across strategies per portfolio configuration |
| **Signal Dispatch** | Converts validated signals into executable orders sent to Vega |
| **Kill Switch Layer 1** | Emergency stop at 1.01% margin utilization |

## What Kuber Alpha Does NOT Do

- **Does NOT generate signals** — Signals come from upstream engines.
- **Does NOT execute orders** — Execution is handled by Vega (Layer 2).
- **Does NOT backtest** — Backtesting is done by the Simulator.
- **Does NOT certify strategies** — Certification is done by Parikshak.
- **Does NOT approve deployments** — Approval is done by DXCC.

## Quick Links

- [Architecture](01-architecture.md)
- [Quick Start](02-quick-start.md)
- [Signal Reception](05-signal-reception.md)
- [Kill Switch](13-kill-switch.md)
- [Vega Integration](15-vega-integration.md)
- [Glossary](25-glossary.md)
