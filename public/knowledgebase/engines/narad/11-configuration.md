# 11 â€” Configuration Guide

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Configuration File

```json
{
  "server": {
    "port": 3003,
    "grpcPort": 50051,
    "wsPort": 3004,
    "host": "0.0.0.0",
    "trustProxy": true
  },
  "database": {
    "postgresql": {
      "host": "localhost",
      "port": 5432,
      "database": "narad",
      "user": "narad_app",
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
      "cluster": false
    }
  },
  "agent": {
    "heartbeatIntervalMs": 15000,
    "heartbeatTTLMs": 30000,
    "offlineAfterMissedHeartbeats": 10,
    "telemetryIntervalMs": 10000,
    "maxReconnectBackoffMs": 60000
  },
  "registry": {
    "autoDeregisterAfterSeconds": 86400,
    "maxServicesPerHost": 50
  },
  "deployment": {
    "defaultStrategy": "rolling",
    "healthCheckTimeoutMs": 300000,
    "rollbackOnFailure": true
  },
  "logCollector": {
    "batchSize": 500,
    "batchIntervalMs": 1000,
    "diskBufferMaxGb": 50,
    "elkUrl": "https://elk.algoiq.io:9200"
  },
  "monitoring": {
    "prometheusPort": 9091,
    "selfHealthCheckIntervalMs": 10000,
    "ecosystemHealthAggregationMs": 10000
  },
  "security": {
    "jwtSecret": "<from-suraksha-vault>",
    "approvalRequiredForProduction": true,
    "maxCommandTimeoutMs": 300000
  }
}
```

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NARAD_PG_PASSWORD` | PostgreSQL password | Yes |
| `NARAD_REDIS_PASSWORD` | Redis password | Yes |
| `NARAD_JWT_SECRET` | Suraksha JWT secret | Yes |
| `NARAD_VAULT_TOKEN` | Suraksha Vault token | Yes |
| `NARAD_GRPC_TLS_KEY` | gRPC mTLS private key path | Yes |
| `NARAD_GRPC_TLS_CERT` | gRPC mTLS certificate path | Yes |
| `NODE_ENV` | Environment | Yes |

## Port Allocation Policy

| Port Range | Allocation |
|---|---|
| 3000â€“3999 | Engine REST APIs |
| 5000â€“5999 | gRPC services |
| 6000â€“6999 | WebSocket services |
| 9000â€“9999 | Management/monitoring |
| 10000â€“19999 | Dynamic/application ports |

## Agent Configuration

Each Narad Agent has a minimal config:

```json
{
  "controlPlane": {
    "hosts": ["narad-cp1.algoiq.io:50051", "narad-cp2.algoiq.io:50051"],
    "tlsCert": "/etc/narad/agent.crt",
    "tlsKey": "/etc/narad/agent.key"
  },
  "server": {
    "hostname": "ganesh-prod-1",
    "ip": "10.0.1.50",
    "roles": ["engine", "database-client"]
  },
  "telemetry": {
    "intervalMs": 10000,
    "collectProcessList": true
  }
}
```
