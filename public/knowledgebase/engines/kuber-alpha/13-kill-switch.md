# 13 — Kill Switch (Layer 1)

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

The Kill Switch is **Layer 1** of the 5-layer architecture — the deepest, most critical safety mechanism. It monitors margin utilization in real time and automatically halts all trading activity if the threshold is breached. Its default trigger is **1.01% margin utilization**.

## Why 1.01%?

The 1.01% threshold is chosen as the last possible defense:

- Normal trading margin: typically 5–15% of position value.
- At 1.01%, the margin buffer is nearly exhausted.
- This is the final automated safety net before a margin call or forced liquidation by the broker.

## Architecture

```
Layer 1: Kill Switch
     │
     │ Monitors
     ▼
┌──────────────────────────────────────────┐
│          Kill Switch Controller           │
│                                            │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Margin   │  │ Loss     │  │ Circuit │ │
│  │ Monitor  │  │ Monitor  │  │ Breaker │ │
│  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │             │             │       │
│  ┌────▼─────────────▼─────────────▼────┐  │
│  │         TRIGGER LOGIC               │  │
│  │  IF margin > 1.01% → ARM           │  │
│  │  IF dailyLoss > limit → ARM        │  │
│  │  IF circuitBreaker → ARM           │  │
│  └────────────────┬───────────────────┘  │
│                   │                       │
│              ┌────▼────┐                  │
│              │ ACTIONS │                  │
│              └─────────┘                  │
└──────────────────────────────────────────┘
```

## Trigger Conditions

| Condition | Threshold | Configurable |
|---|---|---|
| Margin utilization | > 1.01% | Yes |
| Daily loss limit | > ₹50,000 (default) | Yes |
| Circuit breaker (exchange) | Exchange circuit hit | No (auto) |
| Manual emergency | Admin triggered | — |

## Actions on Trigger

When the Kill Switch is armed:

| Priority | Action | Delay |
|---|---|---|
| 1 | Cancel all pending orders | Immediate |
| 2 | Pause all active strategies | Immediate |
| 3 | Close all open positions (MARKET orders) | Immediate |
| 4 | Stop new signal processing | Immediate |
| 5 | Send critical alerts (email, Slack, SMS) | < 1 sec |
| 6 | Log full state snapshot for audit | < 5 sec |
| 7 | Notify DXCC and Strategy Factory | < 5 sec |

## Recovery Process

The Kill Switch does NOT auto-recover. Manual steps are required:

1. Admin reviews the incident.
2. Root cause is identified and documented.
3. Risk parameters are reviewed and adjusted if needed.
4. Admin manually disarms the Kill Switch.
5. Strategies are manually resumed (or reconfigured).
6. Incident report is filed.

## Kill Switch Modes

| Mode | Behavior |
|---|---|
| `ARMED` | Monitoring actively; will trigger on threshold breach |
| `TRIGGERED` | Switch has fired; all trading halted |
| `DISARMED` | Switch deactivated (normal operation) |
| `TEST` | Simulated trigger for drill/testing |
| `OVERRIDE` | Admin override — switch bypassed (audited) |

## Testing the Kill Switch

Regular drills are mandatory:

```bash
curl -X POST https://api.algo-iq.com/kuber-alpha/v1/kill-switch/test
# Simulates a trigger; verifies all actions execute correctly
# No real orders are affected in TEST mode
```

| Drill Frequency | Scope |
|---|---|
| Weekly | Automated test (TEST mode) |
| Monthly | Manual drill with QA team |
| Quarterly | Full incident simulation with all stakeholders |

## Monitoring

| Metric | Description |
|---|---|
| `killswitch.margin_pct` | Current margin utilization % |
| `killswitch.daily_loss` | Cumulative loss since day start |
| `killswitch.status` | Current mode (ARMED/TRIGGERED/DISARMED) |
| `killswitch.last_trigger` | Timestamp of last trigger event |
| `killswitch.trigger_count` | Total lifetime triggers |

## Audit

Every Kill Switch event is immutably recorded:

```json
{
  "eventId": "ks-001",
  "timestamp": "2026-07-24T09:16:05Z",
  "trigger": "MARGIN_EXCEEDED",
  "marginAtTrigger": 1.02,
  "actions": ["cancel_orders", "pause_strategies", "close_positions", "alert"],
  "strategiesAffected": 5,
  "positionsClosed": 12,
  "recoveryTime": "2026-07-24T10:30:00Z",
  "reviewedBy": "admin@algo-iq.com"
}
```
