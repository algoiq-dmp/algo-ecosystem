# 04 — Configuration

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Configuration Layers

```
Platform Defaults → Deployment Settings → Strategy Overrides
```

## Platform Configuration

`config/kuber-alpha.json`:

```json
{
  "engine": {
    "maxStrategies": 50,
    "maxPositions": 100,
    "signalTimeoutMs": 30000,
    "stateSnapshotIntervalMs": 5000,
    "gracefulShutdownMs": 30000
  },
  "killSwitch": {
    "marginPercent": 1.01,
    "dailyLossLimit": 50000,
    "autoDisable": true,
    "notificationChannels": ["email", "slack", "mq"]
  },
  "capital": {
    "defaultBudget": 1000000,
    "maxAllocationPerStrategy": 50,
    "minAllocationPerStrategy": 5,
    "rebalanceFrequency": "daily"
  },
  "vega": {
    "uri": "https://vega.internal:8082",
    "retryAttempts": 3,
    "retryDelayMs": 1000,
    "orderTimeoutMs": 60000
  },
  "signals": {
    "sources": ["aalap", "delta-xi", "vyuh", "talkdelta"],
    "dedupWindowMs": 5000,
    "maxSignalAgeMs": 10000
  }
}
```

## Strategy-Level Configuration

Each strategy can override certain settings:

```json
{
  "strategyId": "sf-abc123",
  "overrides": {
    "capital": { "budget": 500000, "allocationPercent": 10 },
    "mode": "STAGED",
    "stagedSteps": [
      { "percent": 25, "duration": "5d" },
      { "percent": 50, "duration": "5d" },
      { "percent": 100, "duration": null }
    ],
    "tradingHours": { "start": "09:15", "end": "15:30" },
    "killSwitch": { "marginPercent": 1.02 }
  }
}
```

## MQ Configuration

| Queue | Purpose | TTL |
|---|---|---|
| `kuber.incoming.strategy` | Strategy deployment from DXCC | 24h |
| `kuber.incoming.signal.*` | Signals from upstream engines | 1h |
| `kuber.outgoing.order` | Orders to Vega | 1h |
| `kuber.outgoing.status` | Strategy status updates | 24h |
| `kuber.alerts` | Alert notifications | 7d |
| `kuber.dlq` | Dead letter queue | 24h |

## Signal Source Routing Keys

| Source | Routing Key Pattern |
|---|---|
| Aalap Calls | `aalap.signal.{instrument}.{timeframe}` |
| Delta XI | `delta-xi.signal.{product}.{type}` |
| VYUH | `vyuh.signal.{segment}.{strategy}` |
| TalkDelta AI | `talkdelta.signal.{model}.{confidence}` |

## Deployment Modes

| Mode | Description |
|---|---|
| `PAPER` | Virtual trading; no real capital |
| `SHADOW` | Silent production run; no orders sent |
| `STAGED` | Gradual capital increase over time |
| `LIVE` | Full production deployment |

## Configuration Validation

On startup, Kuber Alpha validates:
- Kill Switch margin is valid (> 1.0).
- Vega endpoint is reachable.
- MQ queues are properly bound.
- Strategy definitions in the registry are valid.
- No duplicate strategy IDs.
