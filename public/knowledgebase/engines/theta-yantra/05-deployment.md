# Theta Yantra — Deployment

**Version:** 3.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Deployment Steps

1. **Pre-flight checks:** Verify Ganesh and MQ are healthy. Confirm TimescaleDB connectivity. Validate GPU availability and CUDA driver version (>=12.0).
2. **Model calibration:** Run `ty-calibrate-models` to calibrate SABR/SVI parameters against the latest market data before going live.
3. **Pull artifacts:** Deploy latest build to ALGO IQ 6 via Narad orchestrator.
4. **Database migration:** Run `ty-db-migrate --version 3.1.0` for Greeks and pricing schema updates in TimescaleDB.
5. **GPU warmup:** Run `ty-gpu-warmup` to load CUDA kernels and pre-allocate GPU memory.
6. **Start services:** Launch theta-yantra-pricing → theta-yantra-greeks (API).
7. **Health check:** Poll `/api/v3/health`. Verify GPU accessible and initialized, MQ consumer active, pricing models loaded.
8. **Smoke test:** Query `/greeks/advanced?symbol=NIFTY&expiry=near`. Verify all Greeks return valid numeric values. Query `/pricing/theoretical` and confirm prices within expected bounds.
9. **Consumer validation:** Verify TalkOptions and TalkDelta receive advanced analytics via REST API.
