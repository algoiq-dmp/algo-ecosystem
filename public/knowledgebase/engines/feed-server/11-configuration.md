# 11 — Configuration

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Configuration File

Primary configuration file: `/etc/lakshmi/feedd/config.yaml`

### Top-Level Structure

```yaml
feedd:
  version: "2.8.0"
  instance_id: "feedd-nse-cm-01"
  data_center: "mumbai"

dpdk:
  eal_args: ["-l", "0-15", "-n", "4"]
  memory_channels: 4
  hugepage_mount: "/dev/hugepages"

exchanges:
  - code: NSE
    segments:
      - code: CM
        primary:
          ip: "10.240.1.100"
          port: 9001
          vlan: 100
          nic_port: 0
          nic_queue: 0
        secondary:
          ip: "10.240.1.101"
          port: 9001
          vlan: 100
          nic_port: 1
          nic_queue: 0
        protocol: "nfmt_v2"
        heartbeat_interval_ms: 100
        heartbeat_timeout_ms: 250
        gap_recovery:
          enabled: true
          replay_ip: "10.240.1.200"
          replay_port: 9010
          max_replay_range: 100000

ring_buffer:
  size_gb: 16
  slot_size_bytes: 256
  consumer_timeout_ms: 5000

mq:
  broker_address: "unix:///var/run/lakshmi/mq.sock"
  publish_batch_size: 256
  publish_timeout_us: 100
  max_queue_depth: 100000
  topics:
    tick: "feed.{exchange}.{segment}.tick"
    quote: "feed.{exchange}.{segment}.quote"
    ob: "feed.{exchange}.{segment}.ob"
    status: "feed.market.status"

sequencer:
  gap_threshold: 1
  gap_recovery_enabled: true
  max_gap_recovery_age_sec: 300

monitoring:
  prometheus_port: 9090
  health_check_interval_sec: 5
  narad_agent: "localhost:50060"

audit:
  enabled: true
  batch_size: 10000
  suraksha_endpoint: "localhost:50070"
  storage_retention_days: 1825

logging:
  level: "info"
  spdlog:
    async: true
    queue_size: 8192
    sinks:
      - type: "file"
        path: "/var/log/lakshmi/feedd/feedd.log"
        max_size_mb: 100
        max_files: 10
      - type: "syslog"
        facility: "local0"
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FEEDD_CONFIG_PATH` | `/etc/lakshmi/feedd/config.yaml` | Config file path |
| `FEEDD_INSTANCE_ID` | (required) | Unique instance identifier |
| `FEEDD_DATA_CENTER` | (required) | DC location (mumbai / navimumbai) |
| `FEEDD_PROMETHEUS_PORT` | `9090` | Metrics endpoint port |
| `FEEDD_LOG_LEVEL` | `info` | Log level override |
| `FEEDD_DPDK_WHITELIST` | — | PCI addresses for DPDK-bound NICs |

## Runtime Configuration Reload

Feed Server supports hot reload of specific configuration sections:
- **Log level:** Signal `SIGUSR1`
- **MQ broker address:** `feeddctl reload mq`
- **Symbol master cache:** `feeddctl reload symbols`
- **Bandwidth limits:** `feeddctl reload throttle`

Full config reload requires a restart. Configuration changes are validated against the JSON schema at `/etc/lakshmi/feedd/config-schema.json` before application.
