# Algo IQ Strategy Ecosystem -- From Strategy Factory to Vega Execution

**Type:** Ecosystem Overview | **Last Updated:** 2026-08-05

---

## End-to-End Flow of Strategy Creation, Testing, Deployment & Execution

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────┐
│  1. STRATEGY    │     │  2. PARIKSHAK   │     │  3. KUBER      │     │  4. VEGA        │     │  5. BROKERS │
│     FACTORY     │ --> │  (TESTING &     │ --> │     ALPHA      │ --> │     ENGINE      │ --> │  / EXCHANGE │
│                 │     │   VALIDATION)   │     │  (STRATEGY     │     │  (EXECUTION     │     │             │
│  Create         │     │  Test Validate  │     │   MANAGEMENT)  │     │   CORE)         │     │  Market     │
│  Strategies     │     │  Verify         │     │  Deploy Monitor│     │  Execute Manage │     │  Execution  │
│                 │     │                 │     │  Orchestrate   │     │  Monitor        │     │             │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────┘
```

---

## Phase 1: Strategy Factory (Create Strategies)

The R&D environment where every trading strategy begins its lifecycle.

| Capability | Description |
|---|---|
| **Strategy Builder** | Visual interface for strategy composition |
| **Rule Engine** | Configurable logic for trade decisions |
| **Parameters & Logic** | Fine-tuned strategy parameters |
| **Risk & Money Management** | Per-strategy risk controls and position sizing |
| **Backtest Module** | Initial backtesting against historical data |
| **Optimization** | Parameter tuning and strategy optimization |
| **Strategy Templates** | Predefined strategy templates for rapid development |
| **Version Management** | Complete strategy version history |

**Output:** Strategy Package (Logic + Rules + Parameters)

Each strategy receives a unique **Strategy ID** that persists through all phases.

---

## Phase 2: Parikshak (Testing & Validation)

The mandatory certification gateway. No strategy goes live without Parikshak approval.

| Validation Stage | Description |
|---|---|
| **Backtesting Engine** | Historical data validation |
| **Paper Trading** | Live market simulation without real capital |
| **Replay Testing** | Tick-by-tick market replay |
| **Stress Testing** | Extreme market condition simulation |
| **Market Condition Testing** | Bull, bear, volatile, range-bound scenarios |
| **Performance Analytics** | Returns, Sharpe, Sortino, win rate, max drawdown |
| **Risk Validation** | VaR, CVaR, beta, correlation analysis |
| **Scenario Analysis** | Multi-market condition evaluation |
| **Compliance Check** | SEBI/exchange regulatory verification |

**Results:** Pass/Fail Report (Performance + Risk + Logs)

```
Approved? ──Yes──> Approve & Send to Kuber Alpha
    │
    No
    │
    └──> Send Back for Modification (return to Phase 1)
```

---

## Phase 3: Kuber Alpha (Strategy Management)

The centralized web-based Strategy Management Platform.

### Strategy Management

| Function | Description |
|---|---|
| **Strategy Deployment** | Activate strategies in production |
| **Strategy Configuration** | Configure strategy parameters |
| **Parameter Management** | Update strategy parameters |
| **Risk & Exposure** | Monitor risk limits and exposure |
| **User & Access Control** | Multi-user RBAC |

### Strategy Orchestration Engine

| Function | Description |
|---|---|
| **Daily Strategy Scheduler** | Schedule strategy execution |
| **Strategy Combination Manager** | Combine multiple strategies daily |
| **Signal Aggregation & Prioritization** | Aggregate and rank signals |
| **Conflict Resolution** | Resolve competing strategy signals |
| **Execution Plan Generation** | Generate execution instructions for Vega |

### Strategy Monitoring

| Metric | Description |
|---|---|
| **Live Status** | Real-time strategy status |
| **Positions** | Current open positions |
| **P&L** | Profit and loss tracking |
| **Performance** | Strategy performance metrics |
| **Alerts** | Risk and execution alerts |
| **Logs & Audit** | Complete audit trail |

---

## Phase 4: Vega Engine (Execution Core)

The centralized execution engine processing all trades.

### Vega MAM (Multi Account Manager)

| Function | Description |
|---|---|
| **Multi Vendor Connectivity** | XTS, ODIN, REST, FIX, WebSocket |
| **Multi Account Management** | Client account profiling |
| **Fund Allocation** | Fixed, percentage, margin, risk-based allocation |
| **Signal Distribution** | Single, group, basket, portfolio distribution |
| **Risk & Margin Validation** | Pre-trade risk checks |

### Order Processor (Execution & Order Management)

| Function | Description |
|---|---|
| **Order Creation & Validation** | Generate and validate orders |
| **Execution Plan Engine** | Iceberg, TWAP/VWAP, slippage limits |
| **Modify / Cancel / Retry** | Order lifecycle management |
| **Strategy-wise Order Book** | Independent order books per strategy |
| **Strategy-wise Net Position** | Position tracking per strategy |
| **Kill Switch & Risk Controls** | Multi-tier emergency controls |
| **Strategy-wise Square Off** | Emergency position liquidation |

### Broker / Vendor Connectors

| Broker | Protocol |
|---|---|
| **XTS API** | FIX 4.4, REST |
| **ODIN API** | REST, FIX |
| **REST API** | HTTPS REST |
| **FIX** | FIX 4.4/5.0 |
| **WebSocket** | WSS |

---

## Phase 5: Brokers / Exchange (Market Execution)

Orders reach NSE and BSE for market execution.

---

## Signal Sources for Each Day (Strategy Triggers & Inputs)

Kuber Alpha receives signals from 8 intelligent trigger categories:

### 1. Time Series Triggers
- Time-based triggers
- Scheduled events
- Market time filters
- Session-based rules

### 2. Exit of One Strategy
- Exit signal from another strategy
- Profit booking
- Stop-loss hit
- Trail / Target hit

### 3. Alert on IV (Implied Volatility)
- IV above / below threshold
- IV Rank triggers
- IV Percentile alerts
- IV change alerts

### 4. Alert on Movement
- Price movement
- Breakout / Breakdown
- Gap up / Gap down
- Volume spike alerts

### 5. Alerts from Delta XI
- Delta signals
- Gamma signals
- Hedging alerts
- Exposure alerts

### 6. Alerts from Vyuh Engine
- Stock scan alerts
- Volume alerts
- Price pattern alerts
- Sector / trend alerts

### 7. Alert from SpreadWatch
- Spread opportunities
- Spread widening
- Spread narrowing
- Arbitrage alerts

### 8. Alert from Strategy (Internal)
- Internal strategy alerts
- Condition-based alerts
- Indicator-based alerts
- Custom rule alerts

---

## Daily Strategy Combinations

Multiple strategies work together based on market conditions:

```
Strategy A  +  Strategy B  +  Strategy C  +  Strategy D  =  Daily Combination Set
```

Kuber Alpha intelligently combines strategies every trading day based on predefined rules, market conditions, and real-time events.

---

## Execution Flow (Daily)

```
Signals     Combined &      Execution     Sent to      Orders       Trades      Updates      Strategy
Generated   Prioritized     Plan Created  Vega         Placed       Executed    Back to      Performance
                                                              in Market              Kuber
```

1. **Signals Generated** -- Multiple trigger sources produce signals
2. **Combined & Prioritized** -- Orchestration engine aggregates and ranks
3. **Execution Plan Created** -- Determine how to execute
4. **Sent to Vega for Execution** -- Forward to execution engine
5. **Orders Placed in Market** -- Broker routes to exchange
6. **Trades Executed** -- Exchange fills orders
7. **Updates Back to Kuber** -- Trade confirmations sync
8. **Strategy Performance** -- Monitor and evaluate

---

## Back to Kuber Alpha (Trade & Position Sync)

| Update Type | Description |
|---|---|
| **Real-time Trade Updates** | Live trade confirmations |
| **Order Status Updates** | Order lifecycle changes |
| **Position Synchronization** | Position book alignment |
| **P&L & Exposure Updates** | Profit/loss and risk updates |
| **Execution Reports** | Detailed execution analytics |
| **Audit & Logs** | Complete audit trail |

---

## Key Benefits

| Benefit | Description |
|---|---|
| **Structured Strategy Development** | Controlled Phase 1 → 2 → 3 lifecycle |
| **Robust Testing by Parikshak** | 12-stage validation before production |
| **Safe & Controlled Deployment** | DXCC approval required before go-live |
| **Centralized Strategy Management** | Single platform for all strategies |
| **Multi Source Intelligent Signals** | 8 trigger categories for daily activation |
| **Dynamic Daily Strategy Combinations** | Strategies work together as coordinated portfolio |
| **Real-time Execution via Vega** | Institutional-grade order execution |
| **Complete Traceability & Audit** | Strategy ID persists from creation to settlement |

---

## Flow Types (Legend)

| Arrow Type | Meaning |
|---|---|
| Blue arrow | Data / Signal Flow |
| Green arrow | Approval Flow |
| Dark arrow | Execution Flow |
| Dashed arrow | Feedback Loop |
| Black arrow | Trade Update Flow |

---

## Image Reference

This document describes the ecosystem overview diagram:
- **File:** `/knowledgebase/images/algo-iq-strategy-ecosystem-flow.png`
- **Title:** ALGO IQ STRATEGY ECOSYSTEM -- FROM STRATEGY FACTORY TO VEGA EXECUTION
- **Subtitle:** End to End Flow of Strategy Creation, Testing, Deployment & Execution
