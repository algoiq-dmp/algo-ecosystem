# 01 — Overview & Purpose

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## What is Suchak?

Suchak (Sanskrit: "indicator" / "informer") is the cornerstone engine responsible for computing all technical indicators consumed by trading strategies, risk models, and AI decision layers across the Algo IQ Ecosystem.

## Core Mission

Transform raw OHLC (Open, High, Low, Close) and live streaming market data into actionable technical indicator signals that power algorithmic trading decisions in real-time.

## Design Philosophy

1. **Accuracy First** — Every indicator adheres to industry-standard mathematical formulas verified against reference implementations.
2. **Low Latency** — Sub-50ms computation window ensures signals reach consumers before market moves.
3. **Stateless Computation** — Each tick is processed independently; historical context is maintained via rolling windows.
4. **Extensible** — New indicators can be added via the plugin architecture without core changes.
5. **Fault Tolerant** — Degraded gracefully on missing data points with configurable interpolation strategies.

## Data Flow

```
Ganesh OHLC ─┐
              ├──> Suchak Engine ──> Indicator Signals ──> Consumers
Lakshmi Live ─┘
```

### Inputs
- **Ganesh OHLC** — Historical and real-time candlestick data (1m, 5m, 15m, 1h, 1d timeframes)
- **Lakshmi Live Data** — Tick-by-tick streaming price feeds with bid/ask spreads

### Outputs
- Raw indicator values per symbol per timeframe
- Normalized signal strength scores (0–100 scale)
- Support and resistance level arrays
- Momentum direction and intensity metrics

## Consumer Ecosystem

| Consumer | Use Case |
|----------|----------|
| **DXCC** | Option chain and derivative pricing feeds |
| **KuberAlpha** | Strategy execution and portfolio management |
| **Strategy Builder** | Backtesting and strategy construction UI |
| **Delta XI** | AI/ML model feature engineering |
| **TalkDelta AI** | Natural language market insights |

## Supported Timeframes

| Timeframe | Code | Update Frequency |
|-----------|------|------------------|
| 1 Minute | `1m` | Every tick |
| 5 Minute | `5m` | Every 5 min |
| 15 Minute | `15m` | Every 15 min |
| 1 Hour | `1h` | Every hour |
| 1 Day | `1d` | EOD |

## Performance SLAs

| Metric | Target |
|--------|--------|
| Indicator computation (single) | < 10ms |
| Full suite computation (15 indicators) | < 50ms |
| Throughput (symbols/sec) | 500+ |
| Uptime | 99.9% |

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 4.1.0 | 2026-06-15 | Added Ichimoku & CPR; performance improvements |
| 4.0.0 | 2026-03-01 | Refactored to streaming architecture |
| 3.2.0 | 2025-11-10 | Added SuperTrend, Bollinger Bands |
| 3.0.0 | 2025-06-01 | Multi-timeframe support |
| 2.0.0 | 2024-12-01 | Initial public release |
