# 11 â€” Configuration Guide

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Configuration File

```json
{
  "server": {
    "port": 3004,
    "host": "0.0.0.0",
    "trustProxy": true
  },
  "vault": {
    "address": "https://vault.algoiq.io:8200",
    "token": "<from-environment>",
    "engine": "kv-v2",
    "timeout": 5000,
    "maxRetries": 3
  },
  "database": {
    "postgresql": {
      "host": "localhost",
      "port": 5432,
      "database": "suraksha",
      "user": "suraksha_app",
      "password": "<from-vault>",
      "poolMin": 10,
      "poolMax": 30,
      "ssl": true
    },
    "redis": {
      "host": "localhost",
      "port": 6379,
      "password": "<from-vault>",
      "tls": true,
      "cluster": true,
      "clusterNodes": ["redis-1:6379", "redis-2:6379", "redis-3:6379"]
    }
  },
  "jwt": {
    "algorithm": "RS256",
    "accessTokenTTL": 900,
    "refreshTokenTTL": 86400,
    "issuer": "suraksha.algoiq.io",
    "keyId": "suraksha-key-2026-07"
  },
  "rbac": {
    "cacheTTL": 60,
    "roleHierarchyMaxDepth": 5,
    "permissionWildcardSupport": true
  },
  "threatDetection": {
    "bruteForceThreshold": 10,
    "bruteForceWindowSec": 60,
    "tokenReplayDetection": true,
    "privilegeEscalationThreshold": 3,
    "privilegeEscalationWindowSec": 300,
    "apiAbuseThreshold": 1000,
    "apiAbuseWindowSec": 60
  },
  "certificates": {
    "defaultProvider": "letsencrypt",
    "renewBeforeExpiryDays": 30,
    "challengeType": "dns-01",
    "keyType": "ECDSA_P256"
  },
  "monitoring": {
    "prometheusPort": 9092,
    "logLevel": "info",
    "siemExportEnabled": true
  },
  "compliance": {
    "frameworks": ["SOC2", "ISO27001", "SEBI"],
    "accessReviewIntervalDays": 90,
    "reportRetentionYears": 7
  }
}
```

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `SURAKSHA_VAULT_TOKEN` | Vault access token | Yes |
| `SURAKSHA_PG_PASSWORD` | PostgreSQL password | Yes |
| `SURAKSHA_REDIS_PASSWORD` | Redis password | Yes |
| `SURAKSHA_JWT_KEY_ID` | Current JWT key ID | Yes |
| `NODE_ENV` | Environment | Yes |

## Security Hardening

- Config file permissions: `600` (owner read/write only).
- All secrets sourced from Vault, never in config or env.
- Config validation on startup; abort if invalid.
- TLS cert/key paths validated for existence and permissions.
- Minimum TLS version: 1.3, cipher suites restricted.
