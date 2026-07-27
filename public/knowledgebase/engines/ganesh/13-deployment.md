# 13 â€” Deployment Guide

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Deployment Environments

| Environment | Purpose | URL |
|---|---|---|
| Development | Local development and testing | `http://localhost:3002` |
| Staging | Pre-production validation | `https://ganesh-staging.algoiq.io` |
| Production | Live trading data | `https://ganesh.algoiq.io` |

## Deployment Architecture

```
                    [Cloudflare / AWS ALB]
                              |
            +-----------------+-----------------+
            |                 |                 |
      [API Server 1]   [API Server 2]   [API Server N]
      (us-east-1a)     (us-east-1b)     (us-east-1c)
            |                 |                 |
            +--------+--------+--------+--------+
                     |                 |
            [Redis Sentinel]   [PostgreSQL Primary]
            [Redis Primary]    [PostgreSQL Replica]
            [Redis Replica]    (us-east-1b)
            (us-east-1a)
                              |
                     [Bar Aggregator]
                     (us-east-1a, Active)
                     (us-east-1b, Standby)
```

## Deployment Process

### 1. Build

```bash
npm ci --production
npm run build
npm test
```

### 2. Package

```bash
docker build -t algoiq/ganesh:3.2.1 .
docker push algoiq/ganesh:3.2.1
```

### 3. Database Migrations

```bash
node scripts/migrate-db.js --env production
```

Migrations are **forward-only** and **idempotent**.

### 4. Deploy (Kubernetes)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ganesh-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ganesh-api
  template:
    spec:
      containers:
      - name: ganesh
        image: algoiq/ganesh:3.2.1
        ports:
        - containerPort: 3002
        - containerPort: 9090
        env:
        - name: NODE_ENV
          value: "production"
        - name: GANESH_REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: ganesh-secrets
              key: redis-password
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 3002
          initialDelaySeconds: 10
          periodSeconds: 15
        readinessProbe:
          httpGet:
            path: /api/v1/health/deep
            port: 3002
          initialDelaySeconds: 5
          periodSeconds: 10
```

### 5. Health Verification

```bash
for instance in ganesh-1 ganesh-2 ganesh-3; do
  curl -s https://$instance.internal:3002/api/v1/health | jq .status
done
```

### 6. Smoke Test

```bash
node scripts/smoke-test.js --env production
```

## Rollback Procedure

```bash
kubectl rollout undo deployment/ganesh-api
```

## Deployment Checklist

- [ ] All tests passing on CI
- [ ] Database migrations tested on staging
- [ ] Configuration changes reviewed
- [ ] API backward compatibility verified
- [ ] Monitoring dashboards updated
- [ ] Runbook reviewed with operations team
- [ ] Rollback plan documented
- [ ] Deployment window communicated
