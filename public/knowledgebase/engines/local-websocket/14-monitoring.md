# 14 — Monitoring

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Monitoring Architecture

```
WebSocket Server (Prometheus :9193)
    │
    ├──► Prometheus → Grafana
    │         └──► AlertManager → PagerDuty/Slack
    │
    └──► Narad Agent → Narad Core
```

## Prometheus Metrics

### Connection Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `ws_connections_active` | Gauge | Currently open WebSocket connections |
| `ws_connections_total` | Counter | Total connections since start |
| `ws_connections_duration_sec` | Histogram | Connection lifetime distribution |
| `ws_connection_errors_total` | Counter | Failed connection attempts |

### Message Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `ws_messages_sent_total` | Counter | Messages sent to clients (by topic) |
| `ws_messages_dropped_total` | Counter | Messages dropped due to backpressure |
| `ws_messages_throttled_total` | Counter | Messages dropped due to rate limiting |
| `ws_bytes_sent_total` | Counter | Total bytes sent to clients |

### Subscription Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `ws_subscriptions_active` | Gauge | Active subscriptions (by topic) |
| `ws_subscriptions_total` | Counter | Total subscribe requests |
| `ws_unsubscriptions_total` | Counter | Total unsubscribe requests |
| `ws_subscription_errors_total` | Counter | Failed subscribe attempts |

### MQ Consumer Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `ws_mq_consumers_active` | Gauge | Active MQ consumer count |
| `ws_mq_messages_received_total` | Counter | Messages received from MQ |
| `ws_mq_consumer_lag` | Gauge | Consumer lag per MQ topic |
| `ws_mq_latency_ms` | Histogram | MQ message receive → WebSocket send latency |

### Server Health

| Metric | Type | Description |
|--------|------|-------------|
| `ws_heap_used_bytes` | Gauge | Node.js heap usage |
| `ws_event_loop_lag_sec` | Gauge | Event loop lag (from `perf_hooks`) |
| `ws_cpu_percent` | Gauge | CPU utilization |

## Grafana Dashboards

### Dashboard: "WebSocket Server Overview"
- Active connections over time (line chart)
- Message throughput (msgs/sec, bytes/sec)
- Subscription count by topic (heatmap)
- MQ consumer lag (gauge)
- Event loop lag (gauge)

### Dashboard: "WebSocket Server Health"
- Per-instance connection counts
- Error rates (connection errors, auth failures)
- Message drop rate (backpressure)
- Memory and CPU per instance
- MQ ↔ WebSocket latency histogram

## Alerting Rules

| Alert | Condition | Severity | Channel |
|-------|-----------|----------|---------|
| HighConnectionDrop | `rate(ws_connection_errors_total[5m]) > 10` | P2 | Slack #alerts-infra |
| HighMessageDrop | `rate(ws_messages_dropped_total[5m]) > 100` | P2 | Slack #alerts-infra |
| HighEventLoopLag | `ws_event_loop_lag_sec > 0.1` for 60s | P2 | Slack #alerts-infra |
| MqDisconnected | `ws_mq_consumers_active == 0` for 30s | P1 | PagerDuty |
| ServerDown | `up{job="ws-server"} == 0` for 60s | P1 | PagerDuty |

## Health Endpoint Logging

All health check requests are logged with structured metadata:

```json
{
  "level": "info",
  "event": "health_check",
  "status": "healthy",
  "connections": 1523,
  "subscriptions": 3456,
  "mq_lag_max": 5,
  "timestamp": "2026-07-25T09:15:00.000Z"
}
```
