# 01 — Overview

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## What is ODIN?

ODIN (Order Delivery and Integration Network) is the Lakshmi ecosystem's universal order gateway. It receives order requests from strategy engines (like Hanuman), validates them, transforms them into exchange-specific formats, routes them to the appropriate exchange via dealer terminals or direct APIs, processes execution reports, and reconciles trades.

## Why "ODIN"?

In Norse mythology, Odin is the all-seeing god who observes everything from his throne. Similarly, ODIN has visibility into every order flowing through the Lakshmi ecosystem, from generation to execution. The name also references the widely-used ODIN Diet dealer terminal, which was the first integration target.

## Position in Lakshmi

```
Strategy Engines (Hanuman, etc.)
        │
        │ Orders (via MQ)
        ▼
      ODIN ──► Dealer Terminal APIs
        │          │
        │          ├── ODIN Diet (NSE, BSE)
        │          ├── Omnesys Nest (MCX, NCDEX)
        │          └── uTrade (Multi-exchange)
        │
        ├──► Direct Exchange APIs
        │          │
        │          ├── NSE NEAT API
        │          └── BSE BOLT API
        │
        ▼
    Executions (via MQ) → Strategy Engines, Risk, Settlement
```

## Core Responsibilities

1. **Order Ingestion** — Receive orders from strategy engines via MQ topics
2. **Order Validation** — Price bands, quantity limits, lot size, RMS, circuit filters
3. **Protocol Translation** — Convert Lakshmi canonical order format to exchange/dealer-terminal-specific formats
4. **Smart Routing** — Route orders through optimal path (direct API preferred, dealer terminal fallback)
5. **Execution Processing** — Receive and normalize execution reports from all sources
6. **Trade Reconciliation** — Match execution reports against exchange trade files at EOD
7. **Order State Management** — Maintain canonical order state across all downstream systems
