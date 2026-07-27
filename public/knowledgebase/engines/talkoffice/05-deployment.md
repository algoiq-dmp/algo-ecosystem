# TalkOffice — Deployment

**Version:** 4.0.0 | **Owner:** Operations | **Last Updated:** 2026-07-24

## Deployment Steps

1. **Pre-flight checks:** Verify Vega (ALGO IQ 6) and MQ are healthy. Confirm PostgreSQL connectivity on ALGO IQ 19.
2. **Pull artifacts:** Deploy latest build to ALGO IQ 19 via Narad deployment orchestrator.
3. **Database migration:** Run `talkoffice-db-migrate --version 4.0.0` to apply schema updates (position tables, margin logs, audit tables).
4. **MQ binding:** Ensure `vega.trade.confirmations` queue consumer is registered. Validate broker API credentials through Suraksha.
5. **Start services:** Launch talkoffice-oms → talkoffice-rms → talkoffice-dashboard in sequence.
6. **Health check:** Poll `/api/v4/health`. Verify MQ consumer connected, DB accessible, MTM calculation active.
7. **Smoke test:** Query `/positions` endpoint. Confirm positions reconcile with Vega trade confirmations.
8. **Consumer validation:** Verify DXCC receives risk reports and Chitragupta receives audit data.
