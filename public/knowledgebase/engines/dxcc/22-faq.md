# DXCC — Frequently Asked Questions

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## General

**Q1: What is DXCC?**
DXCC (Delta XI Command Center) is the unified operational interface for the entire Delta XI algorithmic trading ecosystem. It provides a single pane of glass for monitoring, managing, and governing all 18 engines, strategies, risk rules, and audit trails.

**Q2: What does DXCC stand for?**
Delta XI Command Center. It functions as the "operating system" of the trading platform.

**Q3: What is the core philosophy of DXCC?**
"If it's not in DXCC, it doesn't exist in the system." DXCC is the authoritative interface for visibility, control, intelligence, governance, and operations.

**Q4: Who uses DXCC?**
Five roles: Admin (full access), Trader (strategy and order management), Quant (analytics and AI), Auditor (compliance and audit), and Viewer (read-only observation).

---

## Architecture

**Q5: How many layers does DXCC have?**
Five internal layers: L1 Data & Connectivity, L2 Platform Services & Intelligence, L3 Strategy & Analysis, L4 Risk & Execution, L5 Governance & Operations.

**Q6: How many modules does DXCC have?**
20+ modules organized across the 5 layers, including Executive Dashboard, Engine Registry, Market Operations, Strategy Command, Risk Center, Audit Center, and more.

**Q7: How does DXCC connect to engines?**
DXCC does not connect directly to engines. All inter-engine communication flows via the Narad Event Bus. DXCC subscribes to Narad topics for real-time data and uses REST APIs for historical/config data.

**Q8: What is the Plugin Framework?**
A system where each engine auto-registers via a `manifest.yaml` file. DXCC reads the manifest and automatically generates health monitors, configuration forms, documentation pages, and Narad topic visualizations.

---

## Engines and Registration

**Q9: How do engines register with DXCC?**
By placing a valid `manifest.yaml` in the engine registry directory. DXCC scans for manifests, validates them, and auto-generates all UI components. No code changes or database inserts are required.

**Q10: What information is in a manifest.yaml?**
Engine metadata (name, version, description), UI configuration (widgets, health checks), configuration parameters with validation, Narad topic subscriptions and publications, and documentation source paths.

**Q11: How many engines are in the ecosystem?**
18 engines across four domains: Market Data (Feed, Ganesh, Surya, Suchak), Delta XI Analytical (Kohli, Rohit, Bumrah, Jadeja, Dhoni, Sachin), Execution & Strategy (Manthan, Kuber Alpha, Kavach, Vega), and Risk & Platform (Rakshak, Chitragupta, Narad, TalkOffice).

**Q12: What happens if an engine's heartbeat stops?**
After 30 seconds without a heartbeat, the engine status changes to Yellow (degraded). After 60 seconds, Red (unresponsive). After 120 seconds, a SEV-1 incident is auto-created.

---

## Real-Time Data

**Q13: How does real-time data work in DXCC?**
DXCC maintains a persistent WebSocket connection to the Narad WS Gateway. All widgets subscribe to Narad topics. When an engine publishes an event to Narad, it flows through: Engine → Narad → Narad WS Gateway → DXCC WebSocket → React State → UI Widget. Target latency: <100ms.

**Q14: Does DXCC use polling?**
No. All real-time data is streamed via WebSocket. REST API polling is used only as a fallback when the WebSocket connection is lost.

**Q15: What topics does DXCC subscribe to?**
Core topics include `engine.health.*`, `market.*`, `strategy.*`, `order.*`, `risk.*`, `audit.*`, `alert.*`, and `narad.metrics`. Subscriptions are dynamic based on the user's role and currently active module.

---

## Security

**Q16: How does authentication work?**
DXCC uses OAuth2 + JWT with SSO integration (Keycloak, Azure AD, Okta). Users authenticate through their corporate identity provider and receive a JWT with role and permission claims.

**Q17: What RBAC roles exist?**
Admin, Trader, Quant, Auditor, and Viewer. Each role has a distinct set of permissions controlling which modules and actions are accessible.

**Q18: Is MFA required?**
Yes, for Admin, Trader, and Quant roles. MFA is enforced at the SSO provider level via TOTP authenticator apps. Auditor and Viewer roles have optional MFA.

**Q19: How long does a session last?**
30 minutes of inactivity triggers automatic logout. Maximum session duration is 12 hours, after which re-authentication is required. Maximum 3 concurrent sessions per user.

**Q20: Is everything audited?**
Yes. Every action in DXCC is logged by Chitragupta: page views, button clicks, API calls, configuration changes, data exports, and session events. The audit trail is immutable with Merkle tree integrity verification and 10-year retention.

---

## Customization

**Q21: How do I customize my dashboard layout?**
Drag and drop widgets on the Executive Dashboard to rearrange them. Click "Add Widget" to browse and add new widgets. Click "x" on a widget header to remove it. Layout is saved per user and persists across sessions.

**Q22: Can I create custom roles?**
Yes. Admins can create custom roles in Administration > Roles with granular permissions beyond the 5 built-in roles. Custom roles are not overwritten during Suraksha RBAC synchronization.

**Q23: How do I add a new module to DXCC?**
1. Define the module in the DXCC module registry. 2. Implement the React component using the DXCC Plugin SDK. 3. Define Narad subscriptions and REST endpoints. 4. Register the module in navigation with role-based visibility. 5. Add RBAC permissions.

**Q24: Does DXCC support dark mode?**
Yes. DXCC supports light, dark, and high-contrast accessibility modes. Theme is set per user in Settings and persists across sessions.

**Q25: Can I change my notification preferences?**
Yes. Per-user preferences include notification channels per severity (Slack, email, PagerDuty), quiet hours schedule, and digest mode for batched alert summaries.

---

## Operations

**Q26: What is the market open routine?**
1. Log in to DXCC. 2. Verify System Health Summary — all green. 3. Check all engine heartbeats. 4. Verify Narad throughput normal. 5. Confirm market data flowing. 6. Verify risk rules active. 7. Confirm strategies green. 8. Clear overnight alerts. 9. Complete SOP-08 checklist.

**Q27: How do I respond to an incident?**
1. Alert appears in Notification Center. 2. Click to view details. 3. Open Incident Management; create incident from alert in one click. 4. Assign severity and declare incident commander. 5. Use Engine Health and Narad Monitor for diagnostics. 6. Execute SOP from Knowledge Center. 7. Post-resolution: complete post-mortem.

**Q28: How do I deploy a new strategy?**
Use the Strategy Command > Deploy Strategy wizard: Upload strategy → Configure parameters → Run in dry-run mode → Review performance (min 5 sessions) → Get Risk Manager approval → Deploy to live.

---

## Troubleshooting

**Q29: Why is my dashboard blank?**
Most likely the WebSocket connection to Narad is down. Check the status bar for "Disconnected." Try clicking "Retry Connection." If persistent, check network connectivity and verify Narad WS Gateway is running.

**Q30: Why am I seeing stale data?**
If the WebSocket indicator shows "REST" or "Fallback," real-time data is unavailable. Data is being served from cache. Wait for WebSocket reconnection, or refresh the page.

---

> **Next:** See [23-roadmap.md](23-roadmap.md) for the DXCC development roadmap.
