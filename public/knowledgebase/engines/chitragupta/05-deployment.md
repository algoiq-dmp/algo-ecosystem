# Chitragupta — Deployment

**Version:** 3.0.0 | **Owner:** Compliance | **Last Updated:** 2026-07-24

## Deployment Steps

1. **Pre-flight checks:** Verify Vega (ALGO IQ 6), TalkDelta (ALGO IQ 4), and MQ are healthy. Confirm PostgreSQL and Elasticsearch connectivity.
2. **Audit chain validation:** Run `chg-chain-verify` to confirm existing audit hash chain is intact before deployment.
3. **Pull artifacts:** Deploy latest build to ALGO IQ 6 via Narad orchestrator.
4. **Database migration:** Run `chg-db-migrate --version 3.0.0` for audit schema updates. Reindex Elasticsearch if schema changed.
5. **MQ binding:** Ensure Vega trade confirmation queue consumer group is registered.
6. **Start services:** Launch chitragupta-audit → chitragupta-compliance.
7. **Health check:** Poll `/api/v3/health`. Verify MQ consumer active, TalkDelta API reachable, ES cluster green.
8. **Smoke test:** Query `/audit/trades?date=today`. Confirm events flowing. Run `/integrity/verify` to validate hash chain.
9. **Compliance validation:** Generate a daily report via `/compliance/reports/generate` and verify output format.
