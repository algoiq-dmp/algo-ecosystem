# 10 — Database

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Overview

The Feed Server does NOT use a traditional relational database on the hot path. All real-time data flows through in-memory structures. Persistent storage is used only for configuration, audit trails, and operational metadata.

## In-Memory Data Structures

### Symbol Master Cache

An in-memory hash table mapping exchange symbol tokens to Lakshmi internal symbol IDs. Refreshed daily from exchange instrument files.

| Field | Type | Size |
|-------|------|------|
| exchange | uint8 | 1 B |
| segment | uint8 | 1 B |
| exchange_token | uint32 | 4 B |
| lakshmi_symbol_id | uint32 | 4 B |
| symbol_name | char[25] | 25 B |
| lot_size | uint16 | 2 B |
| tick_size | uint32 (fixed) | 4 B |
| expiry_date | uint32 (epoch) | 4 B |
| strike_price | uint32 (fixed) | 4 B |

Total per entry: 49 bytes. With ~250K instruments: ~12.25 MB.

### Ring Buffer State

Stored in shared memory (hugetlbfs mounted at `/dev/hugepages/feedd_ringbuf`).

## Persistent Storage (PostgreSQL 16)

### Schema: `feedd_config`

Configuration database hosted on a separate PostgreSQL instance (not co-located).

#### Table: `exchange_connections`

```sql
CREATE TABLE feedd_config.exchange_connections (
    id              SERIAL PRIMARY KEY,
    exchange        VARCHAR(10) NOT NULL,
    segment         VARCHAR(10) NOT NULL,
    primary_ip      INET NOT NULL,
    primary_port    INTEGER NOT NULL,
    secondary_ip    INET,
    secondary_port  INTEGER,
    protocol        VARCHAR(20) NOT NULL,
    vlan_id         INTEGER,
    enabled         BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);
```

#### Table: `symbol_master_snapshots`

```sql
CREATE TABLE feedd_config.symbol_master_snapshots (
    id              BIGSERIAL PRIMARY KEY,
    exchange        VARCHAR(10) NOT NULL,
    segment         VARCHAR(10) NOT NULL,
    snapshot_date   DATE NOT NULL,
    file_hash       VARCHAR(64) NOT NULL,
    total_symbols   INTEGER NOT NULL,
    raw_data        BYTEA,
    created_at      TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX idx_sym_master_unique
    ON feedd_config.symbol_master_snapshots(exchange, segment, snapshot_date);
```

#### Table: `feed_audit_log`

```sql
CREATE TABLE feedd_config.feed_audit_log (
    id              BIGSERIAL PRIMARY KEY,
    exchange        VARCHAR(10) NOT NULL,
    segment         VARCHAR(10) NOT NULL,
    batch_seq_start BIGINT NOT NULL,
    batch_seq_end   BIGINT NOT NULL,
    batch_hash      VARCHAR(64) NOT NULL,
    merkle_root     VARCHAR(64),
    recorded_at     TIMESTAMPTZ DEFAULT now()
);
```

## Time-Series Storage (ClickHouse)

For operational metrics and latency histograms, data is written to ClickHouse for long-term storage and analysis.

| Table | Retention | Partition By |
|-------|-----------|-------------|
| `feedd_latency_histogram` | 90 days | toDate(timestamp) |
| `feedd_gap_events` | 365 days | toDate(timestamp) |
| `feedd_throughput_1s` | 90 days | toDate(timestamp) |
