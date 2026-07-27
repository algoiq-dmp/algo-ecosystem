# DXCC — Troubleshooting Guide

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## Issue 1: Blank Dashboard (WebSocket Disconnected)

**Symptom:** Executive Dashboard loads with empty widgets; status bar shows "Disconnected."

**Causes:**
- Narad WS Gateway is down or unreachable
- JWT token expired
- Network firewall blocking WSS traffic
- Browser WebSocket support disabled

**Resolution:**

1. Check the browser console for WebSocket errors:
   ```
   WebSocket connection to 'wss://narad-gateway.internal/ws' failed
   ```
2. Verify Narad WS Gateway is running:
   ```bash
   curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
     https://narad-gateway.internal/health
   ```
3. Check network connectivity:
   ```bash
   ping narad-gateway.internal
   telnet narad-gateway.internal 443
   ```
4. If JWT expired, log out and log back in to obtain a fresh token.
5. Try clicking "Retry Connection" in the DXCC status bar.

---

## Issue 2: Stale Data on Widgets

**Symptom:** Widgets show data, but it's clearly not updating; "Stale Data" indicator visible.

**Causes:**
- WebSocket connected but specific topic not subscribed
- Message deduplicator incorrectly filtering messages
- Zustand store update not triggering re-render

**Resolution:**

1. Check subscription status in browser console:
   ```javascript
   // Open DevTools Console
   window.__DXCC__.getSubscribedTopics()
   // Expected: array of active topic subscriptions
   ```
2. Check if the specific topic shows messages:
   ```javascript
   window.__DXCC__.getMessageRate('engine.health.suchak')
   // Expected: number > 0
   ```
3. Force a topic resubscription:
   ```javascript
   window.__DXCC__.resubscribe('engine.health.suchak')
   ```
4. If in REST polling mode (orange indicator), the WebSocket is disconnected. See Issue 1.
5. Clear browser cache and hard refresh (Ctrl+Shift+R).

---

## Issue 3: Slow Table Rendering

**Symptom:** Data tables (Order Blotter, Audit Search results) render slowly or freeze.

**Causes:**
- Too many rows loaded at once (>100K without virtual scrolling)
- Complex column renderers causing excessive DOM updates
- Browser memory pressure from other widgets

**Resolution:**

1. Reduce page size in table settings (default 50, try 25).
2. Apply filters to reduce visible dataset.
3. Check for memory leaks:
   ```javascript
   // DevTools > Performance > Memory
   // Take heap snapshot; compare over time
   ```
4. Verify AG Grid is using virtual scrolling:
   ```javascript
   window.__DXCC__.getGridConfig('order-blotter').rowModelType
   // Expected: 'infinite'
   ```
5. Close unused browser tabs; DXCC requires <500MB per tab.

---

## Issue 4: Login Failure

**Symptom:** Cannot log in; redirected back to login page or error message displayed.

**Causes:**
- SSO provider (Keycloak) is down
- Invalid credentials
- Account disabled or locked
- MFA challenge failed
- OAuth2 client configuration mismatch

**Resolution:**

1. Verify SSO provider is accessible:
   ```bash
   curl https://auth.internal/realms/dxcc/.well-known/openid-configuration
   ```
2. Check if account is active in DXCC Admin Panel (requires another admin).
3. Verify MFA token time sync on your device.
4. Check browser console for OAuth2 redirect errors.
5. Try incognito/private window to rule out cookie issues.
6. If SSO is down, use local admin fallback login:
   ```
   https://dxcc.internal/admin-login?fallback=true
   ```

---

## Issue 5: Missing Engine in Registry

**Symptom:** An engine that should be registered is not visible in the Engine Registry.

**Causes:**
- Engine manifest.yaml is missing or invalid
- Engine not publishing heartbeat to Narad
- Manifest file not in the scanned directory

**Resolution:**

1. Verify manifest exists and is valid YAML:
   ```bash
   cat /etc/dxcc/engines/suchak/manifest.yaml
   yamllint /etc/dxcc/engines/suchak/manifest.yaml
   ```
2. Check manifest schema version (`apiVersion: dxcc.io/v1`).
3. Verify engine is publishing to Narad:
   ```bash
   # Check Narad for engine heartbeat
   narad-cli topic inspect engine.health.suchak --last 1
   ```
4. Trigger manifest rescan from DXCC:
   ```
   POST /api/admin/engines/rescan
   ```
5. Check DXCC backend logs for manifest parsing errors:
   ```bash
   journalctl -u dxcc-backend | grep "manifest"
   ```

---

## Issue 6: Configuration Changes Not Saving

**Symptom:** Changes made in configuration forms revert or show error on save.

**Causes:**
- Insufficient permissions (role cannot write config)
- Backend API timeout
- Validation errors in form (not displayed)
- Concurrent modification conflict

**Resolution:**

1. Verify user has `config.write` or `admin` permissions:
   ```javascript
   window.__DXCC__.getPermissions().includes('config.write')
   ```
2. Check browser console for API error responses (4xx/5xx).
3. Check if another user modified the same config (conflict detection).
4. Reload the page to get the latest config state before editing.
5. Try saving individual parameters rather than bulk save.

---

## Issue 7: Widget Error State

**Symptom:** A widget displays "Error" or red indicator with error message.

**Causes:**
- Data source (Narad topic or REST endpoint) returning errors
- Widget code exception caught by error boundary
- Data format mismatch (schema change)

**Resolution:**

1. Click the error message for detail; note the error code.
2. Check if other widgets using the same data source are also failing.
3. Refresh the specific widget (click refresh icon in widget header).
4. Check Narad topic health:
   ```bash
   narad-cli topic inspect <topic> --stats
   ```
5. If a schema change occurred, the widget may need a code update to handle the new format.
6. Report the error to the DXCC team with the error details and timestamp.

---

## Issue 8: Audit Search Timeout

**Symptom:** Audit search runs for more than 30 seconds or returns timeout error.

**Causes:**
- Searching too wide a date range without filters
- Elasticsearch cluster under load
- Network latency between DXCC and Chitragupta

**Resolution:**

1. Narrow the date range (e.g., from "Last 1 year" to "Last 7 days").
2. Add more specific filters (actor, action, resource type).
3. Use the guided search builder instead of free-text search for common queries.
4. Check Chitragupta (Elasticsearch) health in Infrastructure Monitor.
5. For large exports, use the async export option which emails results when ready.

---

## Issue 9: Alert Not Triggered

**Symptom:** A condition that should generate an alert is not producing one.

**Causes:**
- Alert rule disabled
- Threshold not met (e.g., `for: 5m` hasn't elapsed)
- Alert silenced
- AlertManager not receiving metrics

**Resolution:**

1. Check if the alert rule is enabled in Notification Center > Alert Rules.
2. Verify the alert condition duration: alerts with `for: 5m` require continuous violation.
3. Check active silences in Notification Center > Silences.
4. Verify Prometheus is scraping the metric:
   ```bash
   curl https://prometheus.internal/api/v1/query?query=<metric_name>
   ```
5. Check AlertManager dashboard for the specific alert state.

---

## Issue 10: RBAC Not Working Correctly

**Symptom:** User can see or access modules they shouldn't, or cannot access modules they should.

**Causes:**
- Role permissions misconfigured
- OPA policy not updated after role change
- Suraksha RBAC sync delayed
- Cached permissions from previous role assignment

**Resolution:**

1. Verify the user's role in Admin Panel > Users.
2. Check the role's permissions in Admin Panel > Roles.
3. Force a permissions refresh:
   ```javascript
   window.__DXCC__.refreshPermissions()
   ```
4. Log out and log back in to get fresh JWT with updated claims.
5. Check OPA decision logs:
   ```bash
   curl https://opa.internal/v1/data/dxcc/authz?input=<test_request>
   ```
6. If Suraksha sync delay, manually trigger sync:
   ```
   POST /api/admin/rbac/sync
   ```

---

## Quick Diagnostic Checklist

When experiencing any DXCC issue, run through these checks:

- [ ] Browser console: Any errors? (F12 > Console)
- [ ] WebSocket status: Connected? (Check header status bar)
- [ ] Network tab: API calls succeeding? (F12 > Network)
- [ ] JWT token: Valid and not expired? (Check cookie)
- [ ] User role: Correct for the action? (Check user menu)
- [ ] Backend health: `/api/health` returns 200?
- [ ] Narad health: Narad Monitor shows normal throughput?
- [ ] Database: Infrastructure Monitor shows green for PostgreSQL/Redis?

---

> **Next:** See [22-faq.md](22-faq.md) for frequently asked questions.
