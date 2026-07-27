# 23 — Troubleshooting
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Common Issues
### 1. Greeks not updating
**Symptom:** Stale Greek values. **Cause:** Lakshmi tick feed disconnected. **Fix:** Check Lakshmi connection; verify Kafka consumer group lag.
### 2. High adjustment frequency
**Symptom:** Adjustment signals firing every few minutes. **Cause:** Gamma exposure too high, causing rapid delta drift. **Fix:** Reduce position size or add gamma hedge.
### 3. Neutrality stuck below 50%
**Symptom:** Continuous orange/red zone. **Cause:** Large directional move beyond hedge capacity. **Fix:** Manual intervention; consider emergency position reduction via Rakshak.
### 4. Adjustment cost too high
**Symptom:** Estimated cost > auto-execute threshold. **Cause:** Low liquidity or wide spreads. **Fix:** Wait for liquidity improvement; use alternative hedge instrument.
### 5. Greek calculation errors
**Symptom:** Zero or NaN Greek values. **Cause:** Bad option price data or expired options. **Fix:** Verify option prices; check for expired positions still in system.
## Debug Mode
Set KAVACH_LOG_LEVEL=debug for per-tick Greek trace logs.
