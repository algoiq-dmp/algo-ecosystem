# TalkOffice — Monitoring & Alerting

**Version:** 4.0.0 | **Owner:** Operations | **Last Updated:** 2026-07-25

## Health Monitoring

TalkOffice health is monitored at 99.9% uptime via Narad heartbeat checks every 5 seconds.

## Key Health Metrics

| Metric | Source | Threshold | Alert Severity |
|--------|--------|-----------|----------------|
| Service uptime | Narad heartbeat | < 99.5% | P1 - Critical |
| API response time (P99) | Prometheus | > 500ms | P2 - Warning |
| API error rate (5xx) | Prometheus | > 1% | P2 - Warning |
| MQ consumer lag | RabbitMQ | > 10,000 messages | P2 - Warning |
| CPU utilization | Node Exporter | > 85% sustained | P3 - Info |
| Memory utilization | Node Exporter | > 90% | P2 - Warning |
| Disk I/O latency | Node Exporter | > 100ms | P3 - Info |
| Database connection pool | App metrics | > 80% utilized | P2 - Warning |
| Cache hit rate | App metrics | < 90% | P3 - Info |

## Prometheus Metrics

```prometheus
# Service health
talkoffice_up{instance="192.168.190.119:3080"} 1

# Request metrics
talkoffice_http_requests_total{method="GET", endpoint="/api/v1/health", status="200"}
talkoffice_http_request_duration_seconds{quantile="0.99"}

# Processing metrics
talkoffice_messages_processed_total
talkoffice_processing_duration_seconds{quantile="0.95"}
talkoffice_cache_hit_ratio
```

## Grafana Dashboards

| Dashboard | URL | Purpose |
|-----------|-----|---------|
| Service Overview | `/d/talkoffice-overview` | Health, latency, error rates |
| API Insights | `/d/talkoffice-api` | Endpoint usage, rate limiting |
| MQ Consumer | `/d/talkoffice-mq` | Message processing, lag, DLQ |
| Resource Usage | `/d/talkoffice-resources` | CPU, memory, disk, network |

## Alert Rules

### P1 — Critical (Immediate Response Required)
- Service down for > 60 seconds → Notify on-call engineer via PagerDuty
- Database unreachable → Failover trigger + notify DBA

### P2 — Warning (Respond Within 30 Minutes)
- P99 latency > 500ms for 5+ minutes → Slack #eng-operations
- Error rate > 1% → Create Jira ticket automatically
- MQ consumer lag > 10K → Scale workers notification

### P3 — Info (Review Within 4 Hours)
- CPU > 85% → Capacity planning review
- Cache hit rate < 90% → Cache tuning ticket

## Health Check Endpoints

| Endpoint | Purpose | Frequency |
|----------|---------|-----------|
| `GET /api/v1/health` | Basic liveness | Every 5s (Narad) |
| `GET /api/v1/health/ready` | Readiness (DB + MQ + deps) | Every 10s (K8s) |
| `GET /api/v1/metrics` | Prometheus scrape | Every 15s |
