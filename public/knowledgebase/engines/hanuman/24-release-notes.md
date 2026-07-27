# 24 — Release Notes

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Release v2.1.0 — "Circuit Breaker & Signature"

**Release Date:** 2026-07-01
**Build:** `hanumand-2.1.0+build.245`
**Git Tag:** `hanuman-v2.1.0`

### Highlights

- Circuit breaker prevents runaway strategies (auto-pause after N consecutive losses)
- Strategy signature verification ensures only authorized strategies run in production
- Enhanced partial fill handling with lot-size-aware quantity adjustment
- Vega v4.2 framework support with improved strategy lifecycle management

### New Features

- **Circuit Breaker:** Configurable per strategy. Default: 5 consecutive losses triggers 15-minute cooldown. Strategy auto-pauses; manual review required to resume.
- **Strategy Signing:** Production strategy files must be cryptographically signed by authorized developers. Signature verified at load time via Suraksha.
- **Smart Partial Fills:** Lot-size-aware quantity adjustment. If adjusted quantity < 1 lot, triggers auto-hedge instead of placing unfillable order.
- **Real-Time P&L Streaming:** Per-strategy P&L published to MQ topic `hanuman.pnl.{strategy_id}` at 100ms intervals for dashboard consumption.
- **Vega v4.2 Support:** New strategy lifecycle states, improved parameter validation, nested strategy composition.

### Improvements

- Spread calculation accuracy improved to < 0.001 tick (was 0.01 tick)
- Strategy load time reduced 40% (Vega parser optimization)
- Risk check caching: same (strategy, position) state reuses last risk response for 1 second
- Audit log compression: 3x size reduction using Zstandard

### Bug Fixes

- **HM-421:** Partial fill on Leg 1 causing incorrect Leg 2 quantity when hedge_ratio != 1.0 (fixed: ratio-aware quantity calculation)
- **HM-415:** P&L calculation double-counting STT on cancelled orders (fixed: only count STT on filled orders)
- **HM-408:** Race condition in strategy unload while signal being evaluated (fixed: read-write lock on strategy state)
- **HM-399:** Vega parser rejecting valid comments after strategy parameter block (fixed: comment handling in parser grammar)

### Breaking Changes

- **Vega DSL:** Strategy files must include `VERSION` directive. Legacy files without version default to "1.0" but trigger a deprecation warning.
- **CLI:** `hanumanctl load` now requires `--signature` flag for production environments. Use `--unsigned` flag for dev/UAT.
- **Config:** `risk` section restructured. Old format deprecated but supported until v2.3.0.

### Known Issues

- **HM-429:** Circuit breaker may trip prematurely during market open volatility spike (09:15-09:20). Workaround: increase `max_consecutive_losses` during market open.
- **HM-431:** Auto-hedge market orders may get poor fills in illiquid instruments. Workaround: configure auto-hedge order type as LIMIT with configurable limit offset.
