# AALAP Calls — Architecture

**Version:** 2.5.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Architecture Overview

AALAP Calls consists of two core modules:

- **aalap-strategies:** The 15 strategy engines, each running in its own process/port (3030-3044). Each strategy subscribes to MQ for market data, fetches OHLC from Ganesh, and consumes options analytics from TalkOptions. Strategies evaluate conditions on their configured intervals and generate signals when thresholds are met.
- **aalap-signals:** Centralized signal aggregation and routing module. Collects signals from all 15 strategies, deduplicates, timestamps, and publishes a unified signal feed to Kuber Alpha. Maintains signal history in TimescaleDB.

## Data Flow

```
MQ (Market Data) ────────┐
Ganesh (OHLC) ───────────┤
TalkOptions (Analytics) ──┤
Surya (Ref Files) ────────┤
Lakshmi (Live Prices) ────┴──> [15 Strategy Engines] ──> aalap-signals ──> Kuber Alpha / Vega
                                                              │
                                                              └──> TimescaleDB
```

1. Each strategy independently consumes data via MQ, REST, and file feeds
2. Strategies evaluate conditions and emit signals
3. Signal aggregator collects, deduplicates, and routes to Kuber Alpha
