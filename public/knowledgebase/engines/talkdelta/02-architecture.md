# TalkDelta — Architecture

**Version:** 5.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Architecture Overview

TalkDelta is composed of four core modules:

- **talkdelta-stream:** Real-time ingestion stream consuming trade confirmations via MQ and WebSocket from Vega. Buffers and normalizes trade/order/position events.
- **talkdelta-analytics:** Analytics engine that computes P&L, MTM, execution statistics, and risk metrics. Uses TimescaleDB for time-series aggregations.
- **talkdelta-api:** REST API layer exposing delta calculations, portfolio analytics, strategy sync, and risk data to downstream consumers.
- **talkdelta-dashboard:** WebSocket-powered real-time dashboard for live strategy monitoring and trade visualization.

## Data Flow

```
Vega (Trade Confirmations) ──> talkdelta-stream ──> talkdelta-analytics ──> TimescaleDB
                                     │                                          │
                                     └──> talkdelta-api ──> Kavach, Kuber Alpha, Chitragupta, etc.
                                     └──> talkdelta-dashboard ──> WebSocket ──> Browser
```

1. Vega publishes trade confirmations via MQ
2. stream module normalizes events and pushes to analytics
3. analytics computes derived metrics and persists to TimescaleDB
4. API layer serves downstream consumers; dashboard streams real-time updates to browsers
