# 18 — Monitoring

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Kuber Alpha's monitoring system provides real-time visibility into strategy performance, signal flow, capital utilization, and system health. All metrics are exported to Prometheus and visualized in Grafana dashboards.

## Monitoring Architecture

```
Kuber Alpha
     │
     ├── Metrics Exporter (Prometheus format)
     │   └── /metrics endpoint
     │
     ├── Health Endpoint
     │   └── /health
     │
     ├── Structured Logging (JSON)
     │   └── Elasticsearch → Kibana
     │
     └── Alert Manager
         └── Prometheus Alertmanager → Slack, Email, PagerDuty
```

## Key Dashboards

### Strategy Dashboard

| Panel | Metrics |
|---|---|
| Active Strategies | Count by mode (LIVE/PAPER/STAGED) |
| Strategy P&L | Real-time and daily by strategy |
| Win Rate | Per strategy, rolling 30-day |
| Signal-to-Trade Ratio | Conversion rate per strategy |
| Drawdown | Peak-to-trough by strategy |

### Signal Flow Dashboard

| Panel | Metrics |
|---|---|
| Signals Received | Rate per source |
| Signals Converted | Count and conversion rate |
| Signals Dropped | Drop count by reason |
| Signal Latency | P50/P95/P99 from receipt to dispatch |

### Capital Dashboard

| Panel | Metrics |
|---|---|
| Total Budget | Pool size and utilization % |
| Per-Strategy Allocation | Bar chart of allocated vs deployed |
| Free Capital | Available for new deployments |
| Margin Utilization | Current % vs Kill Switch threshold |

### Kill Switch Dashboard

| Panel | Metrics |
|---|---|
| Margin % (gauge) | Real-time with threshold line |
| Status (ARMED/TRIGGERED/DISARMED) | Current state |
| Trigger History | Timeline of all trigger events |
| Recovery Time | Mean time to recover after trigger |

### Vega Connectivity Dashboard

| Panel | Metrics |
|---|---|
| Connection Status | Health indicator (green/red) |
| Orders Dispatched | Rate and cumulative |
| Orders Rejected | Count by rejection reason |
| Latency | Dispatch → ACK, ACK → Fill |

## Alert Rules

### Critical Alerts (P0 — Immediate Response)

| Alert | Condition |
|---|---|
| Kill Switch TRIGGERED | `killswitch_status == 1` |
| Vega disconnected > 30s | `vega_connection_status == 0` |
| Margin > 0.95% | `margin_pct > 0.95` |
| Daily loss limit breached | `daily_loss > daily_loss_limit` |

### High Alerts (P1 — < 15 min Response)

| Alert | Condition |
|---|---|
| Strategy error rate > 1% | `strategy_error_rate > 0.01` |
| Signal conversion rate < 50% | `conversion_rate < 0.5` for 5 min |
| Position mismatch detected | `position_mismatch > 0` |
| MQ connection lost | `mq_connection_status == 0` |

### Warning Alerts (P2 — < 1 hour Response)

| Alert | Condition |
|---|---|
| Queue depth > 80% of max | `signal_queue_depth > 8000` |
| P99 latency > 500ms | `signal_latency_p99 > 500` |
| Strategy drawdown > 80% of limit | `strategy_drawdown_pct > 0.8 * limit` |
| Low free capital (< 10%) | `free_capital_pct < 0.1` |

## Health Endpoint Response

```json
{
  "status": "healthy",
  "version": "1.8.0",
  "uptime": 86400,
  "checks": {
    "mongodb": "connected",
    "redis": "connected",
    "rabbitmq": "connected",
    "vega": "connected",
    "killSwitch": "armed"
  },
  "strategiesActive": 5,
  "signalsProcessed": 12450,
  "ordersDispatched": 1250
}
```

## Logging

| Level | Content |
|---|---|
| `ERROR` | System errors, connection failures, Kill Switch events |
| `WARN` | Threshold warnings, retry attempts, dropped signals |
| `INFO` | Strategy state changes, order lifecycles, allocation changes |
| `DEBUG` | Signal processing traces, detailed order construction |

## Retention

| Data | Retention |
|---|---|
| Metrics (Prometheus) | 30 days |
| Logs (Elasticsearch) | 90 days |
| Audit events (MongoDB) | 1 year |
| Trade records (MongoDB) | 7 years (regulatory) |
