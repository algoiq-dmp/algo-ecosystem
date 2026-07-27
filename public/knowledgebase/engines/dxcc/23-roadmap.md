# DXCC — Development Roadmap

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## Version History & Future Plans

---

## v1.0.0 — "Foundation" (Q1 2026) ✓ RELEASED

**Released:** 2026-03-15

Core operational modules providing basic visibility and control.

### Features Delivered

| Feature | Description |
|---------|-------------|
| Executive Dashboard | System health, P&L, active strategies, order flow, risk overview |
| Engine Registry | Engine list, health cards, basic detail page |
| Strategy Command | Strategy list, detail view, basic deploy flow |
| Portfolio Command | Position matrix, P&L breakdown |
| Risk Center | Violation feed, basic rule management, Suraksha scores |
| Execution Monitor | Order blotter, fill tracking |
| Audit Center | Audit search, timeline, basic export |
| Infrastructure Monitor | K8s node/pod status, database health, backup status |
| Notification Center | Alert inbox, basic rule management |
| Incident Management | Manual incident creation and tracking |
| Knowledge Center | Documentation browser, search |
| Administration | User management, role management |

### Technology
- React 18 + TypeScript
- Zustand for state management
- REST API with polling for data refresh
- PostgreSQL + Redis

---

## v1.5.0 — "Real-Time" (Q2 2026) ✓ RELEASED

**Released:** 2026-05-20

Transition from polling to real-time WebSocket architecture.

### Features Delivered

| Feature | Description |
|---------|-------------|
| Narad WebSocket Integration | Persistent WSS connection replacing REST polling |
| Real-Time Widgets | All dashboard widgets receiving live data pushes |
| WebSocket Reconnection | Auto-reconnect with exponential backoff |
| REST Fallback Mode | Graceful degradation when WebSocket unavailable |
| API Gateway Monitor | Kraken API Gateway traffic and consumer analytics |
| Ecosystem Timeline | Unified event stream with Narad integration |
| Dark Mode | Dark and light theme support |
| Role-Based UI Rendering | Conditional component rendering based on role |
| SSO Integration | Keycloak OIDC integration |

### Technology Changes
- React 19 upgrade
- WebSocket provider architecture
- Narad message router and deduplication

---

## v2.0.0 — "Plugin Framework" (Current, Q3 2026) ✓ RELEASED

**Released:** 2026-07-14

Dynamic plugin framework and AI operations integration.

### Features Delivered

| Feature | Description |
|---------|-------------|
| **Plugin Framework** | Engine auto-discovery via manifest.yaml; dynamic UI generation |
| **Auto-Documentation** | Engine docs generated from manifests and code comments |
| **AI Operations Center** | Coach health, usage analytics, prompt management, cost tracking |
| **Intelligence Center** | AI Chat (Arjun/Krishna), anomaly detection, sentiment, RAG Q&A |
| **Analytics Center** | BI reports, execution quality, custom dashboards, scheduled reports |
| **DevOps Module** | Pipeline monitor, DORA metrics, ArgoCD integration, deployment history |
| **Strategy Builder Integration** | Direct Kuber Alpha integration, signal preview, Greek overlay |
| **Enhanced RBAC** | Granular permissions, Suraksha sync, OPA policy engine |
| **High-Contrast Mode** | Accessibility mode with WCAG 2.1 AA compliance |
| **Widget Performance** | Sub-100ms DOM updates via throttled, batched state updates |

### Breaking Changes
- Engine manifests required for registration (previously manual config)
- Config file schema changed from v1 to v2 (`narad.ws_url` replaces `narad.rest_url`)
- Permission model moved from simple role check to OPA policy engine

### Fixes
- Memory leak in WebSocket message buffer (30% reduction in tab memory)
- Race condition in concurrent config saves
- AG Grid scroll performance for 100K+ row datasets
- Audit search timeout for date ranges over 1 year
- Session expiry not redirecting to login correctly

---

## v2.1.0 — "Customization & Mobile" (Q4 2026) IN PROGRESS

**Planned Release:** 2026-11-15

### Planned Features

| Feature | Description |
|---------|-------------|
| Custom Dashboards | Per-user custom dashboard creation with saved widget configs |
| Advanced Analytics | Custom query builder, multi-dimensional reporting |
| Mobile PWA | Progressive Web App for mobile monitoring and alert response |
| Enhanced Notifications | Rich push notifications, custom alert routing rules |
| Widget Marketplace | Community widget library; installable via manifest |
| Batch Operations | Bulk engine restart, bulk strategy pause/resume |
| Anomaly Detection v2 | ML-based pattern detection with configurable sensitivity |
| Performance Profiler | Built-in widget render profiler and performance recommendations |

---

## v3.0.0 — "Multi-Tenant Platform" (Q2 2027) PLANNED

**Planned Release:** 2027-06-01

### Planned Features

| Feature | Description |
|---------|-------------|
| **Multi-Tenancy** | Isolated tenant workspaces with separate data, users, and configs |
| **White-Label** | Full branding customization per tenant (logo, colors, domain) |
| **Marketplace** | Plugin marketplace for third-party modules, widgets, and integrations |
| **Federated Search** | Cross-tenant search for auditors and platform administrators |
| **Advanced AI Coach** | Multi-turn conversations, proactive recommendations, strategy co-pilot |
| **Compliance Automation** | Automated SEBI report generation, scheduled compliance checks |
| **Cross-Region DR** | Active-active multi-region deployment |
| **Audit Analytics** | ML-powered audit pattern detection and risk scoring |
| **Workflow Engine** | Custom approval workflows for strategy deployment, risk overrides, config changes |

---

## Future Considerations (v3.1+)

| Idea | Priority | Effort |
|------|----------|--------|
| Voice commands via TalkOffice integration | Medium | Large |
| Strategy co-pilot (AI suggests parameter adjustments) | High | Large |
| Real-time collaboration (multiple users on same dashboard) | Low | Large |
| Native desktop app (Electron/Tauri) | Low | Medium |
| Blockchain-based audit trail (public notarization) | Low | Very Large |
| Integration with external trading platforms | Medium | Large |
| Automated strategy backtesting from DXCC | High | Large |
| Natural language audit queries ("Show me all trades by trader1 last week") | Medium | Large |

---

## Release Cadence

| Type | Frequency | Examples |
|------|-----------|----------|
| Major (X.0) | ~6 months | Plugin Framework, Multi-Tenant |
| Minor (X.Y) | ~3 months | Real-Time, Customization |
| Patch (X.Y.Z) | As needed (weekly) | Bug fixes, security patches |
| Hotfix | Within 24 hours | Critical production issues |

---

> **Next:** See [24-release-notes.md](24-release-notes.md) for detailed version history and changelogs.
