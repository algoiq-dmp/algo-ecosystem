# 16 — Narad Integration

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Overview

MQ integrates with **Narad** for real-time monitoring, health reporting, anomaly detection, and event-driven alerting. Every broker node streams operational events and metrics to Narad.

## Events Published

| Event Type | Trigger | Priority |
|------------|---------|----------|
| `BrokerStarted` | Broker process starts successfully | LOW |
| `BrokerStopped` | Graceful shutdown initiated | HIGH |
| `BrokerCrashed` | Unexpected process termination | CRITICAL |
| `PartitionLeaderElected` | New leader elected for a partition | MEDIUM |
| `PartitionLeaderStepDown` | Leader steps down (controlled or uncontrolled) | HIGH |
| `UnderReplicatedPartition` | ISR count drops below min.insync.replicas | CRITICAL |
| `ReplicaFellOutOfISR` | Follower removed from ISR | HIGH |
| `ReplicaJoinedISR` | Follower caught up and rejoined ISR | MEDIUM |
| `ConsumerGroupRebalance` | Consumer group rebalance completed | LOW |
| `ConsumerGroupDead` | All consumers left the group | MEDIUM |
| `DiskSpaceLow` | Storage < 20% free | HIGH |
| `DiskSpaceCritical` | Storage < 10% free | CRITICAL |
| `LogSegmentCorruption` | RocksDB corruption detected | CRITICAL |
| `MaxConnectionsReached` | Connection limit hit | MEDIUM |

## Health Registration

```protobuf
message BrokerHealthRegistration {
  string component = 1;       // "mq"
  int32 broker_id = 2;
  string host = 3;            // "mq01-mum"
  string version = 4;         // "5.1.3"
  string data_center = 5;
  int32 topics_count = 6;
  int32 partitions_count = 7;
  bool is_controller = 8;
  repeated string checks = 9;
  // ["cluster-health", "replication-health", "storage-health",
  //  "network-health", "consumer-group-health"]
}
```

## Anomaly Detection Rules in Narad

| Rule | Description | Alert |
|------|-------------|-------|
| Consumer Lag Spike | Lag increases 3x above 1-hour rolling average | P2 |
| Produce Rate Drop | Message rate drops > 50% from baseline | P2 |
| ISR Churn | > 3 ISR changes in 5 minutes | P2 |
| Disk Fill Rate | Projected to fill within 24 hours | P1 |
| Leader Election Storm | > 5 elections in 5 minutes | P1 |
| Network Partition | > 2 brokers unreachable from controller | P1 |

## Narad Dashboards

- **MQ Cluster Health Map:** Real-time status of all brokers, partitions, and ISRs
- **MQ Throughput Analysis:** Per-topic, per-partition message rates with anomaly overlays
- **Consumer Lag Overview:** Heatmap of lag across all consumer groups
- **Storage Capacity Planning:** Disk usage trends with 30-day projections

## Integration Configuration

```yaml
narad:
  agent_address: "localhost:50060"
  registration_interval_sec: 30
  health_report_interval_sec: 5
  event_queue_size: 2048
  tags:
    component: "mq"
    team: "infrastructure"
    criticality: "tier-0"
    data_center: "${MQ_DATA_CENTER}"
```
