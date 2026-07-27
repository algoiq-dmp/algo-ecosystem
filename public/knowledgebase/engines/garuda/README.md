---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# Garuda Margin Engine — Documentation Hub

Enterprise-grade, real-time margin calculation and risk intelligence platform for Indian derivatives markets. Computes SPAN, Exposure, Portfolio, Delivery, and all exchange-mandated margin types with sub-50ms latency at 10,000+ API requests per second.

---

## Key Statistics

| Metric | Value |
|---|---|
| Sustained API Throughput | 10,000+ req/sec |
| Concurrent Positions | 100,000+ |
| Exchanges Supported | NSE, BSE, MCX, NCDEX, MSEI, SGX |
| Uptime SLA | 99.99% during market hours |
| SPAN File Updates | 6x daily auto-synced |
| Margin Engine P99 Latency | <5ms per position group |
| Pre-built Trading Strategies | 50+ |

## Core Features

- **Real-time SPAN Calculation** — 16 risk scenarios, Price Scan Range, Volatility Scan Range, Composite Delta
- **Exposure Margin (ELM + Adhoc)** — Index and stock-level exposure with GSM surveillance integration
- **Net Option Value Computation** — Premium netting and premium margin tracking
- **Calendar Spread Benefit** — Automatic identification and benefit computation across expiry months
- **Portfolio Benefit** — Cross-commodity netting (NIFTY↔BANKNIFTY, ρ=0.85)
- **Margin Intelligence** — ML-based 24h/7d/30d margin forecasting, VaR estimation, anomaly detection
- **Hedge Optimizer** — AI-driven hedge recommendations with cost-benefit analysis and confidence scoring
- **Multi-Broker Aggregation** — Unified portfolio across XTS, ODIN, NOW, NEST, Omnesys, Symphony, TT
- **REST & WebSocket APIs** — 100+ REST endpoints, real-time streaming, webhooks, SDKs for 8 languages
- **Peak Margin Tracking** — SEBI-compliant intraday peak margin recording and reporting

---

## Quick Links

### Architecture & Design
| Document | Description |
|---|---|
| [01-overview.md](01-overview.md) | What is Garuda, business objectives, target users |
| [02-business-requirements.md](02-business-requirements.md) | Business goals, functional & non-functional requirements |
| [03-system-requirements.md](03-system-requirements.md) | Hardware, software, OS, network, ports, dependencies |
| [04-high-level-architecture.md](04-high-level-architecture.md) | Microservices architecture, component relationships |
| [05-low-level-design.md](05-low-level-design.md) | Core classes, algorithms, method signatures |
| [06-components.md](06-components.md) | All modules: SPAN, Exposure, Strategy, Portfolio, Hedge |
| [07-data-flow.md](07-data-flow.md) | End-to-end margin calculation data flow |
| [08-topology.md](08-topology.md) | Ecosystem topology with Mermaid diagram |

### Operations & Integration
| Document | Description |
|---|---|
| [09-api-reference.md](09-api-reference.md) | REST endpoint reference with request/response examples |
| [10-database.md](10-database.md) | PostgreSQL schema, tables, views, stored procedures |
| [11-configuration.md](11-configuration.md) | config.json, environment variables, secrets management |
| [12-installation.md](12-installation.md) | Server prep, installation, verification |
| [13-deployment.md](13-deployment.md) | Dev/Staging/Production, Docker, Kubernetes, health checks |
| [14-monitoring.md](14-monitoring.md) | Health endpoints, Prometheus, Grafana, alert thresholds |
| [15-security.md](15-security.md) | OAuth2/JWT, API keys, TLS 1.3, RBAC, audit logging |

### Platform Integrations
| Document | Description |
|---|---|
| [16-narad-integration.md](16-narad-integration.md) | Narad registration, margin event publishing, heartbeat |
| [17-suraksha-integration.md](17-suraksha-integration.md) | Suraksha auth validation, RBAC, certificate management |

### Reliability & Performance
| Document | Description |
|---|---|
| [18-failover.md](18-failover.md) | Primary/Secondary, Redis replication, Patroni, auto-failover |
| [19-performance.md](19-performance.md) | Scaling guide, optimization, load test results |
| [20-testing.md](20-testing.md) | Unit, integration, load, stress, exchange validation |

### Reference
| Document | Description |
|---|---|
| [21-troubleshooting.md](21-troubleshooting.md) | 10 common issues with diagnosis and resolution |
| [22-faq.md](22-faq.md) | 25 FAQ entries on margin concepts, SPAN, API usage |
| [23-roadmap.md](23-roadmap.md) | v5.1 GPU acceleration, v5.2 cross-margin, v6.0 broker SDK |
| [24-release-notes.md](24-release-notes.md) | Version history with features, fixes, breaking changes |
| [25-glossary.md](25-glossary.md) | 30+ margin terms: SPAN, ELM, Premium, NOV, Iron Condor |

---

## Ecosystem Architecture

```
DXCC (Exchange Data) → Garuda Margin Engine → All Margin Consumers
                           ├── Brokers (RMS/OMS)
                           ├── Prop Firms (Algo Platforms)
                           ├── Institutional Desks (Hedge Systems)
                           └── Retail Platforms (Trading Terminals)
```

## Target Users

- **Brokerage Firms** — 100K+ client margin computation, regulatory compliance, audit trails
- **Proprietary Trading Desks** — Ultra-low-latency margin estimation, strategy-level breakdowns
- **Institutional Investors** — Portfolio-level margin optimization, cross-product netting
- **HNI / Professional Traders** — Complex multi-leg strategy margin computation
- **ISVs / Algo Platforms** — White-label integration via comprehensive APIs and SDKs
- **Exchanges & CCPs** — SPAN file validation, audit trail, discrepancy reporting

## Version Information

| Property | Value |
|---|---|
| Current Version | 5.0.0 |
| Codename | "Brahmastra" |
| Release Date | July 24, 2026 |
| Document Owner | Margin Intelligence Team |
| Repository | https://github.com/garuda/margin-engine |

---

*All documents updated as of July 25, 2026. For latest updates, contact the Margin Intelligence team.*
