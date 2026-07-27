# 24 — Changelog

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Version 3.0.0 (2026-06-15)

### Major Changes
- Complete UI redesign with new Canvas Engine (react-flow v12).
- Multi-portfolio allocation support — manage multiple portfolios in a single strategy.
- New block types: Composite Signal, Switch/Case, Parallel Split, Merge.
- Risk-Parity allocation method added.
- Real-time collaboration (beta) — up to 3 simultaneous editors.
- Monte Carlo simulation integration in export pipeline.

### Improvements
- Export JSON schema updated to v3 (breaking change from v2.x).
- Compiler performance: 40% faster for strategies with 100+ blocks.
- Auto-save now uses differential snapshots (reduced storage by 60%).
- Undo/redo stack increased from 30 to 50 operations.
- Block search in palette with fuzzy matching.

### Bug Fixes
- Fixed: Circular dependency detection missed indirect cycles.
- Fixed: Trailing stop-loss not respecting step size.
- Fixed: Export timeout on strategies with deeply nested loops.
- Fixed: Canvas rendering glitch on high-DPI displays.

---

## Version 2.5.0 (2026-04-01)

### Features
- Kelly Criterion position sizing model.
- Walk-forward optimization mode in Simulator integration.
- Ganesh data quality integration.
- Strategy cloning with one click.
- Export format options: pretty-printed and compressed.

### Improvements
- Validation now runs incrementally (on block change, not full graph).
- Risk rule overrides require justification notes.
- Parikshak test suite generation improved for complex strategies.

### Bug Fixes
- Fixed: Position sizing not respecting max position constraint.
- Fixed: MQ reconnection causing duplicate messages.
- Fixed: Time-based exit firing at wrong timezone.

---

## Version 2.0.0 (2026-02-01)

### Major Changes
- Strategy Lifecycle introduced: Build → Parikshak → Simulator → DXCC → Kuber Alpha.
- DXCC integration for compliance approval.
- Kuber Alpha deployment pipeline.
- New risk rules: time-based rules, cooldown, max entries per day.
- RBAC with granular permissions.

### Breaking Changes
- Legacy "direct deploy" mode removed — all strategies must go through the lifecycle.
- JSON schema migrated to v2.
- MQ routing keys renamed to namespace convention.

---

## Version 1.5.0 (2025-12-01)

### Features
- Simulator integration for backtesting.
- Parikshak integration for testing.
- Export JSON generation.
- Position sizing models: Fixed, Percentage, Volatility-Adjusted.

### Improvements
- First version of the risk engine.
- MQ integration for inter-engine communication.

---

## Version 1.0.0 (2025-09-01)

- Initial release.
- Visual drag-and-drop strategy builder.
- Entry and exit logic blocks.
- Basic risk rules.
- Manual JSON export.
- Single-user editing only.

## Upgrade Notes

| From | To | Notes |
|---|---|---|
| 2.x | 3.0.0 | Re-export all strategies to v3 JSON. Review new risk rules. |
| 1.x | 2.0.0 | Strategies must be resubmitted through full lifecycle. |
| 1.0.0 | 1.5.0 | No breaking changes; incremental upgrade. |
