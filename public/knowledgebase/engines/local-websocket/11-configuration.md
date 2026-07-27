# 11 — Configuration

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Configuration File

Primary configuration: `/etc/lakshmi/ws-server/config.yaml`

```yaml
server:
  host: "0.0.0.0"
  port: 8080
  tls:
    enabled: true
    port: 8443
    cert_file: "/etc/lakshmi/certs/ws-server.crt"
    key_file: "/etc/lakshmi/certs/ws-server.key"
    ca_file: "/etc/lakshmi/certs/ca.crt"
  max_connections: 10000
  max_payload_bytes: 1048576  # 1 MB

mq:
  brokers: ["mq01-mum:9092", "mq02-mum:9092", "mq03-mum:9092"]
  client_id: "ws-server-01"
  consumer_group_prefix: "ws-server"
  session_timeout_ms: 30000
  heartbeat_interval_ms: 3000

auth:
  jwt:
    issuer: "suraksha-iam.internal"
    audience: "lakshmi-ws"
    algorithms: ["RS256", "ES256"]
    jwks_uri: "https://suraksha-iam.internal/.well-known/jwks.json"
    jwks_refresh_interval_sec: 3600
    clock_tolerance_sec: 30
  authorization:
    enabled: true
    cache_ttl_sec: 300
    cache_max_entries: 1000

serialization:
  default_format: "json"
  msgpack:
    enabled: true
  compression:
    per_message_deflate: true
    deflate_level: 1  # 0-9, lower = faster

throttling:
  default_rate_limit: 100  # messages per second per connection
  burst_size: 200
  strategy: "token_bucket"

backpressure:
  max_buffer_size: 16384    # bytes per connection
  strategy: "drop_oldest"   # drop_oldest | disconnect | none

heartbeat:
  interval_sec: 30
  timeout_sec: 90

cors:
  enabled: true
  allowed_origins:
    - "https://dashboard.lakshmi.internal"
    - "https://risk.lakshmi.internal"
    - "https://*.lakshmi.internal"

logging:
  level: "info"
  format: "json"  # json | pretty
  redact_sensitive: true

metrics:
  prometheus_port: 9193
  collect_default_metrics: true

narad:
  agent_address: "localhost:50060"

redis:  # optional
  enabled: false
  host: "redis.internal"
  port: 6379
  db: 0
  session_ttl_sec: 3600
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `WS_HOST` | `0.0.0.0` | Listen host |
| `WS_PORT` | `8080` | Listen port (HTTP/WS) |
| `WS_TLS_PORT` | `8443` | Listen port (HTTPS/WSS) |
| `WS_MQ_BROKERS` | — | Comma-separated MQ broker list |
| `WS_AUTH_JWKS_URI` | — | JWKS endpoint for JWT verification |
| `WS_LOG_LEVEL` | `info` | Log level override |
| `NODE_ENV` | `development` | `production` enables optimizations |

## Topic Configuration

MQ topics exposed via WebSocket are not individually configured in the WebSocket server. They are dynamically discovered from MQ. Authorization rules in Suraksha IAM determine which clients can access which topics.

## Runtime Configuration Reload

The server supports sending `SIGUSR1` to reload log level and throttling settings without dropping connections:

```bash
kill -SIGUSR1 $(pidof node)
```

Full configuration changes require a restart. Use rolling restart behind the load balancer for zero-downtime config updates.
