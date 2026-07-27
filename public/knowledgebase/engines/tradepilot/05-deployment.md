# TradePilot — Deployment

**Version:** 2.2.0 | **Owner:** Operations | **Last Updated:** 2026-07-24

## Deployment Steps

1. **Pre-flight checks:** Confirm PostgreSQL connectivity on ALGO IQ 4. Verify Strategy Factory API is reachable for forwarding approved strategies.
2. **Regulatory rule sync:** Run `tp-rules-sync` to pull latest SEBI and exchange compliance rule definitions into the database.
3. **Pull artifacts:** Deploy latest build to ALGO IQ 4 via Narad orchestrator.
4. **Database migration:** Run `tp-db-migrate --version 2.2.0` to apply client, strategy, and approval schema updates.
5. **Start services:** Launch tradepilot-onboarding → tradepilot-workflow.
6. **Health check:** Poll `/api/v2/health`. Verify DB accessible, workflow engine running, KYC provider reachable.
7. **Smoke test:** Submit a test client onboarding and strategy approval. Verify workflow stages advance correctly and audit records are created.
8. **Consumer validation:** Confirm approved strategies reach Strategy Factory with correct clearance metadata.
