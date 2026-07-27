# 22 — Troubleshooting
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Common Issues
### 1. Pre-trade checks rejecting valid positions
**Symptom:** Positions being rejected despite appearing valid. **Cause:** Volatility regime elevated, increasing hedge requirements. **Fix:** Reduce position size or accept higher hedge cost.
### 2. Emergency mode false activation
**Symptom:** Emergency mode triggered but market appears normal. **Cause:** Data feed spike causing phantom P&L drop. **Fix:** Verify data integrity; add sanity check before emergency trigger; implement 2-of-3 voting across replicas.
### 3. Hedge costs exceeding budget
**Symptom:** Dynamic hedging generating expensive adjustments. **Cause:** Correlation breakdown making hedge expensive. **Fix:** Reduce position size; switch to lower-cost hedge instrument (futures vs options).
### 4. Event calendar missing events
**Symptom:** Event passes without pre-event hedge. **Cause:** Calendar sync failure. **Fix:** Manual entry; verify PostgreSQL replication; add backup calendar source.
### 5. Gap risk limit too tight
**Symptom:** Forced to close too many positions EOD. **Cause:** Gap risk parameters too conservative. **Fix:** Review historical gap data; adjust thresholds per instrument.
## Debug Mode
Set RAKSHAK_LOG_LEVEL=debug for detailed protection assessment logs. Use with caution in production — generates high log volume.
