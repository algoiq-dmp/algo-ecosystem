# 16 — Opportunity Conversion

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Opportunity Conversion is Kuber Alpha's core value proposition: the process of transforming raw trading signals into managed, risk-controlled strategies. Kuber Alpha does NOT generate opportunities — it converts them into executable, monitored, and protected trades.

## The Conversion Pipeline

```
RAW SIGNAL (from Layer 4)
        │
        ▼
┌──────────────────────┐
│  1. VALIDATE          │  ← Is the signal authentic and well-formed?
└──────┬───────────────┘
        │
        ▼
┌──────────────────────┐
│  2. MATCH             │  ← Which strategy should this signal activate?
└──────┬───────────────┘
        │
        ▼
┌──────────────────────┐
│  3. ASSESS            │  ← What is the risk/reward profile?
└──────┬───────────────┘
        │
        ▼
┌──────────────────────┐
│  4. SIZE              │  ← How much capital should be allocated?
└──────┬───────────────┘
        │
        ▼
┌──────────────────────┐
│  5. PROTECT           │  ← What stop-loss and take-profit apply?
└──────┬───────────────┘
        │
        ▼
┌──────────────────────┐
│  6. DISPATCH          │  ← Send the managed order to Vega
└──────┬───────────────┘
        │
        ▼
┌──────────────────────┐
│  7. MONITOR           │  ← Track position, P&L, margin, and risk
└──────────────────────┘
        │
        ▼
  MANAGED STRATEGY (ongoing)
```

## Conversion Rules

### Entry Conversion

| Signal Field | Conversion |
|---|---|
| `direction: LONG` | `transactionType: BUY` |
| `direction: SHORT` | `transactionType: SELL` |
| `type: ENTRY` | Open new position |
| `type: EXIT` | Close existing position |
| `type: MODIFY` | Modify existing order (price, quantity, stop) |

### Price Conversion

| Signal Has | Order Type |
|---|---|
| Only `entryPrice` | LIMIT order at entry price |
| `entryPrice` + `triggerPrice` | SL order |
| No price (MARKET signal) | MARKET order |

### Quantity Conversion

```
baseQuantity = min(
    signal.payload.quantity,
    capitalAllocator.calculateMaxQuantity(strategy, instrument),
    strategy.maxPositionSize
)
```

## Risk Overlay

Every converted order receives mandatory risk parameters:

| Parameter | Source |
|---|---|
| Stop-Loss | Strategy config > Signal payload > Platform default |
| Take-Profit | Strategy config > Signal payload |
| Trailing Stop | Strategy config only |
| Max Slippage | Platform config |
| Order Validity | DAY (default) or IOC |

## What Happens When Conversion Fails

| Failure | Action |
|---|---|
| No matching strategy | Signal dropped; logged |
| Strategy PAUSED | Signal queued until resume (up to expiry) |
| Capital exhausted | Signal dropped; alert sent |
| Risk limit breached | Signal dropped; alert sent |
| Kill Switch ARMED | All signals dropped |

## Conversion Analytics

Kuber Alpha tracks conversion metrics:

| Metric | Description |
|---|---|
| `conversion.rate` | Signals received → Orders dispatched |
| `conversion.drop_reason.*` | Breakdown of why signals were dropped |
| `conversion.latency` | Signal received → Order dispatched |
| `conversion.signal_to_pnl` | Attribution: which signals generated profit |

## Notifications on Conversion

| Event | Notification |
|---|---|
| High-confidence signal converted | Dashboard update |
| Signal dropped (capital exhausted) | Strategy owner alert |
| Signal dropped (risk limit) | Risk team alert |
| Consecutive drops (> 10) | Escalation to ops team |
