# 10 — Database

## Overview

Lakshmi uses **PostgreSQL** for persistent metadata and audit logs, **Redis** for in-memory caching and operational state, and **InfluxDB** for time-series performance metrics.

---

## PostgreSQL Schema

### Database: `lakshmi`

### Table: `topics`

Stores the catalog of all registerable topics.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `name` | VARCHAR(256) | UNIQUE, NOT NULL | Topic pattern (e.g., `market.live.NSE.FUT`) |
| `partitions` | SMALLINT | DEFAULT 1, CHECK (1..16) | Partition count for parallel consumers |
| `is_active` | BOOLEAN | DEFAULT true | Whether topic accepts publishes |
| `max_message_size` | INTEGER | DEFAULT 65536 | Maximum payload size in bytes |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `created_by` | VARCHAR(128) | NOT NULL | Creator identity |

```sql
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(256) UNIQUE NOT NULL,
    partitions SMALLINT DEFAULT 1 CHECK (partitions BETWEEN 1 AND 16),
    is_active BOOLEAN DEFAULT true,
    max_message_size INTEGER DEFAULT 65536,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(128) NOT NULL
);

CREATE INDEX idx_topics_name ON topics (name);
CREATE INDEX idx_topics_active ON topics (is_active) WHERE is_active = true;
```

### Table: `subscribers`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `name` | VARCHAR(128) | UNIQUE, NOT NULL | Subscriber logical name |
| `type` | VARCHAR(32) | NOT NULL | `engine`, `websocket`, `web_project`, `terminal` |
| `connection_info` | JSONB | DEFAULT '{}' | Host, port, protocol details |
| `api_key_hash` | VARCHAR(256) | NOT NULL | Hashed API key for verification |
| `is_connected` | BOOLEAN | DEFAULT false | Current connection status |
| `last_heartbeat` | TIMESTAMPTZ | — | Last heartbeat timestamp |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Registration timestamp |

```sql
CREATE TABLE subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) UNIQUE NOT NULL,
    type VARCHAR(32) NOT NULL CHECK (type IN ('engine','websocket','web_project','terminal')),
    connection_info JSONB DEFAULT '{}',
    api_key_hash VARCHAR(256) NOT NULL,
    is_connected BOOLEAN DEFAULT false,
    last_heartbeat TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscribers_type ON subscribers (type);
```

### Table: `subscriber_topics`

Junction table linking subscribers to topics.

| Column | Type | Constraints |
|---|---|---|
| `subscriber_id` | UUID | REFERENCES subscribers(id) ON DELETE CASCADE |
| `topic_id` | UUID | REFERENCES topics(id) ON DELETE CASCADE |
| `subscribed_at` | TIMESTAMPTZ | DEFAULT NOW() |

PRIMARY KEY (`subscriber_id`, `topic_id`)

### Table: `messages`

Stores audit records of published messages (30-day rolling retention).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-increment ID |
| `message_id` | UUID | NOT NULL | Original message UUID |
| `topic_id` | UUID | REFERENCES topics(id) | Target topic |
| `publisher` | VARCHAR(128) | NOT NULL | Publishing subscriber name |
| `payload_size` | INTEGER | NOT NULL | Payload size in bytes |
| `routing_key` | VARCHAR(256) | NOT NULL | Full routing key used |
| `received_at` | TIMESTAMPTZ | DEFAULT NOW() | Ingestion timestamp |
| `published_at` | TIMESTAMPTZ | NOT NULL | Publish timestamp |

```sql
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    message_id UUID NOT NULL,
    topic_id UUID REFERENCES topics(id),
    publisher VARCHAR(128) NOT NULL,
    payload_size INTEGER NOT NULL,
    routing_key VARCHAR(256) NOT NULL,
    received_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_messages_ts ON messages (received_at DESC);
CREATE INDEX idx_messages_topic ON messages (topic_id);
```

### Table: `metrics`

Aggregated hourly metrics for long-term trend analysis.

| Column | Type | Constraints |
|---|---|---|
| `hour` | TIMESTAMPTZ | NOT NULL |
| `topic_id` | UUID | REFERENCES topics(id) |
| `message_count` | BIGINT | NOT NULL DEFAULT 0 |
| `avg_latency_us` | DOUBLE PRECISION | — |
| `p99_latency_us` | DOUBLE PRECISION | — |
| `error_count` | INTEGER | NOT NULL DEFAULT 0 |

PRIMARY KEY (`hour`, `topic_id`)

### Table: `audit_log`

General system audit trail (1-year retention).

| Column | Type | Constraints |
|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY |
| `event_type` | VARCHAR(64) | NOT NULL |
| `actor` | VARCHAR(128) | NOT NULL |
| `details` | JSONB | DEFAULT '{}' |
| `severity` | VARCHAR(16) | NOT NULL DEFAULT 'info' |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

---

## Redis Cache Structure

| Key Pattern | Type | TTL | Description |
|---|---|---|---|
| `lak:topic:{name}` | Hash | — | Topic metadata |
| `lak:sub:{name}` | Hash | — | Subscriber metadata |
| `lak:subscr:{name}:topics` | Set | — | Topics subscribed by a subscriber |
| `lak:dedup:{exchange}:{symbol}` | String (count) | 30s | Duplicate detection window |
| `lak:rate:{apiKey}` | String (count) | 60s | API rate limiter counter |
| `lak:ws:{socketId}` | Hash | — | WebSocket session state |
| `lak:ws:topics:{socketId}` | Set | — | Client-subscribed topics |
| `lak:auth:{apiKeyHash}` | String (scope) | 300s | Cached auth result |

---

## InfluxDB Time-Series

### Bucket: `lakshmi_metrics`

| Measurement | Tags | Fields | Retention |
|---|---|---|---|
| `throughput` | `topic`, `exchange` | `messages_per_sec` | 90 days |
| `latency` | `component`, `operation` | `p50`, `p95`, `p99`, `max` | 90 days |
| `connections` | `type` | `count` | 30 days |
| `errors` | `type`, `topic` | `count` | 90 days |
| `queue_depth` | `queue_name` | `depth`, `ready`, `unacked` | 30 days |

---

## Data Retention Policy

| Storage | Data Type | Hot Retention | Cold Retention | Action After |
|---|---|---|---|---|
| PostgreSQL `messages` | Message audit | 30 days | 1 year (compressed) | DELETE via cron |
| PostgreSQL `audit_log` | System audit | 30 days | 1 year | DELETE via cron |
| PostgreSQL `metrics` | Hourly aggregates | 90 days | 2 years | DELETE via cron |
| Redis | All cache keys | — | — | TTL-based expiry |
| InfluxDB | Time-series metrics | 90 days | — | Influx retention policy |

---

## Backup Strategy

| Database | Method | Frequency | Retention |
|---|---|---|---|
| PostgreSQL | `pg_dump` (full) | Daily at 02:00 UTC | 7 daily, 4 weekly, 3 monthly |
| PostgreSQL | WAL archiving | Continuous | 7 days |
| Redis | RDB snapshot + AOF | Every 15 minutes | 7 daily snapshots |
| InfluxDB | `influx backup` | Daily at 02:00 UTC | 7 daily |
