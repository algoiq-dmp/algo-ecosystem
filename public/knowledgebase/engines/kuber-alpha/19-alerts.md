# 19 — Alerts

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Kuber Alpha's alert system ensures that stakeholders are notified immediately when critical events occur. Alerts are multi-channel, tiered by severity, and include actionable context.

## Alert Channels

| Channel | Use Case | Latency |
|---|---|---|
| **MQ** | Machine-to-machine notifications | < 1s |
| **Slack** | Team notifications (#alerts-kuber-alpha) | < 5s |
| **Email** | Detailed incident reports | < 30s |
| **SMS** | Critical alerts to on-call personnel | < 10s |
| **PagerDuty** | On-call escalation | < 5s |
| **Webhook** | Custom integrations | < 1s |

## Alert Severities

### CRITICAL (P0)

Immediate action required. Trading may be halted.

| Alert | Trigger | Channels |
|---|---|---|
| Kill Switch TRIGGERED | Margin > 1.01% | All channels |
| Vega connection lost | No heartbeat for 30s | SMS, Slack, PagerDuty |
| Daily loss limit breached | Cumulative loss > limit | All channels |
| Strategy runaway | > 50 orders in 1 minute | SMS, Slack |

### HIGH (P1)

Urgent attention required. May impact trading within minutes.

| Alert | Trigger | Channels |
|---|---|---|
| Margin approaching threshold | Margin > 0.95% | Slack, Email |
| Signal conversion rate drop | < 50% for 5 min | Slack, Email |
| Position mismatch | Any detected | Slack, Email |
| MQ disconnection | > 10s | Slack |

### MEDIUM (P2)

Requires attention within the day.

| Alert | Trigger | Channels |
|---|---|---|
| Strategy drawdown warning | > 80% of limit | Slack, Email |
| Low free capital | < 10% of budget | Email |
| High queue depth | > 80% of max | Slack |
| Strategy paused (non-kill) | Manual or auto pause | Slack, Email |

### LOW (P3)

Informational. No immediate action required.

| Alert | Trigger | Channels |
|---|---|---|
| Strategy deployed | New deployment | Slack |
| Strategy mode change | Paper → Live etc. | Slack |
| Kill Switch test completed | Drill result | Email |
| Daily summary | EOD performance | Email |

## Alert Format

```json
{
  "alertId": "alert-uuid-001",
  "severity": "CRITICAL",
  "title": "Kill Switch TRIGGERED",
  "timestamp": "2026-07-24T09:16:05Z",
  "source": "kuber-alpha",
  "details": {
    "trigger": "MARGIN_EXCEEDED",
    "marginAtTrigger": 1.02,
    "threshold": 1.01,
    "strategiesAffected": 5,
    "positionsClosed": 12,
    "estimatedLoss": 15000
  },
  "actions": [
    "All strategies paused",
    "All pending orders cancelled",
    "All positions being closed at market",
    "Immediate review required"
  ],
  "links": {
    "dashboard": "https://grafana.algo-iq.com/d/kuber-alpha",
    "runbook": "https://wiki.algo-iq.com/runbooks/kill-switch",
    "incident": "https://pagerduty.algo-iq.com/incidents/123"
  }
}
```

## On-Call Rotation

| Tier | Schedule | Escalation |
|---|---|---|
| Primary | 24/7 weekly rotation | After 5 min → Secondary |
| Secondary | 24/7 weekly rotation | After 15 min → Manager |
| Manager | Always available | After 30 min → CTO |

## Alert Suppression

| Scenario | Behavior |
|---|---|
| Maintenance window | Alerts suppressed (configurable) |
| Duplicate alert | Suppressed within 5-min window |
| Known issue (tagged) | Suppressed for tagged strategies |
| Test environment | Non-critical alerts suppressed |

## Alert Testing

Alerts are tested regularly:

| Test | Frequency | Method |
|---|---|---|
| Channel delivery | Daily | Automated health check |
| End-to-end drill | Weekly | Trigger test alert |
| On-call response | Monthly | Simulated critical incident |

## MQ Alert Events

| Routing Key | Description |
|---|---|
| `kuber.alerts.critical` | P0 critical alerts |
| `kuber.alerts.high` | P1 high alerts |
| `kuber.alerts.medium` | P2 medium alerts |
| `kuber.alerts.low` | P3 low alerts |
| `kuber.alerts.killswitch` | Kill Switch-specific events |
