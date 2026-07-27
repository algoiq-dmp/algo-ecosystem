# 17 — Kuber Alpha Deployment

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Kuber Alpha is the final destination in the strategy lifecycle. Once DXCC approves a strategy, it is deployed to Kuber Alpha as an active, capital-managed strategy that responds to live market signals.

## Deployment Flow

```
DXCC Approval ──▶ Strategy Factory ──▶ Kuber Alpha
                       │                    │
                       │  Publish to MQ     │
                       │  (kuber.incoming.  │
                       │   strategy)        │
                       │                    ├── Ingest strategy
                       │                    ├── Allocate capital
                       │                    ├── Connect to signals
                       │                    ├── Activate monitoring
                       │                    └── Confirm deployment
                       │                    │
                       ◀── ACK ─────────────┘
```

## Deployment Payload

```json
{
  "deploymentId": "dep-001",
  "strategyId": "sf-abc123",
  "dxccApprovalId": "dxcc-sub-001",
  "strategyJson": { },
  "capitalAllocation": {
    "totalBudget": 500000,
    "maxDrawdown": 15,
    "allocationPercent": 10
  },
  "activation": {
    "startDate": "2026-07-25",
    "tradingHours": { "start": "09:15", "end": "15:30" },
    "mode": "PAPER"
  },
  "killSwitch": {
    "marginThreshold": 1.01,
    "maxDailyLoss": 50000,
    "autoDisable": true
  }
}
```

## Deployment Modes

| Mode | Description |
|---|---|
| `PAPER` | Virtual trading; no real capital. Used for initial deployment validation. |
| `STAGED` | Gradual capital increase over time (e.g., 25% → 50% → 100%). |
| `LIVE` | Full deployment with allocated capital. |
| `SHADOW` | Runs silently in production for further validation; no orders sent. |

## Activation Sequence

1. Kuber Alpha receives deployment payload.
2. Strategy is registered in the strategy registry.
3. Capital is allocated per portfolio configuration.
4. Signal subscriptions are activated (Aalap Calls, Delta XI, VYUH, TalkDelta AI).
5. Kill Switch parameters are configured and armed.
6. Vega connection is established for order routing.
7. Deployment confirmation sent to Strategy Factory.

## Post-Deployment Monitoring

| Monitor | Description |
|---|---|
| Strategy Health | Real-time P&L, positions, signal accuracy |
| Kill Switch Status | Margin utilization vs. threshold |
| Vega Connectivity | Order routing health |
| Signal Latency | Time from signal to order placement |

## Rollback

If issues are detected post-deployment:
1. Kuber Alpha can pause the strategy (manual or via Kill Switch).
2. Strategy Factory receives a `strategy.paused` MQ event.
3. Strategy owner can revise and resubmit through the lifecycle.
4. Emergency rollback supported via DXCC override.

## Deployment API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/deploy` | Deploy strategy to Kuber Alpha |
| POST | `/api/deploy/pause/{strategyId}` | Pause active strategy |
| POST | `/api/deploy/resume/{strategyId}` | Resume paused strategy |
| POST | `/api/deploy/retire/{strategyId}` | Permanently retire strategy |
| GET | `/api/deploy/status/{strategyId}` | Get deployment status |
