# 21 — Monitoring & Health
> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24
## Health Status
| Component | Status | Threshold |
|-----------|--------|-----------|
| Overall Health | **99.6%** | > 99.5% |
| Regime Classifier | Active | — |
| Trend Detector | Active | — |
| Breakout Scorer | Active | — |
| Volatility Regime | Active | — |
| Volume Analysis | Active | — |
| OI Analysis | Active | — |
| Liquidity Scoring | Active | — |
| Confidence Scoring | Active | — |
## Prometheus Metrics
- manthan_regime_transition_total — Counter of regime changes
- manthan_breakout_probability — Gauge per symbol
- manthan_confidence_score — Gauge per symbol
- manthan_analysis_latency_ms — Histogram per module
- manthan_module_errors_total — Counter per module
## Alerting Rules
- High Error Rate: ate(manthan_module_errors_total[5m]) > 0.01
- Stale Analysis: 	ime() - manthan_last_analysis_timestamp > 60
- Module Degraded: manthan_module_healthy == 0
## SLOs
| SLO | Target | Window |
|-----|--------|--------|
| Availability | 99.6% | 30 days |
| Analysis Latency p95 | < 100ms | 5 min |
| Regime Accuracy | > 75% | Monthly review |
