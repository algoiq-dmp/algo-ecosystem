# 06 â€” Component Descriptions

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Component Inventory

| Component | Type | Language | Criticality |
|---|---|---|---|
| Tick Consumer | Service | Node.js | High |
| Bar Aggregator | Service | Node.js | Critical |
| Storage Writer | Service | Node.js | Critical |
| Redis Cache | Infrastructure | â€” | High |
| PostgreSQL Store | Infrastructure | â€” | Critical |
| REST API Server | Service | Node.js | High |
| Corporate Action Engine | Service | Node.js | Medium |
| Data Validator | Service | Node.js | Medium |
| Health Probe | Service | Node.js | High |
| Config Manager | Library | Node.js | Low |

---

## Tick Consumer

Subscribes to `market.ticks.*` on Lakshmi's RabbitMQ cluster. Deserializes tick messages, validates schema, and pushes to the in-memory ring buffer. Implements consumer acknowledgments for guaranteed delivery. Handles backpressure by buffering up to 100,000 ticks before applying flow control.

## Bar Aggregator

Core computation unit responsible for constructing OHLC bars. Maintains in-memory partial bars per symbol per timeframe. At timeframe boundaries, finalizes bars and enqueues them for storage. Supports real-time partial bar queries for ongoing periods.

### Timeframe Alignment Rules

- **1m bars**: Aligned to `MM:00` (e.g., 10:30:00â€“10:30:59).
- **5m bars**: Aligned to `MM:00, MM:05, MM:10, ...`
- **15m bars**: Aligned to `MM:00, MM:15, MM:30, MM:45`.
- **1H bars**: Aligned to `HH:00`.
- **1D bars**: Aligned to market open date.

## Storage Writer

Dedicated writer thread that drains the finalized-bar queue and persists bars to both Redis (synchronous, hot path) and PostgreSQL (asynchronous batch, cold path). Batch size for PostgreSQL inserts is 500 bars or 1 second, whichever comes first.

## Redis Cache

In-memory key-value store holding the most recent 90 days of OHLC bars. Configured in cluster mode for high availability. Key eviction policy: volatile-lru. Used as the primary read path for the API server.

## PostgreSQL Store

Persistent relational store with TimescaleDB extension for time-series optimization. Stores all historical bars indefinitely. Chunked at 1-day intervals. Supports complex analytical queries for backtesting and research.

## REST API Server

Express.js-based HTTP server exposing the Ganesh REST API. Handles authentication via Suraksha JWT middleware, rate limiting per consumer, and request validation. Implements Redis-first read strategy with PostgreSQL fallback.

## Corporate Action Engine

Listens for Surya corporate action events, retrieves all affected historical bars from PostgreSQL, applies adjustment multipliers, and rewrites bars with `adjusted = TRUE` flag. Logs every adjustment to the audit trail.

## Data Validator

Post-storage validation service that checks bar integrity: High >= Low, logical OHLC relationships, gap detection, and outlier detection (price movement > 10% without corporate action context). Flags anomalies to Prometheus and generates alerts.

## Health Probe

Exposes `/api/v1/health` and `/api/v1/health/deep` endpoints. Shallow check verifies process liveness. Deep check validates Redis connectivity, PostgreSQL connectivity, RabbitMQ connectivity, and latest bar freshness (must have bars within last 5 minutes during market hours).
