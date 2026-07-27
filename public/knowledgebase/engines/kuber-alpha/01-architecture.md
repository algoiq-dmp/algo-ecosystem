# 01 — Architecture

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## High-Level Architecture

Kuber Alpha sits at Layer 3 of the 5-layer stack, bridging signal sources (Layer 4) with execution (Layer 2). It is built on an event-driven, actor-based architecture for low-latency signal processing.

```
┌──────────────────────────────────────────────────────────┐
│                  KUBER ALPHA (Layer 3)                    │
│                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Signal  │  │ Strategy │  │ Capital  │  │  Signal  │ │
│  │ Ingestor │  │ Activator│  │Allocator │  │Dispatcher│ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       │             │             │             │         │
│  ┌────▼─────────────▼─────────────▼─────────────▼─────┐  │
│  │                 EVENT BUS (In-Memory)              │  │
│  └────┬─────────────┬─────────────┬─────────────┬─────┘  │
│       │             │             │             │         │
│  ┌────▼─────┐  ┌───▼────┐  ┌────▼─────┐  ┌────▼─────┐  │
│  │  Kill    │  │  State │  │  Audit   │  │  Health  │  │
│  │  Switch  │  │ Manager│  │  Logger  │  │  Monitor │  │
│  └──────────┘  └────────┘  └──────────┘  └──────────┘  │
└──────────────────────┬───────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │    MQ    │ │ MongoDB  │ │  Redis   │
    └──────────┘ └──────────┘ └──────────┘
```

## Core Components

### Signal Ingestor
Receives signals from all upstream sources via dedicated MQ queues:
- `aalap.signal.*` — From Aalap Calls
- `delta-xi.signal.*` — From Delta XI
- `vyuh.signal.*` — From VYUH
- `talkdelta.signal.*` — From TalkDelta AI

Validates signal format, timestamps, and source authenticity before processing.

### Strategy Activator
Maps incoming signals to active strategies:
- Loads strategy definitions (from Strategy Factory via MQ).
- Checks strategy status (ACTIVE, PAUSED, PAPER, STAGED).
- Evaluates if the signal matches entry/exit conditions.
- Activates matching strategies and triggers capital allocation.

### Capital Allocator
Manages the distribution of capital across active strategies:
- Respects portfolio allocation weights.
- Enforces position-level and portfolio-level risk limits.
- Tracks deployed vs. available capital in real time.
- Prevents over-allocation.

### Signal Dispatcher
Converts validated signal+strategy pairs into executable orders:
- Formats orders per Vega API contract.
- Attaches kill-switch parameters.
- Routes to Vega via MQ or REST.
- Handles acknowledgments, rejections, and retries.

### Kill Switch (Layer 1)
The last line of defense:
- Monitors margin utilization in real time.
- Triggers at 1.01% margin (configurable).
- Immediately pauses all affected strategies.
- Sends critical alerts via all notification channels.

### State Manager
Maintains in-memory state for ultra-low latency access:
- Active strategies and their P&L.
- Current capital allocation.
- Signal-to-order correlation.
- Kill Switch arming status.

### Event Bus
High-performance in-memory pub/sub for intra-engine communication. Ensures all components react to state changes with minimal latency.

## Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| State | In-memory (with Redis snapshot) |
| Database | MongoDB 7.0 |
| Cache | Redis 7.2 |
| Messaging | RabbitMQ 3.12 |
| Monitoring | Prometheus, Grafana |
| Container | Docker, Kubernetes |
