# 17 â€” Troubleshooting Guide

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Diagnostic Commands

```bash
curl http://localhost:3002/api/v1/health
curl http://localhost:3002/api/v1/health/deep
curl http://localhost:9090/metrics | grep ganesh
tail -f /var/log/ganesh/app.log | jq .
cat /var/log/ganesh/app.log | jq 'select(.level == "error")'
```

## Common Issues

### API Returns 503 Service Unavailable

**Symptoms**: Health endpoint returns `status: "unhealthy"`, deep check shows Redis or PostgreSQL disconnected.

**Causes**: Redis cluster node down, PostgreSQL primary unreachable, network partition.

**Resolution**:
```bash
redis-cli -h <host> -p 6379 --tls ping
psql -h <host> -U ganesh_app -d ganesh -c "SELECT 1"
pm2 restart ganesh
```

### Bars Not Being Generated

**Symptoms**: `ganesh_bars_aggregated_total` not incrementing, bar freshness age > 5 minutes.

**Causes**: RabbitMQ connection lost, ring buffer overflow, aggregator threads stuck.

**Resolution**:
```bash
rabbitmqctl list_queues name messages | grep ganesh
curl http://localhost:9090/metrics | grep ganesh_ticks_dropped_total
curl http://localhost:9090/metrics | grep ganesh_event_loop_lag_ms
# If drops > 0, increase ring buffer or add worker threads
```

### High API Latency

**Symptoms**: `ganesh_api_latency_ms` p99 > 100ms.

**Causes**: Low Redis cache hit ratio, PostgreSQL under load, insufficient instances.

**Resolution**:
```bash
curl http://localhost:9090/metrics | grep ganesh_cache_hit_ratio
redis-cli INFO memory | grep used_memory_human
# Scale API instances horizontally; warm cache for frequent queries
```

### Corporate Actions Not Applied

**Resolution**:
```bash
curl http://localhost:9090/metrics | grep ganesh_corp_action
rabbitmqctl list_queues name messages | grep corp.actions
node scripts/apply-corp-action.js --symbol RELIANCE --ex-date 2026-07-20 --type SPLIT --ratio 2:1
```

### Memory Usage Too High

**Resolution**:
```bash
# Reduce ring buffer: "ringBufferSize": 50000
redis-cli INFO stats | grep evicted_keys
node --inspect --heapsnapshot-signal=SIGUSR2 index.js
```

## Debug Mode

```bash
GANESH_LOG_LEVEL=debug npm start
```

**Do not run debug in production for more than 5 minutes** due to log volume.

## Support Escalation

| Severity | Channel | Response Time |
|---|---|---|
| Critical (outage) | PagerDuty | 5 minutes |
| High (degraded) | Slack #ganesh-alerts | 15 minutes |
| Medium (anomaly) | Jira ticket | 4 hours |
| Low (question) | Slack #ganesh-support | 24 hours |
