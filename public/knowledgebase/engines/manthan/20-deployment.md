# 20 — Deployment
> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24
## Kubernetes Deployment
Manthan runs as 2-replica deployment in lgo-iq-prod namespace, Go-based binary in a distroless container.
### Resources
| Component | Replicas | CPU | Memory |
|-----------|----------|-----|--------|
| manthan-deployment | 2 | 4 req / 8 limit | 8Gi req / 16Gi limit |
| manthan-redis | 3 (StatefulSet) | 1 req / 4 limit | 4Gi |
### Canary Deployment
1. Deploy canary to 1 pod. 2. Route 10% traffic for 30 min. 3. Monitor error rate, latency. 4. Full rollout or rollback.
### Rollback
kubectl rollout undo deployment/manthan -n algo-iq-prod
### Network Policy
Allows ingress only from DXCC, KuberAlpha, Kavach, Delta XI pods.
