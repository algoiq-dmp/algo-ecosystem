# Simulator — Architecture

**Version:** 3.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Architecture Overview

The Simulator has two core modules:

- **simulator-engine:** The simulation runtime that replays historical data or processes live paper trading data. Fetches minute trade data from TalkDelta API, minute OHLC from Ganesh, live feeds via MQ, and Lakshmi feed server data. Simulates order execution with realistic latency and fill modeling.
- **simulator-api:** REST API for managing simulation runs, retrieving backtest reports, and accessing performance metrics. Stores results in PostgreSQL and time-series data in TimescaleDB.

## Data Flow

```
TalkDelta API (Minute Trades) ──┐
Ganesh (Minute OHLC) ───────────┤
MQ (Live Market Broadcast) ──────┤
Lakshmi (Feed Data) ────────────┴──> simulator-engine ──> PostgreSQL / TimescaleDB
                                            │
                                            └──> simulator-api ──> Parikshak, Strategy Factory
```

1. Engine fetches historical data or subscribes to live streams
2. Replays data through strategy logic at configured speed
3. Simulates fills, slippage, and transaction costs
4. API exposes results to Parikshak and Strategy Factory
