# 10 — Database Schema & Storage

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Database Architecture

Vega uses **PostgreSQL 15** as its primary relational database with **TimescaleDB 2.10** extension for time-series audit data. **Redis 7.x** serves as the caching and real-time state layer.

| Component | Database | Purpose |
|---|---|---|
| Orders | PostgreSQL | Current and historical orders, user accounts, broker configs |
| Audit Events | TimescaleDB (via PG) | Immutable order event log |
| Active State | Redis | Order state cache, FIX seq numbers, rate limits |
| Sessions | Redis | FIX session state, kill switch flags |

---

## PostgreSQL Schema

### Table: `orders`

```sql
CREATE TABLE orders (
    id              BIGSERIAL PRIMARY KEY,
    order_id        VARCHAR(64) UNIQUE NOT NULL,
    signal_id       VARCHAR(64) NOT NULL,
    broker_order_id VARCHAR(64),
    user_id         VARCHAR(32) NOT NULL,
    strategy_id     VARCHAR(64),
    broker          VARCHAR(16) NOT NULL,
    broker_account  VARCHAR(32),
    exchange        VARCHAR(8) NOT NULL,
    symbol          VARCHAR(32) NOT NULL,
    instrument_token BIGINT NOT NULL,
    order_type      VARCHAR(16) NOT NULL,
    transaction_type VARCHAR(4) NOT NULL CHECK (transaction_type IN ('BUY', 'SELL')),
    quantity        INTEGER NOT NULL,
    disclosed_qty   INTEGER DEFAULT 0,
    price           DECIMAL(18,4),
    trigger_price   DECIMAL(18,4),
    product_type    VARCHAR(8) NOT NULL DEFAULT 'MIS',
    validity        VARCHAR(8) NOT NULL DEFAULT 'DAY',
    state           VARCHAR(32) NOT NULL DEFAULT 'NEW',
    filled_qty      INTEGER DEFAULT 0,
    avg_price       DECIMAL(18,4) DEFAULT 0,
    rejection_reason VARCHAR(256),
    idempotency_key VARCHAR(128) UNIQUE,
    parent_order_id VARCHAR(64),
    version         INTEGER DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_state ON orders(state);
CREATE INDEX idx_orders_symbol ON orders(symbol, created_at DESC);
CREATE INDEX idx_orders_signal_id ON orders(signal_id);
CREATE INDEX idx_orders_broker_order ON orders(broker_order_id);
```

### Table: `broker_configs`

```sql
CREATE TABLE broker_configs (
    id              SERIAL PRIMARY KEY,
    broker_name     VARCHAR(16) UNIQUE NOT NULL,
    fix_host        VARCHAR(128) NOT NULL,
    fix_port        INTEGER NOT NULL,
    sender_comp_id  VARCHAR(32) NOT NULL,
    target_comp_id  VARCHAR(32) NOT NULL,
    fix_version     VARCHAR(16) NOT NULL DEFAULT 'FIX.4.4',
    heartbeat_sec   INTEGER DEFAULT 30,
    enabled         BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `user_broker_mappings`

```sql
CREATE TABLE user_broker_mappings (
    id              SERIAL PRIMARY KEY,
    user_id         VARCHAR(32) NOT NULL,
    broker          VARCHAR(16) NOT NULL,
    broker_account  VARCHAR(32) NOT NULL,
    is_primary      BOOLEAN DEFAULT false,
    enabled         BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, broker, broker_account)
);

CREATE INDEX idx_ubm_user ON user_broker_mappings(user_id);
```

### Table: `kill_switch_events`

```sql
CREATE TABLE kill_switch_events (
    id              BIGSERIAL PRIMARY KEY,
    user_id         VARCHAR(32) NOT NULL,
    drawdown_pct    DECIMAL(6,4) NOT NULL,
    running_pnl     DECIMAL(18,4),
    total_margin    DECIMAL(18,4),
    orders_cancelled INTEGER DEFAULT 0,
    activated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deactivated_at  TIMESTAMPTZ,
    deactivated_by  VARCHAR(32)
);
```

---

## TimescaleDB Schema (Audit)

### Hypertable: `audit.order_events`

```sql
CREATE TABLE audit.order_events (
    time            TIMESTAMPTZ NOT NULL,
    event_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        VARCHAR(64) NOT NULL,
    event_type      VARCHAR(32) NOT NULL,
    correlation_id  VARCHAR(64),
    actor           VARCHAR(64),
    previous_state  VARCHAR(32),
    new_state       VARCHAR(32),
    event_data      JSONB,
    user_id         VARCHAR(32),
    broker          VARCHAR(16),
    ip_address      INET,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

SELECT create_hypertable('audit.order_events', 'time');

CREATE INDEX idx_audit_order_id ON audit.order_events(order_id, time DESC);
CREATE INDEX idx_audit_user_id ON audit.order_events(user_id, time DESC);
CREATE INDEX idx_audit_event_type ON audit.order_events(event_type, time DESC);
```

### Table: `audit.credential_access`

```sql
CREATE TABLE audit.credential_access (
    time            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    id              BIGSERIAL,
    user_id         VARCHAR(32),
    broker          VARCHAR(16),
    action          VARCHAR(32),  -- READ, ROTATE, CREATE, DELETE
    ip_address      INET,
    user_agent      VARCHAR(256)
);

SELECT create_hypertable('audit.credential_access', 'time');
```

---

## Redis Key Design

### Data Structures

| Key | Type | Fields/Value | TTL |
|---|---|---|---|
| `order:{orderId}` | Hash | `state, filledQty, avgPrice, brokerOrderId, updatedAt` | 24h |
| `user:{userId}:brokers` | Set | `{XTS, Greeksoft}` | None |
| `user:{userId}:broker:{broker}` | Hash | `account, isPrimary, sessionId` | None |
| `sym:{instrumentToken}` | Hash | `symbol, exchange, lotSize, tickSize, maxQty` | 1h |
| `strategy:{strategyId}:pos:{symbol}` | String | Current position quantity | None |
| `idem:{key}` | String | `{orderId}` or `DUPLICATE` | 24h |
| `ks:{userId}:halted` | String | `true` or absent | Manual |
| `fix:seq:{senderCompId}:{targetCompId}` | String | Current sequence number | None |
| `fix:seq:{senderCompId}:{targetCompId}:in` | String | Expected inbound seq number | None |
| `rate:{userId}:{window}` | String | Counter integer | 1s |
| `broker:{broker}:health` | Hash | `status, lastHeartbeat, activeSessions` | 30s |

### Pub/Sub Channels

| Channel | Publisher | Subscribers | Purpose |
|---|---|---|---|
| `vega.order.state.{orderId}` | Order Processor | Strategy Factory, API | Real-time state updates |
| `risk.user.pnl` | Parikshak | Kill Switch | Running P&L updates |
| `broker.{broker}.status` | Broker Adapter | Health monitor, API | Broker connectivity status |

---

## Data Partitioning Strategy

```
orders table:
  Partition by: RANGE (created_at)
  Partition interval: 1 month
  Retention: 36 partitions (3 years) hot, archive older

audit.order_events:
  Partition by: TimescaleDB automatic (7-day chunks)
  Retention: 365 days hot, compress after 30 days

Archive:
  Monthly job exports data older than retention to S3 (Parquet format)
  Catalog maintained in PostgreSQL for query routing
```

---

## Backup Strategy

| Database | Method | Frequency | Retention |
|---|---|---|---|
| PostgreSQL | `pg_dump` + WAL archiving | Full: daily, WAL: continuous | 30 days |
| Redis | RDB snapshots + AOF | Snapshot: hourly, AOF: every second | 7 days |
| TimescaleDB | `pg_dump` (audit schema only) | Daily | 30 days |

### Disaster Recovery

```
RPO: < 5 minutes (via async replication to DR DC)
RTO: < 5 minutes (manual promotion of DR replica)
```
