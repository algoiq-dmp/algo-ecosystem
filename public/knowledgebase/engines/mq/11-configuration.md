# 11 — Configuration

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Configuration File

Primary configuration: `/etc/lakshmi/mq/broker.yaml`

```yaml
broker:
  id: 1                        # Unique broker ID in cluster (1-255)
  host: "mq01-mum"
  data_center: "mumbai"
  rack: "rack-a1"

network:
  client:
    host: "10.100.2.10"
    port: 9092
    max_connections: 10000
    send_buffer_bytes: 1048576
    receive_buffer_bytes: 1048576
  inter_broker:
    host: "10.200.2.10"
    port: 9093
  admin:
    host: "10.100.2.10"
    port: 9095
    tls:
      enabled: true
      cert_file: "/etc/lakshmi/certs/mq-server.crt"
      key_file: "/etc/lakshmi/certs/mq-server.key"
      ca_file: "/etc/lakshmi/certs/ca.crt"

storage:
  data_dir: "/data/mq"
  checkpoint_dir: "/data/mq/checkpoints"
  rocksdb:
    write_buffer_mb: 256
    max_background_jobs: 16
    block_cache_mb: 32768
    compression: "zstd"

raft:
  election_timeout_ms: 150
  election_timeout_jitter_ms: 150
  heartbeat_interval_ms: 50
  snapshot_threshold_entries: 100000000
  snapshot_threshold_bytes: 10737418240  # 10 GB

replication:
  default_factor: 3
  min_insync_replicas: 2
  follower_fetch_max_bytes: 1048576

log:
  segments_bytes: 1073741824       # 1 GB per segment
  retention_check_interval_ms: 300000  # 5 minutes
  cleanup_policy: "delete"         # or "compact"
  compression_type: "zstd"

consumer:
  session_timeout_ms: 30000
  heartbeat_interval_ms: 3000
  max_poll_interval_ms: 300000
  partition_assignment_strategy: "sticky"

metrics:
  prometheus_port: 9192
  export_interval_sec: 15

narad:
  agent_address: "localhost:50060"
  registration_interval_sec: 30

suraksha:
  mTLS: true
  cert_refresh_interval_hours: 24
  audit_enabled: true
```

## Topic-Level Configuration

Configurable per topic and overridable:

| Property | Default | Description |
|----------|---------|-------------|
| `retention.ms` | 604800000 (7d) | Message retention period |
| `retention.bytes` | -1 (unlimited) | Max partition size |
| `max.message.bytes` | 1048576 (1MB) | Max message size |
| `min.insync.replicas` | 2 | Min ISR for produce ACK |
| `compression.type` | zstd | Producer compression |
| `cleanup.policy` | delete | delete or compact |
| `segment.bytes` | 1073741824 (1GB) | Log segment size |
| `cross.dc.mirror` | false | Enable cross-DC mirroring |

## Dynamic Configuration

Some properties can be changed at runtime:

```bash
# Alter topic retention
mqctl topic alter --name "feed.NSE.CM.tick" --retention-ms 259200000

# Alter topic partitions (increase only)
mqctl topic alter --name "feed.NSE.CM.tick" --partitions 32

# Update broker log level
mqctl broker config --log-level debug
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MQ_BROKER_ID` | (required) | Unique broker ID |
| `MQ_CONFIG_PATH` | `/etc/lakshmi/mq/broker.yaml` | Config file path |
| `MQ_HEAP_GB` | 128 | JVM-style heap for RocksDB block cache |
| `MQ_RAFT_LOG_LEVEL` | info | Raft subsystem log level |
