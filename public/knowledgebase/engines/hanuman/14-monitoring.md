# 14 — Monitoring

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Monitoring Architecture

```
Hanuman (Prometheus :9194)
    │
    ├──► Prometheus → Grafana → Execution Desk Dashboards
    │         └──► AlertManager → PagerDuty/Slack
    │
    └──► Narad Agent → Narad Core (strategy events)
```

## Prometheus Metrics

### Strategy Metrics

| Metric | Type | Labels |
|--------|------|--------|
| `hanuman_strategies_active` | Gauge | — |
| `hanuman_strategies_total` | Gauge | state (RUNNING, PAUSED, etc.) |
| `hanuman_signals_total` | Counter | strategy, signal_type |
| `hanuman_risk_vetos_total` | Counter | strategy, reason |
| `hanuman_orders_total` | Counter | strategy, leg, side |
| `hanuman_fills_total` | Counter | strategy, leg |
| `hanuman_partial_fills_total` | Counter | strategy, leg |

### P&L Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `hanuman_pnl_realized` | Gauge | Realized P&L per strategy |
| `hanuman_pnl_unrealized` | Gauge | Unrealized P&L per strategy |
| `hanuman_pnl_total` | Gauge | Total P&L across all strategies |
| `hanuman_trading_cost_total` | Counter | Cumulative trading costs |

### Latency Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `hanuman_signal_latency_us` | Histogram | Tick-to-signal decision latency |
| `hanuman_order_latency_us` | Histogram | Signal-to-order-dispatch latency |
| `hanuman_risk_check_latency_us` | Histogram | Risk validation round-trip time |

### Health Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `hanuman_orderbook_stale_count` | Gauge | Instruments with stale prices |
| `hanuman_mq_consumer_lag` | Gauge | Lag on market data MQ consumers |
| `hanuman_risk_engine_connected` | Gauge | 1=connected, 0=disconnected |
| `hanuman_checkpoint_age_sec` | Gauge | Seconds since last successful checkpoint |

## Grafana Dashboards

### Dashboard: "Hanuman — Strategy Overview"
- Active strategies by type (pie chart)
- Total P&L trend (line, 1-day)
- Signal generation rate (per strategy)
- Order dispatch rate
- Fill ratio (filled/submitted)

### Dashboard: "Hanuman — Strategy Detail"
- Per-strategy P&L (realized + unrealized)
- Per-strategy fill timeline
- Spread vs thresholds (time series)
- Risk vetoes timeline
- Latency breakdown (signal, risk, order)

## Alerting Rules

| Alert | Condition | Severity | Routing |
|-------|-----------|----------|---------|
| StrategyError | `rate(hanuman_risk_vetos_total[5m]) > 5` | P2 | Slack #alerts-execution |
| HighUnrealizedLoss | `hanuman_pnl_unrealized < -100000` | P2 | Slack #alerts-execution |
| DailyLossLimit | `hanuman_pnl_total < -500000` (daily) | P1 | PagerDuty + Slack |
| StaleOrderBook | `hanuman_orderbook_stale_count > 0` for 30s | P2 | Slack #alerts-execution |
| RiskEngineDisconnected | `hanuman_risk_engine_connected == 0` | P1 | PagerDuty |
| StrategyStuck | Strategy in RUNNING state but no signals for 5 minutes (trading hours) | P2 | Slack |
| CheckpointFailed | `hanuman_checkpoint_age_sec > 120` | P2 | Slack |
