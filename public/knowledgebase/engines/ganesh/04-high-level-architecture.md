# 04 â€” High-Level Architecture

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Architectural Overview

Ganesh follows a layered, event-driven architecture designed for high throughput and low latency. The system is split into four primary tiers: **Ingestion**, **Aggregation**, **Storage**, and **Serving**.

```
+-------------------+       +-------------------+
|   Feed Server     |       |      Surya        |
| (Exchange Ticks)  |       | (Corp. Actions)   |
+--------+----------+       +--------+----------+
         |                           |
         v                           v
+--------+--------------------------+----------+
|              Lakshmi (RabbitMQ)              |
+--------+--------------------------+----------+
         |                           |
         v                           v
+--------+----------+       +--------+----------+
|  Tick Consumer    |       | Corp Action       |
|  (AMQP Sub)       |       | Consumer          |
+--------+----------+       +--------+----------+
         |                           |
         v                           v
+--------+--------------------------+----------+
|           Bar Aggregator                     |
|  (1m, 5m, 15m, 1H, 1D Bars)                |
+--------+--------------------------+----------+
         |
         v
+--------+--------------------------+----------+
|              Storage Layer                   |
|  +----------+    +-------------------+       |
|  |  Redis   |    |  PostgreSQL       |       |
|  | (Cache)  |    |  (+TimescaleDB)   |       |
|  +----------+    +-------------------+       |
+--------+--------------------------+----------+
         |
         v
+--------+--------------------------+----------+
|              REST API Server                 |
|  (Consumer Queries, Auth, Rate Limit)        |
+--------+--------------------------+----------+
         |
         v
+--------+--------------------------+----------+
|                   Consumers                  |
|  Vega, Brahma, Garuda, Simulator,           |
|  TalkOptions, TalkDelta, Suchak              |
+----------------------------------------------+
```

## Tier Descriptions

### Ingestion Tier

Raw market ticks arrive from the exchange feed server via Lakshmi's RabbitMQ fabric. A dedicated AMQP consumer subscribes to the `market.ticks.*` topic pattern. Corporate action notifications from Surya arrive on a separate `corp.actions.*` topic.

### Aggregation Tier

The Bar Aggregator is the core compute unit. It buffers ticks per symbol, constructs OHLC bars at each timeframe boundary, and finalizes bars when the timeframe window closes. For 1-minute bars, finalization occurs at `MM:00`; for 1-hour bars at `HH:00`, etc. Partial bars (in-progress) are available for real-time consumers.

### Storage Tier

Dual-layer storage ensures both speed and durability:
- **Redis** holds the most recent 90 days of bars as a hot cache with TTL-based eviction.
- **PostgreSQL + TimescaleDB** stores all historical bars with automatic time-based partitioning.

### Serving Tier

A stateless REST API server handles consumer queries. It checks Redis first, falls back to PostgreSQL for cold data, caches frequently accessed ranges, and enforces Suraksha JWT authentication.

## Design Decisions

| Decision | Rationale |
|---|---|
| Redis as hot cache | Sub-millisecond reads for recent data |
| TimescaleDB for cold storage | Optimized for time-series, automatic partitioning |
| Stateless API servers | Horizontal scalability behind load balancer |
| Event-driven aggregation | Minimizes latency from tick to bar |
| Suraksha for auth | Unified security model across ecosystem |
