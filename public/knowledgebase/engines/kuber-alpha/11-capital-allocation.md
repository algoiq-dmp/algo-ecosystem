# 11 — Capital Allocation

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

The Capital Allocator is responsible for distributing available capital across all active strategies. It ensures no strategy exceeds its allocated budget, respects portfolio-level risk limits, and dynamically adjusts allocations based on performance.

## Allocation Models

### Fixed Allocation

Each strategy receives a fixed percentage of the total capital pool:

```json
{
  "model": "fixed",
  "totalBudget": 10000000,
  "allocations": [
    { "strategyId": "sf-trend-master", "percent": 40, "maxCapital": 4000000 },
    { "strategyId": "sf-mean-rev", "percent": 35, "maxCapital": 3500000 },
    { "strategyId": "sf-breakout", "percent": 25, "maxCapital": 2500000 }
  ]
}
```

### Dynamic Allocation

Allocations shift based on performance metrics:

```json
{
  "model": "dynamic",
  "totalBudget": 10000000,
  "metric": "sharpe_ratio",
  "lookbackDays": 30,
  "rebalanceFrequency": "weekly",
  "minAllocation": 5,
  "maxAllocation": 50
}
```

### Risk-Parity

Capital is allocated so each strategy contributes equal risk:

```json
{
  "model": "risk_parity",
  "totalBudget": 10000000,
  "targetVolatility": 5.0,
  "lookbackDays": 60
}
```

## Allocation Constraints

| Constraint | Default | Enforced |
|---|---|---|
| Max per strategy | 50% | Hard limit |
| Min per strategy | 5% | Soft limit (warning) |
| Total deployed ≤ budget | 100% | Hard limit |
| Max leverage | 3x | Hard limit |
| Max correlated exposure | 30% | Hard limit |

## Capital Lifecycle

```
FREE → ALLOCATED → DEPLOYED → LOCKED → RELEASED → FREE
```

| State | Description |
|---|---|
| `FREE` | Available for allocation |
| `ALLOCATED` | Reserved for a strategy, not yet deployed |
| `DEPLOYED` | Actively used in open positions |
| `LOCKED` | Margin-locked in Vega; cannot be reallocated |
| `RELEASED` | Returned to pool after position close |

## Real-Time Capital Tracking

```json
{
  "totalBudget": 10000000,
  "free": 2500000,
  "allocated": 5000000,
  "deployed": 2000000,
  "locked": 500000,
  "utilizationPercent": 75.0,
  "strategies": [
    {
      "strategyId": "sf-trend-master",
      "allocated": 4000000,
      "deployed": 1800000,
      "pnl": 45000,
      "pnlPercent": 1.13
    }
  ]
}
```

## Rebalancing

| Trigger | Action |
|---|---|
| Scheduled (daily/weekly) | Recalculate weights; adjust allocations |
| Threshold breach | If any allocation deviates > 10% from target |
| New strategy added | Rebalance to include new strategy |
| Strategy retired | Redistribute freed capital proportionally |
| Manual | Admin-triggered rebalance |

## Drawdown Protection

If the total portfolio drawdown exceeds the configured limit:
1. All strategies are paused.
2. No new capital is allocated.
3. An alert is sent to all notification channels.
4. Manual review is required before resuming.

## Monitoring

| Metric | Description |
|---|---|
| `capital.total_budget` | Total capital pool |
| `capital.utilization_pct` | Percentage of budget deployed |
| `capital.per_strategy` | Allocation per strategy |
| `capital.drawdown_pct` | Portfolio-level drawdown |
| `capital.rebalance.count` | Number of rebalances |
