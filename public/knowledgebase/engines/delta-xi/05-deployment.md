# Delta XI — Deployment

**Version:** 3.2.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Deployment Steps

1. **Pre-flight checks:** Confirm MQ, Lakshmi, Surya, and TalkOptions are healthy. Verify TimescaleDB connectivity.
2. **Screener config validation:** Run `dxi-config-validate` to check all active screener configurations for syntax errors and stale references.
3. **Pull artifacts:** Deploy latest build to ALGO IQ 4 via Narad.
4. **Database migration:** Run `dxi-db-migrate --version 3.2.0` to apply TimescaleDB schema updates for signal history hypertables.
5. **Start services:** Launch delta-xi-scanner → delta-xi-signals → delta-xi-api.
6. **Health check:** Poll `/api/v3/health`. Verify MQ consumer active, TalkOptions API reachable, scanner evaluating symbols.
7. **Smoke test:** Query `/signals` endpoint. Confirm signals flowing with valid confidence scores.
8. **Consumer validation:** Verify Kuber Alpha and DXCC receive screening signals.
