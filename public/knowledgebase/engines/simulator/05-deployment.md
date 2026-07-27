# Simulator — Deployment

**Version:** 3.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Deployment Steps

1. **Pre-flight checks:** Verify TalkDelta API, Ganesh, MQ, and Lakshmi are healthy. Confirm PostgreSQL and TimescaleDB connectivity on ALGO IQ 4.
2. **Data availability check:** Run `sim-data-verify` to confirm minute trade data from TalkDelta and OHLC data from Ganesh are available for the required lookback period.
3. **Pull artifacts:** Deploy latest build to ALGO IQ 4 via Narad orchestrator.
4. **Database migration:** Run `sim-db-migrate --version 3.0.0` for simulation run and metrics schema updates.
5. **Start services:** Launch simulator-engine → simulator-api.
6. **Health check:** Poll `/api/v3/health`. Verify TalkDelta API reachable, MQ connected, DB writable.
7. **Smoke test:** Submit a short backtest (1 week, 1 strategy). Confirm run completes and generates valid performance metrics.
8. **Consumer validation:** Verify Parikshak can fetch simulation results and Strategy Factory can submit test scenarios.
