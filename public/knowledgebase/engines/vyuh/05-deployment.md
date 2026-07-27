# VYUH — Deployment

**Version:** 3.0.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Deployment Steps

1. **Pre-flight checks:** Verify MQ, Lakshmi, Surya, and TalkOptions are healthy. Confirm TimescaleDB connectivity on ALGO IQ 4.
2. **Factor validation:** Run `vyuh-factor-test` to verify all scoring factors produce valid outputs for the configured universe.
3. **Pull artifacts:** Deploy latest build to ALGO IQ 4 via Narad orchestrator.
4. **Database migration:** Run `vyuh-db-migrate --version 3.0.0` to apply ranking and score schema updates in TimescaleDB.
5. **Start services:** Launch vyuh-engine (background scoring worker) → vyuh-api (REST endpoint).
6. **Health check:** Poll `/api/v3/health`. Verify engine evaluating stocks, MQ consumer active, TalkOptions API reachable.
7. **Smoke test:** Query `/rankings?limit=10`. Confirm ranked list with valid composite scores.
8. **Consumer validation:** Verify Kuber Alpha and DXCC receive ranking signals.
