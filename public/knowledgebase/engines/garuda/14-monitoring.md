---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 14 — Monitoring

## Health Endpoints

| Endpoint | Method | Purpose | Auth Required |
|---|---|---|---|
| `/health` | GET | Aggregated component health | No |
| `/health/live` | GET | Kubernetes liveness probe | No |
| `/health/ready` | GET | Kubernetes readiness probe | No |
| `/health/database` | GET | DB connectivity + latency | Internal |
| `/health/redis` | GET | Redis connectivity + latency | Internal |
| `/health/kafka` | GET | Kafka broker connectivity | Internal |
| `/health/detailed` | GET | Full diagnostics with latency | Internal key |

### Sample Health Response
```json
{
  "status": "Healthy",
  "entries": {
    "database": { "status": "Healthy", "duration": "8ms" },
    "redis": { "status": "Healthy", "duration": "1ms" },
    "kafka": { "status": "Healthy", "description": "5/5 brokers connected" },
    "span_parameters": { "status": "Healthy", "description": "Latest: NSE (2026-07-25)" }
  }
}
```

## Prometheus Metrics

All services expose metrics on port 8081 at `/metrics`.

### Key Metrics

| Metric | Type | Description |
|---|---|---|
| `http_requests_total` | Counter | Total HTTP requests by endpoint, method, status |
| `http_request_duration_seconds` | Histogram | Request duration with P50/P95/P99 buckets |
| `margin_calculations_total` | Counter | Total margin calculations by type and exchange |
| `margin_calculation_duration_ms` | Histogram | Margin calculation duration (1, 5, 10, 25, 50, 100, 250, 500, 1000, 5000 ms buckets) |
| `margin_calculation_failures_total` | Counter | Failed calculations |
| `active_positions_total` | Gauge | Current active positions in system |
| `total_margin_exposure` | Gauge | Total margin exposure across all brokers |
| `reconciliation_discrepancy_percent` | Histogram | Exchange reconciliation discrepancy |
| `redis_keyspace_hits` | Counter | Cache hits |
| `redis_keyspace_misses` | Counter | Cache misses |
| `kafka_consumer_group_lag` | Gauge | Consumer lag per topic |
| `npgsql_connection_pool_active` | Gauge | Active DB connections |
| `dotnet_gc_pause_seconds` | Counter | GC pause time |

### PromQL Alert Queries

| Alert | PromQL | Threshold |
|---|---|---|
| High API Latency | `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` | >500ms for 5min |
| Margin Calc Errors | `rate(margin_calculation_failures_total[5m]) / rate(margin_calculations_total[5m])` | >1% for 2min |
| DB Pool Exhausted | `npgsql_connection_pool_active / npgsql_connection_pool_max` | >90% for 5min |
| Redis Down | `redis_connected_clients` | <1 for 1min |
| Kafka Lag | `kafka_consumer_group_lag{topic="margin.calculated"}` | >10,000 for 10min |
| Low Cache Hit Ratio | `redis_keyspace_hits / (redis_keyspace_hits + redis_keyspace_misses)` | <85% for 15min |
| EOD Batch Failed | `eod_batch_completion_status` | 0 (failed) |

## Grafana Dashboards

### Pre-built Dashboards

| Dashboard | UID | Panels |
|---|---|---|
| **System Overview** | `garuda-system` | Pod status, node health, CPU/Memory cluster-wide |
| **API Performance** | `garuda-api` | Request rates, P95/P99 latency, error rates by endpoint |
| **Margin Engine** | `garuda-engine` | Calculation throughput, duration, error rate |
| **Database** | `garuda-postgres` | Connections, queries/sec, replication lag, deadlocks |
| **Kafka** | `garuda-kafka` | Message rates, consumer lag, partition health |
| **Redis** | `garuda-redis` | Hit ratio, memory usage, connected clients, evictions |
| **Business KPIs** | `garuda-business` | Active brokers, position count, total margin, peak margin |
| **Security** | `garuda-security` | Auth attempts, failed logins, rate limit hits |

### Key Dashboard Views

**System Overview:**
1. Cluster Health — Pod status, node status, CPU/Memory
2. API Traffic — Requests/sec, P95 latency, Error rate (4xx/5xx)
3. Margin Engine — Calculations/sec, Avg duration, Error count
4. Database — Active connections, Transactions/sec, Replication lag
5. Kafka — Message rate (in/out), Consumer lag per topic
6. Redis — Hit ratio, Memory usage, Connected clients

**Custom Time Ranges:**
- **Market Hours**: 9:15 AM - 3:30 PM IST
- **EOD Batch**: 3:30 PM - 5:30 PM IST
- **Rolling Windows**: 5 min, 15 min, 1 hour, 24 hours

## Alert Thresholds

### System Alerts

| Alert | Threshold | Channels |
|---|---|---|
| API Latency High | P95 > 500ms for 5 min | Slack, Email, PagerDuty |
| API Error Rate High | >1% for 2 min | Slack, PagerDuty |
| Database Connection Pool | >85% utilized | Slack, Email |
| Redis Memory | >80% | Slack, Email |
| Kafka Consumer Lag | >10,000 for 10 min | Slack, PagerDuty |
| EOD Batch Failed | Any failure | Slack, Email, PagerDuty |
| Exchange File Missing | >2 hours past expected | Slack, Email |
| Reconciliation Failure | Discrepancy >0.1% | Slack, Email, PagerDuty |
| Certificate Expiry | <30 days | Email |
| Disk Usage | >85% | Slack, Email |

### Broker-Level Alerts

| Alert | Default Threshold | Configurable By |
|---|---|---|
| Client Margin Utilization | >85% warning, >95% critical | Broker Admin |
| Client Margin Shortfall | Any shortfall | Broker Admin |
| Large Position Change | >50% change in position value | Broker Admin |
| API Rate Limit | >80% of tier limit | System |

## Alert Routing

```
Critical Alerts
  → PagerDuty (on-call SRE)
  → Slack #garuda-ops-alerts

Warning Alerts
  → Slack #garuda-ops-alerts
  → Email ops@garuda.dev

Info Alerts
  → Slack #garuda-notifications
```

## Distributed Tracing

- **OpenTelemetry** for distributed tracing across all services
- **Jaeger** as trace backend (UI: http://jaeger.garuda-monitoring:16686)
- **Sample rate**: 5% in production, 10% in staging
- Trace context propagated via `traceparent` header across HTTP/gRPC/Kafka

## Centralized Logging

- **Structured JSON logging** via Serilog
- **Elasticsearch** for production log storage (1 year retention)
- **Kibana** for log search and visualization
- **Loki** as alternative for non-production environments
- Log levels configurable at runtime without restart

### Log Level Runtime Change
```bash
curl -X POST "https://api.garuda.dev/internal/logging/level" \
    -H "X-Internal-Key: $INTERNAL_KEY" \
    -d '{"category":"Garuda.MarginEngine","level":"Debug","duration_minutes":30}'
```

## BOD (Beginning of Day) Monitoring Checklist

| Time | Task | Verification |
|---|---|---|
| 8:30 AM | Verify all services healthy | `/health` endpoint: all green |
| 8:35 AM | DB replication status | Replication lag <5 seconds |
| 8:40 AM | Redis cluster health | All nodes connected |
| 8:45 AM | Kafka brokers healthy | All brokers in ISR |
| 8:50 AM | Exchange files processed | Yesterday's files: all processed |
| 9:00 AM | Market data WebSocket active | Live ticks flowing |
| 9:05 AM | Sanity margin calculation | Sample calc matches expected |
| 9:10 AM | All brokers active | Status dashboard: all green |
| 9:15 AM | Market opens — monitor | First 15 min heightened monitoring |
