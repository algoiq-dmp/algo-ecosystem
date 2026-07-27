# 04 — High-Level Architecture

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Architecture Overview

Hanuman follows an event-driven architecture where market data events flow through strategy evaluation, signal generation, risk checking, and order dispatch stages. Each strategy runs as an independent state machine managed by the Vega framework.

## Architecture Layers

### Layer 1: Market Data Ingestion
- Subscribes to MQ topics for instruments required by loaded strategies
- Maintains real-time order book cache (top 5 levels) for each instrument
- Computes derived metrics: mid-price, weighted average price, spread

### Layer 2: Strategy Engine (Vega)
- Loads strategy definitions from Vega DSL files
- Manages strategy lifecycle: INIT → READY → RUNNING → PAUSED → STOPPED
- Each strategy has a dedicated evaluation function called on every tick
- Strategies maintain internal state: position, P&L, signal history

### Layer 3: Signal Evaluator
- Evaluates entry conditions: spread crosses threshold, volume sufficient, volatility within range
- Evaluates exit conditions: profit target hit, stop loss hit, time expiry, spread mean-reversion
- Generates `TradeSignal` events with leg quantities, prices, and time-in-force

### Layer 4: Risk Validator
- Enforces hard limits: max position, max order value, daily loss cap, circuit breaker
- Margin check: verifies sufficient margin via Risk Engine API
- Slippage guard: if market moved against signal by more than `max_slippage_ticks`, order is rejected
- Generates `RiskVeto` event if any check fails

### Layer 5: Order Dispatcher
- Converts `TradeSignal` to paired order requests for ODIN
- Leg 1 and Leg 2 orders dispatched with `OCO` (One-Cancels-Other) linkage
- Monitors fill events from ODIN via MQ execution reports
- Adjusts unfilled leg quantity on partial fills
- Triggers auto-hedge if one leg fails

## Strategy State Machine

```
INIT ──► READY ──► RUNNING ──► PAUSED ──► STOPPED
                    │    ▲
                    ▼    │
                  PAUSED ─┘
```

Transitions:
- `load`: INIT → READY
- `start`: READY → RUNNING
- `pause`: RUNNING → PAUSED (hold positions, no new orders)
- `resume`: PAUSED → RUNNING
- `stop`: RUNNING/PAUSED → STOPPED (close all positions, cancel pending orders)
- `unload`: STOPPED → (removed)
