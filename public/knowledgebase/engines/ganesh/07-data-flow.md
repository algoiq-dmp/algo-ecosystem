# 07 â€” Data Flow

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## End-to-End Data Flow

```
Exchange Lease Line
        |
        v
   Feed Server
        |
        v
   Lakshmi (RabbitMQ)  <----------------------+
        |                                      |
        v                                      |
   Tick Consumer (Ganesh)                      |
        |                                      |
        v                                      |
   Ring Buffer (In-Memory, 100K cap)           |
        |                                      |
        v                                      |
   Dispatcher (Per-Symbol Routing)             |
        |                                      |
        v                                      |
   Bar Aggregator (5 Timeframes)               |
        |                                      |
        v                                      |
   Finalized Bar Queue                         |
        |                                      |
        +----------> Redis (Hot Cache)         |
        |              |                       |
        |              v                       |
        +----------> PostgreSQL  ---->  REST API Server
                       |                       |
                       v                       |
                  Corp Action Engine --------->+
                                               |
                                               v
                                          Consumers
                                   (Vega, Brahma, Garuda,
                                    Simulator, TalkOptions,
                                    TalkDelta, Suchak)
```

## Tick Ingestion Path

1. Exchange lease line delivers raw TCP tick data to the Feed Server.
2. Feed Server normalizes ticks and publishes to Lakshmi's RabbitMQ `market.ticks.{exchange}.{segment}` topic.
3. Ganesh Tick Consumer (AMQP subscriber) receives tick, validates JSON schema, and enqueues to ring buffer.
4. Average latency: **< 2ms** from exchange wire to Ganesh ring buffer.

## Bar Aggregation Path

1. Dispatcher worker dequeues tick from ring buffer.
2. Identifies symbol and dispatches to all five timeframe aggregators.
3. Each aggregator updates its partial bar (open, high, low, close, volume).
4. At timeframe boundary, the finalized bar is queued for storage.
5. Average aggregation latency: **< 100ms** for 1-minute bar finalization.

## Storage Path

1. Storage Writer dequeues finalized bar from queue.
2. Writes to Redis: Updates latest bar hash, inserts into timestamp-sorted set.
3. Batches PostgreSQL inserts (500 bars or 1-second flush).
4. Redis write: **sub-ms**; PostgreSQL write: **< 5ms** per batch.

## Consumer Read Path

1. Consumer sends authenticated GET request to REST API.
2. Suraksha JWT middleware validates token.
3. Rate limiter checks consumer quota.
4. API server queries Redis first for requested bars.
5. On cache miss, queries PostgreSQL and repopulates Redis.
6. Response returned with bars + metadata.
7. Average read latency: **< 5ms** (Redis hit), **< 50ms** (cache miss).

## Corporate Action Flow

1. Surya detects corporate action and publishes to `corp.actions.{symbol}`.
2. Ganesh Corporate Action Engine receives event.
3. Queries PostgreSQL for all bars of the affected symbol before the ex-date.
4. Applies adjustment multiplier to historical OHLC values.
5. Rewrites bars to PostgreSQL with `adjusted = TRUE`.
6. Invalidates affected Redis keys.
7. Logs audit trail entry with before/after values.
8. End-to-end latency: **< 30 seconds**.

## Error Handling

| Failure Point | Handling Strategy |
|---|---|
| RabbitMQ disconnection | Auto-reconnect with exponential backoff, buffer ticks locally |
| Redis unavailable | Fallback to PostgreSQL direct reads, alert via Narad |
| PostgreSQL unavailable | Buffer bars in Redis, retry writes, alert immediately |
| Invalid tick data | Log and discard, increment `invalid_ticks` counter |
| Bar validation failure | Flag bar, exclude from API, generate alert |
