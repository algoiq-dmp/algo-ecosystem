# 03 — Installation & Setup

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## System Requirements

| Resource | Minimum | Recommended |
|---|---|---|
| CPU | 8 cores | 16+ cores |
| RAM | 16 GB | 32 GB |
| Storage | 100 GB SSD | 500 GB SSD |
| Node.js | 18.x | 20.x LTS |
| MongoDB | 6.0 | 7.0 |
| Redis | 6.x | 7.2 |
| Docker | 24.x | Latest stable |

## Installation

### Docker Compose (Recommended)

```yaml
version: "3.8"
services:
  parikshak-orchestrator:
    image: algo-iq/parikshak:2.0.0
    ports:
      - "8080:8080"
    environment:
      - MONGO_URI=mongodb://mongo:27017/parikshak
      - REDIS_URI=redis://redis:6379
      - MQ_URI=amqp://rabbitmq:5672
      - WORKER_COUNT=4
    depends_on:
      - mongo
      - redis
      - rabbitmq

  parikshak-worker:
    image: algo-iq/parikshak-worker:2.0.0
    environment:
      - MONGO_URI=mongodb://mongo:27017/parikshak
      - MQ_URI=amqp://rabbitmq:5672
    deploy:
      replicas: 4
```

### Kubernetes

```bash
helm install parikshak algo-iq/parikshak \
  --set image.tag=2.0.0 \
  --set workers.replicas=4 \
  --set mongo.uri=mongodb://mongo-service:27017/parikshak
```

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `8080` | HTTP server port |
| `MONGO_URI` | Yes | — | MongoDB connection string |
| `REDIS_URI` | Yes | — | Redis connection string |
| `MQ_URI` | Yes | — | RabbitMQ connection string |
| `WORKER_COUNT` | No | `4` | Number of worker processes |
| `MAX_CONCURRENT_SUITES` | No | `10` | Max parallel test suites |
| `TEST_TIMEOUT_MS` | No | `600000` | Max test suite duration (10 min) |
| `RETENTION_DAYS` | No | `90` | How long to keep test results |
| `JWT_SECRET` | Yes | — | JWT signing key |
| `LOG_LEVEL` | No | `info` | Logging verbosity |

## Worker Auto-Scaling

Parikshak workers auto-scale based on:
- **Queue Depth**: More than 5 pending suites → add 2 workers.
- **Average Suite Duration**: Exceeds 5 min → add 1 worker.
- **CPU Utilization**: > 80% on any worker → add workers.

Scale-down happens after 10 minutes of low utilization.

## Verification

```bash
curl http://localhost:8080/health
# {"status":"healthy","version":"2.0.0","workers":4,"queueDepth":0}

curl -X POST http://localhost:8080/v2/submit \
  -H "Content-Type: application/json" \
  -d '{"type": "ping", "testSuites": ["smoke"]}'
# {"submissionId":"sub-001","status":"QUEUED"}
```

## Database Collections

| Collection | Purpose |
|---|---|
| `submissions` | Test submission records |
| `test_results` | Individual test case results |
| `reports` | Generated report documents |
| `test_suites` | Registered test suite definitions |
| `workers` | Worker health and metrics |
| `audit_log` | Immutable audit trail |
