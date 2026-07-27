# TalkDelta — Deployment

**Version:** 5.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Deployment Steps

1. **Pre-flight checks:** Confirm Vega (ALGO IQ 6), MQ, and TalkOptions are healthy. Verify PostgreSQL, TimescaleDB, and Redis connectivity.
2. **Pull artifacts:** Deploy latest build to ALGO IQ 4 via Narad deployment orchestrator.
3. **Database migration:** Run `talkdelta-db-migrate --version 5.1.0` to apply TimescaleDB hypertable and PostgreSQL schema updates.
4. **MQ binding:** Ensure `vega.trade.confirmations` queue is bound and consumer group is registered. Verify TalkOptions API connectivity.
5. **Start services:** Launch in order: talkdelta-stream → talkdelta-analytics → talkdelta-api → talkdelta-dashboard.
6. **Health check:** Poll `/api/v5/health`. Confirm MQ consumer lag < 100ms, API p99 < 300ms, WebSocket connections active.
7. **Smoke test:** Query `/strategies` endpoint. Verify trade data flowing from Vega through to dashboard.
8. **Consumer validation:** Confirm Kavach, Chitragupta, TalkDelta AI, and Simulator receive analytics data.
