# 14 — Monitoring

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Monitoring Architecture

```
ODIN (Prometheus :9195)
    │
    ├──► Prometheus → Grafana → Execution Desk Dashboards
    │         └──► AlertManager → PagerDuty/Slack
    │
    └──► Narad Agent → Narad Core (order events)
```

## Prometheus Metrics

### Order Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `odin_orders_received_total{exchange,segment}` | Counter | Orders received from MQ |
| `odin_orders_accepted_total{exchange,segment}` | Counter | Orders accepted and routed |
| `odin_orders_rejected_total{exchange,segment,reason}` | Counter | Orders rejected (with reason) |
| `odin_orders_inflight` | Gauge | Currently active orders |
| `odin_orders_filled_total{exchange,segment}` | Counter | Filled trades |

### Adapter Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `odin_adapter_status{adapter_id}` | Gauge | 0=down, 1=connecting, 2=connected |
| `odin_adapter_latency_ms{adapter_id}` | Histogram | Order submit to ACK latency |
| `odin_adapter_errors_total{adapter_id,error}` | Counter | Adapter errors |
| `odin_adapter_failovers_total{exchange,segment}` | Counter | Path failover events |

### Latency Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `odin_order_routing_latency_ms` | Histogram | MQ receive → adapter dispatch |
| `odin_execution_processing_latency_us` | Histogram | Adapter ACK → MQ publish |

### Reconciliation Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `odin_reconciliation_status` | Gauge | 0=idle, 1=running, 2=complete, 3=discrepancies |
| `odin_reconciliation_match_pct` | Gauge | Match percentage |
| `odin_reconciliation_discrepancies` | Gauge | Discrepancy count |

## Grafana Dashboards

### Dashboard: "ODIN — Order Flow"
- Orders/sec by exchange (stacked bar)
- Acceptance rate (accepted / received %)
- Rejection reasons breakdown (pie chart)
- Active in-flight orders (gauge)
- Adapter latency per path (heatmap)

### Dashboard: "ODIN — Adapter Health"
- Adapter status per exchange (traffic light)
- Failover events timeline
- Per-adapter order rate
- Per-adapter error rate
- Adapter connection uptime

## Alerting Rules

| Alert | Condition | Severity | Routing |
|-------|-----------|----------|---------|
| AdapterDown | `odin_adapter_status == 0` for 30s | P1 | PagerDuty |
| HighRejectionRate | `rate(odin_orders_rejected_total[5m]) / rate(odin_orders_received_total[5m]) > 0.1` | P2 | Slack #alerts-execution |
| OrderRoutingLatencyHigh | `histogram_quantile(0.99, odin_order_routing_latency_ms) > 10` | P2 | Slack |
| ReconciliationFailed | `odin_reconciliation_status == 3` | P2 | Slack #alerts-execution |
| AllAdaptersDown | No adapters connected for an exchange | P1 | PagerDuty |
| OrdersStalled | `rate(odin_orders_received_total[5m]) == 0` during trading hours | P1 | PagerDuty |
