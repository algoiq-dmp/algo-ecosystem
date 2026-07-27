# 11 — Configuration

## Configuration File: `config.json`

Lakshmi reads its configuration from `config.json` in the application root directory. A template file `config.example.json` is provided in the repository.

---

## Complete Configuration Schema

```json
{
  "environment": "production",
  "mq": {
    "host": "localhost",
    "port": 5672,
    "vhost": "/",
    "username": "lakshmi",
    "password": "${MQ_PASSWORD}",
    "heartbeat": 30,
    "connectionTimeout": 10000,
    "confirmTimeout": 5000,
    "maxChannels": 50,
    "prefetch": 50
  },
  "websocket": {
    "enabled": true,
    "host": "0.0.0.0",
    "port": 3001,
    "path": "/stream",
    "maxConnections": 5000,
    "heartbeatInterval": 15000,
    "maxPayloadSize": 65536,
    "compression": true
  },
  "redis": {
    "host": "localhost",
    "port": 6379,
    "db": 0,
    "password": "${REDIS_PASSWORD}",
    "keyPrefix": "lak:",
    "connectionPool": {
      "min": 5,
      "max": 50
    },
    "retryStrategy": {
      "maxAttempts": 10,
      "baseDelayMs": 100
    }
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "database": "lakshmi",
    "username": "lakshmi_app",
    "password": "${DB_PASSWORD}",
    "pool": {
      "min": 5,
      "max": 30,
      "idleTimeoutMs": 30000
    },
    "ssl": false
  },
  "influxdb": {
    "enabled": true,
    "url": "http://localhost:8083",
    "token": "${INFLUX_TOKEN}",
    "org": "algo-iq",
    "bucket": "lakshmi_metrics",
    "batchSize": 5000,
    "flushInterval": 5000
  },
  "monitoring": {
    "enabled": true,
    "metricsPort": 9090,
    "healthPort": 3001,
    "interval": 10000,
    "alertWebhook": "https://hooks.slack.com/services/xxx",
    "alertThresholds": {
      "errorRate": 0.01,
      "latencyP99Ms": 10,
      "queueDepth": 100000,
      "connectionDrop": 0.1
    }
  },
  "security": {
    "tls": {
      "enabled": true,
      "certPath": "/certs/lakshmi.crt",
      "keyPath": "/certs/lakshmi.key",
      "caPath": "/certs/ca.crt",
      "minVersion": "TLSv1.3"
    },
    "apiKeyHeader": "X-API-Key",
    "surakshaUrl": "https://suraksha.algoiq.internal/validate",
    "authCacheTtl": 300,
    "rateLimit": {
      "enabled": true,
      "maxRequestsPerMinute": 100,
      "burstSize": 20
    }
  },
  "topics": {
    "maxDepth": 10,
    "allowWildcard": true,
    "defaultPartitions": 4,
    "defaultMaxMessageSize": 65536
  },
  "retry": {
    "strategy": "exponential",
    "maxAttempts": 5,
    "baseDelayMs": 100,
    "maxDelayMs": 10000,
    "factor": 2
  },
  "logging": {
    "level": "info",
    "format": "json",
    "outputs": ["console", "file"],
    "filePath": "/logs/lakshmi.log",
    "maxFileSizeMb": 100,
    "maxFiles": 10,
    "auditEnabled": true
  }
}
```

---

## Environment Variables

All configuration values can be overridden via environment variables using the `LAKSHMI_` prefix with double-underscore path separator.

| Environment Variable | Config Path | Example |
|---|---|---|
| `LAKSHMI_ENV` | `environment` | `production` |
| `LAKSHMI_MQ__HOST` | `mq.host` | `rabbitmq-01.internal` |
| `LAKSHMI_MQ__PORT` | `mq.port` | `5672` |
| `LAKSHMI_MQ__PASSWORD` | `mq.password` | `s3cr3t` |
| `LAKSHMI_WS__PORT` | `websocket.port` | `3001` |
| `LAKSHMI_REDIS__HOST` | `redis.host` | `redis.internal` |
| `LAKSHMI_REDIS__PASSWORD` | `redis.password` | `s3cr3t` |
| `LAKSHMI_DB__HOST` | `database.host` | `pg.internal` |
| `LAKSHMI_DB__PASSWORD` | `database.password` | `s3cr3t` |
| `LAKSHMI_INFLUX__TOKEN` | `influxdb.token` | `tok-xxx` |
| `LAKSHMI_LOG__LEVEL` | `logging.level` | `debug` |
| `LAKSHMI_SECURITY__TLS__ENABLED` | `security.tls.enabled` | `true` |

### Priority Order

1. Environment variables (highest)
2. `config.json` file
3. Default values in code (lowest)

---

## Environment-Specific Configurations

### Development

```json
{
  "environment": "development",
  "logging": { "level": "debug", "format": "text" },
  "security": { "tls": { "enabled": false } },
  "monitoring": { "alertWebhook": "" }
}
```

### Staging

```json
{
  "environment": "staging",
  "mq": { "host": "mq-staging.internal" },
  "redis": { "host": "redis-staging.internal" },
  "database": { "host": "pg-staging.internal", "ssl": true }
}
```

### Production

```json
{
  "environment": "production",
  "mq": { "host": "mq-prod.internal" },
  "redis": { "host": "redis-prod.internal" },
  "database": { "host": "pg-prod.internal", "ssl": true },
  "influxdb": { "url": "http://influx-prod.internal:8083" }
}
```

---

## Default Values

If a configuration key is not specified in `config.json` or environment variables, the following defaults are applied:

| Key | Default |
|---|---|
| `mq.host` | `localhost` |
| `mq.port` | `5672` |
| `mq.heartbeat` | `30` |
| `websocket.port` | `3001` |
| `websocket.maxConnections` | `5000` |
| `redis.host` | `localhost` |
| `redis.port` | `6379` |
| `redis.db` | `0` |
| `redis.keyPrefix` | `lak:` |
| `database.host` | `localhost` |
| `database.port` | `5432` |
| `monitoring.metricsPort` | `9090` |
| `monitoring.interval` | `10000` |
| `security.tls.enabled` | `true` |
| `retry.strategy` | `exponential` |
| `retry.maxAttempts` | `5` |
| `logging.level` | `info` |

---

## Validation

On startup, Lakshmi validates the configuration:
- Required fields must be present (or provided via environment variables).
- Ports must be in the range 1024–65535.
- Connection pool sizes must be >= 1.
- TLS cert/key paths must exist if TLS is enabled.
- InfluxDB token must be non-empty if InfluxDB is enabled.

Invalid configuration causes the process to exit with code `1` and an error message describing the issue.
