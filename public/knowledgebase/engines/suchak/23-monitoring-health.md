# 23 — Monitoring & Health

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Health Status

| Component | Status | Threshold |
|-----------|--------|-----------|
| Overall Health | **99.9%** | > 99.5% |
| API Latency (p95) | 35ms | < 100ms |
| Indicator Compute | 28ms | < 50ms |
| Tick Ingestion | 85K/s | > 50K/s |
| Redis Latency | 2ms | < 10ms |
| Error Rate | 0.02% | < 0.1% |

## Prometheus Metrics

### Application Metrics

| Metric Name | Type | Description |
|-------------|------|-------------|
| `suchak_indicator_compute_duration_ms` | Histogram | Per-indicator compute time |
| `suchak_signal_strength_score` | Gauge | Current composite signal |
| `suchak_ticks_ingested_total` | Counter | Total ticks processed |
| `suchak_api_requests_total` | Counter | API request count by endpoint |
| `suchak_api_latency_ms` | Histogram | API response latency |
| `suchak_active_symbols` | Gauge | Count of active symbols |
| `suchak_indicator_errors_total` | Counter | Indicator computation failures |
| `suchak_data_source_connected` | Gauge | 1=connected, 0=disconnected |
| `suchak_redis_connections` | Gauge | Active Redis connections |
| `suchak_memory_usage_bytes` | Gauge | Process memory usage |

### Grafana Dashboard

Suchak ships with a pre-configured Grafana dashboard:

**Panels:**

1. **Overview** — Request rate, error rate, latency p50/p95/p99
2. **Indicator Performance** — Per-indicator compute times over time
3. **Data Sources** — Ganesh and Lakshmi connection health
4. **Signal Distribution** — Histogram of signal strength values
5. **Consumer Traffic** — Request rate per consumer application
6. **Resource Usage** — CPU, Memory, Goroutine count
7. **Redis Health** — Connection pool, hit rate, latency

## Alerting Rules

```yaml
groups:
- name: suchak-alerts
  rules:
  - alert: SuchakHighErrorRate
    expr: rate(suchak_indicator_errors_total[5m]) > 0.01
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Suchak error rate > 1%"

  - alert: SuchakHighLatency
    expr: histogram_quantile(0.95, suchak_api_latency_ms) > 100
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Suchak p95 latency > 100ms"

  - alert: SuchakDataSourceDisconnected
    expr: suchak_data_source_connected == 0
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "Suchak data source disconnected"

  - alert: SuchakRedisDown
    expr: suchak_redis_connections < 1
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "Suchak Redis connection lost"

  - alert: SuchakHighMemoryUsage
    expr: suchak_memory_usage_bytes / 8e9 > 0.85
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "Suchak memory usage > 85%"

  - alert: SuchakStaleSignals
    expr: time() - suchak_last_compute_timestamp > 30
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Suchak signals stale > 30s"
```

## Logging

Structured JSON logs shipped to ELK:

```json
{
  "timestamp": "2026-07-24T12:00:00.000Z",
  "level": "info",
  "module": "indicator::ema",
  "symbol": "NIFTY",
  "timeframe": "1d",
  "duration_ms": 1.2,
  "message": "EMA computation completed"
}
```

### Log Levels

| Level | Usage |
|-------|-------|
| ERROR | Computation failures, data source disconnects |
| WARN | Stale data, degraded performance, rate limit hits |
| INFO | Normal operations, configuration reloads |
| DEBUG | Detailed indicator computations, data flow |
| TRACE | Tick-level debug information |

## Health Check Endpoints

### Liveness

```
GET /health
→ 200 OK: {"status": "healthy", "version": "4.1.0", "uptime": "45d 12h 30m"}
→ 503: {"status": "unhealthy", "reason": "..."}
```

### Readiness

```
GET /health/ready
→ 200 OK: {"status": "ready"}
→ 503: {"status": "not_ready", "reason": "redis_not_connected"}
```

Readiness criteria:
- Redis connected
- At least 1 data source connected
- Indicator plugins loaded
- Watchlist loaded

## SLOs

| SLO | Target | Measurement Window |
|-----|--------|-------------------|
| Availability | 99.9% | 30 days |
| Latency (p95) | < 50ms | 5 min rolling |
| Error Rate | < 0.1% | 5 min rolling |
| Data Freshness | < 5s | Continuous |

## Incident Response

### Severity Levels

| Level | Criteria | Response Time |
|-------|----------|---------------|
| SEV1 | Service down, no indicators | 5 min |
| SEV2 | Degraded, partial outage | 15 min |
| SEV3 | Minor impact, single consumer | 30 min |
| SEV4 | Non-critical, investigation | 2 hours |

### Runbook Quick Reference

1. **Data source disconnected:** Check Ganesh/Lakshmi connectivity; verify certs
2. **High latency:** Check Redis latency; scale up replicas; check symbol count
3. **Memory pressure:** Reduce window_cache_size; scale up memory; restart pod
4. **Stale signals:** Check tick ingestion rate; verify Kafka consumer lag
