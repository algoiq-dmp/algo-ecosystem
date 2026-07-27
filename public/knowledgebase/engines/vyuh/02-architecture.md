# VYUH — Architecture

**Version:** 3.0.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Architecture Overview

VYUH is built around two core modules:

- **vyuh-engine:** The ranking and scoring engine. Consumes live market data from MQ and Lakshmi, options analytics from TalkOptions, and reference data from Surya. Computes multi-factor scores for each stock in the universe. Runs on a configurable evaluation cycle.
- **vyuh-api:** REST API exposing stock rankings, trend signals, sector analysis, and relative strength scores to Kuber Alpha and DXCC. Also serves historical score data from TimescaleDB.

## Data Flow

```
MQ (Market Data) ────────┐
Lakshmi (Live Prices) ───┤
TalkOptions (Analytics) ──┤
Surya (Ref Files) ───────┴──> vyuh-engine ──> TimescaleDB
                                    │
                                    └──> vyuh-api ──> Kuber Alpha, DXCC
```

1. Multi-source data ingested and normalized
2. Engine scores each stock on configured factor dimensions
3. Rankings persisted to TimescaleDB for historical analysis
4. API serves current rankings and signals to consumers
