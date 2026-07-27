---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 13 — Deployment

## Environment Architecture

Garuda Margin Engine supports four deployment environments on a standard promotion path:

```
Development → Staging → UAT → Production
```

| Environment | Purpose | Scale | Data |
|---|---|---|---|
| **Development** | Local feature development | Single node (Docker Compose) | Synthetic, auto-refreshed weekly |
| **Staging** | Integration testing, performance validation | 3-node K8s cluster | Anonymized production subset |
| **UAT** | User acceptance, broker onboarding validation | 4-node K8s cluster | Full production mirror (anonymized) |
| **Production** | Live trading margin computation | 8+ node K8s cluster (3 AZ) | Live market data |

## Docker Deployment

### Build Images
```bash
docker build -t garuda/api:5.0.0 -f docker/Dockerfile.api .
docker build -t garuda/margin-engine:5.0.0 -f docker/Dockerfile.engine .
docker build -t garuda/intelligence:5.0.0 -f docker/Dockerfile.intelligence .
docker build -t garuda/web:5.0.0 -f docker/Dockerfile.web .
```

### Push to Registry
```bash
docker tag garuda/api:5.0.0 ghcr.io/garuda/api:5.0.0
docker push ghcr.io/garuda/api:5.0.0
```

### Docker Compose (Dev/Test)
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## Kubernetes Deployment

### Helm Chart
```bash
helm install garuda garuda/garuda-margin-engine \
    --namespace garuda-production \
    --set global.environment=production \
    --values deployment/helm/values-production.yaml
```

### Production Pod Configuration

| Service | Replicas (Min/Max) | CPU Request/Limit | Memory Request/Limit |
|---|---|---|---|
| API Gateway | 3 / 20 | 500m / 2000m | 512Mi / 2048Mi |
| Margin Engine | 8 / 30 | 2000m / 4000m | 2048Mi / 6144Mi |
| Position Service | 2 / 10 | 500m / 1500m | 512Mi / 1024Mi |
| Intelligence Engine | 2 / 10 | 1000m / 4000m | 2048Mi / 6144Mi |
| Reporting Service | 1 / 5 | 500m / 1500m | 512Mi / 2048Mi |

## Blue-Green Deployment Strategy

```
                    ┌──────────────────────┐
                    │   Azure Front Door    │
                    │  (Traffic Manager)    │
                    └──────────┬───────────┘
                               │
               ┌───────────────┼───────────────┐
               ▼               │               ▼
      ┌────────────┐           │      ┌────────────┐
      │  BLUE       │           │      │  GREEN      │
      │  (Active)   │           │      │  (Standby)  │
      │  v5.0.0     │           │      │  v5.0.1     │
      └────────────┘           │      └────────────┘
                    100% → BLUE
                     0% → GREEN
```

### Gradual Traffic Shift
```
1. Deploy new version to standby color
2. Run smoke tests against standby
3. Shift 5% traffic → verify for 5 minutes
4. Shift 50% traffic → verify for 15 minutes
5. Shift 100% traffic → mark new color as active
6. Retain old version for 1 hour as rollback target
7. Clean up old deployment
```

## Health Check Configuration

### Kubernetes Probes

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 15
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 5
  failureThreshold: 2
```

### Health Endpoints

| Endpoint | Purpose | Success Response |
|---|---|---|
| `GET /health` | Aggregated component status | `{"status":"Healthy"}` |
| `GET /health/live` | Kubernetes liveness | `200 OK` |
| `GET /health/ready` | Kubernetes readiness | `200 OK` (dependencies ready) |
| `GET /health/database` | DB connectivity | `{"status":"Healthy","latency_ms":12}` |
| `GET /health/redis` | Redis connectivity | `{"status":"Healthy","latency_ms":2}` |
| `GET /health/kafka` | Kafka connectivity | `{"status":"Healthy","brokers":5}` |

## Rollback Procedure

### Automated Rollback (Trigger: health check failure)
```bash
# Roll back Helm release
helm rollback garuda <previous-revision> -n garuda-production --wait

# Verify
curl https://api.garuda.dev/health
```

### Rollback Decision Matrix
| Condition | Auto-Rollback? | Time |
|---|---|---|
| Health check fails (any instance) | Yes — immediate | <30s |
| Error rate >5% for 2 consecutive minutes | Yes — automated | 2 min |
| P95 latency >2× baseline for 5 minutes | No — manual investigation | 5 min |
| Database migration fails | Yes — immediate | <10s |
| Any critical alert | No — manual assessment | 5 min |

## CI/CD Pipeline

### Stages
```
Git Push → Build & Unit Test → Static Analysis → Security Scan
    → Container Build → Integration Tests → Deploy to Staging
    → Smoke Tests → Approval Gate → Deploy to Production (Blue-Green)
    → Database Migrations → Health Check → Post-Deploy Validation
```

### Pipeline Duration Targets
| Stage | Target |
|---|---|
| Build & Unit Test | <5 min |
| Security Scan | <5 min |
| Container Build | <8 min |
| Integration Tests | <10 min |
| Deploy to Staging | <5 min |
| Deploy to Production | <15 min |
| **Total (commit to production)** | **<45 min** |

## Disaster Recovery

### DR Architecture
```
Primary Region (India Central):
    Active AKS + PostgreSQL Primary + Redis + Kafka

DR Region (India South):
    Standby AKS (scaled to 0) + PostgreSQL Async Replica
    + Kafka MirrorMaker + Blob Storage RA-GRS
```

### RTO/RPO
| Metric | Target | Last Drill |
|---|---|---|
| Recovery Time Objective | <15 minutes | 12 min |
| Recovery Point Objective | <1 minute data loss | 45 sec |
| Full Service Restoration | <30 minutes | 22 min |
| DR Drill Frequency | Quarterly | 2026-06-15 |

### Failover Command
```bash
# 1. Promote PostgreSQL replica in DR region
az postgres flexible-server replica promote --name garuda-dr-pg

# 2. Scale up DR Kubernetes
az aks scale --name garuda-dr-aks --node-count 8

# 3. Deploy app to DR
helm install garuda garuda/garuda-margin-engine \
    --namespace garuda-production --values values-dr.yaml

# 4. Update DNS
az network dns record-set a update --zone-name garuda.dev \
    --name api --set aRecords[0].ipv4Address=$DR_LB_IP
```
