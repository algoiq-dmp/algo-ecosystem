# 02 — Quick Start Guide

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Prerequisites

- A strategy approved by DXCC and deployed to Kuber Alpha
- At least one active signal source (Aalap Calls, Delta XI, VYUH, or TalkDelta AI)
- Admin or Strategy Owner role in Algo-IQ

## Quick Start: Deploy a Strategy

### Step 1: Strategy is DXCC-Approved

Your strategy has passed through the full lifecycle:
```
Strategy Factory → Parikshak → Simulator → DXCC → APPROVED
```

### Step 2: Deploy to Kuber Alpha

From Strategy Factory UI or API:

```bash
curl -X POST https://api.algo-iq.com/kuber-alpha/v1/strategies/deploy \
  -H "Authorization: Bearer <token>" \
  -d '{
    "strategyId": "sf-abc123",
    "mode": "PAPER",
    "capital": { "totalBudget": 500000, "allocationPercent": 10 }
  }'
```

Response: `{ "deploymentId": "dep-001", "status": "ACTIVE" }`

### Step 3: Monitor Signal Reception

Kuber Alpha now listens for signals matching your strategy:

```bash
curl https://api.algo-iq.com/kuber-alpha/v1/strategies/sf-abc123/status
# { "status": "PAPER", "signalsReceived": 0, "tradesTriggered": 0 }
```

### Step 4: Graduate to Live

Once paper trading confirms expected behavior:

```bash
curl -X POST https://api.algo-iq.com/kuber-alpha/v1/strategies/sf-abc123/mode \
  -d '{"mode": "LIVE"}'
```

## Quick Start: Monitor Active Strategies

```bash
curl https://api.algo-iq.com/kuber-alpha/v1/strategies?status=ACTIVE
```

Response includes current P&L, position count, margin utilization.

## Quick Start: Emergency Pause

If you need to halt a strategy immediately:

```bash
curl -X POST https://api.algo-iq.com/kuber-alpha/v1/strategies/sf-abc123/pause
```

Or use the Kill Switch trigger (automatic at 1.01% margin).

## Key Commands

| Action | API Endpoint |
|---|---|
| Deploy strategy | `POST /strategies/deploy` |
| Change mode | `POST /strategies/{id}/mode` |
| Pause strategy | `POST /strategies/{id}/pause` |
| Resume strategy | `POST /strategies/{id}/resume` |
| Retire strategy | `POST /strategies/{id}/retire` |
| View status | `GET /strategies/{id}/status` |
| View P&L | `GET /strategies/{id}/pnl` |
| Health check | `GET /health` |

## What's Next?

- Understand [Signal Reception](05-signal-reception.md)
- Configure [Capital Allocation](11-capital-allocation.md)
- Learn about the [Kill Switch](13-kill-switch.md)
- Explore [Monitoring](18-monitoring.md)
