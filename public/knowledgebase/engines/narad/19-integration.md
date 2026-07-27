# 19 â€” Integration Guide

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Overview

Every service in the Algo-IQ ecosystem MUST integrate with Narad for service discovery, health reporting, configuration management, and log collection.

## Integration Methods

| Method | When to Use |
|---|---|
| Narad Agent (auto) | Full integration: health, logs, telemetry via gRPC Agent on server |
| REST API (manual) | Service registration, heartbeat, config fetch |
| SDK (Node.js) | Programmatic registration, config subscription, log shipping |

## Automatic Integration via Narad Agent

If the Narad Agent is installed on the server, it automatically:
- Collects CPU, memory, disk, network telemetry.
- Ships application logs (stdout/stderr) to ELK.
- Monitors process liveness.

To add service-level metadata, register via API:

```bash
curl -X POST https://narad.algoiq.io/api/v1/registry/services \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-engine",
    "type": "engine",
    "version": "1.0.0",
    "owner": "ai-team",
    "host": "10.0.1.100",
    "port": 3007,
    "healthUrl": "/api/v1/health"
  }'
```

## SDK Integration (Node.js)

```bash
npm install @algoiq/narad-sdk
```

```javascript
const narad = require('@algoiq/narad-sdk');

await narad.init({
  serviceName: 'my-engine',
  serviceType: 'engine',
  host: process.env.HOST,
  port: process.env.PORT,
  healthUrl: '/api/v1/health',
  naradControlPlane: 'https://narad.algoiq.io'
});

// Auto-registers on init
// Auto-sends heartbeat every 15s
// Auto-deregisters on process exit

// Fetch config
const config = await narad.getConfig('production');
console.log(config);

// Subscribe to config changes
narad.onConfigChange((newConfig) => {
  console.log('Config updated:', newConfig);
  applyConfig(newConfig);
});
```

## Config Integration

Services MUST fetch their configuration from Narad on startup:

```javascript
async function bootstrap() {
  const config = await fetch(
    `https://narad.algoiq.io/api/v1/config/${SERVICE_NAME}?env=${ENV}`,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return config.json();
}
```

Services SHOULD subscribe to config changes via Redis Pub/Sub:

```javascript
const subscriber = redis.duplicate();
subscriber.subscribe(`config:change:${SERVICE_NAME}:${ENV}`, (err) => {
  if (!err) console.log('Subscribed to config changes');
});
subscriber.on('message', (channel, message) => {
  const newConfig = JSON.parse(message);
  applyConfig(newConfig);
});
```

## Heartbeat

Services MUST send heartbeats every 15 seconds:

```javascript
setInterval(async () => {
  await fetch(
    `https://narad.algoiq.io/api/v1/registry/services/${SERVICE_NAME}/heartbeat`,
    { method: 'PUT', headers: { Authorization: `Bearer ${getToken()}` } }
  );
}, 15000);
```

## Log Integration

Application logs written to stdout/stderr are automatically collected by the Narad Agent. For structured logs:

```javascript
console.log(JSON.stringify({
  level: 'info',
  component: 'bar-aggregator',
  message: 'Bar finalized',
  symbol: 'RELIANCE',
  timestamp: new Date().toISOString()
}));
```

## Consumer Registration

```bash
narad-cli register-consumer \
  --name "My Consumer Service" \
  --type "web-dashboard" \
  --contact "team@example.com"
```
