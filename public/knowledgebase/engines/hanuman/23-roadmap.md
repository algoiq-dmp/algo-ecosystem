# 23 — Roadmap

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Version History and Future Plans

### v2.1.0 (Current — Q2 2026)

- Vega v4.2 framework integration with enhanced strategy lifecycle
- Auto-hedging on leg failure with configurable hedge order types
- Partial fill adjustment with lot-size-aware rounding
- Circuit breaker: auto-pause after N consecutive losses
- Real-time P&L with mark-to-market at 100ms intervals
- Strategy signature verification via Suraksha
- Prometheus metrics with per-strategy P&L

### v2.2.0 (Planned — Q3 2026)

**Theme: Advanced Spread Execution**

- Dynamic hedge ratio: adjust ratio based on volatility regime
- Iceberg orders for large spread positions (slice and execute over time)
- Multi-exchange spreads: NSE Leg 1 + BSE Leg 2
- Spread market-making mode: quote on both legs simultaneously
- Execution quality metrics: implementation shortfall, VWAP slippage
- Strategy co-location optimization: route strategies to server nearest the exchange

### v2.3.0 (Planned — Q4 2026)

**Theme: Machine Learning Integration**

- ML-based entry/exit signal enhancement (Z-score replaced by ML probability score)
- Volatility regime detection: auto-adjust spread thresholds based on VIX
- Anomaly detection on execution patterns
- Strategy performance prediction (Sharpe, drawdown forecasts)

### v3.0.0 (Planned — H1 2027)

**Theme: Multi-Leg and Cross-Asset**

- 3-leg and 4-leg strategy support (butterflies, condors, boxes)
- Cross-asset spreads: equity + currency hedge
- Basket execution: execute spread on a basket of correlated instruments
- Strategy marketplace: share and license strategies across trading desks

## Backlog

| Feature | Effort | Priority |
|---------|--------|----------|
| Options spread Greeks calculation | L | High |
| TWAP/VWAP execution algo for leg orders | M | Medium |
| Strategy versioning and rollback | M | Medium |
| P&L attribution (spread alpha vs market beta) | M | Low |
