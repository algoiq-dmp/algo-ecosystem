# 14 â€” Health & Monitoring

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Health Architecture

Ganesh exposes comprehensive health and monitoring data through multiple channels, all aggregated by **Narad** for centralized observability.

```
Ganesh Instances
    |
    +---> /api/v1/health          (Liveness - HTTP 200)
    +---> /api/v1/health/deep     (Readiness - Component Checks)
    +---> :9090/metrics           (Prometheus - Quantitative)
    +---> stdout JSON logs        (ELK Stack - Structured)
```

## Health Endpoints

### GET /api/v1/health

Liveness probe. Returns HTTP 200 if the process is alive.

```json
{
  "status": "healthy",
  "version": "3.2.1",
  "uptime": 1234567,
  "node_version": "20.11.0"
}
```

### GET /api/v1/health/deep

Readiness probe. Validates all downstream dependencies.

```json
{
  "status": "healthy",
  "checks": {
    "redis": "connected",
    "postgresql": "connected",
    "rabbitmq": "connected",
    "bar_freshness": "ok",
    "latest_bar_age_ms": 1500,
    "memory_usage_pct": 45.2,
    "cpu_usage_pct": 32.1
  }
}
```

## Prometheus Metrics

### Bar Aggregation Metrics

| Metric | Type | Description |
|---|---|---|
| `ganesh_bars_aggregated_total` | Counter | Total bars finalized, labeled by timeframe and symbol |
| `ganesh_bar_aggregation_latency_ms` | Histogram | Tick-to-bar latency per timeframe |
| `ganesh_ticks_consumed_total` | Counter | Total ticks ingested |
| `ganesh_ticks_dropped_total` | Counter | Ticks dropped due to ring buffer overflow |
| `ganesh_partial_bars_active` | Gauge | Currently open (in-progress) bars |

### Storage Metrics

| Metric | Type | Description |
|---|---|---|
| `ganesh_redis_write_latency_ms` | Histogram | Redis write operation duration |
| `ganesh_pg_write_latency_ms` | Histogram | PostgreSQL batch insert duration |
| `ganesh_pg_batch_size` | Histogram | Number of bars per PostgreSQL batch |
| `ganesh_cache_hit_ratio` | Gauge | Redis cache hit ratio (0.0-1.0) |

### API Metrics

| Metric | Type | Description |
|---|---|---|
| `ganesh_api_requests_total` | Counter | Total API requests, labeled by endpoint and consumer |
| `ganesh_api_latency_ms` | Histogram | End-to-end API request latency |
| `ganesh_api_errors_total` | Counter | API errors, labeled by status code |
| `ganesh_api_rate_limited_total` | Counter | Rate-limited requests by consumer |

### Health Metrics

| Metric | Type | Description |
|---|---|---|
| `ganesh_bar_freshness_age_ms` | Gauge | Age of the most recent bar per symbol |
| `ganesh_bar_validation_failures_total` | Counter | Bars failing integrity checks |
| `ganesh_gap_detected_total` | Counter | Data gaps detected |
| `ganesh_memory_heap_mb` | Gauge | Process heap memory usage |
| `ganesh_event_loop_lag_ms` | Gauge | Node.js event loop lag |

## Alerting Rules

| Alert | Condition | Severity | Action |
|---|---|---|---|
| BarFreshnessStale | `bar_freshness_age_ms > 300000` | Critical | PagerDuty |
| RedisDisconnected | Deep check redis = "disconnected" | Critical | PagerDuty |
| PGDisconnected | Deep check postgresql = "disconnected" | Critical | PagerDuty |
| HighCacheMissRate | `cache_hit_ratio < 0.5` for 5 min | Warning | Slack |
| HighAPILatency | `api_latency_ms_p99 > 100` for 5 min | Warning | Slack |
| TickDropRate | `ticks_dropped > 0` for 1 min | Warning | Slack |
| HighCPU | `cpu_usage_pct > 90` for 10 min | Warning | Email |
| HighMemory | `memory_usage_pct > 85` for 5 min | Critical | PagerDuty |

## Logging

All logs are structured JSON to stdout:

```json
{
  "timestamp": "2026-07-24T10:30:00.123Z",
  "level": "info",
  "component": "bar-aggregator",
  "message": "Bar finalized",
  "symbol": "RELIANCE",
  "timeframe": "1m",
  "barTime": "2026-07-24T10:30:00.000Z",
  "values": { "o": 2450.50, "h": 2455.75, "l": 2448.25, "c": 2453.10, "v": 125000 }
}
```

Logs are collected by Narad and shipped to the ELK stack for centralized querying.
