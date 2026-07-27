# TalkDelta AI — Deployment

**Version:** 1.4.0 | **Owner:** AI/ML | **Last Updated:** 2026-07-24

## Deployment Steps

1. **Pre-flight checks:** Verify TalkDelta (ALGO IQ 4:3005), MQ, Lakshmi, Surya, and TalkOptions are healthy. Confirm MongoDB and Redis connectivity.
2. **Model validation:** Run `tai-model-validate` to verify latest trained models pass accuracy thresholds (>85% precision, >70% recall).
3. **Pull artifacts:** Deploy latest build to ALGO IQ 4 via Narad.
4. **Feature cache warmup:** Run `tai-feature-warmup` to pre-populate Redis feature cache with last 100 data points per symbol.
5. **Start services:** Launch talkdelta-ai-engine → talkdelta-ai-ml (background worker) → talkdelta-ai-api.
6. **Health check:** Poll `/api/v1/health`. Verify model loaded, inference latency < 500ms, MQ consumer active.
7. **Smoke test:** Query `/signals` endpoint. Expect non-empty signal list with confidence scores.
8. **Consumer validation:** Confirm Kuber Alpha receives AI signals via API.
