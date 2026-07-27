# 08 — VYUH Integration

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

VYUH is the multi-strategy orchestration engine that generates portfolio-level signals across multiple strategies, segments, and products. Unlike single-strategy signal sources, VYUH provides coordinated signals designed for diversified portfolio execution.

## Signal Profile

| Property | Description |
|---|---|
| Source | Portfolio-level strategy orchestration |
| Medium | Automated multi-strategy signal pipeline |
| Typical signals/day | 100–1000 |
| Coverage | Multi-segment (Equity, F&O, Currency, Commodity) |
| Timeframe | Multi-timeframe, portfolio-aligned |
| Coordination | Signals may be correlated across strategies |

## Integration Flow

```
VYUH Engine
        │
        ├── Portfolio model evaluates all strategies
        ├── Correlated signals generated
        ├── Allocation weights assigned
        │
        ▼
    MQ: vyuh.signal.{segment}.{strategy}
        │
        ▼
  Kuber Alpha Signal Ingestor
        │
        ├── Recognize portfolio correlation
        ├── Validate aggregate exposure
        ├── Apply capital allocation weights
        ├── Activate individual strategies
        └── Dispatch to Vega
```

## Signal Format (VYUH-Specific)

```json
{
  "signalId": "vyuh-20260724-001",
  "source": "vyuh",
  "timestamp": "2026-07-24T09:16:00Z",
  "expiresAt": "2026-07-24T09:31:00Z",
  "instrument": "BANK NIFTY",
  "exchange": "NSE",
  "direction": "LONG",
  "type": "ENTRY",
  "confidence": 0.88,
  "metadata": {
    "segment": "INDEX_FUTURES",
    "strategyId": "sf-vyuh-bank-trend",
    "portfolioId": "pf-aggressive-growth",
    "correlationGroup": "group-a",
    "allocationWeight": 0.25,
    "siblingSignals": ["sig-002", "sig-003"]
  },
  "payload": {
    "entryPrice": 52000.00,
    "targetPrice": 52250.00,
    "stopPrice": 51850.00,
    "quantity": 30,
    "hedgeInstrument": "BANK NIFTY PUT",
    "hedgeQuantity": 30
  }
}
```

## Portfolio Correlation Awareness

VYUH signals can be correlated. Kuber Alpha:

1. Recognizes `correlationGroup` tags.
2. Validates that aggregate exposure does not exceed portfolio limits.
3. Sequences correlated signals to avoid execution race conditions.
4. Cancels sibling signals if one in the group is rejected or hits a stop.

## Hedge Handling

VYUH signals may include hedge legs:

| Hedge Type | Behavior |
|---|---|
| Option hedge | Kuber Alpha dispatches both primary and hedge orders |
| Future hedge | Both legs must execute or both cancel (OCO semantics) |
| Pair trade | Long one instrument, short another; must be atomic |

## Allocation Weight

VYUH signals carry an `allocationWeight` that Kuber Alpha respects:
- Total weights across all active VYUH signals must sum to ≤ 1.0.
- If total exceeds 1.0, signals are scaled down proportionally.
- Weights are re-evaluated on each rebalance event.

## Monitoring

| Metric | Description |
|---|---|
| `vyuh.signals.received` | Signals from VYUH |
| `vyuh.portfolio.exposure` | Aggregate portfolio exposure from VYUH |
| `vyuh.correlation.violations` | Times correlation limits exceeded |
| `vyuh.hedge.execution` | Hedge leg execution success rate |
| `vyuh.allocation.utilization` | How much of the allocation budget is used |
