# 01 — Overview

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## What is Hanuman?

Hanuman is the Lakshmi ecosystem's dedicated 2-leg algorithmic execution engine. It executes spread, pair, and arbitrage strategies that involve exactly two correlated financial instruments. Built on the Vega strategy framework, Hanuman provides a declarative strategy definition language, real-time spread calculation, and automated order dispatch through ODIN.

## Why "Hanuman"?

In Hindu mythology, Hanuman is known for his ability to leap across great distances. Similarly, this engine "leaps" across two instruments, executing coordinated trades faster than humanly possible.

## Strategy Types

| Strategy | Leg 1 | Leg 2 | Description |
|----------|-------|-------|-------------|
| Calendar Spread | Near-month futures | Far-month futures | Exploits time value differences |
| Inter-Commodity Spread | Gold futures | Silver futures | Exploits commodity price relationships |
| Pair Trade | RELIANCE | ONGC | Statistical arbitrage on correlated equities |
| Cash-Futures Arbitrage | Equity spot | Equity futures | Exploits cost-of-carry mispricing |
| Option Spread | Call option | Put option | Vertical, calendar, or ratio spreads |
| Cross-Exchange Arb | NSE futures | BSE futures | Same instrument, different exchange |

## Position in Lakshmi

```
MQ (Market Data) ──► Hanuman ──► ODIN ──► Exchange
                         │
                    Vega Framework
                    (Strategy Lifecycle)
                         │
                    Risk Engine
                    (Pre-Trade Checks)
```

## Core Responsibilities

1. **Strategy Execution** — Load and execute Vega strategy definitions
2. **Spread Calculation** — Compute real-time spread between two instruments from tick data
3. **Signal Generation** — Detect entry and exit conditions based on spread thresholds
4. **Order Dispatch** — Generate paired orders (Leg1 + Leg2) and send to ODIN
5. **Fill Management** — Track partial fills on both legs, maintain hedge ratios
6. **Risk Compliance** — Validate orders against position limits, margin, and exposure before dispatch
7. **P&L Accounting** — Real-time and end-of-day P&L per strategy and per leg
