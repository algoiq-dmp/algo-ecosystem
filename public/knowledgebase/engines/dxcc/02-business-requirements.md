# DXCC — Business Requirements

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## Business Goals

### 1. Single Pane of Glass

DXCC must provide a unified interface where operators can monitor and manage every component of the Delta XI ecosystem without switching between tools or interfaces. All 18 engines, 20+ modules, risk rules, strategies, and audit logs must be accessible from a single application.

### 2. Real-Time Operational Visibility

All dashboard widgets and status indicators must reflect the current state of the system. No polling, no refresh buttons, no stale data. The platform processes over 100,000 messages per second; the UI must keep pace without manual intervention.

### 3. Governance and Compliance

Every action in the system must be traceable. The audit trail must be immutable, verifiable through Merkle tree hashing, and retained for a minimum of 10 years. Configuration changes must show before/after diffs. Data access must be logged per-user with IP tracking.

### 4. Reduced Operator Cognitive Load

Role-based views must surface only information relevant to the user's role. An auditor should not see trading controls; a trader should not see user management. The platform should filter noise and highlight anomalies through AI-driven pattern detection.

### 5. Zero-Config Engine Onboarding

New engines must be discoverable and integrable without code changes to DXCC. A manifest YAML file should be sufficient for DXCC to auto-create health monitors, configuration forms, documentation pages, and Narad topic visualizations.

---

## Functional Requirements

### FR-1: Engine Auto-Discovery

DXCC shall automatically discover engines by reading their `manifest.yaml` files from the engine registry. Registration must be zero-code: no manual configuration, no database inserts, no UI changes. The manifest defines all UI elements, health checks, configuration parameters, and Narad subscriptions.

### FR-2: Role-Based Views

The UI shall conditionally render components based on the authenticated user's role (Admin, Trader, Quant, Auditor, Viewer). Server-side authorization must validate every API call. Client-side rendering decisions are for UX only; never for security.

### FR-3: Drill-Down Everywhere

Every widget, metric, chart data point, and alert shall be clickable for deeper investigation. Clicking an engine health card navigates to the engine detail page. Clicking a P&L number opens the portfolio breakdown. This must be consistent across all 20 modules.

### FR-4: Auto-Documentation

Engine documentation shall be generated automatically from manifests, code comments, and Avro/Protobuf schema definitions. Manual writing of documentation is prohibited. Documentation must be indexed for RAG-based AI Coach queries.

### FR-5: Real-Time Narad Integration

DXCC shall maintain a persistent WebSocket connection to the Narad WebSocket Gateway. All real-time data shall arrive via this connection. Widgets shall subscribe to Narad topics based on user role and current view, automatically subscribing on mount and unsubscribing on unmount.

### FR-6: REST API Fallback

For operations requiring historical data, configuration CRUD, or audit queries, DXCC shall use REST APIs via the Kraken API Gateway. These must include proper error handling, retry logic, and loading states.

### FR-7: Incident Management

DXCC shall support SEV-0 through SEV-3 incident tracking with integrated timeline, chat, and post-mortem workflow. Incidents shall be creatable from alerts with one click. Runbook SOPs shall be accessible from the incident detail view.

### FR-8: Notification Center

All alerts from AlertManager shall be visible in a centralized notification inbox. Users shall be able to acknowledge, silence, and escalate alerts. Notification preferences (channels, quiet hours, digest mode) shall be configurable per user.

### FR-9: Customizable Dashboard

Users shall be able to drag-and-drop widgets to rearrange their Executive Dashboard layout. Layout preferences shall persist across sessions. Widgets shall be addable and removable per user.

### FR-10: Audit Trail

Every user action and system event shall be recorded by Chitragupta. The audit trail must support full-text search, timeline grouping, before/after diffs, and export in CSV, JSON, and signed PDF formats. Merkle tree integrity verification must be available.

---

## Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | UI Widget Update Latency | <100ms from Narad event to DOM update |
| NFR-2 | Dashboard Availability | 99.9% uptime (excluding planned maintenance) |
| NFR-3 | WebSocket Reconnection | Within 3 seconds of disconnect |
| NFR-4 | Concurrent Users | Support 100+ concurrent active users |
| NFR-5 | Session Timeout | 30 minutes inactivity; 12 hours absolute max |
| NFR-6 | Browser Memory | <500MB per browser tab |
| NFR-7 | Table Rendering | 100K+ rows via AG Grid virtual scrolling |
| NFR-8 | Audit Search Latency | <2 seconds for 1-year range, <5 seconds for 10-year range |
| NFR-9 | API Response Time | P95 <200ms for REST endpoints |
| NFR-10 | Accessibility | WCAG 2.1 AA compliant; high-contrast mode available |

---

## Constraints

- All inter-engine communication must flow exclusively through Narad Event Bus
- No engine may directly access another engine's database
- Frontend must be buildable with Vite and served as static assets
- Backend must compile as a single Go binary with minimal dependencies
- Authentication must integrate with corporate SSO (OIDC/SAML)
- MFA is mandatory for Admin, Trader, and Quant roles

---

> **Next:** See [03-system-requirements.md](03-system-requirements.md) for technology stack and system requirements.
