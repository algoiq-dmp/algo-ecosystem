# TalkOptions Platform — Troubleshooting Guide

**Version:** 4.7.2 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## Common Issues & Solutions

This guide covers frequently encountered issues with TalkOptions Platform and their resolution steps.

## Issue 1: Service Fails to Start

**Symptoms:** Container exits immediately, logs show connection refused errors.

**Diagnosis:**
```bash
docker logs talkoptions-core --tail 50
```

**Common causes:**
1. Database unreachable → Verify `TALKOPTIONSDB_URL` and network
2. MQ unreachable → Check RabbitMQ status on port 5672
3. Narad not running → Verify Narad on port 3100
4. Port conflict → Check no other process on ports 8081, 8444

**Resolution:**
```bash
# Check dependencies
narad health-check --target talkoptions --include-deps

# Force restart with clean state
docker compose down -v; docker compose up -d
```

## Issue 2: High API Latency

**Symptoms:** P99 latency exceeds 500ms, users report slowness.

**Diagnosis:**
```bash
# Check current metrics
curl http://192.168.190.118:8081/api/v1/metrics | grep latency
```

**Common causes:**
1. Database connection pool exhausted → Increase pool size
2. Cache miss rate high → Check Redis connectivity
3. CPU throttling → Scale up instance or add replicas
4. Slow downstream dependency → Check Ganesh/MQ health

**Resolution:**
```bash
# Scale up workers
narad scale talkoptions --replicas 4

# Clear and warm cache
curl -X POST http://192.168.190.118:8081/api/v1/admin/cache/warm
```

## Issue 3: MQ Consumer Disconnection

**Symptoms:** Messages piling up in MQ queue, downstream consumers not receiving data.

**Diagnosis:**
```bash
# Check MQ queue status
rabbitmqctl list_queues name messages_ready messages_unacknowledged | grep talkoptions
```

**Resolution:**
```bash
# Restart MQ consumer connection
narad restart-component talkoptions --component mq-consumer

# For persistent issues, check network between servers
narad network-test --source 192.168.190.118 --target 192.168.190.118:5672
```

## Issue 4: Database Migration Failure

**Symptoms:** Startup fails with migration error in logs.

**Diagnosis:**
```bash
docker logs talkoptions-core | grep -i migration
```

**Resolution:**
```bash
# Check migration status
docker compose run --rm talkoptions-core ./migrate.sh status

# Repair if stuck
docker compose run --rm talkoptions-core ./migrate.sh repair

# Force rollback and retry
docker compose run --rm talkoptions-core ./migrate.sh undo
docker compose run --rm talkoptions-core ./migrate.sh up
```

## Issue 5: Suraksha Auth Failures

**Symptoms:** All API calls return 401/403.

**Diagnosis:**
```bash
# Test authentication
curl -H "Authorization: Bearer <test_token>" \
  http://192.168.190.118:8081/api/v1/health
```

**Common causes:**
1. JWT signing key rotated → Restart service to refresh keys
2. Suraksha unreachable → Check Suraksha health
3. Service token expired → Re-register with Suraksha

**Resolution:**
```bash
# Re-register service with Suraksha
narad reauth talkoptions --service suraksha
docker compose restart talkoptions-api
```

## Issue 6: Memory Leak

**Symptoms:** Memory usage grows continuously, eventual OOM.

**Diagnosis:**
```bash
# Monitor memory trend
narad metrics talkoptions --metric memory_usage --duration 1h
```

**Resolution:**
```bash
# Immediate: restart the service
narad restart talkoptions --graceful

# Long-term: profile with heap dump
# Open ticket with Analytics team for investigation
```

## Issue 7: Stale Data

**Symptoms:** API returns outdated analytics, timestamps lagging.

**Diagnosis:**
```bash
# Compare latest data timestamp with current time
curl http://192.168.190.118:8081/api/v1/status | jq .last_processed_at
```

**Resolution:**
```bash
# Check upstream data flow
narad pipeline-status --target talkoptions

# Force reprocessing
curl -X POST http://192.168.190.118:8081/api/v1/admin/reprocess \
  -d '{"from":"2026-07-25T09:00:00"}'
```

## Issue 8: Disk Space Exhaustion

**Symptoms:** Write errors in logs, database full.

**Diagnosis:**
```bash
df -h | grep postgresql
```

**Resolution:**
```bash
# Clean old data (retention policy)
curl -X POST http://192.168.190.118:8081/api/v1/admin/cleanup \
  -d '{"before":"2026-07-18","force":false}'
```

## Escalation Path

1. Check this guide → 2. Check Grafana dashboards → 3. Slack #talkoptions-support → 4. Page Analytics on-call → 5. Incident in PagerDuty
