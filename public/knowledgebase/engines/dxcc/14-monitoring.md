# DXCC — Monitoring & Observability

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## Dashboard Health Metrics

DXCC exposes its own health metrics both internally (visible in the UI) and externally (via Prometheus endpoint).

### Internal Health Indicators

| Metric | Location | Normal Range | Alert Threshold |
|--------|----------|-------------|-----------------|
| WebSocket Connection | Header status bar | Connected | Disconnected > 5s |
| API Latency | Dev tools / hidden | P95 < 200ms | P95 > 500ms |
| Widget Render Time | Performance panel | <100ms | > 500ms |
| Session Count | Admin panel | — | > 100 concurrent |
| Error Rate | Admin panel | < 0.1% | > 1% |
| Frontend Build Size | DevOps panel | < 500KB gzip | > 1MB gzip |

### Prometheus Metrics Endpoint

```
GET /metrics
```

**Key Metrics Exported:**

| Metric Name | Type | Labels | Description |
|------------|------|--------|-------------|
| `dxcc_ws_connected` | Gauge | — | 1 if Narad WebSocket connected, 0 otherwise |
| `dxcc_ws_messages_total` | Counter | topic | Total messages received per topic |
| `dxcc_ws_message_latency_ms` | Histogram | topic | Message processing latency in ms |
| `dxcc_ws_reconnects_total` | Counter | — | Total WebSocket reconnection attempts |
| `dxcc_api_requests_total` | Counter | method, endpoint, status | Total REST API requests |
| `dxcc_api_request_duration_ms` | Histogram | method, endpoint | API request duration |
| `dxcc_db_connections_active` | Gauge | db_name | Active database connections |
| `dxcc_db_query_duration_ms` | Histogram | db_name, query | Database query duration |
| `dxcc_sessions_active` | Gauge | — | Number of active user sessions |
| `dxcc_widget_render_time_ms` | Histogram | widget_type | Widget render time |
| `dxcc_errors_total` | Counter | type | Total errors by type |

---

## Engine Heartbeat Monitoring via Narad

Every engine publishes a heartbeat on `engine.health.<engine_id>` at a configurable interval (default 5 seconds).

### Heartbeat Message Schema

```json
{
  "topic": "engine.health.suchak",
  "payload": {
    "engine_id": "suchak",
    "version": "2.3.1",
    "timestamp": "2026-07-24T09:30:00Z",
    "status": "healthy",
    "metrics": {
      "cpu_percent": 45.2,
      "memory_mb": 1024,
      "latency_p50_ms": 5.1,
      "latency_p95_ms": 12.3,
      "latency_p99_ms": 18.9,
      "error_rate": 0.001,
      "uptime_seconds": 86400,
      "goroutines": 24,
      "replicas": 3
    }
  }
}
```

### Heartbeat Alert Rules

| Condition | Severity | Description |
|-----------|----------|-------------|
| No heartbeat for 30s | P2 | Engine may be down or network issue |
| No heartbeat for 60s | P1 | Engine unresponsive; investigate immediately |
| No heartbeat for 120s | P0 | Engine down; incident response required |
| CPU > 90% for 5 min | P2 | Engine under high load |
| Memory > 90% for 5 min | P2 | Potential memory leak |
| Error rate > 1% for 5 min | P2 | Engine experiencing errors |
| Latency P95 > 100ms for 5 min | P3 | Performance degradation |

---

## WebSocket Connection Health

DXCC monitors the WebSocket connection to Narad and provides real-time status:

### Status States

| State | Icon | Description |
|-------|------|-------------|
| Connected | Green circle | WebSocket active; receiving data |
| Connecting | Yellow spinner | Initial connection or reconnection in progress |
| Reconnecting | Yellow pulse | Connection lost; retrying with backoff |
| Disconnected | Red circle | Connection failed; data stale |
| Fallback | Orange warning | Operating in REST polling mode |

### Connection Metrics

```
Messages Received: 1,245,678
Messages Dropped (Dedup): 12
Reconnects Today: 2
Average Reconnect Time: 1.8s
Last Heartbeat: 2s ago
Current Latency (Round Trip): 15ms
```

---

## Widget Render Performance

DXCC tracks render performance of all widgets to ensure sub-100ms updates:

```typescript
// Performance monitoring hook
function useWidgetPerformance(widgetId: string) {
  useEffect(() => {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      if (duration > 100) {
        console.warn(`Widget ${widgetId} render took ${duration}ms`);
      }
    };
  });
}
```

### Performance Targets

| Widget Type | Target Render Time | Max Acceptable |
|------------|-------------------|----------------|
| Metric Card | <20ms | 50ms |
| Status Grid | <50ms | 100ms |
| Time-series Chart | <80ms | 200ms |
| Data Table (AG Grid) | <100ms | 300ms |
| Heatmap | <60ms | 150ms |
| OHLC Chart | <100ms | 200ms |

---

## Grafana Dashboard Integration

DXCC provides pre-built Grafana dashboards:

### Dashboard: "DXCC — Operations Overview"

- **Row 1:** WebSocket connection status, API requests/sec, active sessions, error rate
- **Row 2:** Engine health matrix (CPU, Memory, Latency) for top 10 engines
- **Row 3:** Widget render time histogram; P50/P95/P99 latencies
- **Row 4:** Narad message throughput by topic; DLQ depth trend
- **Row 5:** PostgreSQL connections, query duration, cache hit ratio
- **Row 6:** Redis memory usage, hit ratio, connected clients

### Dashboard: "DXCC — User Analytics"

- Active users over time (1h, 24h, 7d)
- Most viewed modules
- Average session duration
- Login success/failure rate
- Per-role usage distribution

---

## AlertManager Integration

DXCC feeds alert rules to AlertManager and displays firing alerts:

### DXCC-Specific Alert Rules

```yaml
groups:
  - name: dxcc_alerts
    rules:
      - alert: DXCCWebSocketDisconnected
        expr: dxcc_ws_connected == 0
        for: 1m
        labels:
          severity: P1
        annotations:
          summary: "DXCC WebSocket disconnected from Narad"
          runbook: "https://kb.internal/dxcc/troubleshooting#ws-disconnect"

      - alert: DXCCHighErrorRate
        expr: rate(dxcc_errors_total[5m]) > 0.01
        for: 5m
        labels:
          severity: P2
        annotations:
          summary: "DXCC error rate exceeds 1%"

      - alert: DXCCDatabaseConnectionPoolExhausted
        expr: dxcc_db_connections_active / dxcc_db_connections_max > 0.9
        for: 5m
        labels:
          severity: P2
        annotations:
          summary: "DXCC database connection pool at 90% capacity"
```

---

## Logging

DXCC uses structured logging with the Go `slog` package:

```json
{
  "time": "2026-07-24T09:30:01.123Z",
  "level": "INFO",
  "msg": "Narad message received",
  "topic": "engine.health.suchak",
  "message_id": "uuid-v4",
  "latency_ms": 12
}
```

Log levels: `DEBUG`, `INFO`, `WARN`, `ERROR`.

Production logs are shipped to Elasticsearch via Filebeat for centralized search and analysis in the Ecosystem Timeline.

---

> **Next:** See [15-security.md](15-security.md) for authentication, authorization, and audit security documentation.
