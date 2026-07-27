# 21 — Deployment
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Deployment Architecture
Kavach runs as a 3-replica Kubernetes Deployment for high availability, with a Redis StatefulSet for state persistence.
## Resources
| Component | Replicas | CPU | Memory |
|-----------|----------|-----|--------|
| kavach-deployment | 3 | 4 req / 8 limit | 8Gi req / 16Gi limit |
| kavach-redis | 3 (StatefulSet) | 2 req / 4 limit | 4Gi |
## Health Probes
- **Liveness:** /health (checks Greek calculator + Redis connection)
- **Readiness:** /health/ready (checks all data sources + active strategies loaded)
## Canary Deployment
1. Deploy canary pod. 2. Route 10% of adjustment signals. 3. Monitor for 30 min. 4. Full rollout or rollback.
## Rollback
kubectl rollout undo deployment/kavach -n algo-iq-prod
## Network Policy
Ingress allowed only from KuberAlpha, Vega, DXCC, Rakshak pods on ports 8080 and 9090.
