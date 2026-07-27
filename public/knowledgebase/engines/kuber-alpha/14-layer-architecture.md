# 14 — Layer Architecture

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## The 5-Layer Architecture

Kuber Alpha operates within the Algo-IQ 5-layer architecture. Each layer has a distinct responsibility, and together they form a complete trading system from idea to execution.

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  LAYER 5: USER INTERFACE                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Strategy Factory (Drag-and-drop strategy builder)   │  │
│  │  - Visual strategy creation                          │  │
│  │  - JSON generation and export                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  LAYER 4: SIGNAL SOURCES                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Aalap Calls │ Delta XI │ VYUH │ TalkDelta AI       │  │
│  │  - Signal generation from multiple methodologies     │  │
│  │  - Publish signals to Layer 3 via MQ                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  LAYER 3: KUBER ALPHA (Central Strategy Hub)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - Receives signals from Layer 4                     │  │
│  │  - Activates managed strategies                      │  │
│  │  - Allocates capital intelligently                   │  │
│  │  - Converts opportunities into managed trades        │  │
│  │  - Sends orders to Layer 2                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  LAYER 2: EXECUTION                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Vega (Order execution engine)                       │  │
│  │  - Broker connectivity                               │  │
│  │  - Order routing and management                      │  │
│  │  - Trade confirmations                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  LAYER 1: KILL SWITCH                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - Margin monitoring at 1.01% threshold              │  │
│  │  - Emergency halt of all trading                     │  │
│  │  - Last line of defense                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Layer Communication

| From | To | Mechanism | Latency |
|---|---|---|---|
| Layer 5 | Layer 3 | MQ (strategy deployment) | < 1s |
| Layer 4 | Layer 3 | MQ (signal ingestion) | < 50ms |
| Layer 3 | Layer 2 | MQ + REST (order dispatch) | < 10ms |
| Layer 2 | Layer 3 | MQ (order status) | < 50ms |
| Layer 1 | Layer 3 | Internal event bus | < 1ms |
| Layer 1 | Layer 2 | MQ (cancel all orders) | < 5ms |

## Why This Architecture?

### Separation of Concerns
Each layer has a single responsibility. Changes in one layer don't cascade.

### Independent Scaling
- Layer 5 scales with user activity.
- Layer 4 scales with signal generation volume.
- Layer 3 scales with strategy count and signal throughput.
- Layer 2 scales with order volume.
- Layer 1 is always active, minimal footprint.

### Defense in Depth
- Layer 1 (Kill Switch) protects regardless of what happens above.
- Layer 3 (Kuber Alpha) manages risk between signal and execution.
- Layer 2 (Vega) provides broker-level safeguards.

### Failure Isolation
- Signal source failure? Layer 3 continues with other sources.
- Execution failure? Layer 3 queues orders; Layer 1 monitors.
- Layer 3 failure? Layer 1 can still halt trading.
- Layer 1 failure? This is the highest-severity incident — trading halts manually.

## Deployment Architecture

```
┌─────────────┐     ┌─────────────┐
│  Pod: KA-1  │     │  Pod: KA-2  │  ← Horizontal scaling
│  (Active)   │     │  (Standby)  │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └─────────┬─────────┘
                 │
          ┌──────▼──────┐
          │  Redis      │  ← Shared state
          │  (Cluster)  │
          └─────────────┘
```

Kuber Alpha runs in active-standby mode for high availability. State is shared via Redis Cluster. If the active pod fails, the standby takes over in < 5 seconds.
