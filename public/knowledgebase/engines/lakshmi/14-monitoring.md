# 14. Monitoring & Alerting

**Version:** 2.1.0
**Owner:** DevOps / Data Engineering
**Last Updated:** 2026-07-24

---

## Overview

Lakshmi exposes a comprehensive observability stack built on Prometheus metrics, InfluxDB time-series storage, and Grafana dashboards. All critical subsystems are instrumented with pre-aggregated counters, gauges, and histograms for real-time alerting and trend analysis.

---

## Metrics Collection

### Prometheus Endpoint

Lakshmi exposes a `/metrics` endpoint on port `9090` (configurable). All metrics follow the `lakshmi_` namespace convention.

```
http://lakshmi-host:9090/metrics
```

### InfluxDB Writer

Time-series data is written to InfluxDB every 10 seconds for long-term trending. Retention policy: 90 days raw, 1 year aggregated.

```
influxdb://lakshmi-monitoring:8086/lakshmi_metrics
```

---

## Key Metrics

### System Health (Heartbeat)

| Metric | Type | Description |
|---|---|---|
| `lakshmi_heartbeat` | Gauge (1/0) | 1 if engine is alive and serving; 0 otherwise |
| `lakshmi_uptime_seconds` | Counter | Seconds since last process start |
| `lakshmi_healthy` | Gauge (1/0) | Aggregate health probe result |
| `lakshmi_ready` | Gauge (1/0) | Readiness probe (traffic-serving) |

### CPU & Memory

| Metric | Type | Description | Alert Threshold |
|---|---|---|---|
| `lakshmi_cpu_usage_percent` | Gauge | Process CPU utilisation per core | **>80%** for 5 min |
| `lakshmi_memory_usage_bytes` | Gauge | RSS memory consumption | **>6 GB** |
| `lakshmi_memory_usage_percent` | Gauge | Percentage of total system memory | **>85%** |
| `lakshmi_gc_pause_ms` | Histogram | Node.js GC pause duration | **p99 > 100ms** |

### Latency

| Metric | Type | Description | Alert Threshold |
|---|---|---|---|
| `lakshmi_message_latency_ms` | Histogram | End-to-end message latency (publish → subscriber ack) | **p99 > 10ms** |
| `lakshmi_publish_latency_ms` | Histogram | Time to publish to RabbitMQ exchange | **p99 > 5ms** |
| `lakshmi_websocket_delivery_latency_ms` | Histogram | WebSocket push to client | **p99 > 15ms** |
| `lakshmi_redis_command_duration_ms` | Histogram | Redis command round-trip | **p99 > 3ms** |

### Topics

| Metric | Type | Description | Alert Threshold |
|---|---|---|---|
| `lakshmi_topics_total` | Gauge | Total number of active topics | — |
| `lakshmi_topic_message_rate` | Gauge (per topic) | Messages/sec per topic | Deviation >50% from baseline |
| `lakshmi_topic_subscribers` | Gauge (per topic) | Number of subscribers per topic | — |
| `lakshmi_topic_dropped_messages` | Counter (per topic) | Messages dropped due to TTL expiry or overflow | **>0** |

### Queues

| Metric | Type | Description | Alert Threshold |
|---|---|---|---|
| `lakshmi_queue_depth` | Gauge (per queue) | Messages waiting in RabbitMQ queue | **>1000** |
| `lakshmi_queue_consumers` | Gauge (per queue) | Active consumer count per queue | **<1** for expected queues |
| `lakshmi_queue_unacked_messages` | Gauge (per queue) | Unacknowledged messages | **>500** |
| `lakshmi_queue_message_bytes` | Gauge (per queue) | Total bytes in queue | **>100 MB** |
| `lakshmi_dead_letter_count` | Counter (per queue) | Messages routed to dead-letter queue | **>10/min** |

### Connections

| Metric | Type | Description | Alert Threshold |
|---|---|---|---|
| `lakshmi_mq_connections` | Gauge | Active RabbitMQ connections | **<1** (down) |
| `lakshmi_websocket_connections` | Gauge | Active WebSocket client connections | Deviation >30% from 1h baseline |
| `lakshmi_redis_connections` | Gauge | Active Redis connections | **<1** (down) |
| `lakshmi_http_requests_total` | Counter | HTTP API requests | — |
| `lakshmi_http_request_duration_ms` | Histogram | HTTP request duration | **p99 > 500ms** |

### Throughput

| Metric | Type | Description |
|---|---|---|
| `lakshmi_messages_published_total` | Counter | Total messages published since start |
| `lakshmi_messages_delivered_total` | Counter | Total messages delivered to subscribers |
| `lakshmi_messages_failed_total` | Counter | Total failed message deliveries |
| `lakshmi_messages_retried_total` | Counter | Total retry attempts |
| `lakshmi_publish_rate_per_sec` | Gauge | Current publish rate (messages/sec) |
| `lakshmi_delivery_rate_per_sec` | Gauge | Current delivery rate (messages/sec) |

---

## Alert Rules

### Critical Alerts (P1 — Immediate Response)

| Alert | Condition | Duration | Action |
|---|---|---|---|
| Engine Down | `lakshmi_heartbeat == 0` | 30s | Restart via Nomad/PM2; escalate if >2 min |
| MQ Disconnected | `lakshmi_mq_connections < 1` | 30s | Check RabbitMQ cluster; failover to secondary |
| High Latency | `histogram_quantile(0.99, lakshmi_message_latency_ms) > 10` | 2 min | Investigate MQ queue depth; check network |
| Queue Overflow | `lakshmi_queue_depth > 1000` | 1 min | Scale consumers; check for slow subscribers |
| Dead Letters Spike | `rate(lakshmi_dead_letter_count[5m]) > 10` | 5 min | Inspect DLQ; check message format issues |

### Warning Alerts (P2 — Address Within 1 Hour)

| Alert | Condition | Duration | Action |
|---|---|---|---|
| High CPU | `lakshmi_cpu_usage_percent > 80` | 5 min | Profile hot paths; consider horizontal scaling |
| High Memory | `lakshmi_memory_usage_bytes > 6442450944` (6 GB) | 5 min | Check for memory leak; restart during maintenance window |
| High Redis Latency | `histogram_quantile(0.99, lakshmi_redis_command_duration_ms) > 3` | 5 min | Check Redis load; verify network |
| Subscriber Drop | `delta(lakshmi_websocket_connections[10m]) < -30% of baseline` | 10 min | Check WebSocket server; verify client health |
| Unacked Backlog | `lakshmi_queue_unacked_messages > 500` | 5 min | Check slow consumers; increase prefetch |

---

## Grafana Dashboards

| Dashboard | Link | Purpose |
|---|---|---|
| Lakshmi Overview | `/d/lakshmi-overview` | CPU, memory, throughput, latency summary |
| Lakshmi MQ Health | `/d/lakshmi-mq` | RabbitMQ queues, exchanges, connections |
| Lakshmi Topics | `/d/lakshmi-topics` | Per-topic message rates and subscriber counts |
| Lakshmi WebSocket | `/d/lakshmi-ws` | WebSocket connections, delivery latency |
| Lakshmi Alerts | `/d/lakshmi-alerts` | Active alerts timeline and history |
| Lakshmi Redis | `/d/lakshmi-redis` | Redis cache hit rates, latency, connections |

> **Note:** Grafana dashboards are provisioned via `dashboards/` directory in the Lakshmi repository. Import using `grafana-dashboard.json` files.

---

## Health Endpoints

| Endpoint | Purpose | Response |
|---|---|---|
| `GET /api/v1/health` | Liveness probe | `{"status":"ok","timestamp":"..."}` |
| `GET /api/v1/health/ready` | Readiness probe | `{"ready":true,"dependencies":{"mq":true,"redis":true,"ws":true}}` |
| `GET /api/v1/metrics` | Prometheus scrape endpoint | OpenMetrics text format |
| `GET /api/v1/stats` | Human-readable stats JSON | Current throughput, latency, connections |

---

## Logging

Structured JSON logs are emitted to stdout/stderr with the following log levels:

```
{"level":"info","ts":"2026-07-24T10:30:00Z","msg":"message published","topic":"NFO_EQ","msg_id":"abc123","latency_ms":1.2}
{"level":"warn","ts":"2026-07-24T10:30:01Z","msg":"queue depth threshold","queue":"feed.nfo","depth":852}
{"level":"error","ts":"2026-07-24T10:30:02Z","msg":"mq connection refused","host":"mq1:5672","attempt":3}
```

Logs are forwarded to the centralized ELK stack (Elasticsearch, Logstash, Kibana) via Filebeat.

---

## Monitoring Quick Reference

| What | Where | When |
|---|---|---|
| Current engine health | Grafana Overview or `/api/v1/health` | Real-time |
| Latency trends | Grafana Overview → Latency panel | Daily review |
| Queue depths | Grafana MQ Health | Hourly check |
| Alert history | Grafana Alerts or PagerDuty | On-call rotation |
| Capacity planning | InfluxDB → 30-day aggregates | Weekly review |
