# TalkStrategy App - Roadmap

**Version:** 2.5.0 | **Owner:** Frontend | **Last Updated:** 2026-07-25


## Current Version: 2.5.0

Released and stable in production on ALGO IQ 4.

## Upcoming Releases

### vNext (Target: Q3 2026)

| Feature | Description | Priority |
|---------|-------------|----------|
| Horizontal scaling | Support for multi-instance deployments with load balancing | High |
| gRPC migration | Migrate REST endpoints to gRPC for improved performance | Medium |
| Enhanced metrics | Additional per-strategy risk metrics (VaR, CVaR) | Medium |
| Auto-scaling | Dynamic process scaling based on signal volume | Low |

### vNext+1 (Target: Q4 2026)

| Feature | Description | Priority |
|---------|-------------|----------|
| Kubernetes support | Helm chart for K8s deployment on ALGO IQ Cloud | High |
| Multi-region failover | Cross-data-center active-active with conflict resolution | High |
| Real-time risk engine | Live position risk monitoring with circuit breakers | Medium |
| ML signal filter | Machine learning model to filter low-quality signals | Low |
| OpenAPI 3.1 spec | Full OpenAPI specification for all endpoints | Low |

### Long-Term Vision (2027)

| Initiative | Description |
|------------|-------------|
| Cloud-native architecture | Full containerization, service mesh, serverless components |
| Unified control plane | Single management interface for all Algo IQ engines |
| Predictive analytics | AI-driven signal quality prediction and position sizing |
| Blockchain audit trail | Immutable audit log using distributed ledger |
| Zero-downtime upgrades | Blue/green deployment with seamless traffic cutover |

## Deprecation Notices

| Feature | Deprecation Date | Removal Date | Replacement |
|---------|-----------------|--------------|-------------|
| Legacy REST v1 endpoints | 2026-09-01 | 2027-03-01 | gRPC API |
| PM2 process manager | 2026-12-01 | 2027-06-01 | Kubernetes |
| In-process caching | 2026-10-01 | 2027-04-01 | Redis cluster |

## Feedback & Prioritization

Feature requests and prioritization are managed through the Algo IQ internal issue tracker. Roadmap items are reviewed quarterly with stakeholders from Strategy, QA, Operations, and Compliance teams.

