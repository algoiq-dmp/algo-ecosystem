# 16 — Narad Integration

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Overview

ODIN integrates with **Narad** for real-time order monitoring, adapter health tracking, and alerting. Every order event, adapter state change, and anomaly is published to Narad.

## Events Published

| Event Type | Trigger | Priority |
|------------|---------|----------|
| `OrderReceived` | New order received from MQ | LOW |
| `OrderValidated` | Order passed validation | LOW |
| `OrderRejected` | Order rejected (with reason) | MEDIUM |
| `OrderRouted` | Order dispatched to adapter | LOW |
| `OrderFilled` | Trade execution received | LOW |
| `OrderCancelled` | Order cancelled | LOW |
| `AdapterConnected` | Adapter established connection | LOW |
| `AdapterDisconnected` | Adapter lost connection | HIGH |
| `AdapterFailover` | Path failover occurred | HIGH |
| `RateLimiterHit` | Client exceeded rate limit | MEDIUM |
| `ReconciliationStarted` | EOD reconciliation begun | LOW |
| `ReconciliationCompleted` | Reconciliation finished clean | LOW |
| `ReconciliationDiscrepancy` | Discrepancy found | HIGH |
| `EmergencyStopTriggered` | Kill switch activated | CRITICAL |

## Order Flow Dashboard (Narad)

- Real-time order flow: received → accepted → filled (sankey diagram)
- Adapter health map: traffic lights per exchange path
- Rejection breakdown: pie chart by reason
- Recent order timeline: last 100 orders with state colors
- Latency histogram: routing latency by adapter

## Anomaly Detection

| Rule | Description | Alert |
|------|-------------|-------|
| Order Rate Spike | > 3x normal order rate for client | P2 |
| High Rejection Rate | > 5% of orders rejected in 5 minutes | P2 |
| Adapter Flapping | Connect/disconnect cycle > 3 in 5 minutes | P1 |
| Order Timeout | Orders in PENDING > 30 seconds | P2 |
| Reconciliation Failure | EOD reconciliation with discrepancies | P2 |

## Integration Configuration

```yaml
narad:
  agent_address: "localhost:50060"
  registration_interval_sec: 30
  health_report_interval_sec: 5
  event_queue_size: 4096
  tags:
    component: "odin"
    team: "execution"
    criticality: "tier-1"
```
