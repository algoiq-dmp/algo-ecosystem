# TalkOptions — Deployment

**Version:** 4.7.2 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Deployment Steps

1. **Pre-flight checks:** Verify Ganesh, MQ, and Surya are online and healthy. Confirm PostgreSQL and InfluxDB connectivity.
2. **Pull artifacts:** Deploy latest talkoptions artifacts via Narad deployment orchestrator to ALGO IQ 18.
3. **Database migration:** Run `talkoptions-db-migrate --version 4.7.2` against PostgreSQL to apply schema changes.
4. **Configuration sync:** Push updated `config.yaml` via Narad config management. Validate MQ queue bindings and DB credentials.
5. **Start services:** Launch in order: talkoptions-core → talkoptions-analytics → talkoptions-api. Each validates downstream dependencies before proceeding.
6. **Health verification:** Poll `/api/v4/health` endpoint. Verify Greeks computation, MQ connectivity, and DB write throughput.
7. **Smoke test:** Query `/option-chain?symbol=NIFTY&expiry=near` and confirm valid JSON response with expected fields.
8. **Consumer validation:** Confirm Delta XI, VYUH, SpreadWatch, TalkDelta, and AALAP Calls receive options data.
9. **Monitoring:** Grafana dashboards track API latency (p99 < 200ms), MQ consumer lag (< 50ms), and error rate (< 0.1%).
