# 03 — Installation & Setup

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## System Requirements

| Resource | Minimum | Recommended |
|---|---|---|
| CPU | 4 cores | 8+ cores |
| RAM | 8 GB | 16 GB |
| Storage | 20 GB SSD | 50 GB SSD |
| Node.js | 18.x | 20.x LTS |
| MongoDB | 6.0 | 7.0 |
| Redis | 6.x | 7.2 |

## Installation Methods

### Docker (Recommended)

```bash
docker pull algo-iq/strategy-factory:3.0.0
docker run -d \
  --name strategy-factory \
  -p 3000:3000 \
  -e MONGO_URI=mongodb://host:27017/strategy-factory \
  -e REDIS_URI=redis://host:6379 \
  -e MQ_URI=amqp://host:5672 \
  algo-iq/strategy-factory:3.0.0
```

### Kubernetes

```bash
helm repo add algo-iq https://charts.algo-iq.com
helm install strategy-factory algo-iq/strategy-factory \
  --set image.tag=3.0.0 \
  --set mongo.uri=mongodb://mongo-service:27017/strategy-factory
```

### Manual (Development)

```bash
git clone https://github.com/algo-iq/strategy-factory.git
cd strategy-factory
npm install
cp .env.example .env
```

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | HTTP server port |
| `MONGO_URI` | Yes | — | MongoDB connection string |
| `REDIS_URI` | Yes | — | Redis connection string |
| `MQ_URI` | Yes | — | RabbitMQ connection string |
| `PARIKSHAK_URI` | Yes | — | Parikshak engine endpoint |
| `SIMULATOR_URI` | Yes | — | Simulator engine endpoint |
| `DXCC_URI` | No | — | DXCC approval endpoint |
| `JWT_SECRET` | Yes | — | JWT signing key |
| `LOG_LEVEL` | No | `info` | Logging verbosity |
| `AUTO_SAVE_INTERVAL` | No | `5000` | Auto-save debounce in ms |
| `MAX_REVISIONS` | No | `50` | Version history limit |

## Health Check

```bash
curl http://localhost:3000/health
# {"status":"healthy","version":"3.0.0","uptime":3600}
```

## Verification

1. Open `http://localhost:3000` in your browser.
2. Log in with admin credentials.
3. Verify the canvas loads without errors.
4. Create a test strategy and validate it compiles.
