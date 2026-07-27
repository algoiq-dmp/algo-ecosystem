# 16 — Narad Integration

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Overview

The Feed Server integrates with **Narad** (the Lakshmi monitoring and observability platform) for health reporting, anomaly detection, alerting, and operational insights.

## Integration Architecture

```
Feed Server
    │
    ├── Narad gRPC Client (embedded in feedd)
    │       │
    │       └──► Narad Agent (localhost:50060)
    │                │
    │                └──► Narad Core (central monitoring cluster)
    │
    └── Prometheus Exporter (:9090)
             │
             └──► Prometheus ──► Narad Dashboards
```

## Events Published to Narad

| Event Type | Trigger | Priority |
|------------|---------|----------|
| `FeedStateChange` | Feed connects/disconnects/pauses | HIGH |
| `SequenceGapDetected` | Gap in exchange sequence numbers | HIGH |
| `GapRecoveryStarted` | Replay initiated | MEDIUM |
| `GapRecoveryCompleted` | All gaps filled | MEDIUM |
| `GapRecoveryFailed` | Replay did not fill all gaps | CRITICAL |
| `HighLatencyWarning` | p99 latency > 100 us for 60s | MEDIUM |
| `RingBufferHighWatermark` | Ring buffer > 90% full | MEDIUM |
| `MQConnectionLost` | Lost connection to MQ broker | CRITICAL |
| `MQConnectionRestored` | Reconnected to MQ broker | HIGH |
| `SymbolMasterUpdated` | New instrument master loaded | LOW |
| `ConfigurationReloaded` | Runtime config reload executed | LOW |
| `AuditBatchFlushed` | Audit batch committed to Suraksha | LOW |

## Health Check Registration

At startup, the Feed Server registers with Narad Agent:

```protobuf
message HealthCheckRegistration {
  string component = 1;     // "feedd"
  string instance_id = 2;   // "feedd-nse-cm-01"
  string version = 3;       // "2.8.0"
  string data_center = 4;   // "mumbai"
  repeated string checks = 5;
  // ["feed-connectivity", "sequence-health", "latency-health",
  //  "mq-connectivity", "ringbuffer-health"]
}
```

Narad periodically probes the health check endpoint (`:9091/health`) and correlates the response with published events to determine overall component health.

## Anomaly Detection

Narad applies statistical anomaly detection on the following metrics:
- **Message rate:** Alert if throughput deviates > 3 sigma from the 4-week rolling baseline for the same time window
- **Latency:** Alert if p99 latency exceeds the 95th percentile of the rolling 24-hour window
- **Gap frequency:** Alert if gap rate exceeds 2 per hour

## Dashboards in Narad

The following pre-built dashboards are available:
- **Feed Server Health Map:** Real-time status of all feed instances across DCs
- **Latency Analysis:** Per-exchange, per-segment latency percentiles with anomaly overlays
- **Gap Investigation:** Timeline of gap events with recovery status
- **Throughput Trends:** 7-day, 30-day, and 90-day throughput patterns by exchange

## Integration Configuration

```yaml
narad:
  agent_address: "localhost:50060"
  registration_interval_sec: 30
  health_report_interval_sec: 5
  event_queue_size: 1024
  tags:
    component: "feedd"
    team: "market-data"
    criticality: "tier-0"
```
