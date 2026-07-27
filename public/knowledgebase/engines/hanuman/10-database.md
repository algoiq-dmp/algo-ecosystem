# 10 — Database

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Overview

Hanuman uses a combination of in-memory state (hot path) and PostgreSQL (configuration and historical data). The hot execution path is entirely in-memory with no database queries.

## In-Memory State

| State | Data Structure | Purpose |
|-------|---------------|---------|
| Strategy registry | `Map<strategy_id, StrategyState>` | Active strategy states |
| Order book cache | `Map<symbol, OrderBook>` | Top 5 levels per instrument |
| Fill ledger | `Map<strategy_id, vector<Fill>>` | Recent fill history per strategy |
| P&L accumulator | `struct` per strategy | Running P&L values |
| Signal history | `CircularBuffer<Signal>` | Last 1000 signals per strategy |

All in-memory state is lost on restart. Strategy state is recovered from the state replication stream (cross-instance) or from the last checkpoint.

## PostgreSQL Tables

### Schema: `hanuman_config`

#### Table: `strategy_definitions`

```sql
CREATE TABLE hanuman_config.strategy_definitions (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL UNIQUE,
    vega_definition TEXT NOT NULL,
    version         INTEGER NOT NULL DEFAULT 1,
    status          VARCHAR(20) DEFAULT 'INACTIVE',  -- ACTIVE, INACTIVE, ARCHIVED
    created_by      VARCHAR(100),
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);
```

#### Table: `strategy_instances`

```sql
CREATE TABLE hanuman_config.strategy_instances (
    id              VARCHAR(50) PRIMARY KEY,  -- e.g., "strat-001"
    definition_id   INTEGER REFERENCES hanuman_config.strategy_definitions(id),
    server          VARCHAR(50),  -- "hanuman01-mum"
    state           VARCHAR(20),  -- RUNNING, PAUSED, STOPPED
    params_override JSONB,
    started_at      TIMESTAMPTZ,
    stopped_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

### Schema: `hanuman_analytics`

#### Table: `trade_log`

```sql
CREATE TABLE hanuman_analytics.trade_log (
    id              BIGSERIAL PRIMARY KEY,
    strategy_id     VARCHAR(50) NOT NULL,
    signal_type     VARCHAR(10),  -- ENTRY, EXIT, HEDGE
    leg             INTEGER,      -- 1 or 2
    symbol          VARCHAR(25),
    side            VARCHAR(4),   -- BUY, SELL
    quantity        INTEGER,
    price           DOUBLE PRECISION,
    spread_at_signal DOUBLE PRECISION,
    order_id        VARCHAR(50),
    fill_id         VARCHAR(50),
    executed_at     TIMESTAMPTZ DEFAULT now()
);
```

#### Table: `daily_pnl`

```sql
CREATE TABLE hanuman_analytics.daily_pnl (
    strategy_id     VARCHAR(50) NOT NULL,
    trade_date      DATE NOT NULL,
    realized_pnl    DOUBLE PRECISION DEFAULT 0,
    trading_cost    DOUBLE PRECISION DEFAULT 0,
    net_pnl         DOUBLE PRECISION DEFAULT 0,
    num_trades      INTEGER DEFAULT 0,
    win_rate        DOUBLE PRECISION,
    sharpe_ratio    DOUBLE PRECISION,
    max_drawdown    DOUBLE PRECISION,
    PRIMARY KEY (strategy_id, trade_date)
);
```

## State Recovery

On restart, Hanuman recovers strategy state from:
1. **Checkpoint file:** `/opt/lakshmi/hanuman/checkpoints/checkpoint.latest`
2. **Replay log:** RocksDB-based state change log for post-checkpoint recovery
3. **ODIN query:** Active orders for this strategy (to cancel and re-submit if needed)
4. **Risk Engine query:** Current positions for strategy instruments
