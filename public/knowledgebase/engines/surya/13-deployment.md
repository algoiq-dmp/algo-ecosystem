# 13 — Deployment Guide

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Deployment Architecture

Surya is deployed with **active-passive** topology: the Mumbai DC runs the full pipeline, while Hyderabad serves as DR with replicated storage and warm standby API.

---

## Environment Matrix

| Environment | Purpose | Extranet Connectivity | Schedule |
|---|---|---|---|
| **Development** | Local dev, unit tests | Mock extranet | Manual trigger only |
| **Staging / UAT** | Integration testing | UAT extranet endpoints | Simulated schedule |
| **Production — Mumbai** | Primary file pipeline | Live extranet APIs | Full BOD/EOD schedule |
| **Production — Hyderabad** | Disaster recovery | Live (standby) | Passive (warm standby) |

---

## Deployment Strategy

Surya uses a **rolling deployment** strategy with canary validation:

```
Phase 1: Deploy to Canary (1 instance)
  ├── Build Docker image: surya:2.4.1
  ├── Deploy to single staging instance
  ├── Run health checks + test file fetch
  └── Monitor for 5 minutes

Phase 2: Rolling Update
  ├── Drain one instance at a time
  ├── Deploy new version
  ├── Verify health before moving to next
  └── Scheduler lock prevents duplicate processing during rollout

Phase 3: Verify & Monitor
  ├── Check today's BOD/EOD files processed correctly
  ├── Monitor error rates for 10 minutes
  └── Rollback if any file type fails validation
```

---

## CI/CD Pipeline (GitHub Actions)

```yaml
name: Surya Deploy
on:
  push:
    branches: [main]
    tags: ['v*']
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run test:integration

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker
        run: |
          docker build -t algoiq/surya:${{ github.ref_name }} .
          docker push algoiq/surya:${{ github.ref_name }}

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to Staging
        run: ssh deploy@staging.algoiq.com './deploy-surya.sh ${{ github.ref_name }}'
      - name: Smoke Test
        run: |
          sleep 30
          ./scripts/smoke-test-surya.sh staging

  deploy-prod:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production-mumbai
    steps:
      - name: Deploy Canary
        run: ssh deploy@mum-prod.algoiq.com './deploy-surya-canary.sh ${{ github.ref_name }}'
      - name: Verify Canary
        run: ./scripts/verify-canary.sh
      - name: Rolling Deploy
        run: ssh deploy@mum-prod.algoiq.com './deploy-surya-rolling.sh ${{ github.ref_name }}'
      - name: Verify Deployment
        run: ./scripts/verify-deployment-surya.sh
```

---

## Kubernetes Deployment

### Deployment: Surya API

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: surya-api
  namespace: surya
spec:
  replicas: 2
  selector:
    matchLabels:
      app: surya-api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: surya-api
        version: "2.4.1"
    spec:
      containers:
        - name: surya-api
          image: algoiq/surya:2.4.1
          command: ["node", "src/api/index.js"]
          ports:
            - containerPort: 3005
            - containerPort: 9090
          env:
            - name: NODE_ENV
              value: "production"
            - name: PG_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: surya-secrets
                  key: pg-password
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: surya-secrets
                  key: redis-password
          resources:
            requests:
              cpu: "1"
              memory: "2Gi"
            limits:
              cpu: "4"
              memory: "8Gi"
          livenessProbe:
            httpGet:
              path: /api/v1/health
              port: 3005
            initialDelaySeconds: 15
            periodSeconds: 20
          readinessProbe:
            httpGet:
              path: /api/v1/health
              port: 3005
            initialDelaySeconds: 5
            periodSeconds: 10
          volumeMounts:
            - name: surya-data
              mountPath: /data/surya
            - name: nse-certs
              mountPath: /etc/surya/certs/nse
              readOnly: true
      volumes:
        - name: surya-data
          persistentVolumeClaim:
            claimName: surya-data-pvc
        - name: nse-certs
          secret:
            secretName: nse-extranet-cert
```

### Deployment: Pipeline Worker

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: surya-worker
  namespace: surya
spec:
  replicas: 2
  template:
    spec:
      containers:
        - name: surya-worker
          image: algoiq/surya:2.4.1
          command: ["node", "src/worker/index.js"]
          # ... similar env, resources, volumes
```

---

## Extranet Connectivity Setup

### NSE Extranet Certificate Deployment

```bash
# 1. Obtain certificate from NSE (annual renewal)
# Files: nse_client.crt, nse_client.key, nse_ca.crt

# 2. Store in Kubernetes Secret
kubectl create secret generic nse-extranet-cert \
  --from-file=nse_client.crt=./nse_client.crt \
  --from-file=nse_client.key=./nse_client.key \
  --from-file=nse_ca.crt=./nse_ca.crt \
  -n surya

# 3. Verify certificate validity
openssl x509 -in nse_client.crt -text -noout | grep -A2 Validity

# 4. Set expiration alert (30 days before)
# Monitor via Prometheus: cert_expiry_days{path="/etc/surya/certs/nse/nse_client.crt"}
```

---

## Pre-Deployment Checklist

- [ ] All tests passing in CI
- [ ] Database migrations tested in staging
- [ ] File type registry changes reviewed by Operations lead
- [ ] Extranet certificates valid (> 30 days until expiry)
- [ ] MinIO bucket versioning enabled and verified
- [ ] Pipeline smoke test passes (fetch + validate + store one file)
- [ ] Alert rules updated for new version
- [ ] Deployment window: Outside BOD/EOD windows
  - Safe: 09:30–14:00 IST, 17:00–05:00 IST
  - Unsafe: 06:00–09:00 IST (BOD), 15:30–16:30 IST (EOD)
- [ ] Rollback plan documented

---

## Deployment Windows

```
SAFE WINDOWS:
  ├── Mid-day: 09:30–14:00 IST
  │   └── BOD complete, EOD not yet started
  ├── Overnight: 17:00–05:00 IST
  │   └── All files processed for the day
  └── Weekends: All day Saturday, Sunday until 16:00

RESTRICTED WINDOWS:
  ├── BOD: 06:00–09:00 IST
  │   └── DEPLOYMENT PROHIBITED
  └── EOD: 15:30–16:30 IST
      └── DEPLOYMENT PROHIBITED

EMERGENCY DEPLOYMENT:
  └── Requires Operations Lead + CTO approval
      └── Must complete within 15 minutes
```

---

## Rollback Procedure

```bash
# 1. Roll back to previous version
kubectl rollout undo deployment/surya-api -n surya
kubectl rollout undo deployment/surya-worker -n surya

# 2. Verify rollback
kubectl rollout status deployment/surya-api -n surya
curl -s https://surya-api.algoiq.com/api/v1/health

# 3. If DB migration was applied (should be backward-compatible)
# Verify file_versions and file_types tables intact:
psql -h pg.algoiq.internal -d surya -c "SELECT count(*) FROM file_types;"

# 4. Re-process any files that failed during bad deployment
curl -X POST -H "X-API-Key: admin-key" \
  -d '{"fileTypeCode":"SEC_TOK","fileDate":"2026-07-24"}' \
  https://surya-api.algoiq.com/api/v1/admin/files/trigger
```

---

## Post-Deployment Verification

```bash
# 1. Verify health of all instances
for pod in $(kubectl get pods -n surya -l app=surya-api -o name); do
  kubectl exec -n surya $pod -- curl -s localhost:3005/api/v1/health
done

# 2. Check file pipeline processes today's files
curl -s -H "X-API-Key: admin-key" \
  "https://surya-api.algoiq.com/api/v1/admin/pipeline/status?date=$(date +%Y-%m-%d)"

# 3. Verify downstream engines can access files
curl -s -H "X-API-Key: ganesh-key" \
  "https://surya-api.algoiq.com/api/v1/files?fileType=SEC_TOK&date=$(date +%Y-%m-%d)"

# 4. Monitor for 10 minutes:
# - No spike in error logs (Kibana)
# - No alert triggered (PagerDuty)
# - MinIO write throughput normal (Grafana)
```
