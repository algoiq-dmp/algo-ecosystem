# 10 — Database

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Overview

ODIN uses PostgreSQL for persistent order storage, audit trails, and reconciliation data. The hot order path is in-memory; PostgreSQL is used for durability and querying.

## In-Memory State

| State | Structure | Purpose |
|-------|-----------|---------|
| Order state store | `ConcurrentHashMap<order_id, OrderState>` | Active order states |
| Adapter health | `Map<adapter_id, HealthStatus>` | Adapter connectivity status |
| Rate limit counters | `Map<client_id, TokenBucket>` | Per-client rate limiting |

## PostgreSQL Tables

### Schema: `odin_orders`

#### Table: `orders`

```sql
CREATE TABLE odin_orders.orders (
    order_id            VARCHAR(50) PRIMARY KEY,
    client_id           VARCHAR(50) NOT NULL,
    client_order_id     VARCHAR(50),
    exchange            VARCHAR(10) NOT NULL,
    segment             VARCHAR(10) NOT NULL,
    symbol              VARCHAR(25) NOT NULL,
    side                VARCHAR(4) NOT NULL,
    order_type          VARCHAR(10) NOT NULL,
    quantity            INTEGER NOT NULL,
    price               DOUBLE PRECISION,
    trigger_price       DOUBLE PRECISION,
    tif                 VARCHAR(10) DEFAULT 'DAY',
    order_status        VARCHAR(20) DEFAULT 'NEW',
    filled_quantity     INTEGER DEFAULT 0,
    avg_price           DOUBLE PRECISION,
    adapter_id          VARCHAR(30),
    algo_id             VARCHAR(20),
    strategy_tag        VARCHAR(50),
    created_at          TIMESTAMPTZ DEFAULT now(),
    updated_at          TIMESTAMPTZ DEFAULT now(),
    completed_at        TIMESTAMPTZ
);

CREATE INDEX idx_orders_client ON odin_orders.orders(client_id, created_at);
CREATE INDEX idx_orders_exchange ON odin_orders.orders(exchange, segment, created_at);
CREATE INDEX idx_orders_status ON odin_orders.orders(order_status);
```

#### Table: `trades`

```sql
CREATE TABLE odin_orders.trades (
    trade_id            VARCHAR(50) PRIMARY KEY,
    order_id            VARCHAR(50) NOT NULL REFERENCES odin_orders.orders(order_id),
    exchange_order_id   VARCHAR(50),
    symbol              VARCHAR(25),
    side                VARCHAR(4),
    quantity            INTEGER NOT NULL,
    price               DOUBLE PRECISION NOT NULL,
    trade_value         DOUBLE PRECISION GENERATED ALWAYS AS (quantity * price) STORED,
    exchange_ts         TIMESTAMPTZ,
    odin_ts             TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_trades_order ON odin_orders.trades(order_id);
CREATE INDEX idx_trades_date ON odin_orders.trades(odin_ts::date);
```

#### Table: `reconciliation`

```sql
CREATE TABLE odin_orders.reconciliation (
    id                  BIGSERIAL PRIMARY KEY,
    trade_date          DATE NOT NULL,
    exchange            VARCHAR(10) NOT NULL,
    segment             VARCHAR(10) NOT NULL,
    odin_trade_count    INTEGER,
    exchange_trade_count INTEGER,
    matched_count       INTEGER,
    discrepancy_count   INTEGER,
    missing_in_odin     INTEGER,
    missing_in_exchange INTEGER,
    status              VARCHAR(20),  -- IN_PROGRESS, COMPLETE, DISCREPANCIES
    report_path         TEXT,
    created_at          TIMESTAMPTZ DEFAULT now()
);
```

#### Table: `order_audit`

```sql
CREATE TABLE odin_orders.order_audit (
    id                  BIGSERIAL PRIMARY KEY,
    order_id            VARCHAR(50) NOT NULL,
    event_type          VARCHAR(30) NOT NULL,  -- NEW, VALIDATED, ROUTED, FILLED, etc.
    old_state           JSONB,
    new_state           JSONB,
    source              VARCHAR(50),  -- adapter ID, validator ID
    created_at          TIMESTAMPTZ DEFAULT now()
);
```

## Data Retention

| Table | Retention | Partition By |
|-------|-----------|-------------|
| `orders` | 5 years | DATE(created_at), monthly |
| `trades` | 5 years | DATE(odin_ts), monthly |
| `reconciliation` | 5 years | trade_date, monthly |
| `order_audit` | 5 years | DATE(created_at), monthly |
