# 22 — Troubleshooting
> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24
## Common Issues
### 1. Regime not updating
**Symptom:** Regime stuck on same classification. **Cause:** Suchak data feed stale or ADX computation delayed. **Fix:** Check Suchak health; verify Redis pub/sub flow; restart Manthan pod if needed.
### 2. High analysis latency
**Symptom:** p95 > 200ms. **Cause:** Too many symbols or heavy volume day. **Fix:** Reduce active symbols in watchlist; scale up replicas; check Redis latency.
### 3. Confidence score consistently low
**Symptom:** Confidence < 30 for extended period. **Cause:** Conflicting signals across timeframes or modules. **Fix:** This is normal in choppy markets; verify if data sources are healthy first.
### 4. Module returning stale data
**Symptom:** Analysis timestamp > 2 min old. **Cause:** Ganesh/Lakshmi data source disconnected. **Fix:** Check data source connections; verify network policies; check Kafka consumer lag.
### 5. OI Analysis missing
**Symptom:** OI module returns empty or error. **Cause:** OI data not available for symbol (common for equities vs F&O). **Fix:** Verify symbol is F&O-eligible; check Ganesh OI feed.
## Debug Mode
Set MANTHAN_LOG_LEVEL=debug for detailed per-module computation traces.
