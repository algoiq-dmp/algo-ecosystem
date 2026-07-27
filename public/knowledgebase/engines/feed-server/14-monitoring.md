# 14 — Monitoring

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Monitoring Architecture

```
Feed Server (Prometheus Exporter :9090)
      │
      ├──► Prometheus Server (scrape every 5s)
      │         │
      │         ├──► Grafana Dashboards
      │         └──► AlertManager → PagerDuty / Slack
      │
      └──► Narad Agent → Narad Core (health events, anomalies)
```

## Prometheus Metrics

### RED Metrics (Rate, Errors, Duration)

| Metric | Type | Labels |
|--------|------|--------|
| `feedd_msgs_ingested_total` | Counter | exchange, segment |
| `feedd_msgs_published_total` | Counter | exchange, segment |
| `feedd_decode_errors_total` | Counter | exchange, segment, error_type |
| `feedd_publish_errors_total` | Counter | exchange, segment |
| `feedd_latency_p50_us` | Gauge | exchange, segment |
| `feedd_latency_p99_us` | Gauge | exchange, segment |
| `feedd_latency_p999_us` | Gauge | exchange, segment |

### Saturation Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `feedd_ringbuf_utilization_pct` | Gauge | 0-100% ring buffer fill |
| `feedd_mq_publish_queue_depth` | Gauge | Messages waiting for MQ publish |
| `feedd_decoder_queue_depth` | Gauge | Messages waiting in decoder queue |
| `feedd_nic_rx_bytes_total` | Counter | Total bytes received per NIC port |

### Health Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `feedd_feed_state` | Gauge | 0=Disconnected, 1=Connecting, 2=Connected, 3=Error |
| `feedd_gaps_detected_total` | Counter | Cumulative gap count |
| `feedd_gap_recovery_duration_sec` | Histogram | Recovery time (buckets: 0.1, 1, 5, 10, 30, 60, 300) |
| `feedd_heartbeat_latency_ms` | Gauge | Time since last exchange heartbeat |

## Grafana Dashboards

### Dashboard: "Feed Server — Overview"
- Panel: Feed Status (state per exchange/segment)
- Panel: Message Throughput (msgs/sec per feed)
- Panel: Latency (p50, p99, p999 over time)
- Panel: Gap Events (counter, 5m rate)
- Panel: Ring Buffer Utilization %

### Dashboard: "Feed Server — Health"
- Panel: NIC RX Drops (per port)
- Panel: Decode Error Rate
- Panel: Publish Queue Depth
- Panel: Heartbeat Latency

## Alerting Rules

| Alert | Condition | Severity | Channel |
|-------|-----------|----------|---------|
| FeedDisconnected | `feedd_feed_state == 0` for 30s | P1 | PagerDuty |
| HighLatency | `feedd_latency_p99_us > 100` for 60s | P2 | Slack #alerts-trading |
| GapDetected | `rate(feedd_gaps_detected_total[1m]) > 0` | P2 | Slack #alerts-trading |
| GapRecoveryFailed | Gap exists > 300s | P1 | PagerDuty |
| RingBufferHigh | `feedd_ringbuf_utilization_pct > 90` for 30s | P2 | Slack #alerts-trading |
| MQQueueFull | `feedd_mq_publish_queue_depth > 80000` | P2 | Slack #alerts-infra |
| HeartbeatMissed | `feedd_heartbeat_latency_ms > 500` for 10s | P1 | PagerDuty |

## Health Check Endpoint

```
GET /health HTTP/1.1
Host: feed01-mum:9091
```

Returns HTTP 200 with JSON body:
```json
{
  "status": "healthy",
  "version": "2.8.0",
  "uptime_seconds": 1234567,
  "feeds": {
    "NSE-CM": {"state": "CONNECTED", "last_seq": 1023456789},
    "NSE-FO": {"state": "CONNECTED", "last_seq": 987654321}
  }
}
```

Used by load balancers and service discovery for traffic routing decisions.
