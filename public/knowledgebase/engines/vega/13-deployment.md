# 13 — Deployment Guide

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Deployment Architecture

Vega is deployed in an **active-active** configuration across two data centers (Mumbai primary, Hyderabad DR) using a **blue-green deployment strategy** with zero-downtime rollouts.

---

## Environment Matrix

| Environment | Purpose | Configuration | Auto-Scale |
|---|---|---|---|
| **Development** | Local development, unit tests | Mock brokers, no auth | No |
| **Staging / UAT** | Integration testing, broker UAT | Test broker endpoints | No |
| **Production — Mumbai** | Primary trading traffic | Live brokers | Yes |
| **Production — Hyderabad** | DR, read-only standby | Same as primary, dormant | Yes (standby) |

---

## Blue-Green Deployment Process

```
Phase 1: Deploy to Blue
  ├── Build Docker image: vega:6.3.0
  ├── Push to registry
  ├── Deploy to BLUE environment (inactive)
  ├── Run smoke tests on BLUE
  └── Verify: health checks, broker connectivity, DB migrate success

Phase 2: Database Migrations
  ├── Run migrations against production DB
  ├── Migrations MUST be backward-compatible
  └── Verify no locking issues on active tables

Phase 3: Traffic Switch
  ├── Add BLUE nodes to load balancer pool
  ├── Drain GREEN nodes (stop new connections)
  ├── Wait for active connections to complete (30s grace)
  └── Remove GREEN from pool

Phase 4: Verify & Cleanup
  ├── Monitor error rates, latency for 5 minutes
  ├── If healthy → decommission GREEN
  └── If unhealthy → rollback (swap GREEN back)
```

---

## CI/CD Pipeline (GitHub Actions)

```yaml
name: Vega Deploy
on:
  push:
    branches: [main]
    tags: ['v*']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker Image
        run: |
          docker build -t algoiq/vega:${{ github.ref_name }} .
          docker tag algoiq/vega:${{ github.ref_name }} algoiq/vega:latest

      - name: Run Tests
        run: docker run --rm algoiq/vega:${{ github.ref_name }} npm test

      - name: Push to Registry
        run: |
          docker push algoiq/vega:${{ github.ref_name }}
          docker push algoiq/vega:latest

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to Staging
        run: |
          ssh deploy@staging.algoiq.com './deploy-vega.sh v${{ github.ref_name }}'

  deploy-prod-mumbai:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production-mumbai
    steps:
      - name: Deploy Blue
        run: |
          ssh deploy@mum-prod.algoiq.com './deploy-vega-blue.sh v${{ github.ref_name }}'
      - name: Smoke Test Blue
        run: |
          ./scripts/smoke-test-blue.sh
      - name: Switch Traffic
        run: |
          ssh deploy@mum-prod.algoiq.com './switch-vega-traffic.sh blue'
      - name: Verify
        run: |
          ./scripts/verify-deployment.sh

  deploy-prod-hyderabad:
    needs: deploy-prod-mumbai
    runs-on: ubuntu-latest
    environment: production-hyderabad
    steps:
      - name: Deploy DR
        run: |
          ssh deploy@hyd-dr.algoiq.com './deploy-vega-dr.sh v${{ github.ref_name }}'
```

---

## Kubernetes Deployment (Production)

### Deployments

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vega-talkstrategy-api
  namespace: vega
spec:
  replicas: 4
  selector:
    matchLabels:
      app: vega-ts-api
  template:
    metadata:
      labels:
        app: vega-ts-api
        version: "6.3.0"
    spec:
      containers:
        - name: vega-api
          image: algoiq/vega:6.3.0
          command: ["node", "src/api/index.js"]
          ports:
            - containerPort: 3003
              name: http
            - containerPort: 3004
              name: grpc
            - containerPort: 9090
              name: metrics
          env:
            - name: NODE_ENV
              value: "production"
            - name: PG_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: vega-secrets
                  key: pg-password
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: vega-secrets
                  key: redis-password
          resources:
            requests:
              cpu: "2"
              memory: "4Gi"
            limits:
              cpu: "4"
              memory: "8Gi"
          livenessProbe:
            httpGet:
              path: /api/v1/health
              port: 3003
            initialDelaySeconds: 10
            periodSeconds: 15
          readinessProbe:
            httpGet:
              path: /api/v1/health
              port: 3003
            initialDelaySeconds: 5
            periodSeconds: 5
```

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: vega-api-hpa
  namespace: vega
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vega-talkstrategy-api
  minReplicas: 4
  maxReplicas: 16
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
    - type: Pods
      pods:
        metric:
          name: vega_orders_per_second
        target:
          type: AverageValue
          averageValue: "1000"
```

---

## FIX Session Deployment

FIX sessions are **not containerized** — they run on dedicated VMs for stable IP and deterministic routing.

### XTS FIX Deployment

```
VM: fix-xts-01.algoiq.internal (Mumbai)
  ├── /opt/vega/broker/xts/
  ├── Config: fix-xts.cfg (SenderCompID, TargetCompID, IPs)
  ├── Sequence file: /data/fix/seq/vega-xts.seq
  └── Logs: /var/log/vega/fix-xts/
```

### Greeksoft FIX Deployment

```
VM: fix-gs-01.algoiq.internal (Mumbai)
  ├── /opt/vega/broker/greeksoft/
  ├── Config: fix-gs.cfg
  ├── Sequence file: /data/fix/seq/vega-gs.seq
  └── Logs: /var/log/vega/fix-gs/
```

---

## Pre-Deployment Checklist

- [ ] All tests passing in CI
- [ ] Database migrations tested in staging
- [ ] Backward compatibility verified (no breaking schema changes)
- [ ] Configuration changes reviewed by lead engineer
- [ ] Broker connectivity tested with UAT endpoints
- [ ] Kill switch thresholds confirmed with Risk team
- [ ] Deployment window approved (pre-market: 07:00–08:30 IST, post-market: 15:45–18:00 IST)
- [ ] Rollback plan documented and tested
- [ ] Monitoring dashboards configured for new version
- [ ] On-call engineer notified and available

---

## Rollback Procedure

```bash
# 1. Immediate rollback (traffic switch back to GREEN)
ssh deploy@mum-prod.algoiq.com './switch-vega-traffic.sh green'

# 2. If DB migration was applied (backward compatible)
# No rollback needed — migrations are designed to be additive only

# 3. If new deployment has data corruption risk
# Restore from latest backup (RPO: 5 min)
ssh deploy@mum-prod.algoiq.com './restore-vega-db.sh latest'

# 4. Verify rollback
curl -s https://vega-api.algoiq.com/api/v1/health
```

---

## Market Hours Deployment Restrictions

```
TRADING HOURS (09:15–15:30 IST):
  └─ NO DEPLOYMENTS ALLOWED

PRE-MARKET WINDOW (07:00–08:30 IST):
  ├─ Allowed: Hotfix deployments with CTO approval
  ├─ Emergency rollback only
  └─ Must complete before 08:45 IST

POST-MARKET WINDOW (15:45–18:00 IST):
  ├─ Allowed: Standard deployments
  └─ Preferred window for all code changes

WEEKEND WINDOW (Sat 10:00–Sun 16:00 IST):
  ├─ Allowed: Major version upgrades, DB migrations, DR tests
  └─ Must complete by Sunday 16:00 for pre-market verification
```
