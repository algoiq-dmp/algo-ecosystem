# DXCC — Delta XI Command Center

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## What is DXCC?

DXCC (Delta XI Command Center) is the OS-level control plane and unified operational interface for the entire Delta XI algorithmic trading ecosystem. It provides a single pane of glass through which every component, every engine, every strategy, every risk rule, and every audit log is visible and manageable.

DXCC is not just a dashboard. It is a **dynamic plugin framework** where each of the 18 engines auto-registers, auto-documents, and exposes its operational capabilities through a unified interface.

### Core Philosophy

> "If it's not in DXCC, it doesn't exist in the system."

---

## Five-Layer Architecture

DXCC organizes its 20+ modules into 5 logical layers:

| Layer | Name | Modules | Purpose |
|-------|------|---------|---------|
| **L1** | Data & Connectivity | Infra Monitor, Notification Center, Timeline, Executive Dashboard | Raw metrics, status from all layers |
| **L2** | Platform Services & Intelligence | Engine Registry, Market Operations, Narad Monitor, API Gateway, Alert Manager | Engine health, event bus metrics, API traffic |
| **L3** | Strategy & Analysis | Strategy Command, Analytics Center, AI Ops Center, Intelligence Center, Strategy Builder | Signals, P&L, AI coach interactions |
| **L4** | Risk & Execution | Risk Center, Execution Monitor, Circuit Breakers, Portfolio Command | Risk violations, order flow, positions |
| **L5** | Governance & Operations | Audit Center, Incident Management, Admin Panel, Knowledge Center | Audit logs, incidents, config, documentation |

---

## 20+ Core Modules

| # | Module | Layer | Key Data Source |
|---|--------|-------|----------------|
| 1 | Executive Dashboard | L1 | All engines |
| 2 | Engine Registry & Health | L2 | Engine manifests + heartbeats |
| 3 | Market Operations | L2 | Ganesh + Suchak + Surya |
| 4 | Intelligence Center | L3 | Arjun / Krishna AI Coaches |
| 5 | Strategy Command | L3 | Vikray + Kuber Alpha |
| 6 | Portfolio Command | L4 | Rakshak + Vega |
| 7 | Risk Center | L4 | Kavach + Rakshak |
| 8 | Execution Monitor | L4 | Vega |
| 9 | Audit Center | L5 | Chitragupta |
| 10 | Infrastructure Monitor | L1 | K8s + Prometheus |
| 11 | API Gateway Monitor | L2 | Kraken API Gateway |
| 12 | Notification Center | L1 | AlertManager |
| 13 | Incident Management | L5 | Internal + AlertManager |
| 14 | Knowledge Center | L5 | Auto-generated from manifests |
| 15 | Administration | L5 | PostgreSQL |
| 16 | AI Operations | L3 | Ollama + ChromaDB |
| 17 | DevOps | L1 | ArgoCD + Docker Registry |
| 18 | Analytics Center | L3 | ClickHouse |
| 19 | Ecosystem Timeline | L1 | Narad + Elasticsearch |
| 20 | Strategy Builder Integration | L3 | Kuber Alpha |

---

## Plugin Framework

Every engine registers via a `manifest.yaml`:

```yaml
apiVersion: dxcc.io/v1
kind: Engine
metadata:
  name: Suchak
  version: 2.3.1
spec:
  ui:
    dashboard:
      widgets:
        - name: indicator-status
          type: metric-grid
          query: suchak_indicators_computed
    configuration:
      - name: ACTIVE_SYMBOLS
        type: string_list
        default: ["NIFTY", "BANKNIFTY"]
  narad:
    subscribes:
      - topic: market.ticks
    publishes:
      - topic: engine.indicators
```

From this manifest, DXCC auto-generates health cards, config forms, documentation pages, and Narad topic visualizations.

---

## Narad Integration

DXCC maintains a persistent WebSocket connection to the Narad Event Bus:

```
[Engine] -> [Narad] -> [Narad WS Gateway] -> [DXCC WebSocket] -> [React State] -> [UI Widget]
```

- JWT-authenticated WebSocket with per-message validation
- Real-time data push; no polling
- Heartbeat ping/pong every 10s; reconnect within 3s
- REST API fallback for historical data and non-real-time operations

---

## Security

- **Authentication:** OAuth2 + JWT flow with SSO integration
- **Authorization:** RBAC with 5 roles: Admin, Trader, Quant, Auditor, Viewer
- **MFA:** Required for Admin, Trader, Quant roles
- **Session:** 30-minute inactivity timeout; 12-hour absolute max
- **Audit:** Every action logged by Chitragupta with Merkle tree integrity verification

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 19 + TypeScript, Zustand, AG Grid, Lightweight Charts / D3 |
| Backend | Go 1.22+, Chi Router, gorilla/websocket |
| Database | PostgreSQL (config + prefs), Redis (cache + sessions) |
| Event Bus | Narad (Rust, 100K msg/sec) |
| Build | Vite (frontend), Go build (backend) |
| Testing | Vitest + Playwright |

---

## Quick Links

| Document | Description |
|----------|-------------|
| [01-overview.md](01-overview.md) | DXCC overview and objectives |
| [02-business-requirements.md](02-business-requirements.md) | Business goals and functional requirements |
| [03-system-requirements.md](03-system-requirements.md) | Technology stack and system requirements |
| [04-high-level-architecture.md](04-high-level-architecture.md) | 5-layer architecture and plugin framework |
| [05-low-level-design.md](05-low-level-design.md) | Component design and data flow |
| [06-components.md](06-components.md) | All 20 DXCC modules detailed |
| [07-data-flow.md](07-data-flow.md) | Complete data flow diagrams |
| [08-topology.md](08-topology.md) | Ecosystem topology and position |
| [09-api-reference.md](09-api-reference.md) | Plugin SDK and REST API endpoints |
| [10-database.md](10-database.md) | PostgreSQL and Redis schema |
| [11-configuration.md](11-configuration.md) | Configuration and customization |
| [12-installation.md](12-installation.md) | Installation guide |
| [13-deployment.md](13-deployment.md) | Deployment environments and procedures |
| [14-monitoring.md](14-monitoring.md) | Health monitoring and metrics |
| [15-security.md](15-security.md) | Authentication, authorization, and audit |
| [16-narad-integration.md](16-narad-integration.md) | WebSocket integration with Narad |
| [17-suraksha-integration.md](17-suraksha-integration.md) | Suraksha security integration |
| [18-failover.md](18-failover.md) | Failover and disaster recovery |
| [19-performance.md](19-performance.md) | Performance targets and optimization |
| [20-testing.md](20-testing.md) | Testing strategy and certification |
| [21-troubleshooting.md](21-troubleshooting.md) | Common issues and solutions |
| [22-faq.md](22-faq.md) | Frequently asked questions |
| [23-roadmap.md](23-roadmap.md) | Development roadmap |
| [24-release-notes.md](24-release-notes.md) | Version history and changes |
| [25-glossary.md](25-glossary.md) | Terminology definitions |

---

> **Next:** See [01-overview.md](01-overview.md) for DXCC objectives and scope.
