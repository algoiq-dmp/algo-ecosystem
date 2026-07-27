# 23 — Changelog

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Version 1.8.0 (2026-07-01)

### Features
- TalkDelta AI integration with confidence-based routing.
- AI suggestion support: scale-in, scale-out, contingent orders.
- Model drift detection for TalkDelta AI models.
- Enhanced reasoning transparency for AI-generated signals.
- Capital allocation: dynamic model using Sharpe ratio.

### Improvements
- Signal deduplication window reduced from 10s to 5s.
- Kill Switch drill automation (weekly auto-test).
- Vega integration: position reconciliation interval reduced to 5s.
- Strategy activation latency reduced by 30%.
- Monitoring dashboards consolidated into single Grafana view.

### Bug Fixes
- Fixed: Signal deduplication not respecting expiry time.
- Fixed: Capital allocator double-counting margin on OCO orders.
- Fixed: Kill Switch not triggering on rapid margin spikes (< 100ms).
- Fixed: Race condition in strategy mode transitions.

---

## Version 1.5.0 (2026-05-15)

### Features
- VYUH integration: multi-strategy portfolio signals with correlation awareness.
- Hedge handling for VYUH signals (option + future hedges).
- Dynamic capital allocation model.
- Strategy mode: SHADOW (silent production run).
- Kill Switch dashboard with real-time margin gauge.

### Improvements
- Order dispatch retry with exponential backoff.
- Signal validation: model signature verification for Delta XI.
- Capital tracking: real-time free/allocated/deployed/locked breakdown.

### Bug Fixes
- Fixed: Memory leak in Signal Ingestor during high-volume periods.
- Fixed: Incorrect profit calculation on partial fills.
- Fixed: MQ reconnection causing duplicate signal processing.

---

## Version 1.2.0 (2026-03-01)

### Features
- Delta XI integration with model signature verification.
- Aalap Calls integration with confidence thresholds.
- Strategy staging: PAPER → 25% → 50% → LIVE.
- Position sizing model override per signal source.
- Capital allocation: fixed and risk-parity models.

### Improvements
- Kill Switch: margin monitoring precision improved to 0.001%.
- Event bus performance: 2x throughput with lock-free queues.
- Order dispatch: added BRACKET and OCO order support.

---

## Version 1.0.0 (2026-01-15)

### Initial Release
- Core Signal Ingestor, Strategy Activator, Capital Allocator, Signal Dispatcher.
- Kill Switch Layer 1 at 1.01% margin.
- Vega integration for order execution.
- Basic strategy lifecycle: deploy, pause, resume, retire.
- Fixed capital allocation model.
- MQ-based inter-component communication.
- Health endpoint and basic monitoring.

## Upgrade Notes

| From | To | Notes |
|---|---|---|
| 1.5.0 | 1.8.0 | TalkDelta AI added; no breaking changes |
| 1.2.0 | 1.5.0 | VYUH added; SHADOW mode introduced |
| 1.0.0 | 1.2.0 | Delta XI + Aalap added; capital models extended |
