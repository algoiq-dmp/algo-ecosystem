# TalkOptions Platform — Configuration Reference

**Version:** 4.7.2 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## Configuration Parameters

TalkOptions Platform configuration is managed via Narad config store and supports environment variable overrides.

## Core Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `TALKOPTIONS_PORT` | int | 8081 | Primary API port |
| `TALKOPTIONS_MQ_HOST` | string | localhost | RabbitMQ host address |
| `TALKOPTIONS_MQ_PORT` | int | 5672 | RabbitMQ port |
| `TALKOPTIONS_DB_URL` | string | — | Primary database connection string |
| `TALKOPTIONS_REDIS_URL` | string | — | Redis connection string |
| `TALKOPTIONS_LOG_LEVEL` | string | info | Logging level (debug/info/warn/error) |
| `TALKOPTIONS_NARAD_URL` | string | http://narad:3100 | Narad connector URL |
| `TALKOPTIONS_SURAKSHA_URL` | string | http://suraksha:3110 | Suraksha auth URL |
| `TALKOPTIONS_MAX_WORKERS` | int | 4 | Worker thread pool size |
| `TALKOPTIONS_BATCH_SIZE` | int | 1000 | Processing batch size |
| `TALKOPTIONS_RATE_LIMIT` | int | 1000 | Max requests/min per client |
| `TALKOPTIONS_CACHE_TTL` | int | 300 | Cache TTL in seconds |

## Environment Overrides

Configuration follows this precedence (highest to lowest):
1. Environment variables (`TALKOPTIONS_*`)
2. Narad config store values
3. Local config file (`/etc/talkoptions/config.yaml`)
4. Built-in defaults

## Sample Configuration

```yaml
# /etc/talkoptions/config.yaml
server:
  host: "0.0.0.0"
  port: 8081
  read_timeout: 30s
  write_timeout: 30s

database:
  host: "192.168.190.118"
  port: 5432
  name: "talkoptions_db"
  pool_size: 50

messaging:
  mq_host: "192.168.190.118"
  mq_port: 5672
  exchange: "algo.market"
  consumer_tag: "talkoptions-consumer"

narad:
  url: "http://192.168.190.104:3100"
  heartbeat_interval: 5s
  register_on_startup: true

suraksha:
  url: "http://192.168.190.106:3110"
  token_refresh: 300s
```

## Feature Flags

| Flag | Default | Description |
|------|---------|-------------|
| `ENABLE_MQ_PUBLISH` | true | Publish results to MQ |
| `ENABLE_WEBHOOKS` | true | Webhook callback delivery |
| `ENABLE_METRICS` | true | Prometheus metrics export |
| `ENABLE_RATE_LIMIT` | true | API rate limiting |
| `ENABLE_AUDIT_LOG` | true | Suraksha audit logging |
