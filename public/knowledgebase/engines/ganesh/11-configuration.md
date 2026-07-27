# 11 â€” Configuration Guide

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Configuration File

Ganesh uses a JSON configuration file, typically located at `/etc/ganesh/config.json` or `./config.json` for local development.

```json
{
  "server": {
    "port": 3002,
    "host": "0.0.0.0",
    "trustProxy": true
  },
  "redis": {
    "host": "localhost",
    "port": 6379,
    "password": "<from-vault>",
    "tls": true,
    "cluster": false,
    "clusterNodes": [],
    "maxRetries": 5,
    "retryDelayMs": 1000
  },
  "postgresql": {
    "host": "localhost",
    "port": 5432,
    "database": "ganesh",
    "user": "ganesh_app",
    "password": "<from-vault>",
    "poolMin": 5,
    "poolMax": 20,
    "ssl": true
  },
  "rabbitmq": {
    "urls": ["amqps://user:pass@mq1:5671", "amqps://user:pass@mq2:5671"],
    "exchange": "market.ticks",
    "queuePrefix": "ganesh.tick.",
    "prefetch": 250,
    "heartbeat": 30
  },
  "aggregation": {
    "timeframes": ["1m", "5m", "15m", "1H", "1D"],
    "ringBufferSize": 100000,
    "workerThreads": 7,
    "postgresBatchSize": 500,
    "postgresFlushIntervalMs": 1000
  },
  "cache": {
    "barTtlDays": 90,
    "rangeQueryMaxBars": 10000
  },
  "security": {
    "jwtSecret": "<from-suraksha-vault>",
    "rateLimitPerConsumer": 100,
    "rateLimitWindowMs": 1000
  },
  "monitoring": {
    "prometheusPort": 9090,
    "logLevel": "info",
    "logFormat": "json"
  },
  "corporateActions": {
    "enabled": true,
    "suryaQueue": "corp.actions.ganesh",
    "adjustmentTimeoutMs": 30000
  }
}
```

## Environment Variables

Sensitive values SHOULD be injected via environment variables, not the config file:

| Variable | Description | Required |
|---|---|---|
| `GANESH_REDIS_PASSWORD` | Redis AUTH password | Yes |
| `GANESH_PG_PASSWORD` | PostgreSQL password | Yes |
| `GANESH_MQ_PASSWORD` | RabbitMQ password | Yes |
| `GANESH_JWT_SECRET` | Suraksha JWT signing secret | Yes |
| `GANESH_VAULT_TOKEN` | Suraksha Vault access token | Yes |
| `NODE_ENV` | Environment: `development`, `staging`, `production` | Yes |

## Timeframe Configuration

Each timeframe can be customized with override settings:

```json
"timeframeOverrides": {
  "1m": {
    "barDurationMs": 60000,
    "alignToMarketHours": true
  },
  "1D": {
    "barDurationMs": 86400000,
    "alignToMarketHours": true,
    "excludeWeekends": true
  }
}
```

## Symbol Configuration

```json
"symbolDefaults": {
  "defaults": {
    "lotSize": 1,
    "tickSize": 0.05
  },
  "overrides": {
    "RELIANCE": { "lotSize": 250, "tickSize": 0.05 },
    "BANKNIFTY": { "lotSize": 15, "tickSize": 0.05 }
  }
}
```

## Configuration Validation

```powershell
node scripts/validate-config.js --config ./config.json
```

This checks: required keys present, valid ports, reachable databases, correct Redis cluster config, and valid timeframe strings.
