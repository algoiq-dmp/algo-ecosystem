# TalkOffice — Configuration Reference

**Version:** 4.0.0 | **Owner:** Operations | **Last Updated:** 2026-07-25

## Configuration Parameters

TalkOffice configuration is managed via Narad config store and supports environment variable overrides.

## Core Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `TALKOFFICE_PORT` | int | 3080 | Primary API port |
| `TALKOFFICE_MQ_HOST` | string | localhost | RabbitMQ host address |
| `TALKOFFICE_MQ_PORT` | int | 5672 | RabbitMQ port |
| `TALKOFFICE_DB_URL` | string | — | Primary database connection string |
| `TALKOFFICE_REDIS_URL` | string | — | Redis connection string |
| `TALKOFFICE_LOG_LEVEL` | string | info | Logging level (debug/info/warn/error) |
| `TALKOFFICE_NARAD_URL` | string | http://narad:3100 | Narad connector URL |
| `TALKOFFICE_SURAKSHA_URL` | string | http://suraksha:3110 | Suraksha auth URL |
| `TALKOFFICE_MAX_WORKERS` | int | 4 | Worker thread pool size |
| `TALKOFFICE_BATCH_SIZE` | int | 1000 | Processing batch size |
| `TALKOFFICE_RATE_LIMIT` | int | 1000 | Max requests/min per client |
| `TALKOFFICE_CACHE_TTL` | int | 300 | Cache TTL in seconds |

## Environment Overrides

Configuration follows this precedence (highest to lowest):
1. Environment variables (`TALKOFFICE_*`)
2. Narad config store values
3. Local config file (`/etc/talkoffice/config.yaml`)
4. Built-in defaults

## Sample Configuration

```yaml
# /etc/talkoffice/config.yaml
server:
  host: "0.0.0.0"
  port: 3080
  read_timeout: 30s
  write_timeout: 30s

database:
  host: "192.168.190.119"
  port: 5432
  name: "talkoffice_db"
  pool_size: 50

messaging:
  mq_host: "192.168.190.118"
  mq_port: 5672
  exchange: "algo.market"
  consumer_tag: "talkoffice-consumer"

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
