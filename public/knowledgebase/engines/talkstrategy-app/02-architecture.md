# TalkStrategy App — Architecture

**Version:** 2.5.0 | **Owner:** Frontend | **Last Updated:** 2026-07-24

## Architecture Overview

TalkStrategy App is a single-module application with two functional layers:

- **Middleware Layer:** Receives validated execution requests from TalkStrategy API via REST. Routes them to the Vega Order Processor with guaranteed delivery semantics (acknowledgment tracking, retry logic). Listens for trade confirmations and propagates them back to the API. Uses WebSocket for real-time status streaming to the UI.
- **UI Layer:** Web-based strategy management dashboard. Displays real-time execution flow, order status, and trade confirmations. Provides configuration management for strategy-level execution parameters.

## Data Flow

```
TalkStrategy API ──> [Middleware Layer] ──> Vega Order Processor
        ▲                    │                      │
        │                    ▼                      ▼
        └──── Trade Confirmations ◄─────────────────┘
                              │
                              ▼
                     [UI Layer] ──> WebSocket ──> Browser Dashboard
```

1. API forwards validated requests to middleware
2. Middleware routes to Vega, tracks acknowledgments
3. Confirmation flows back through middleware to API
4. UI streams real-time execution status via WebSocket
