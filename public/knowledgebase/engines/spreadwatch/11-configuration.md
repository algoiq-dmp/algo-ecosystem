# SpreadWatch — Configuration Reference

**Version:** 2.8.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## Configuration Parameters

SpreadWatch configuration is managed via Narad config store and supports environment variable overrides.

## Core Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `SPREADWATCH_PORT` | int | 3022 | Primary API port |
| `SPREADWATCH_MQ_HOST` | string | localhost | RabbitMQ host address |
| `SPREADWATCH_MQ_PORT` | int | 5672 | RabbitMQ port |
| `SPREADWATCH_DB_URL` | string | — | Primary database connection string |
| `SPREADWATCH_REDIS_URL` | string | — | Redis connection string |
| `SPREADWATCH_LOG_LEVEL` | string | info | Logging level (debug/info/warn/error) |
| `SPREADWATCH_NARAD_URL` | string | http://narad:3100 | Narad connector URL |
| `SPREADWATCH_SURAKSHA_URL` | string | http://suraksha:3110 | Suraksha auth URL |
| `SPREADWATCH_MAX_WORKERS` | int | 4 | Worker thread pool size |
| `SPREADWATCH_BATCH_SIZE` | int | 1000 | Processing batch size |
| `SPREADWATCH_RATE_LIMIT` | int | 1000 | Max requests/min per client |
| `SPREADWATCH_CACHE_TTL` | int | 300 | Cache TTL in seconds |

## Environment Overrides

Configuration follows this precedence (highest to lowest):
1. Environment variables (`SPREADWATCH_*`)
2. Narad config store values
3. Local config file (`/etc/spreadwatch/config.yaml`)
4. Built-in defaults

## Sample Configuration

```yaml
# /etc/spreadwatch/config.yaml
server:
  host: "0.0.0.0"
  port: 3022
  read_timeout: 30s
  write_timeout: 30s

database:
  host: "192.168.190.104"
  port: 5432
  name: "spreadwatch_db"
  pool_size: 50

messaging:
  mq_host: "192.168.190.118"
  mq_port: 5672
  exchange: "algo.market"
  consumer_tag: "spreadwatch-consumer"

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
