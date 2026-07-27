# 18 — API Endpoints
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Base URL
https://rakshak.internal.algoiq.io/api/v2
## Authentication
mTLS + X-API-Key + X-Consumer-ID.
## Endpoints
### 1. Get Hedge Requirements
GET /hedge-requirements?strategy_id={id} — Returns required hedge sizing and instruments.
### 2. Get Risk Assessment
GET /risk-assessment?strategy_id={id} — Returns tail, gap, overnight, event risk scores.
### 3. Get Portfolio Protection
GET /portfolio-protection?portfolio_id={id} — Returns cross-strategy correlation and concentration.
### 4. Get Event Calendar
GET /events?from={date}&to={date} — Returns upcoming events with impact levels.
### 5. Check Emergency Status
GET /emergency-status — Returns if emergency mode is active.
### 6. Get Dynamic Hedge Ratio
GET /dynamic-hedge?strategy_id={id} — Returns current dynamic hedge ratio.
### 7. Pre-Trade Hedge Check
POST /pre-trade-check — Validates proposed position against protection rules.
### 8. Streaming (WebSocket)
wss://rakshak.internal.algoiq.io/ws/v2/stream — Real-time risk and protection updates.
### 9. Health
GET /health -> {"status":"healthy","version":"2.3.0","emergency_mode":false,"strategies_protected":12}
## Error Codes
| Code | Description |
|------|-------------|
| 400 | Invalid parameters |
| 403 | Position rejected (risk limits) |
| 404 | Strategy not found |
| 503 | Protection degraded |
