---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 04 — High-Level Architecture

## Architecture Overview

Garuda Margin Engine employs a **Cloud-Native Microservices Architecture** deployed on Kubernetes, following Domain-Driven Design (DDD) principles with bounded contexts. Each business capability is encapsulated in an independently deployable microservice. Services communicate synchronously via gRPC/REST and asynchronously via Apache Kafka.

```
                          ┌─────────────────────────────────────┐
                          │         External Consumers           │
                          │  (Trading Platforms, Web Apps, SDKs) │
                          └──────────────┬──────────────────────┘
                                         │ HTTPS / WSS
                                         ▼
                    ┌────────────────────────────────────────────┐
                    │          Azure Front Door / Cloudflare      │
                    │         (CDN + WAF + DDoS Protection)       │
                    └────────────────────┬───────────────────────┘
                                         │
                                         ▼
                    ┌────────────────────────────────────────────┐
                    │         API Gateway Cluster (YARP)          │
                    │  - Rate Limiting  - Auth Validation        │
                    │  - Request Routing - Response Caching      │
                    │  - CORS Policy     - API Versioning        │
                    └────────┬──────────┬──────────┬─────────────┘
                             │          │          │
              ┌──────────────┼──────────┼──────────┼──────────────┐
              │              │          │          │              │
              ▼              ▼          ▼          ▼              ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Auth     │ │ Margin   │ │ Position │ │ Strategy │ │ Portfolio│
        │ Service  │ │ Engine   │ │ Service  │ │ Engine   │ │ Engine   │
        └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
             │            │            │            │            │
             └────────────┼────────────┼────────────┼────────────┘
                          │            │            │
                          ▼            ▼            ▼
                  ┌───────────────────────────────────────┐
                  │         Kafka Message Bus             │
                  │  Topics: position.*, margin.*, alert.*│
                  └──────────┬──────────────┬─────────────┘
                             │              │
                  ┌──────────┼──────────────┼──────────────┐
                  │          │              │              │
                  ▼          ▼              ▼              ▼
           ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
           │ Margin   │ │ Hedge    │ │ Reporting│ │ Audit    │
           │ Intel.   │ │ Optimizer│ │ Service  │ │ Service  │
           └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
                │            │            │            │
                └────────────┼────────────┼────────────┘
                             │            │
                             ▼            ▼
                  ┌───────────────────────────────────────┐
                  │          Data Layer                    │
                  │  ┌──────────┐  ┌──────────┐          │
                  │  │PostgreSQL│  │  Redis   │          │
                  │  │ (Primary)│  │ Cluster  │          │
                  │  └──────────┘  └──────────┘          │
                  │  ┌──────────┐  ┌──────────┐          │
                  │  │  Kafka   │  │  Azure   │          │
                  │  │  Cluster │  │ Blob/S3  │          │
                  │  └──────────┘  └──────────┘          │
                  └───────────────────────────────────────┘
```

## Architecture Principles

| Principle | Implementation |
|---|---|
| **Stateless Services** | All business logic services stateless; state in DB/Cache |
| **Event-Driven** | Inter-service communication via Kafka for async operations |
| **API-First** | All services expose OpenAPI 3.0 contracts before implementation |
| **Defense in Depth** | Security at network (mTLS), application (JWT), data (AES-256) layers |
| **Observability** | Metrics (Prometheus), Traces (Jaeger), Logs (ELK) for every service |
| **Infrastructure as Code** | All infrastructure defined in Terraform + Helm charts |
| **12-Factor App** | Configuration via env vars, stateless processes, port binding |

## Core Microservices

### Authentication Service
- OAuth 2.0 / OpenID Connect integration
- JWT token generation (15-min access, 24h refresh)
- API Key management with HMAC signing
- RBAC with 6 predefined roles
- MFA/TOTP support, SAML 2.0 SSO
- Brute-force protection, account lockout

### Margin Engine (Core)
- SPAN Calculation: 16 risk scenarios, scanning risk, inter-month spread
- Exposure Calculation: ELM + Adhoc with GSM integration
- Net Option Value: Real-time option premium netting
- Calendar Spread Benefit: Automatic pair identification
- Portfolio Aggregator: Cross-commodity netting
- Peak Margin Tracker: 15-minute interval snapshots
- Real-time recalculation on price ticks

### Margin Intelligence Engine
- ML-based 24h/7d/30d margin forecasting (XGBoost, LSTM)
- VaR estimation: Historical Simulation, Parametric, Monte Carlo
- Stress testing with configurable scenarios
- Anomaly detection for sudden margin spikes
- Implied volatility surface modeling

### Hedge Optimizer
- Portfolio hedging gap analysis
- Optimal hedge ratio calculation
- Delta-neutral and cost-efficient hedge strategies
- Cost-benefit analysis with confidence scoring
- Multi-instrument hedge optimization

### Position Service
- CRUD for trading positions
- Bulk import (10M+ positions CSV)
- Real-time position sync from OMS
- Expiry tracking, auto-square-off for MIS
- Position lifecycle management

### Reporting Service
- Peak Margin Report (SEBI format)
- EOD Margin Summary
- Client-wise Utilization Report
- Broker-level Consolidated Report
- PDF, Excel, CSV export
- Scheduled report generation and delivery

### Audit Service
- Immutable audit log for all margin computations
- User action audit trail
- API access log
- SIEM integration (Splunk, Azure Sentinel)
- 7-year retention for compliance

## Communication Patterns

### Synchronous (gRPC/REST)
- Real-time margin calculation: HTTP/2 REST
- Authentication checks: HTTP/2 REST
- High-performance data lookups: gRPC
- Real-time streaming: WebSocket (SignalR)

### Asynchronous (Kafka)

| Topic | Producer | Consumer(s) |
|---|---|---|
| `position.created` | Position Service | Margin Orchestrator |
| `position.updated` | Position Service | Margin Orchestrator |
| `price.tick` | Market Data Ingestor | Margin Recalculator |
| `margin.calculated` | Margin Orchestrator | Alert Evaluator, Reporting, Audit |
| `margin.shortfall` | Alert Evaluator | Notification Dispatcher |
| `alert.generated` | Alert Evaluator | WebSocket Hub, Notification |
| `report.requested` | API Gateway | Reporting Service |

## Kubernetes Architecture

```
Cluster: AKS / EKS / GKE (v1.28+)

Namespaces:
├── garuda-system        (core platform services)
├── garuda-brokers       (broker-specific services)
├── garuda-monitoring    (Prometheus, Grafana, Jaeger, Loki)
├── garuda-ingress       (NGINX Ingress, cert-manager)
├── garuda-data          (Kafka, Redis, PostgreSQL operators)
└── garuda-cicd          (ArgoCD / Flux for GitOps)

Node Pools:
├── system-pool    (3 nodes, 4vCPU/16GB)  - Control plane
├── app-pool       (10 nodes, 8vCPU/32GB) - Application services
├── data-pool      (5 nodes, 16vCPU/64GB) - Stateful workloads
└── gpu-pool       (2 nodes, GPU T4)      - ML model inference
```

## Auto-Scaling Rules

| Service | Metric | Threshold | Min | Max |
|---|---|---|---|---|
| Margin Engine | CPU > 65% + Queue Depth > 100 | Scale out | 5 | 50 |
| API Gateway | CPU > 60% + P95 Latency > 500ms | Scale out | 3 | 20 |
| Position Service | CPU > 60% | Scale out | 2 | 10 |
| Intelligence Engine | GPU > 50% | Scale out | 1 | 10 |
| Reporting Service | CPU > 50% | Scale out | 1 | 5 |
