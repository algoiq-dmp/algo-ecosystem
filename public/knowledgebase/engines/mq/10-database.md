# 10 — Database

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Overview

MQ uses RocksDB as its embedded storage engine for all persistent data. No external database is required for normal operation. A PostgreSQL instance is used for operational metadata (topic configurations, schema registry, audit logs).

## RocksDB Storage

### Data Directory Layout

```
/data/mq/
├── data/
│   ├── messages/          # Messages column family
│   │   ├── 000001.log     # WAL files
│   │   ├── MANIFEST-000001
│   │   └── *.sst          # Sorted String Tables
│   ├── offsets/           # High watermark column family
│   ├── consumer_offsets/  # Consumer position column family
│   └── metadata/          # Cluster metadata column family
├── raft/
│   ├── {partition_id}/
│   │   ├── raft_log/
│   │   ├── snapshots/
│   │   └── metadata
├── config/
│   └── broker.properties
└── tmp/
```

### RocksDB Tuning

```cpp
rocksdb::Options options;
options.create_if_missing = true;
options.compression = rocksdb::kZSTD;
options.bottommost_compression = rocksdb::kZSTD;
options.write_buffer_size = 256 * 1024 * 1024;  // 256 MB
options.max_write_buffer_number = 4;
options.min_write_buffer_number_to_merge = 2;
options.level0_file_num_compaction_trigger = 4;
options.max_background_jobs = 16;
options.bytes_per_sync = 1048576;  // 1 MB
options.wal_recovery_mode = rocksdb::WALRecoveryMode::kPointInTimeRecovery;
options.allow_mmap_reads = true;
options.allow_mmap_writes = false;  // Use direct I/O for writes
options.use_direct_reads = true;
options.use_direct_io_for_flush_and_compaction = true;
```

### Space Management

| Data Type | Estimated Size | Retention |
|-----------|---------------|-----------|
| Market data messages | ~2 TB/day (compressed) | 7 days = 14 TB |
| Order/execution messages | ~500 GB/day | 30 days = 15 TB |
| Consumer offsets | ~10 GB | Indefinite |
| Metadata | ~1 GB | Indefinite |
| Raft logs | ~200 GB (cycling) | Per snapshot threshold |
| **Total per broker** | | ~50 TB (with 30% headroom) |

## PostgreSQL (Operational Metadata)

### Schema: `mq_config`

#### Table: `topics`

```sql
CREATE TABLE mq_config.topics (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL UNIQUE,
    partitions      INTEGER NOT NULL DEFAULT 8,
    replication_factor INTEGER NOT NULL DEFAULT 3,
    retention_ms    BIGINT DEFAULT 604800000,
    retention_bytes BIGINT DEFAULT -1,
    compression     VARCHAR(10) DEFAULT 'zstd',
    cross_dc_mirror BOOLEAN DEFAULT false,
    max_message_bytes INTEGER DEFAULT 1048576,
    min_insync_replicas INTEGER DEFAULT 2,
    created_by      VARCHAR(100),
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);
```

#### Table: `schema_versions`

```sql
CREATE TABLE mq_config.schema_versions (
    id              SERIAL PRIMARY KEY,
    topic_name      VARCHAR(255) NOT NULL REFERENCES mq_config.topics(name),
    version         INTEGER NOT NULL,
    schema_type     VARCHAR(10) NOT NULL,  -- 'protobuf' or 'avro'
    schema_def      TEXT NOT NULL,
    compatibility   VARCHAR(20) NOT NULL DEFAULT 'BACKWARD',
    fingerprint     VARCHAR(64) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE(topic_name, version)
);
```

#### Table: `audit_log`

```sql
CREATE TABLE mq_config.audit_log (
    id              BIGSERIAL PRIMARY KEY,
    action          VARCHAR(50) NOT NULL,   -- CREATE_TOPIC, DELETE_TOPIC, etc.
    principal       VARCHAR(100) NOT NULL,
    resource        VARCHAR(255) NOT NULL,
    details         JSONB,
    source_ip       INET,
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

## Backup and Recovery

### RocksDB Backup

```bash
# Create a checkpoint (consistent snapshot)
mqctl storage checkpoint --broker mq01-mum

# The checkpoint is at /data/mq/checkpoints/checkpoint-{timestamp}/
# Back up the checkpoint directory
rsync -avz /data/mq/checkpoints/checkpoint-{timestamp}/ backup-server:/backups/mq/
```

### Disaster Recovery

1. Restore RocksDB checkpoint from backup to `/data/mq/`
2. Restore PostgreSQL from recent dump
3. Start broker with `--recovery-mode` flag
4. Broker will replay any Raft log entries after the checkpoint
5. Follower catch-up completes from the leader's current log position
