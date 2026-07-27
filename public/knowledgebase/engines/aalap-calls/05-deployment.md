# AALAP Calls — Deployment

**Version:** 2.5.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Deployment Steps

1. **Pre-flight checks:** Verify MQ, Ganesh, TalkOptions, Surya, and Lakshmi are healthy. Confirm TimescaleDB connectivity. Check all strategy config files exist and are valid YAML.
2. **Strategy validation:** Run `aalap-strategy-validate --all` to verify each strategy's logic, dependencies, and parameter ranges.
3. **Pull artifacts:** Deploy latest build to ALGO IQ 4 via Narad orchestrator.
4. **Database migration:** Run `aalap-db-migrate --version 2.5.0` for signal history schema updates.
5. **Start services:** Launch all 15 strategy engines (ports 3031-3044) → aalap-signals aggregator (port 3030).
6. **Health check:** Poll `/api/v2/strategies`. Verify all 15 strategies show `online` status with current timestamps.
7. **Smoke test:** Query `/signals`. Confirm signals flowing from active strategies with valid payloads.
8. **Consumer validation:** Verify Kuber Alpha receives aggregated signal feed. Confirm no duplicate signals in a 5-second window.
