# SpreadWatch — Architecture

**Version:** 2.8.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Architecture Overview

SpreadWatch has two core modules:

- **spreadwatch-engine:** The spread computation engine. Subscribes to live market data via MQ and fetches options analytics from TalkOptions. Maintains running spread calculations for configured pairs, calendar spreads, and multi-leg structures. Detects deviations from fair value and triggers alerts.
- **spreadwatch-api:** REST API serving spread signals, arbitrage alerts, pair trade opportunities, and historical spread data from TimescaleDB.

## Data Flow

```
MQ (Live Prices) ────────┐
TalkOptions (Options) ───┴──> spreadwatch-engine ──> TimescaleDB
                                    │
                                    └──> spreadwatch-api ──> Kuber Alpha, DXCC
```

1. Engine subscribes to real-time price and options data
2. Computes spread fair values and detects deviations
3. Generates ranked spread opportunity signals
4. API serves signals and historical data to consumers
