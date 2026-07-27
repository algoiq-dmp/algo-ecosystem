# TalkStrategy API — Deployment

**Version:** 2.8.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

## Deployment Steps

1. **Pre-flight checks:** Verify TalkStrategy App (ALGO IQ 6:3141) is healthy. Confirm Redis connectivity. Validate all upstream engine API keys.
2. **Validator rule sync:** Run `tsa-rules-sync` to load latest symbol master, lot sizes, and trading restrictions from Surya.
3. **Pull artifacts:** Deploy latest build to ALGO IQ 6 via Narad orchestrator.
4. **Start services:** Launch talkstrategy-api (includes embedded validator as middleware).
5. **Health check:** Poll `/api/v2/health`. Verify TalkStrategy App reachable, Redis connected, validator rules loaded.
6. **Smoke test:** Submit a test execution via `/execute`. Confirm accepted response, verify status tracking via `/execute/:id/status`.
7. **Consumer validation:** Test execution submissions from Kuber Alpha, Strategy Factory, AALAP Calls, Delta XI, VYUH, SpreadWatch, and Suchak.
