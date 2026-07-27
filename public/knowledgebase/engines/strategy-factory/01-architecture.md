# 01 — Architecture

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## High-Level Architecture

Strategy Factory is built on a modular, event-driven architecture that separates the visual builder layer from the strategy compilation and export layer.

```
┌──────────────────────────────────────────────────────┐
│                   FRONTEND (React)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Canvas   │ │ Palette  │ │ Inspector│ │ Toolbar │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬────┘ │
│       └─────────────┴────────────┴────────────┘      │
│                         │                             │
├─────────────────────────┼─────────────────────────────┤
│                   BACKEND (Node.js)                   │
│  ┌──────────────────────────────────────────────────┐│
│  │              Strategy Compiler                    ││
│  │  ┌─────────┐ ┌──────────┐ ┌──────────────────┐  ││
│  │  │Parser   │ │Validator │ │Code Generator    │  ││
│  │  └─────────┘ └──────────┘ └──────────────────┘  ││
│  └──────────────────────┬───────────────────────────┘│
│                         │                             │
│  ┌──────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐   │
│  │State     │ │Block   │ │Risk     │ │Export    │   │
│  │Manager   │ │Library │ │Engine   │ │Service   │   │
│  └──────────┘ └────────┘ └─────────┘ └──────────┘   │
└──────────────────────┬───────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │  MQ      │ │ MongoDB  │ │  Redis   │
    └──────────┘ └──────────┘ └──────────┘
```

## Key Components

### Canvas Engine
The visual workspace where users place and connect logic blocks. Supports zoom, pan, multi-select, and undo/redo.

### Block Library
A curated set of reusable strategy blocks categorized as:
- **Signals** — Entry trigger conditions
- **Filters** — Market condition filters
- **Actions** — Order placement logic
- **Risk** — Position sizing and risk controls
- **Flow** — Conditional branching and loops

### Strategy Compiler
Transforms the visual graph into executable logic. Three-phase pipeline:
1. **Parser** — Traverses the node graph and builds an AST
2. **Validator** — Checks for logical errors, cycles, and rule violations
3. **Code Generator** — Produces standardized JSON output

### State Manager
Maintains real-time strategy state using a Redux store with middleware for auto-save (5-second debounce), version history (last 50 revisions), and collaborative conflict resolution.

### Risk Engine
Evaluates strategy-level risk in real time during construction. Highlights violations of configurable limits on exposure, correlation, drawdown, and leverage.

### Export Service
Generates standardized JSON payloads consumed by Parikshak, Simulator, DXCC, and Kuber Alpha.

## Data Flow

1. User places blocks on canvas → Canvas Engine updates visual state
2. State Manager persists to Redux store → auto-saves to MongoDB
3. On export trigger → Compiler parses graph → validates → generates JSON
4. JSON published to MQ → downstream engines consume

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, react-flow |
| Backend | Node.js 20, Express |
| Database | MongoDB 7.0 |
| Cache | Redis 7.2 |
| Messaging | RabbitMQ (MQ) |
| Container | Docker, Kubernetes |
