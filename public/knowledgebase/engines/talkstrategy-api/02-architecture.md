# TalkStrategy API — Architecture

**Version:** 2.8.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

## Architecture Overview

TalkStrategy API consists of two core modules:

- **talkstrategy-api:** The REST API layer that exposes trade execution endpoints. Handles authentication, rate limiting, and request queuing. Routes validated requests to TalkStrategy App via HTTP. Persists request state in Redis for durability and status tracking.
- **talkstrategy-validator:** Request validation engine that checks symbol validity, lot sizes, price limits, quantity constraints, and strategy authorization. Rejects malformed or unauthorized requests before they reach the execution layer.

## Data Flow

```
Kuber Alpha ──────┐
Strategy Factory ──┤
AALAP Calls ───────┤
Delta XI ──────────┤
VYUH ──────────────┤
SpreadWatch ───────┤
Suchak ────────────┴──> talkstrategy-api ──> talkstrategy-validator
                                │                       │
                                │ (if valid)            │ (if invalid)
                                ▼                       ▼
                        TalkStrategy App           HTTP 4xx Response
                                │
                                ▼
                        Vega Order Processor
```

1. Multiple upstream engines send execution requests
2. Validator checks parameters, authorization, and constraints
3. Valid requests forwarded to TalkStrategy App middleware
4. Invalid requests rejected with detailed error messages
