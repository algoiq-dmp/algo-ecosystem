# 03 — Installation & Setup

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## System Requirements

| Resource | Minimum | Recommended |
|---|---|---|
| CPU | 8 cores | 16+ cores |
| RAM | 16 GB | 32 GB |
| Storage | 50 GB SSD | 200 GB SSD |
| Node.js | 18.x | 20.x LTS |
| MongoDB | 6.0 | 7.0 |
| Redis | 6.x | 7.2 |
| RabbitMQ | 3.11 | 3.12 |

## Installation

### Docker Compose

```yaml
services:
  kuber-alpha:
    image: algo-iq/kuber-alpha:1.8.0
    ports:
      - "8081:8081"
    environment:
      - MONGO_URI=mongodb://mongo:27017/kuber-alpha
      - REDIS_URI=redis://redis:6379
      - MQ_URI=amqp://rabbitmq:5672
      - VEGA_URI=https://vega.internal:8082
      - KILL_SWITCH_MARGIN=1.01
      - NODE_ENV=production
    depends_on:
      - mongo
      - redis
      - rabbitmq
```

### Kubernetes

```bash
helm install kuber-alpha algo-iq/kuber-alpha \
  --set image.tag=1.8.0 \
  --set killSwitch.marginPercent=1.01 \
  --set vega.uri=https://vega-service:8082
```

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `8081` | HTTP server port |
| `MONGO_URI` | Yes | — | MongoDB connection string |
| `REDIS_URI` | Yes | — | Redis connection string |
| `MQ_URI` | Yes | — | RabbitMQ connection string |
| `VEGA_URI` | Yes | — | Vega execution engine endpoint |
| `KILL_SWITCH_MARGIN` | No | `1.01` | Kill switch trigger threshold (%) |
| `MAX_STRATEGIES` | No | `50` | Maximum concurrent strategies |
| `MAX_POSITIONS` | No | `100` | Maximum total open positions |
| `SIGNAL_TIMEOUT_MS` | No | `30000` | Signal processing timeout |
| `STATE_SNAPSHOT_INTERVAL` | No | `5000` | Redis snapshot interval (ms) |
| `JWT_SECRET` | Yes | — | JWT signing key |
| `LOG_LEVEL` | No | `info` | Logging verbosity |

## Key Directories

| Path | Purpose |
|---|---|
| `/data/strategies` | Strategy definition cache |
| `/data/state` | State snapshot storage |
| `/logs` | Application logs |
| `/config` | Configuration files |

## Verification

```bash
curl http://localhost:8081/health
# {"status":"healthy","version":"1.8.0","uptime":3600,"strategiesActive":5,"killSwitchArmed":true}

curl http://localhost:8081/v1/strategies
# {"total":5,"active":3,"paused":1,"paper":1}
```

## Database Collections

| Collection | Purpose |
|---|---|
| `strategies` | Strategy registry and definitions |
| `deployments` | Deployment history and status |
| `signals` | Incoming signal log (TTL: 7 days) |
| `trades` | Order dispatch records |
| `capital_allocations` | Capital allocation snapshots |
| `kill_switch_events` | Kill Switch trigger history |
| `audit_log` | Immutable audit trail |
