# 11 — Portfolio Allocation

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Portfolio Allocation controls how capital is distributed across multiple strategies running simultaneously. It ensures diversification, prevents over-concentration, and aligns capital deployment with strategic priorities.

## Allocation Methods

### Equal Weight

All strategies receive the same capital allocation.

```json
{ "method": "equal", "strategies": ["strat_a", "strat_b", "strat_c"] }
```

### Fixed Weight

Manual capital allocation per strategy.

```json
{
  "method": "fixed",
  "allocations": [
    { "strategyId": "strat_a", "weight": 40 },
    { "strategyId": "strat_b", "weight": 35 },
    { "strategyId": "strat_c", "weight": 25 }
  ]
}
```

### Performance-Based

Allocate dynamically based on recent performance metrics.

```json
{
  "method": "performance",
  "metric": "sharpe_ratio",
  "lookbackDays": 30,
  "rebalanceFrequency": "weekly"
}
```

| Metric | Description |
|---|---|
| `sharpe_ratio` | Risk-adjusted returns |
| `win_rate` | Percentage of winning trades |
| `profit_factor` | Gross profit / Gross loss |
| `sortino_ratio` | Downside risk-adjusted returns |

### Risk-Parity

Allocate inversely to volatility so each strategy contributes equal risk.

```json
{
  "method": "risk_parity",
  "lookbackDays": 60,
  "targetRiskContribution": "equal"
}
```

## Allocation Constraints

| Constraint | Description |
|---|---|
| Min allocation per strategy | 5% (configurable) |
| Max allocation per strategy | 50% (configurable) |
| Total allocation must sum | 100% |
| Max strategies in portfolio | 20 |

## Rebalancing

| Trigger | Description |
|---|---|
| Time-based | Weekly, monthly, or quarterly |
| Threshold-based | When any allocation deviates > 10% from target |
| Event-based | On new strategy addition or removal |
| Manual | Ad-hoc rebalance by user |

## Portfolio-Level Risk Overlay

Regardless of individual allocation, global limits apply:

- **Max Portfolio Drawdown**: If breached, all strategies are paused.
- **Max Leverage**: Aggregate leverage across all strategies.
- **Correlation Check**: Warn if two strategies have > 0.7 correlation.

## JSON Export

```json
{
  "portfolio": {
    "method": "fixed",
    "allocations": [
      { "strategyId": "trend_master", "weight": 50 },
      { "strategyId": "mean_reversion", "weight": 30 },
      { "strategyId": "breakout_hunter", "weight": 20 }
    ],
    "rebalanceFrequency": "weekly",
    "maxDrawdown": 15,
    "maxLeverage": 3
  }
}
```
