# TalkOptions — Architecture

**Version:** 4.7.2 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Architecture Overview

TalkOptions follows a layered modular architecture with three core modules:

- **talkoptions-core:** Option chain builder, Greeks engine (Binomial/Black-Scholes), IV solver, PCR calculator, Max Pain, and volatility surface modeling.
- **talkoptions-api:** REST API layer exposing 150+ endpoints with response caching, rate limiting, and pagination. Serves downstream consumers via HTTP/HTTPS.
- **talkoptions-analytics:** Batch analytics processor for historical OI trends, IV term structure, and expiry analytics.

## Data Flow

```
Ganesh (OHLC) ──┐
MQ (Market Data) ──┤
Surya (BOD/EOD)  ──┴──> talkoptions-core ──> talkoptions-api ──> Consumers
                                   │
                                   └──> talkoptions-analytics ──> PostgreSQL / InfluxDB
```

1. Raw market data ingested from Ganesh (OHLC), MQ (live tick), and Surya (BOD/EOD reference files)
2. Core engine computes options analytics in-memory with sub-second latency
3. API layer serves computed results to Delta XI, VYUH, SpreadWatch, TalkDelta, AALAP Calls, and Simulator
4. Analytics module runs batch jobs for historical aggregation and stores results in PostgreSQL and InfluxDB
