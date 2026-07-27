# SpreadWatch — Deployment

**Version:** 2.8.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Deployment Steps

1. **Pre-flight checks:** Verify MQ and TalkOptions are healthy. Confirm TimescaleDB connectivity on ALGO IQ 4.
2. **Pair config validation:** Run `sw-config-validate` to check all registered pairs for valid symbols, expiries, and ratio definitions.
3. **Pull artifacts:** Deploy latest build to ALGO IQ 4 via Narad orchestrator.
4. **Database migration:** Run `sw-db-migrate --version 2.8.0` to apply spread history hypertable updates.
5. **Start services:** Launch spreadwatch-engine → spreadwatch-api.
6. **Health check:** Poll `/api/v2/health`. Verify MQ consumer active, TalkOptions reachable, spread calculations running.
7. **Smoke test:** Query `/spreads`. Confirm spread signals generated with deviation metrics.
8. **Consumer validation:** Verify Kuber Alpha and DXCC receive spread and arbitrage signals.
