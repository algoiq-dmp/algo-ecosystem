# 05 â€” Low-Level Design

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Bar Aggregator Design

The Bar Aggregator is the heart of Ganesh. It operates as an in-memory state machine keyed by `{symbol}_{timeframe}`.

### Memory Structures

```
barBuffer: Map<string, OHLCPartial>
  Key: "RELIANCE_1m" | "INFY_5m" | "TCS_1H"
  Value: { open, high, low, close, volume, oi, startTime, tickCount }

barPendingFinalize: PriorityQueue<OHLCBar>
  Ordered by: finalizeTimestamp ASC
```

### Processing Pipeline

1. **Tick Ingestion**: AMQP consumer pushes ticks into an in-memory ring buffer (capacity: 100,000).
2. **Dispatcher**: Worker thread dequeues ticks, routes to per-symbol, per-timeframe aggregators.
3. **Bar Update**: For each tick, update the partial bar's high, low, close, volume.
4. **Bar Finalization**: At timeframe boundaries, the finalized bar is pushed to the Storage Writer.
5. **Corporate Action Handler**: On Surya event, retrieves affected historical bars, applies multiplier, rewrites.

### Concurrency Model

- **Main thread**: AMQP consumption + dispatch.
- **Worker pool**: N workers (N = CPU cores - 1) for bar computation.
- **Storage writer**: Dedicated thread for Redis + PostgreSQL writes.
- **Lock-free data structures**: Ring buffer for tick queue, atomic operations for bar updates.

## Redis Schema

| Key Pattern | Type | TTL | Description |
|---|---|---|---|
| `bar:{symbol}:{tf}:{ts}` | Hash | 90 days | Single OHLC bar |
| `bars:{symbol}:{tf}:latest` | Hash | None | Most recent finalized bar |
| `bars:{symbol}:{tf}:range` | Sorted Set | 90 days | Timestamp-indexed bars for range queries |
| `symbols:active` | Set | None | Currently traded symbols |
| `corp_action:{symbol}:{ex_date}` | Hash | 7 years | Applied corporate action record |

## PostgreSQL Schema

```sql
CREATE TABLE ohlc_bars (
    id BIGSERIAL,
    symbol VARCHAR(20) NOT NULL,
    timeframe VARCHAR(5) NOT NULL,
    bar_time TIMESTAMPTZ NOT NULL,
    open DECIMAL(18, 4),
    high DECIMAL(18, 4),
    low DECIMAL(18, 4),
    close DECIMAL(18, 4),
    volume BIGINT,
    open_interest BIGINT,
    adjusted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (symbol, timeframe, bar_time)
);

SELECT create_hypertable('ohlc_bars', 'bar_time', chunk_time_interval => INTERVAL '1 day');
CREATE INDEX idx_ohlc_symbol_time ON ohlc_bars (symbol, bar_time DESC);
```

## API Routes

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/bar/:symbol/:timeframe` | Latest bar |
| GET | `/api/v1/bar/:symbol/:timeframe/:timestamp` | Bar at specific time |
| GET | `/api/v1/bars/:symbol/:timeframe?from=&to=` | Range query |
| GET | `/api/v1/bars/multi/:symbol?timeframes=1m,5m` | Multi-TF snapshot |
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/health/deep` | Deep health check (DB, Redis, MQ) |
