# 11 — Configuration

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Configuration File

Primary: `/etc/lakshmi/odin/config.yaml`

```yaml
odin:
  instance_id: "odin01-mum"
  data_center: "mumbai"

adapters:
  - id: "nse_neat_primary"
    type: "nse_neat"
    exchange: "NSE"
    segments: ["CM", "FO", "CD"]
    priority: 1
    connection:
      host: "192.168.10.100"
      port: 9001
      fix_version: "FIX.4.4"
      sender_comp_id: "LAKSHMI"
      target_comp_id: "NSE"
      heartbeat_interval_sec: 30
      reconnect_interval_sec: 5

  - id: "nse_diet_backup"
    type: "odin_diet"
    exchange: "NSE"
    segments: ["CM", "FO", "CD"]
    priority: 2
    connection:
      host: "192.168.10.200"
      port: 9001
      timeout_ms: 5000

  - id: "bse_bolt_primary"
    type: "bse_bolt"
    exchange: "BSE"
    segments: ["CM", "FO"]
    priority: 1
    connection:
      host: "192.168.20.100"
      port: 9002

  - id: "mcx_nest"
    type: "omnesys_nest"
    exchange: "MCX"
    segments: ["COM"]
    priority: 1
    connection:
      host: "192.168.30.100"
      port: 9000

validation:
  price_band_check: true
  quantity_check: true
  rms_check: true
  rms_endpoint: "rms.internal:50090"
  rms_timeout_ms: 100
  rate_limiter:
    enabled: true
    default_rate: 100     # orders/sec per client
    burst_size: 200

routing:
  failover_timeout_ms: 500
  max_retry_per_adapter: 2
  fallback_on_timeout: true

execution:
  normalize_timestamps: true
  timestamp_source: "exchange"  # or "odin" (local)

reconciliation:
  enabled: true
  schedule: "15:45 IST"
  exchange_sftp:
    host: "sftp.exchange.internal"
    port: 22
    user: "lakshmi_odin"
    key_file: "/etc/lakshmi/odin/sftp_key"
  report_dir: "/opt/lakshmi/odin/reports"

mq:
  brokers: ["mq01-mum:9092", "mq02-mum:9092"]
  client_id: "odin01-mum"
  subscribe_topics:
    - "orders.*"
    - "orders.modify.*"
    - "orders.cancel.*"
  publish_topics:
    executions: "executions.{exchange}.{segment}"

database:
  host: "pg-odin.internal"
  port: 5432
  dbname: "odin_orders"
  user: "odin_app"
  password_env: "ODIN_DB_PASSWORD"
  pool_size: 20
  connect_timeout_ms: 5000

narad:
  agent_address: "localhost:50060"

metrics:
  prometheus_port: 9195
```
