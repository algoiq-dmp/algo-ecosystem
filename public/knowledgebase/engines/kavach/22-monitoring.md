# 22 — Monitoring & Health
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Health Status
| Component | Status | Threshold |
|-----------|--------|-----------|
| Overall Health | **99.95%** | > 99.9% |
| Greek Calc Latency (p95) | 18ms | < 25ms |
| Strategies Monitored | 12 | — |
| Positions Tracked | 234 | — |
## Prometheus Metrics
- kavach_net_delta — Gauge per strategy
- kavach_neutrality_pct — Gauge per strategy
- kavach_risk_score — Gauge per strategy
- kavach_greek_calc_duration_ms — Histogram
- kavach_adjustment_signals_total — Counter
- kavach_adjustment_executed_total — Counter
- kavach_neutrality_breaches_total — Counter by zone
## Alerting Rules
- Neutrality < 50% for > 5 min: CRITICAL
- Greek calc latency > 50ms (p95): WARNING
- Adjustment signal generated but not ack'd > 10 min: WARNING
- Risk Score > 75: CRITICAL
## SLOs
| SLO | Target | Window |
|-----|--------|--------|
| Availability | 99.95% | 30 days |
| Greek Latency p95 | < 25ms | 5 min |
| Adjustment Signal Accuracy | > 98% | Monthly |
