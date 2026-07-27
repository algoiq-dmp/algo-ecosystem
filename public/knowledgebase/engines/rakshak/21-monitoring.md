# 21 — Monitoring & Health
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Health Status
| Component | Status | Threshold |
|-----------|--------|-----------|
| Overall Health | **99.9%** | > 99.5% |
| Protection Assessment Latency | 35ms | < 50ms |
| Strategies Protected | 12 | — |
| Emergency Mode | Inactive | Should be inactive |
| Event Calendar | Up to date | — |
## Prometheus Metrics
- akshak_hedge_ratio — Gauge per strategy
- akshak_tail_risk_score — Gauge per strategy
- akshak_gap_risk_score — Gauge per strategy
- akshak_portfolio_protection_score — Gauge
- akshak_emergency_mode — Gauge (0/1)
- akshak_exit_signals_total — Counter
- akshak_pre_trade_rejections_total — Counter
## Alerting Rules
- Emergency mode activated: **CRITICAL** (immediate)
- Portfolio protection score < 40: **CRITICAL**
- Hedge ratio > 2.0 (over-hedged): **WARNING**
- Pre-trade rejection rate > 10%: **WARNING**
- Event calendar not updated > 24h: **WARNING**
## SLOs
| SLO | Target | Window |
|-----|--------|--------|
| Availability | 99.9% | 30 days |
| Protection Assessment | < 50ms | 5 min |
| Emergency Signal Delivery | < 100ms | Always |
