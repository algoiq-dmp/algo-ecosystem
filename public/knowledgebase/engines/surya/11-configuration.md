# 11 — Configuration Guide

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Configuration Sources

| Priority | Source | Environment |
|---|---|---|
| 1 (highest) | Environment Variables | All |
| 2 | Consul KV Store | Production, Staging |
| 3 | `config.json` file | Development, Testing |
| 4 (lowest) | Default values | All |

---

## Main Configuration (`config.json`)

```json
{
  "server": {
    "port": 3005,
    "host": "0.0.0.0",
    "trustProxy": true
  },
  "auth": {
    "apiKeyHeader": "X-API-Key",
    "defaultRateLimit": 100,
    "adminApiKeys": ["${ADMIN_API_KEY}"]
  },
  "extranet": {
    "nse": {
      "enabled": true,
      "baseUrl": "https://extranet.nseindia.com/api/v2",
      "authType": "client_certificate",
      "certificatePath_env": "NSE_CERT_PATH",
      "certificateKeyPath_env": "NSE_KEY_PATH",
      "caPath_env": "NSE_CA_PATH",
      "rateLimitPerMinute": 10,
      "timeoutSec": 120,
      "maxConnections": 5,
      "retryAttempts": 5,
      "retryBackoffMs": 30000
    },
    "bse": {
      "enabled": true,
      "baseUrl": "https://mftp.bseindia.com/api/v1",
      "authType": "api_key",
      "apiKey_env": "BSE_API_KEY",
      "ipWhitelist": ["10.0.20.10", "10.0.20.11"],
      "rateLimitPerMinute": 20,
      "timeoutSec": 120,
      "maxConnections": 5,
      "retryAttempts": 5,
      "retryBackoffMs": 30000
    }
  },
  "pipeline": {
    "workers": 2,
    "maxConcurrentDownloads": 3,
    "stagingDir": "/data/surya/staging",
    "normalizedDir": "/data/surya/normalized",
    "emergencyDir": "/data/surya/emergency",
    "cleanupStagingHours": 24,
    "schedulerLockTtlMs": 600000
  },
  "minio": {
    "endPoint": "minio1.algoiq.internal",
    "port": 9000,
    "useSSL": false,
    "accessKey_env": "MINIO_ACCESS_KEY",
    "secretKey_env": "MINIO_SECRET_KEY",
    "bucket": "surya-files",
    "stagingBucket": "surya-staging",
    "region": "ap-south-1",
    "partSize": 10485760
  },
  "postgresql": {
    "host": "pg-ro.algoiq.internal",
    "port": 5432,
    "database": "surya",
    "username": "surya_app",
    "password_env": "PG_PASSWORD",
    "poolMin": 5,
    "poolMax": 25,
    "idleTimeoutMs": 30000
  },
  "redis": {
    "sentinels": [
      { "host": "redis-sentinel-1.algoiq.internal", "port": 26379 },
      { "host": "redis-sentinel-2.algoiq.internal", "port": 26379 }
    ],
    "masterName": "surya-redis-master",
    "password_env": "REDIS_PASSWORD",
    "db": 0,
    "keyPrefix": "surya:"
  },
  "rabbitmq": {
    "hosts": ["mq1.algoiq.internal"],
    "port": 5672,
    "vhost": "surya",
    "username": "surya_svc",
    "password_env": "MQ_PASSWORD"
  },
  "validation": {
    "structural": {
      "rowCountMaxDeviationPct": 50,
      "headerMatchMode": "exact"
    },
    "business": {
      "priceMin": 0.01,
      "priceMax": 1000000.00,
      "lotSizeMin": 1,
      "lotSizeMax": 100000
    },
    "crossFile": {
      "enabled": true,
      "lookbackDays": 7
    }
  },
  "scheduler": {
    "timezone": "Asia/Kolkata",
    "weekdaysOnly": true,
    "earlyMorningStart": "06:00",
    "eveningEnd": "18:00"
  },
  "monitoring": {
    "enabled": true,
    "metricsPort": 9090,
    "fileDeadlineCheckIntervalSec": 60,
    "alertEscalation": {
      "warningAfterMin": 0,
      "criticalAfterMin": 15
    }
  },
  "notifications": {
    "slack_webhook_env": "SLACK_WEBHOOK_URL",
    "pagerduty_key_env": "PAGERDUTY_KEY",
    "email": {
      "smtpHost": "smtp.algoiq.com",
      "fromAddress": "surya-alerts@algoiq.com",
      "opsTeamEmail": "operations@algoiq.com"
    }
  },
  "logging": {
    "level": "info",
    "format": "json",
    "outputs": ["stdout", "elasticsearch"],
    "elasticsearch": {
      "hosts": ["es1.algoiq.internal:9200"],
      "index": "surya-logs"
    }
  }
}
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | `development`, `staging`, or `production` |
| `NSE_CERT_PATH` | Yes (prod) | Path to NSE extranet client certificate |
| `NSE_KEY_PATH` | Yes (prod) | Path to NSE extranet private key |
| `NSE_CA_PATH` | Yes (prod) | Path to NSE CA certificate |
| `BSE_API_KEY` | Yes (prod) | BSE MFTP API key |
| `PG_PASSWORD` | Yes | PostgreSQL password |
| `REDIS_PASSWORD` | Yes | Redis password |
| `MQ_PASSWORD` | Yes | RabbitMQ password |
| `MINIO_ACCESS_KEY` | Yes | MinIO access key |
| `MINIO_SECRET_KEY` | Yes | MinIO secret key |
| `ADMIN_API_KEY` | Yes | Admin API key hash |
| `VAULT_ADDR` | Yes (prod) | HashiCorp Vault address |
| `VAULT_TOKEN` | Yes (prod) | Vault authentication token |
| `SLACK_WEBHOOK_URL` | No | Slack notification webhook |
| `PAGERDUTY_KEY` | No | PagerDuty integration key |

---

## File Type Configuration (Database-Driven)

File types are configured in the `file_types` database table, not in static config:

```sql
INSERT INTO file_types (file_type_code, file_type_name, exchange, schedule, ...) VALUES
('SEC_TOK', 'Security Token', 'NSE', 'BOD', '{"rowCountMin": 5000, "rowCountMaxDeviationPct": 30}', ...);
```

Changes to file type configs are picked up within 60 seconds via Redis-based hot reload.

---

## Environment-Specific Overrides

### Development

```json
{
  "logging": { "level": "debug", "format": "pretty" },
  "validation": { "structural": { "rowCountMaxDeviationPct": 100 } },
  "monitoring": { "enabled": false },
  "extranet": {
    "nse": { "baseUrl": "https://mock-extranet.local/nse" },
    "bse": { "baseUrl": "https://mock-extranet.local/bse" }
  },
  "scheduler": { "enabled": false }
}
```

### Staging

```json
{
  "logging": { "level": "debug" },
  "extranet": {
    "nse": { "baseUrl": "https://uat-extranet.nseindia.com/api/v2" },
    "bse": { "baseUrl": "https://uat-mftp.bseindia.com/api/v1" }
  }
}
```

---

## Feature Flags

| Flag | Default | Description |
|---|---|---|
| `parquet-generation` | `true` | Generate Parquet alongside CSV |
| `cross-file-validation` | `true` | Enable Layer 3 cross-file validation |
| `presigned-urls` | `true` | Allow presigned URL downloads |
| `webhook-notifications` | `true` | Notify downstream engines on file ready |
| `auto-retry-on-failure` | `true` | Auto-retry failed fetches |
| `deduplication` | `true` | Enable content-based deduplication in MinIO |
