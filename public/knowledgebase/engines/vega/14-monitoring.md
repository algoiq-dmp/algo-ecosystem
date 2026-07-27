# 14 — Monitoring & Observability

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Observability Stack

| Component | Technology | Purpose |
|---|---|---|
| Metrics | Prometheus + Grafana | System and business metrics |
| Time-Series | InfluxDB | Order throughput, latency percentiles |
| Traces | OpenTelemetry + Jaeger | Distributed tracing |
| Logs | Elasticsearch + Kibana | Centralized log aggregation |
| Alerts | Prometheus AlertManager + PagerDuty | Incident notification |
| Dashboards | Grafana | Operational visibility |

---

## Key Metrics

### Business Metrics

| Metric | Type | Labels | Description |
|---|---|---|---|
| `vega_orders_total` | Counter | `broker, order_type, state` | Total orders processed |
| `vega_orders_active` | Gauge | `broker, product_type` | Currently active orders |
| `vega_order_latency_ms` | Histogram | `component, state` | Order processing latency per component |
| `vega_fill_quantity_total` | Counter | `symbol, broker` | Total filled quantity |
| `vega_order_rejections_total` | Counter | `reason, component` | Order rejections by reason |
| `vega_kill_switch_active` | Gauge | `user_id` | 1 if kill switch active for user |
| `vega_notional_value_total` | Counter | `broker` | Total notional order value |

### System Metrics

| Metric | Type | Labels | Description |
|---|---|---|---|
| `vega_api_requests_total` | Counter | `endpoint, method, status` | API request count |
| `vega_api_request_duration_ms` | Histogram | `endpoint, method` | API latency |
| `vega_mq_messages_total` | Counter | `queue, status` | MQ messages processed |
| `vega_mq_consumer_lag` | Gauge | `queue` | MQ consumer lag count |
| `vega_db_query_duration_ms` | Histogram | `operation` | Database query latency |
| `vega_redis_operation_duration_ms` | Histogram | `operation` | Redis operation latency |
| `vega_fix_session_state` | Gauge | `broker, sender, target` | FIX session state (0=down, 1=up) |
| `vega_fix_messages_total` | Counter | `broker, msg_type, direction` | FIX message count |
| `vega_fix_reconnect_total` | Counter | `broker` | FIX reconnection attempts |

### Infrastructure Metrics

| Metric | Type | Description |
|---|---|---|
| `process_cpu_seconds_total` | Counter | CPU usage |
| `process_resident_memory_bytes` | Gauge | Memory usage |
| `process_open_fds` | Gauge | Open file descriptors |
| `nodejs_eventloop_lag_seconds` | Gauge | Event loop lag |
| `nodejs_heap_size_bytes` | Gauge | Heap memory usage |

---

## Grafana Dashboards

### Dashboard: Vega — Execution Overview

| Panel | Metrics | Visualization |
|---|---|---|
| Orders/sec (by broker) | `rate(vega_orders_total[1m])` | Timeseries |
| Active Orders | `vega_orders_active` | Stat + Gauge |
| P95 Order Latency | `histogram_quantile(0.95, vega_order_latency_ms)` | Timeseries |
| Rejection Rate | `rate(vega_order_rejections_total[5m])` | Stat |
| FIX Session Status | `vega_fix_session_state` | Status Panel |
| Kill Switch Status | `vega_kill_switch_active` | Alert Table |
| MQ Consumer Lag | `vega_mq_consumer_lag` | Timeseries |
| API Request Rate | `rate(vega_api_requests_total[1m])` | Timeseries |

### Dashboard: Vega — Broker Health

| Panel | Metrics |
|---|---|
| XTS Session State | `vega_fix_session_state{broker="xts"}` |
| Greeksoft Session State | `vega_fix_session_state{broker="greeksoft"}` |
| XTS Orders/Minute | `rate(vega_orders_total{broker="xts"}[1m]) * 60` |
| Greeksoft Orders/Minute | `rate(vega_orders_total{broker="greeksoft"}[1m]) * 60` |
| FIX Reconnections | `rate(vega_fix_reconnect_total[15m])` |
| Order Rejections by Broker | `rate(vega_order_rejections_total[5m]) by (broker, reason)` |

---

## Alert Rules

### Critical Alerts (PagerDuty)

```yaml
- alert: VegaDown
  expr: up{job="vega"} == 0
  for: 30s
  severity: critical
  summary: "Vega instance is down"

- alert: KillSwitchActivated
  expr: vega_kill_switch_active == 1
  for: 0s
  severity: critical
  summary: "Kill switch activated for user {{ $labels.user_id }}"

- alert: FixSessionDown
  expr: vega_fix_session_state == 0
  for: 30s
  severity: critical
  summary: "FIX session down for {{ $labels.broker }}"

- alert: HighOrderRejectionRate
  expr: rate(vega_order_rejections_total[5m]) > 0.05 * rate(vega_orders_total[5m])
  for: 2m
  severity: critical
  summary: "Order rejection rate > 5%"

- alert: MQConsumerLagHigh
  expr: vega_mq_consumer_lag > 5000
  for: 1m
  severity: critical
  summary: "MQ consumer lag > 5000 on {{ $labels.queue }}"
```

### Warning Alerts (Slack)

```yaml
- alert: HighLatency
  expr: histogram_quantile(0.95, rate(vega_order_latency_ms_bucket[5m])) > 100
  for: 5m
  severity: warning
  summary: "P95 order latency > 100ms"

- alert: DBConnectionPoolHigh
  expr: vega_db_pool_active / vega_db_pool_max > 0.8
  for: 5m
  severity: warning
  summary: "DB connection pool > 80% utilized"

- alert: HighCPUUsage
  expr: rate(process_cpu_seconds_total[5m]) * 100 > 80
  for: 10m
  severity: warning
  summary: "CPU usage > 80% for 10 minutes"

- alert: FixReconnectFrequent
  expr: rate(vega_fix_reconnect_total[15m]) > 0.1
  for: 5m
  severity: warning
  summary: "Frequent FIX reconnections on {{ $labels.broker }}"
```

---

## Distributed Tracing

OpenTelemetry traces span the full order lifecycle with the following span attributes:

```
Trace: {traceId}
  ├── Span: TalkStrategy API — POST /orders
  │   └── Attributes: signalId, userId, correlationId
  ├── Span: RabbitMQ — Publish incoming
  ├── Span: TalkStrategy App — Process signal
  │   └── Attributes: enriched broker, instrumentToken
  ├── Span: RabbitMQ — Publish validated
  ├── Span: Order Processor — Process order
  │   └── Attributes: orderId, state transition, idempotency check
  ├── Span: RabbitMQ — Publish routed
  ├── Span: Broker Integration — FIX NewOrderSingle
  │   └── Attributes: broker, clOrdID, msgSeqNum
  └── Span: Broker Integration — ExecutionReport
      └── Attributes: brokerOrderId, execType, fillQty
```

---

## Synthetic Monitoring

Every 30 seconds, a synthetic order is placed and immediately cancelled to verify end-to-end pipeline health:

```javascript
// synthetic-monitor.js
async function syntheticCheck() {
  const order = {
    signalId: `SYNTH-${Date.now()}`,
    symbol: 'RELIANCE',
    orderType: 'LIMIT',
    transactionType: 'BUY',
    quantity: 1,
    price: 1, // Far OTM — will not execute
    userId: 'SYNTHETIC-MONITOR',
    strategyId: 'SYNTH-MONITOR'
  };

  const result = await placeOrder(order);
  await cancelOrder(result.orderId);

  // Report metrics: synthetic_order_latency_ms,
  //                 synthetic_order_success{broker="xts"}
}
```

---

## Log Aggregation

All logs are structured JSON and shipped to Elasticsearch via Filebeat:

```json
{
  "timestamp": "2026-07-24T09:16:45.123Z",
  "level": "info",
  "component": "OrderProcessor",
  "correlationId": "b3f2c1d4-...",
  "orderId": "VEGA-20260724-000001-AB12",
  "message": "Order state transition",
  "previousState": "VALIDATED",
  "newState": "ROUTED",
  "durationMs": 1.2,
  "host": "vega-mum-prod-03"
}
```

### Kibana Saved Searches

| Search | Query |
|---|---|
| All errors | `level: "error"` |
| Order state transitions | `component: "OrderProcessor" AND message: "Order state transition"` |
| Kill switch events | `component: "KillSwitch" AND message: "KILL_SWITCH_ACTIVATED"` |
| FIX session issues | `component: "BrokerIntegration" AND (level: "warn" OR level: "error")` |
| Slow orders (>500ms) | `component: "OrderProcessor" AND durationMs > 500` |
