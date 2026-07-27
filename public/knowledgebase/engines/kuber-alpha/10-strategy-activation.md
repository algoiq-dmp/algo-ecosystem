# 10 — Strategy Activation

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Strategy Activation is the process by which Kuber Alpha matches incoming signals to registered strategies and initiates trade execution. It is the critical bridge between signal reception and order dispatch.

## Activation Pipeline

```
Signal Received (from Ingestor)
        │
        ▼
┌───────────────────┐
│ 1. Strategy Lookup │──▶ Find matching strategy by ID, instrument, direction
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│ 2. Status Check    │──▶ Is strategy ACTIVE/LIVE? Not PAUSED/KILL_SWITCH?
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│ 3. Condition Eval  │──▶ Does signal match entry/exit rules?
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│ 4. Risk Check      │──▶ Position limits, drawdown, cooldown, daily loss?
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│ 5. Capital Alloc   │──▶ Calculate position size; allocate capital
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│ 6. Order Construct │──▶ Build order payload for Vega
└───────┬───────────┘
        │
        ▼
   Dispatch to Vega
```

## Strategy Lookup

| Match Method | Priority | Description |
|---|---|---|
| Exact ID | 1 | Signal contains explicit `strategyId` |
| Instrument + Direction | 2 | Match any active strategy for the instrument/direction |
| Instrument only | 3 | Any strategy for the instrument |
| Default | 4 | Fallback strategy for the signal source |

## Status Check

Only strategies in these states can be activated:

| Status | Can Activate? |
|---|---|
| `ACTIVE` (LIVE mode) | Yes |
| `ACTIVE` (PAPER mode) | Yes (paper trades only) |
| `ACTIVE` (STAGED mode) | Yes (within capital step) |
| `ACTIVE` (SHADOW mode) | Yes (orders logged, not sent) |
| `PAUSED` | No |
| `KILL_SWITCH` | No |
| `RETIRED` | No |
| `ERROR` | No |

## Condition Evaluation

The Strategy Activator evaluates:
1. **Entry conditions**: Signal type matches strategy's entry logic.
2. **Direction alignment**: Signal direction matches strategy's allowed direction.
3. **Timeframe alignment**: Signal timeframe is in strategy's allowed timeframes.
4. **Market hours**: Current time is within trading hours.
5. **Cooldown**: Sufficient time has passed since last entry.

## Risk Check (Pre-Activation)

| Check | Failure Action |
|---|---|
| Max positions reached | Skip signal |
| Daily loss limit breached | Skip signal |
| Max drawdown breached | Skip signal (strategy may be paused) |
| Concentration limit exceeded | Skip signal |
| Kill Switch armed | Skip all signals |

## Order Construction

After activation, an order is constructed:

```json
{
  "orderId": "ord-uuid-001",
  "strategyId": "sf-abc123",
  "signalId": "sig-uuid-001",
  "instrument": "NIFTY 50",
  "exchange": "NSE",
  "direction": "BUY",
  "orderType": "LIMIT",
  "quantity": 50,
  "price": 24500.50,
  "stopLoss": 24450.00,
  "takeProfit": 24600.00,
  "product": "MIS",
  "validity": "DAY"
}
```

## Activation Metrics

| Metric | Target |
|---|---|
| Strategy lookup latency | < 1ms |
| Full activation pipeline | < 5ms |
| Activation success rate | > 99.5% |
| False activation rate | < 0.1% |
