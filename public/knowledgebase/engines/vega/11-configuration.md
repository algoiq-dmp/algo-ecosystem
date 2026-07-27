# 11 — Configuration Guide

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Configuration Sources

Vega supports multiple configuration backends, resolved in priority order:

| Priority | Source | Environment |
|---|---|---|
| 1 (highest) | Environment Variables | All |
| 2 | Consul KV Store | Production, Staging |
| 3 | `config.json` file | Development, Testing |
| 4 (lowest) | Default values in code | All |

---

## Main Configuration (`config.json`)

```json
{
  "server": {
    "port": 3003,
    "grpcPort": 3004,
    "host": "0.0.0.0",
    "trustProxy": true,
    "corsOrigins": ["https://algoiq.com", "https://admin.algoiq.com"]
  },
  "auth": {
    "hmacAlgorithm": "sha256",
    "timestampDriftMs": 5000,
    "apiKeyHeader": "X-API-Key",
    "signatureHeader": "X-Signature",
    "timestampHeader": "X-Timestamp"
  },
  "rateLimit": {
    "enabled": true,
    "defaultTier": "standard",
    "tiers": {
      "standard": { "rate": 500, "burst": 1000 },
      "premium": { "rate": 1000, "burst": 2000 },
      "admin": { "rate": 2000, "burst": 5000 }
    }
  },
  "rabbitmq": {
    "hosts": ["mq1.algoiq.internal", "mq2.algoiq.internal", "mq3.algoiq.internal"],
    "port": 5672,
    "vhost": "vega",
    "username": "vega_svc",
    "password_env": "MQ_PASSWORD",
    "exchange": "vega.orders",
    "prefetch": 50,
    "reconnectTimeoutMs": 5000,
    "heartbeatSeconds": 30
  },
  "redis": {
    "sentinels": [
      { "host": "redis-sentinel-1.algoiq.internal", "port": 26379 },
      { "host": "redis-sentinel-2.algoiq.internal", "port": 26379 },
      { "host": "redis-sentinel-3.algoiq.internal", "port": 26379 }
    ],
    "masterName": "vega-redis-master",
    "password_env": "REDIS_PASSWORD",
    "db": 0,
    "keyPrefix": "vega:"
  },
  "postgresql": {
    "host": "pg-ro.algoiq.internal",
    "port": 5432,
    "database": "vega",
    "username": "vega_app",
    "password_env": "PG_PASSWORD",
    "poolMin": 10,
    "poolMax": 50,
    "idleTimeoutMs": 30000,
    "statementTimeoutMs": 5000
  },
  "brokers": {
    "xts": {
      "enabled": true,
      "fixHost": "fix.xtsbroker.com",
      "fixPort": 9200,
      "senderCompId": "VEGA-PROD-01",
      "targetCompId": "XTS-BROKER",
      "fixVersion": "FIX.4.4",
      "heartbeatSec": 30,
      "reconnectBaseMs": 1000,
      "reconnectMaxMs": 30000
    },
    "greeksoft": {
      "enabled": true,
      "fixHost": "fix.greeksoft.com",
      "fixPort": 9201,
      "senderCompId": "VEGA-PROD-01",
      "targetCompId": "GREEKSOFT",
      "fixVersion": "FIX.5.0SP2",
      "heartbeatSec": 30,
      "restBaseUrl": "https://api.greeksoft.com/v2",
      "restFallback": true
    }
  },
  "killSwitch": {
    "enabled": true,
    "thresholdPct": 0.015,
    "evaluationIntervalMs": 100,
    "autoReset": false,
    "alertChannels": ["pagerduty", "slack", "email"]
  },
  "orderProcessor": {
    "workers": 2,
    "maxConcurrentOrders": 50000,
    "idempotencyTtlSec": 86400,
    "stateTimeoutMs": 30000
  },
  "audit": {
    "enabled": true,
    "eventTypes": ["ORDER_CREATED", "ORDER_VALIDATED", "ORDER_ROUTED", "BROKER_ACK", "ORDER_FILLED", "ORDER_CANCELLED", "ORDER_REJECTED", "KILL_SWITCH"],
    "retentionDays": 365
  },
  "logging": {
    "level": "info",
    "format": "json",
    "outputs": ["stdout", "elasticsearch"],
    "elasticsearch": {
      "hosts": ["es1.algoiq.internal:9200"],
      "index": "vega-logs"
    }
  },
  "monitoring": {
    "enabled": true,
    "metricsPort": 9090,
    "tracingEndpoint": "http://jaeger.algoiq.internal:4317",
    "healthCheckIntervalMs": 5000
  },
  "trading": {
    "marketOpen": "09:15",
    "marketClose": "15:30",
    "timezone": "Asia/Kolkata",
    "preOpenStart": "09:00",
    "allowedExchanges": ["NSE", "BSE", "NFO", "MCX"],
    "priceBandPct": 20,
    "maxOrderQuantity": 100000,
    "blockedSymbols": []
  }
}
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | `development`, `staging`, or `production` |
| `MQ_PASSWORD` | Yes | RabbitMQ password |
| `REDIS_PASSWORD` | Yes | Redis password |
| `PG_PASSWORD` | Yes | PostgreSQL password |
| `VAULT_TOKEN` | Yes (prod) | HashiCorp Vault token for credential decryption |
| `XTS_CREDENTIAL_KEY` | Yes | Encryption key for XTS credentials |
| `GREEKSOFT_CREDENTIAL_KEY` | Yes | Encryption key for Greeksoft credentials |
| `API_SECRET_KEY` | Yes | Master key for HMAC signature verification |
| `PAGERDUTY_KEY` | No | PagerDuty integration key |
| `SLACK_WEBHOOK_URL` | No | Slack alert webhook |
| `CONSUL_HTTP_ADDR` | No | Consul agent address |
| `LOG_LEVEL` | No | Override log level |

---

## Consul KV Structure (Production)

```
vega/
├── config/
│   ├── server/port          → 3003
│   ├── broker/xts/host      → fix.xtsbroker.com
│   ├── broker/xts/port      → 9200
│   ├── killswitch/threshold → 0.015
│   └── trading/marketOpen   → 09:15
├── credentials/
│   ├── xts/api-key          → (encrypted)
│   └── greeksoft/cert       → (encrypted)
└── feature-flags/
    ├── greeksoft-rest-fallback → true
    └── order-slicing           → false
```

---

## Environment-Specific Overrides

### Development

```json
{
  "logging": { "level": "debug", "format": "pretty" },
  "brokers": {
    "xts": { "fixHost": "fix-sim.xtsbroker.com", "fixPort": 19200 },
    "greeksoft": { "fixHost": "fix-sim.greeksoft.com", "fixPort": 19201 }
  },
  "killSwitch": { "enabled": false },
  "rateLimit": { "enabled": false }
}
```

### Staging

```json
{
  "logging": { "level": "debug" },
  "brokers": {
    "xts": { "fixHost": "fix-uat.xtsbroker.com" },
    "greeksoft": { "fixHost": "fix-uat.greeksoft.com" }
  },
  "killSwitch": { "thresholdPct": 0.05 }
}
```

---

## Feature Flags

| Flag | Default | Description |
|---|---|---|
| `greeksoft-rest-fallback` | `true` | Enable REST fallback when FIX session drops |
| `order-slicing` | `false` | Enable TWAP/VWAP order slicing (v6.5.0+) |
| `gprc-enabled` | `true` | Enable gRPC endpoints alongside REST |
| `async-order-mode` | `true` | Use async order processing (202) vs sync (201) |
| `strict-fix-validation` | `true` | Validate FIX messages before transmit |
| `credential-auto-rotation` | `true` | Auto-rotate broker credentials daily |
