# 20 — Deployment
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Deployment Architecture
Rakshak runs as a 2-replica Kubernetes Deployment with dual-redundancy. As the last line of defense, it must never have a single point of failure.
## Resources
| Component | Replicas | CPU | Memory |
|-----------|----------|-----|--------|
| rakshak-deployment | 2 (active-active) | 2 req / 4 limit | 4Gi req / 8Gi limit |
| rakshak-db (PostgreSQL) | 2 (primary+standby) | 2 req / 4 limit | 8Gi |
## Dual Redundancy
Both replicas are active. Emergency exit signals use direct TCP between replicas to ensure signal delivery even if one fails.
## Health Probes
- **Liveness:** /health (core protection engine running)
- **Readiness:** /health/ready (event calendar loaded + data sources connected)
## Deployment Strategy
- Rolling update with maxSurge: 1, maxUnavailable: 0
- At least 1 replica always serving during updates
## Rollback
kubectl rollout undo deployment/rakshak -n algo-iq-prod
## Network Policy
Ingress allowed only from KuberAlpha, Vega, DXCC pods. Emergency direct TCP channel between replicas.
