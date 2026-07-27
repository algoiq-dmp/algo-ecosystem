# DXCC — Release Notes

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## v2.0.0 — "Plugin Framework" (2026-07-14)

### Major Features

**Plugin Framework**
- Engine auto-discovery via `manifest.yaml` files
- Dynamic UI generation from manifest specifications
- Auto-generated health monitoring cards, configuration forms, documentation pages
- Narad topic subscription and publication auto-visualization
- Prometheus alert rule auto-registration from manifest health checks
- Knowledge Base auto-indexing for RAG-based AI Coach queries

**AI Operations Center**
- Coach health monitoring (inference latency, token usage, error rate)
- Usage analytics (query volume, top users, popular topics)
- Quality metrics (hallucination rate, relevance scores, user feedback)
- Prompt management with versioning
- Knowledge Base status monitoring (index date, document count, chunk count)
- Model configuration (model selection, temperature, context window)
- Per-user memory management with purge options
- LLM API cost tracking (daily/weekly/monthly)

**Intelligence Center**
- AI Chat interface powered by Arjun (full) and Krishna (lite) AI Coaches
- AI-generated strategy suggestions based on market conditions
- Anomaly detection with severity and explanation
- News sentiment scoring for tracked symbols
- AI-detected chart pattern recognition with confidence scores
- Knowledge Q&A powered by RAG over the Knowledge Base

**Analytics Center**
- Performance reports (strategy, desk, overall P&L)
- Risk reports (daily summary, limit utilization, violation trends)
- Execution quality analysis (slippage, fill rate, venue analysis)
- Custom report builder with drag-and-drop query interface
- Scheduled reports with auto-email (daily, weekly, monthly)
- Data export to CSV, Excel, and PDF

**DevOps Module**
- CI/CD pipeline monitoring with status and duration
- DORA metrics dashboard (deployment frequency, lead time, MTTR, change failure rate)
- Environment status matrix (Dev, QA, UAT, Prod)
- ArgoCD integration with sync status and drift detection
- Container registry with vulnerability scan results
- Feature flag management via LaunchDarkly integration
- Deployment history with rollback capability

**Strategy Builder Integration**
- Direct Kuber Alpha IDE integration
- Signal preview before deployment
- Real-time Greeks overlay from Talkdelta
- Strategy version control with diff and rollback
- Churn simulation via Manthan

### Enhancements

- React upgraded to v19 with concurrent rendering
- WebSocket performance: batched state updates at 16ms intervals
- Widget render time: sub-100ms from Narad event to DOM update
- AG Grid virtual scrolling for 100K+ row datasets
- Redis-backed session state enables session survival across backend restarts
- OPA policy engine replaced simple role-check authorization
- Custom RBAC roles supported beyond the 5 built-in
- High-contrast accessibility mode with WCAG 2.1 AA compliance
- Enhanced audit search with async export for large result sets

### Breaking Changes

| Change | Migration |
|--------|-----------|
| Engine registration requires `manifest.yaml` | Create manifest for each engine following the `dxcc.io/v1` schema |
| Config schema v1 → v2 | Migrate `narad.rest_url` to `narad.ws_url`; add `narad.topics` section |
| Permission model changes | Review custom role definitions; migrate to OPA Rego policies |
| `useEngineData` hook deprecated | Replace with `useNaradSubscription` and `useApiQuery` from Plugin SDK |

### Bug Fixes

- **Memory Leak:** Fixed WebSocket message buffer accumulating unreleased references (30% memory reduction per tab)
- **Race Condition:** Fixed concurrent configuration saves overwriting each other
- **Table Performance:** Fixed AG Grid freezing on datasets exceeding 100K rows
- **Audit Timeout:** Fixed audit search timing out for date ranges over 1 year
- **Session Redirect:** Fixed expired sessions not redirecting to login correctly
- **RBAC Glitch:** Fixed permission cache not invalidating after role change
- **Chart Memory:** Fixed OHLC charts retaining all historical data points in memory
- **WebSocket Leak:** Fixed abandoned WebSocket connections on rapid module navigation
- **Theme Flicker:** Fixed dark/light theme flashing on initial page load

### Known Issues

- Plugin manifest hot-reload requires manual rescan in production (will be automatic in v2.1)
- iOS Safari may experience occasional WebSocket disconnects on network change
- Firefox ESR 115: AG Grid column resize performance issue (fix pending in v2.0.1)
- Custom role permissions added during Suraksha sync may require second sync to fully propagate

---

## v1.5.0 — "Real-Time" (2026-05-20)

### Major Features

- Persistent WebSocket connection to Narad Event Bus replacing REST polling
- Real-time data push for all dashboard widgets
- Auto-reconnection with exponential backoff (1s → 2s → 3s)
- REST API fallback mode when WebSocket unavailable
- API Gateway Monitor with traffic analytics, rate limit management, WAF dashboard
- Ecosystem Timeline with unified Narad event stream, filtering, and correlation
- Dark mode and light mode theme support
- Role-based UI rendering with conditional component visibility
- SSO integration with Keycloak OIDC

### Bug Fixes (v1.5.0)

- **Order Blotter:** Fixed stale order status not updating after manual refresh
- **Strategy Deploy:** Fixed wizard getting stuck at step 4 (approval) for non-admin users
- **Risk Heatmap:** Fixed color scale incorrectly showing all cells as green
- **Login Loop:** Fixed SSO callback redirecting to login page instead of dashboard
- **Mobile View:** Fixed sidebar not collapsing on viewport width < 1024px

---

## v1.0.0 — "Foundation" (2026-03-15)

### Major Features

- **Executive Dashboard:** System health summary, today's P&L, active strategies, order flow, top movers, risk overview, market status
- **Engine Registry:** Engine list with search, filter, sort; health indicators; basic detail page
- **Strategy Command:** Strategy list with status and P&L; detail view with performance, signals, orders
- **Portfolio Command:** Position matrix, P&L breakdown, exposure analysis
- **Risk Center:** Violation feed, basic risk rule management, Suraksha score dashboard
- **Execution Monitor:** Order blotter with status tracking, fill log
- **Audit Center:** Audit search by actor/action/resource/date; timeline view; CSV export
- **Infrastructure Monitor:** K8s cluster view, database health, backup status
- **Notification Center:** Alert inbox, basic alert rule management
- **Incident Management:** Manual incident creation, tracking, and resolution
- **Knowledge Center:** Documentation browser and full-text search
- **Administration:** User CRUD, role management, API key management

### Technology Stack (v1.0.0)
- React 18 + TypeScript
- Zustand for client state management
- React Query (TanStack) for server state
- AG Grid Community for data tables
- Lightweight Charts for OHLC visualization
- REST API with 10-second polling interval
- PostgreSQL 15 for user data and preferences
- Redis 7 for session store

### Known Issues (v1.0.0, resolved in later versions)
- Dashboard could show data up to 10 seconds stale (resolved in v1.5.0 with WebSocket)
- No high-contrast accessibility mode (added in v2.0.0)
- Engine registration required manual database inserts (resolved in v2.0.0 with Plugin Framework)
- Documentation pages manually maintained (auto-generated in v2.0.0)

---

## Version Numbering Convention

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes, major architectural shifts, new platform capabilities
MINOR: New features, new modules, backwards-compatible enhancements
PATCH: Bug fixes, security patches, dependency updates
```

---

> **Next:** See [25-glossary.md](25-glossary.md) for terminology definitions.
