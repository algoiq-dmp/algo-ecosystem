# 10 â€” Database Schema & Storage

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Storage Architecture

Ganesh employs a dual-layer storage strategy combining Redis for hot data and PostgreSQL with TimescaleDB for cold, durable storage.

```
Hot Path (sub-ms):   Redis Cluster
                     |- Latest bars (90 days)
                     |- Active symbols
                     |- Consumer query cache

Cold Path (durable): PostgreSQL + TimescaleDB
                     |- All historical bars (10+ years)
                     |- Corporate action audit log
                     |- Consumer usage analytics
```

---

## Redis Schema

### Bar Storage

| Key | Type | TTL | Purpose |
|---|---|---|---|
| `bar:{symbol}:{tf}:{epoch_ts}` | Hash | 90d | Individual OHLC bar |
| `bars:{symbol}:{tf}:latest` | Hash | None | Most recent finalized bar |
| `bars:{symbol}:{tf}:range` | Sorted Set | 90d | Timestamp-indexed for range queries |

### Bar Hash Fields

```
HSET bar:RELIANCE:1m:1721808000
  o  "2450.50"
  h  "2455.75"
  l  "2448.25"
  c  "2453.10"
  v  "125000"
  oi "0"
  adj "0"
```

### Metadata

| Key | Type | Purpose |
|---|---|---|
| `symbols:active` | Set | All currently traded symbols |
| `symbols:{symbol}:meta` | Hash | Symbol metadata (lot size, tick size) |
| `cache:miss:{pattern}` | Counter | Cache miss monitoring |

---

## PostgreSQL Schema

### Primary Table: ohlc_bars

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
    volume BIGINT DEFAULT 0,
    open_interest BIGINT DEFAULT 0,
    adjusted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (symbol, timeframe, bar_time)
);

SELECT create_hypertable('ohlc_bars', 'bar_time',
    chunk_time_interval => INTERVAL '1 day');
```

### Indexes

```sql
CREATE INDEX idx_ohlc_symbol_time ON ohlc_bars (symbol, bar_time DESC);
CREATE INDEX idx_ohlc_timeframe ON ohlc_bars (timeframe, bar_time DESC);
CREATE INDEX idx_ohlc_adjusted ON ohlc_bars (symbol, adjusted) WHERE adjusted = TRUE;
```

### Corporate Action Audit

```sql
CREATE TABLE corp_action_audit (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    action_type VARCHAR(20) NOT NULL,
    ex_date DATE NOT NULL,
    multiplier DECIMAL(10, 6),
    bars_affected INTEGER,
    surya_event_id VARCHAR(64),
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    details JSONB
);
```

### Consumer Usage Analytics

```sql
CREATE TABLE consumer_queries (
    id BIGSERIAL PRIMARY KEY,
    consumer_id VARCHAR(64) NOT NULL,
    symbol VARCHAR(20),
    timeframe VARCHAR(5),
    query_type VARCHAR(20),
    cache_hit BOOLEAN,
    response_time_ms INTEGER,
    requested_at TIMESTAMPTZ DEFAULT NOW()
);

SELECT create_hypertable('consumer_queries', 'requested_at',
    chunk_time_interval => INTERVAL '1 day');
```

## Data Retention Policies

| Data Type | Retention | Eviction Policy |
|---|---|---|
| Redis hot bars | 90 days | TTL-based auto-eviction |
| PostgreSQL bars | 10+ years | Manual archival after 10 years |
| Corp action audit | 7 years | Manual archival |
| Consumer queries | 90 days | TimescaleDB compression after 7d, drop after 90d |
| Prometheus metrics | 30 days | Standard Prometheus retention |

## Backup Strategy

| Database | Frequency | Retention | Method |
|---|---|---|---|
| PostgreSQL | Daily full, hourly WAL | 30 days | pgBackRest |
| Redis | Every 6 hours (RDB) | 7 days | BGSAVE to S3 |
| Configs | On change | 90 days | Git + Vault |
