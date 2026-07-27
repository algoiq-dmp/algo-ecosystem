# 16 — Narad Integration

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Overview

The Local WebSocket server integrates with **Narad** for health reporting, operational event streaming, and anomaly detection. Every instance publishes its state to Narad for centralized visibility.

## Events Published

| Event Type | Trigger | Priority |
|------------|---------|----------|
| `WSServerStarted` | Server process starts | LOW |
| `WSServerStopped` | Graceful shutdown | MEDIUM |
| `WSConnectionOpened` | New WebSocket connection established | LOW |
| `WSConnectionClosed` | WebSocket connection closed | LOW |
| `WSConnectionAuthFailed` | JWT validation failed | MEDIUM |
| `WSSubscriptionCreated` | Client subscribed to topics | LOW |
| `WSSubscriptionRevoked` | Client unsubscribed | LOW |
| `WSMessageDropped` | Message dropped due to backpressure | MEDIUM |
| `WSHighConnectionCount` | Connections > 80% of max | MEDIUM |
| `WSMqDisconnected` | Lost connection to MQ | CRITICAL |
| `WSMqReconnected` | Reconnected to MQ | HIGH |
| `WSEventLoopLag` | Event loop lag > 100ms | HIGH |

## Health Registration

```protobuf
message WSHealthRegistration {
  string component = 1;       // "ws-server"
  string instance_id = 2;     // "ws01-mum"
  string version = 3;         // "2.5.0"
  string data_center = 4;     // "mumbai"
  int32 max_connections = 5;
  repeated string checks = 6;
  // ["mq-connectivity", "jwt-keys-valid", "event-loop-health",
  //  "memory-health", "connection-capacity"]
}
```

## Anomaly Detection

| Rule | Description | Alert |
|------|-------------|-------|
| Connection Spike | > 2x normal connection rate in 1 minute | P2 |
| Auth Failure Rate | > 10% of connections failing auth | P2 |
| Message Drop Rate | > 100 drops/sec sustained for 60s | P2 |
| Memory Growth | Memory increasing > 20% per hour | P2 |
| Event Loop Lag | Lag > 200ms for > 30s | P1 |

## Narad Dashboards

- **WebSocket Tier Health:** Real-time status of all instances across DCs
- **Connection Analytics:** Connection counts, durations, churn rate
- **Message Flow:** Messages/sec per instance, drop rates, MQ lag
- **Auth Analytics:** Auth success/failure rates, token expiration patterns

## Integration Configuration

```yaml
narad:
  agent_address: "localhost:50060"
  registration_interval_sec: 30
  health_report_interval_sec: 5
  event_queue_size: 1024
  tags:
    component: "ws-server"
    team: "infrastructure"
    criticality: "tier-1"
```
