# AALAP Calls - Monitoring

**Version:** 2.5.0 | **Owner:** Strategy | **Last Updated:** 2026-07-25


## Monitoring Stack

The engine exports metrics and logs to the centralized monitoring stack consisting of Prometheus, Grafana, and the ELK stack.

## Key Metrics

### Health Metrics

| Metric | Type | Description | Alert Threshold |
|--------|------|-------------|-----------------|
| process_uptime_seconds | Gauge | PM2 process uptime | < 60s after restart |
| health_check_status | Gauge | 1 = healthy, 0 = unhealthy | == 0 |
| mq_connection_status | Gauge | MQ broker connectivity | == 0 > 30s |
| db_connection_pool_available | Gauge | Available DB connections | < 2 |

### Performance Metrics

| Metric | Type | Description | Alert Threshold |
|--------|------|-------------|-----------------|
| request_latency_p99_ms | Histogram | P99 API latency | > 500ms |
| signal_generation_rate | Counter | Signals generated per minute | Deviation > 50% |
| mq_consume_lag | Gauge | Messages pending in queue | > 1000 |
| error_rate_percent | Gauge | Error rate per 5m window | > 1% |

### Business Metrics

| Metric | Type | Description |
|--------|------|-------------|
| signals_total | Counter | Total signals generated |
| signals_by_strategy | Counter | Signals per strategy |
| pnl_daily | Gauge | Daily PnL across strategies |
| hit_rate | Gauge | Percentage of profitable signals |

## Grafana Dashboards

Available pre-built dashboards:
- **Engine Health Overview:** Process status, resource usage, MQ/DB connectivity
- **Strategy Performance:** Per-strategy metrics, PnL curves, drawdown charts
- **API Latency Heatmap:** Request latency distribution by endpoint
- **Signal Quality Dashboard:** Signal-to-fill ratio, rejection rates, timing analysis

## Log Aggregation

Structured JSON logs are shipped to Elasticsearch via Filebeat. Logs are queryable in Kibana with pre-configured index patterns. Retention is 30 days for operational logs and 7 years for audit logs.

## Alerting Rules

Alerts are configured in Prometheus AlertManager and routed to Narad for real-time notification. Critical alerts trigger SMS and email via the Narad notification pipeline.

