# TalkStrategy App — Deployment

**Version:** 2.5.0 | **Owner:** Frontend | **Last Updated:** 2026-07-24

## Deployment Steps

1. **Pre-flight checks:** Verify TalkStrategy API (ALGO IQ 6:3140) and Vega Order Processor (ALGO IQ 6:9095) are healthy. Confirm no active WebSocket connections from previous deployment.
2. **UI build:** Run `tsapp-ui-build` to compile and bundle the strategy management dashboard frontend assets.
3. **Pull artifacts:** Deploy latest build to ALGO IQ 6 via Narad orchestrator.
4. **Start services:** Launch TalkStrategy App (middleware + embedded UI server on port 3141).
5. **Health check:** Poll `/api/v2/health`. Verify API and Vega connectivity, WebSocket server accepting connections.
6. **Smoke test:** Submit a test execution through the full pipeline: API → App → Vega. Confirm request routed, acknowledgment received, status tracked.
7. **UI validation:** Open strategy management dashboard in browser. Verify real-time execution flow displayed via WebSocket.
