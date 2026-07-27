# 14 — Monitoring

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Monitoring Architecture

```
MQ Broker (Prometheus :9192)
    │
    ├──► Prometheus → Grafana (dashboards)
    │         └──► AlertManager → PagerDuty/Slack
    │
    └──► Narad Agent → Narad Core (health events)
```

## Key Metrics to Monitor

### Broker Health

| Metric | Warning Threshold | Critical Threshold |
|--------|------------------|-------------------|
| `mq_broker_state` | != 1 (healthy) | != 1 for > 30s |
| `mq_active_controller_count` | != 1 | 0 or > 1 |
| `mq_under_replicated_partitions` | > 0 | > 0 for > 60s |
| `mq_offline_partitions` | > 0 | > 0 for > 10s |
| `mq_raft_leader_elections_total` | > 1/min | > 5/min |

### Throughput

| Metric | Normal Range | Alert If |
|--------|-------------|----------|
| `mq_messages_in_total` rate | 5-8M msgs/sec | < 1M or > 12M |
| `mq_bytes_in_total` rate | 1-2 GB/sec | < 100 MB/sec (possible outage) |
| `mq_active_connections` | 200-500 | < 50 (component outage) |

### Latency

| Metric | Warning | Critical |
|--------|---------|----------|
| `mq_produce_latency_ms` p99 | > 5 ms | > 20 ms |
| `mq_fetch_latency_ms` p99 | > 10 ms | > 50 ms |

### Consumer Lag

| Metric | Warning | Critical |
|--------|---------|----------|
| `mq_consumer_lag` (trading topics) | > 1000 | > 10000 |
| `mq_consumer_lag` (monitoring topics) | > 10000 | > 100000 |

### Storage

| Metric | Warning | Critical |
|--------|---------|----------|
| Disk usage % | > 70% | > 85% |
| `mq_log_segment_count` total | > 10000 | > 50000 |
| RocksDB `num_running_compactions` | > 8 | > 12 |

## Grafana Dashboards

### Dashboard: "MQ Cluster Overview"
- Cluster health status (broker up/down, controller, ISR status)
- Aggregate throughput (msgs/sec, bytes/sec)
- Consumer lag by topic/group (top 10 heatmap)
- Under-replicated partitions over time
- Leader election rate

### Dashboard: "MQ Broker Detail"
- Per-broker CPU, memory, disk I/O
- Per-broker network throughput (client + inter-broker)
- Per-broker request latency histograms
- Per-broker RocksDB compaction stats
- Per-broker Raft log stats

## Alerting Rules

| Alert | Expression | Severity | Routing |
|-------|-----------|----------|---------|
| BrokerDown | `mq_broker_state{state="down"} == 1` | P1 | PagerDuty |
| UnderReplicatedPartitions | `mq_under_replicated_partitions > 0` for 60s | P1 | PagerDuty |
| HighProduceLatency | `histogram_quantile(0.99, mq_produce_latency_ms) > 20` | P2 | Slack #alerts-infra |
| ConsumerLagHigh | `mq_consumer_lag{topic="feed.*"} > 10000` | P2 | Slack #alerts-trading |
| DiskFull | `node_filesystem_avail_bytes{mountpoint="/data/mq"} < 536870912000` (500GB) | P1 | PagerDuty |
| LeaderElectionStorm | `rate(mq_raft_leader_elections_total[5m]) > 10` | P1 | PagerDuty |

## Health Check Endpoint

```
GET /health HTTP/1.1
Host: mq01-mum:9191
```

Response:
```json
{
  "status": "healthy",
  "broker_id": 1,
  "controller": true,
  "topics": 245,
  "partitions": 2187,
  "under_replicated": 0,
  "active_connections": 312,
  "uptime_seconds": 4320000
}
```

## Log Monitoring

Critical log patterns to alert on:
- `FATAL` level logs → P1
- `Raft leader step down` → P2
- `Log segment corruption detected` → P1
- `Disk write error` → P1
- `Max connections reached` → P2
- `Consumer group rebalance timeout` → P2
