# 10 — Database Schema & Storage

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Database Architecture

Surya uses **PostgreSQL 15** for metadata and operational data, **MinIO** (S3-compatible) for file object storage, and **Redis 7.x** for caching and distributed locking.

| Component | Database | Purpose |
|---|---|---|
| File metadata | PostgreSQL | File versions, file types, pipeline status |
| Audit events | TimescaleDB (via PG) | Immutable pipeline event log |
| File blobs | MinIO | Compressed CSV/Parquet file storage |
| Active state | Redis | Pipeline progress, scheduler locks, caching |

---

## PostgreSQL Schema

### Table: `file_types`

```sql
CREATE TABLE file_types (
    file_type_code      VARCHAR(32) PRIMARY KEY,
    file_type_name      VARCHAR(128) NOT NULL,
    exchange            VARCHAR(8) NOT NULL CHECK (exchange IN ('NSE', 'BSE')),
    schedule            VARCHAR(16) NOT NULL CHECK (schedule IN ('BOD', 'EOD', 'INTRADAY', 'ON_DEMAND')),
    schedule_cron       VARCHAR(32),
    schedule_time       TIME,
    extranet_endpoint   VARCHAR(256) NOT NULL,
    http_method         VARCHAR(8) DEFAULT 'GET',
    expected_columns    JSONB NOT NULL,
    primary_keys        TEXT[] NOT NULL,
    validation_rules    JSONB,
    cross_ref_rules     JSONB,
    deadline            TIME NOT NULL,
    retry_max           INTEGER DEFAULT 5,
    retry_backoff_sec   INTEGER DEFAULT 60,
    retention_days      INTEGER DEFAULT 1825,
    subscribers         TEXT[],
    enabled             BOOLEAN DEFAULT true,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `file_versions`

```sql
CREATE TABLE file_versions (
    id                  BIGSERIAL PRIMARY KEY,
    file_id             VARCHAR(64) UNIQUE NOT NULL,
    file_type_code      VARCHAR(32) NOT NULL REFERENCES file_types(file_type_code),
    exchange            VARCHAR(8) NOT NULL,
    file_date           DATE NOT NULL,
    version             INTEGER NOT NULL DEFAULT 1,
    state               VARCHAR(24) NOT NULL DEFAULT 'PENDING',
    checksum_sha256     VARCHAR(64),
    file_size_bytes     BIGINT,
    row_count           INTEGER,
    column_count        INTEGER,
    storage_key         VARCHAR(512),
    storage_bucket      VARCHAR(64) DEFAULT 'surya-files',
    compressed          BOOLEAN DEFAULT true,
    compression_algo    VARCHAR(16) DEFAULT 'gzip',
    normalized_format   VARCHAR(16) DEFAULT 'CSV',
    content_hash        VARCHAR(64),
    fetch_attempts      INTEGER DEFAULT 0,
    fetch_duration_ms   INTEGER,
    validation_duration_ms INTEGER,
    normalization_duration_ms INTEGER,
    storage_duration_ms INTEGER,
    error_message       TEXT,
    deadline            TIMESTAMPTZ,
    downloaded_at       TIMESTAMPTZ,
    ready_at            TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(file_type_code, exchange, file_date, version)
);

CREATE INDEX idx_fv_type_date ON file_versions(file_type_code, file_date DESC);
CREATE INDEX idx_fv_state ON file_versions(state);
CREATE INDEX idx_fv_exchange ON file_versions(exchange, file_date DESC);
CREATE INDEX idx_fv_ready_at ON file_versions(ready_at DESC);
```

### Table: `api_keys`

```sql
CREATE TABLE api_keys (
    id                  SERIAL PRIMARY KEY,
    key_hash            VARCHAR(64) UNIQUE NOT NULL,
    engine_name         VARCHAR(64) NOT NULL,
    allowed_file_types  TEXT[] NOT NULL DEFAULT '{}',
    rate_limit          INTEGER DEFAULT 100,
    enabled             BOOLEAN DEFAULT true,
    expires_at          TIMESTAMPTZ,
    last_used_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `fetch_log`

```sql
CREATE TABLE fetch_log (
    id                  BIGSERIAL PRIMARY KEY,
    fetch_id            UUID NOT NULL,
    file_type_code      VARCHAR(32) NOT NULL,
    file_date           DATE NOT NULL,
    attempt             INTEGER NOT NULL,
    http_status         INTEGER,
    file_size_bytes     BIGINT,
    checksum_sha256     VARCHAR(64),
    duration_ms         INTEGER,
    status              VARCHAR(16) NOT NULL,  -- SUCCESS, FAILED, TIMEOUT
    error_message       TEXT,
    started_at          TIMESTAMPTZ NOT NULL,
    completed_at        TIMESTAMPTZ
);

CREATE INDEX idx_fl_type_date ON fetch_log(file_type_code, file_date DESC);
```

### Table: `corporate_actions`

```sql
CREATE TABLE corporate_actions (
    id                  BIGSERIAL PRIMARY KEY,
    symbol              VARCHAR(32) NOT NULL,
    exchange            VARCHAR(8) NOT NULL,
    action_type         VARCHAR(32) NOT NULL,  -- DIVIDEND, BONUS, SPLIT, etc.
    ex_date             DATE NOT NULL,
    record_date         DATE,
    details             JSONB NOT NULL,
    adjustment_factor   DECIMAL(10,6),
    file_id             VARCHAR(64) REFERENCES file_versions(file_id),
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ca_symbol ON corporate_actions(symbol, ex_date DESC);
CREATE INDEX idx_ca_type ON corporate_actions(action_type, ex_date DESC);
```

---

## TimescaleDB Schema (Audit)

```sql
CREATE TABLE audit.file_events (
    time                TIMESTAMPTZ NOT NULL,
    event_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type          VARCHAR(32) NOT NULL,
    file_id             VARCHAR(64),
    file_type_code      VARCHAR(32),
    exchange            VARCHAR(8),
    component           VARCHAR(32),
    detail              JSONB,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

SELECT create_hypertable('audit.file_events', 'time');

CREATE INDEX idx_afe_type ON audit.file_events(event_type, time DESC);
CREATE INDEX idx_afe_file ON audit.file_events(file_id, time DESC);
```

---

## MinIO Object Storage

### Bucket Configuration

```
Bucket: surya-files
  Versioning: Enabled (immutable history)
  Object Locking: Compliance mode, 5-year retention
  Encryption: SSE-S3 (AES-256)
  Compression: Objects stored pre-compressed (gzip/Snappy)

Bucket: surya-staging
  Versioning: Disabled (temporary staging files)
  Lifecycle: Delete objects older than 24 hours
  Encryption: SSE-S3
```

### Object Key Convention

```
{exchange}/{fileTypeCode}/{year}/{month}/{day}/v{version}_{fileTypeCode}_{YYYYMMDD}.{format}.{compression}

Example:
nse/SEC_TOK/2026/07/24/v1_SEC_TOK_20260724.csv.gz
nse/SEC_TOK/2026/07/24/v1_SEC_TOK_20260724.parquet
```

### MinIO Cluster Topology

```
[MinIO Node 1]  [MinIO Node 2]  [MinIO Node 3]  [MinIO Node 4]
  (16 TB)         (16 TB)         (16 TB)         (16 TB)
     │               │               │               │
     └───────────────┴───────┬───────┴───────────────┘
                             │
                    Erasure Coding: EC 8+4
                    Total Usable: ~42 TB
```

---

## Redis Key Design

| Key Pattern | Type | TTL | Purpose |
|---|---|---|---|
| `surya:scheduler:{fileTypeCode}` | String (lock) | 600s | Prevent duplicate scheduler execution |
| `surya:file:{fileId}:state` | Hash | 24h | File processing state cache |
| `surya:file:{fileId}:progress` | Hash | 24h | Download/processing percent complete |
| `surya:registry:fileTypes` | Hash | 60s | Hot-reload file type registry cache |
| `surya:stats:{fileTypeCode}:rowsAvg` | String | 7d | Rolling 30-day average row count |
| `surya:extranet:{exchange}:ratelimit` | String | 60s | Token bucket for extranet API calls |
| `surya:api:{hash}` | Hash | 5m | API key scope cache |
| `surya:presigned:{fileId}` | String | 1h | Cached presigned download URL |
| `surya:daily:{date}:status` | Hash | 7d | Daily pipeline summary |

---

## Data Archival Strategy

```
HOT (MinIO SSD — 0–1 year)
  ├── All files from current + previous year
  ├── Instant access via Distribution API
  └── Full pipeline reprocessing possible

WARM (MinIO HDD — 1–5 years)
  ├── Compressed objects (gzip, Snappy)
  ├── Slightly slower access (HDD vs SSD)
  └── Available within 5 seconds

COLD (AWS S3 Glacier — 5+ years)
  ├── Compressed, deduplicated archives
  ├── Retrieval: 3–5 hours (standard), minutes (expedited)
  └── Regulatory retention requirement
```

### Archival Job (Monthly)

```sql
-- Move file_versions older than 5 years to archive
INSERT INTO archive.file_versions
SELECT * FROM file_versions
WHERE file_date < NOW() - INTERVAL '5 years';

DELETE FROM file_versions
WHERE file_date < NOW() - INTERVAL '5 years';
```

---

## Backup Strategy

| Component | Method | Frequency | Retention |
|---|---|---|---|
| PostgreSQL | `pg_dump` + WAL | Full: daily, WAL: continuous | 30 days |
| MinIO | `mc mirror` to DR site | Hourly (incremental) | Matches source |
| Audit (TimescaleDB) | `pg_dump` audit schema | Daily | 90 days |
| Redis | RDB snapshot | Hourly | 7 days |
