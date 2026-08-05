# Kuber Alpha -- Central Strategy Management & Execution Platform

> **Version:** 1.8.0 | **Owner:** Strategy | **Health:** 99.8% | **Last Updated:** 2026-08-05

## Overview

**Kuber Alpha** is the centralized web-based Strategy Management Platform of the Algo IQ ecosystem. It replaces the legacy **TalkStrategy Desktop (EXE)** application and serves as the intelligent bridge between trading strategies and the **Vega Execution Engine**.

Kuber Alpha is the single platform where all automated, semi-automated, AI-driven, and quantitative trading strategies are created, configured, monitored, executed, and managed. Rather than individual strategies communicating directly with brokers or exchanges, every strategy communicates exclusively with **Vega Engine** through standardized APIs, making Kuber Alpha the unified strategy control center.

> **See Also:** [Algo IQ Strategy Ecosystem Overview](/knowledgebase/ecosystem-overview.md) -- End-to-end flow from Strategy Factory to Vega Execution.

---

## Evolution

### Legacy Architecture
```
Strategy Engine
      |
      v
TalkStrategy Desktop (EXE)
      |
      v
Broker API
      |
      v
Exchange
```

### New Architecture
```
Strategy Engine
      |
      v
Kuber Alpha (Web Platform)
      |
      v
Vega Engine
      |
      v
Vendor/Broker API
      |
      v
Exchange
```

The migration from desktop to web provides centralized management, better scalability, easier deployment, multi-user collaboration, high availability, and seamless integration with the entire Algo IQ ecosystem.

---

## Position in the Algo IQ Ecosystem

```
Market Data Engines (Ganesh, Lakshmi, Surya)
        |
        v
Analytical Engines (Garuda, Suchak, Manthan, Delta XI, VYUH, SpreadWatch)
        |
        v
     KUBER ALPHA                         <-- YOU ARE HERE
(Strategy Management Platform)
        |
        v
     VEGA ENGINE
(Execution Engine)
        |
        v
 Broker / Vendor APIs (XTS, ODIN, FIX, REST)
        |
        v
   NSE / BSE Exchange
        |
        v
Orders -> Trades -> Positions
        |
        v
Trade Updates back to Kuber Alpha
```

Kuber Alpha serves as the **brain of strategy management**, while Vega acts as the **execution backbone**. Together they create a scalable, modular, and institutional-grade trading architecture.

---

## Primary Responsibilities

Kuber Alpha acts as the **Strategy Operating System** for the organization:

| Responsibility | Description |
|---|---|
| **Centralized Strategy Management** | Single platform for all strategies across categories |
| **Strategy Execution Control** | Activate, pause, modify, and retire strategies |
| **Strategy Lifecycle Management** | Design -> Test -> Approve -> Deploy -> Live -> Modify -> Suspend -> Retire |
| **Signal Orchestration** | Validate, authenticate, deduplicate, prioritize, and queue signals |
| **Engine Integration** | Connect strategies to Ganesh, Suchak, Garuda, Manthan, and more |
| **Risk Configuration** | Per-strategy risk parameters and kill switch thresholds |
| **Performance Monitoring** | Real-time dashboards for every active strategy |
| **Trade Synchronization** | Bidirectional sync of orders, trades, and positions with Vega |
| **Strategy Analytics** | P&L, drawdown, margin utilization, execution quality |
| **Communication with Vega Engine** | Standardized API-based signal dispatch and trade updates |

---

## Strategy Repository

All trading strategies are maintained within Kuber Alpha:

| Category | Description |
|---|---|
| **Options Strategies** | Call/Put, spreads, straddles, strangles, iron condors |
| **Futures Strategies** | Long/short futures, calendar spreads |
| **Equity Strategies** | Long/short equity, pair trades |
| **Index Strategies** | Nifty, Bank Nifty, sectoral indices |
| **Delta Neutral Strategies** | Delta-hedged option positions |
| **Gamma Strategies** | Gamma scalping and positioning |
| **Theta Strategies** | Theta decay harvesting |
| **Volatility Strategies** | Volatility arbitrage, variance swaps |
| **AI Strategies** | ML-driven signal generation |
| **Quantitative Models** | Statistical models and factor-based strategies |
| **Statistical Arbitrage** | Mean reversion, cointegration pairs |
| **Portfolio Strategies** | Multi-asset portfolio allocation |
| **Hedging Strategies** | Portfolio and position hedging |
| **Basket Trading Strategies** | Multi-symbol basket orders |

Each strategy has its own independent configuration, execution parameters, permissions, and monitoring dashboard.

---

## Strategy Lifecycle Management

```
DESIGN          Configure logic and execution parameters
   |
   v
TESTING         Paper trading and replay engine validation
   |
   v
APPROVAL        Risk and compliance validation
   |
   v
DEPLOYMENT      Production activation
   |
   v
LIVE            Real-time monitoring of signals, positions, and performance
MONITORING
   |
   v
MODIFICATION    Parameter updates without affecting other strategies
   |
   v
SUSPENSION      Temporary disablement with state preservation
   |
   v
RETIREMENT      Archiving with complete audit history
```

---

## Signal Management

Every connected strategy generates trading signals. Kuber Alpha performs:

| Stage | Check |
|---|---|
| **Signal Validation** | Structure and field-level validation |
| **Strategy Authentication** | API key + HMAC verification |
| **Duplicate Detection** | Idempotency check on Signal ID |
| **Risk Verification** | Pre-trade risk limit checks |
| **Execution Rule Check** | Strategy-specific execution parameters |
| **Priority Assignment** | FIFO with priority overrides |
| **Signal Queuing** | Ordered queue per strategy |
| **Strategy Mapping** | Route signal to correct strategy instance |

Only validated signals are forwarded to Vega Engine for execution.

---

## Communication with Vega Engine

Kuber Alpha communicates with Vega through standardized APIs:

| Field | Description |
|---|---|
| **Strategy ID** | Unique strategy identifier (persists through entire lifecycle) |
| **Signal ID** | Unique signal identifier for deduplication |
| **Symbol** | Trading symbol |
| **Exchange** | NSE, BSE, MCX |
| **Buy/Sell Action** | Transaction direction |
| **Order Type** | MARKET, LIMIT, STOP, STOP_LIMIT |
| **Quantity** | Order quantity |
| **Price** | Limit/stop price |
| **Execution Plan** | Iceberg, TWAP/VWAP, slippage limits |
| **Risk Parameters** | Max drawdown, stop loss |
| **Client Allocation Rules** | MAM distribution rules |
| **Execution Priority** | Priority level for order queuing |
| **Trading Session Details** | Session type and validity |

Vega manages account allocation, broker connectivity, order execution, and exchange communication.

---

## Trade Synchronization

Once Vega executes orders, execution details sync back to Kuber Alpha:

| Update | Description |
|---|---|
| **Internal Order ID** | Vega-assigned order identifier |
| **Broker Order ID** | Broker-assigned order identifier |
| **Exchange Order ID** | Exchange-assigned order identifier |
| **Trade Confirmation** | Fill notification |
| **Execution Price** | Fill price |
| **Filled Quantity** | Executed quantity |
| **Average Price** | Weighted average fill price |
| **Order Status** | Current lifecycle state |
| **Position Updates** | Net position changes |
| **P&L Information** | Realized and unrealized P&L |
| **Rejections & Error Codes** | Rejection reasons and codes |

---

## Engine Integration Hub

Kuber Alpha acts as the integration hub for multiple Algo IQ engines:

| Engine | Data Provided |
|---|---|
| **Ganesh** | OHLC market data, historical prices |
| **Suchak** | Processed market data, events |
| **Garuda** | Options analytics, margin calculations |
| **Pragnya** | Probability analysis |
| **Manthan** | Market intelligence, data pipelines |
| **Trinetra** | Closing auction prediction |
| **Chitragupta** | Audit & compliance data |
| **Lakshmi** | Live data distribution |
| **Surya** | BOD/EOD operations, exchange files |
| **Narad** | Network connectivity hub |
| **Suraksha** | Security layer, risk enforcement |

Each strategy can subscribe only to the engines and data streams it requires.

---

## Strategy-wise Monitoring

Every strategy has a dedicated monitoring dashboard:

| Metric | Description |
|---|---|
| **Current Status** | Active, Paused, Paper, Staged |
| **Signal Count** | Signals generated today |
| **Active Positions** | Current open positions |
| **Pending Orders** | Orders awaiting execution |
| **Executed Orders** | Orders filled today |
| **MTM** | Mark-to-market value |
| **Realized P&L** | Closed trade profit/loss |
| **Unrealized P&L** | Open position profit/loss |
| **Drawdown** | Current drawdown from peak |
| **Margin Utilization** | % of allocated margin used |
| **Execution Latency** | Signal-to-fill time |
| **API Health** | Vega connection status |
| **Risk Status** | Kill switch armed/triggered state |

---

## API-Driven Architecture

Kuber Alpha exposes secure APIs for:

| API Category | Purpose |
|---|---|
| **Strategy Registration** | Create and register new strategies |
| **Strategy Configuration** | Configure strategy parameters |
| **Signal Submission** | Submit trading signals |
| **Position Synchronization** | Sync positions with Vega |
| **Order Status Updates** | Receive order lifecycle updates |
| **Trade Notifications** | Receive trade confirmations |
| **Risk Management** | Configure and monitor risk |
| **Monitoring** | Access monitoring data |
| **Reporting** | Generate performance reports |
| **Audit Services** | Access audit trail |

---

## Key Advantages

- Replaces legacy TalkStrategy Desktop (EXE) with modern web platform
- Single control center for all trading strategies
- Standardized communication with Vega Engine
- Centralized strategy lifecycle management
- Modular integration with all Algo IQ analytical engines
- Real-time monitoring of strategy execution and performance
- Complete synchronization of signals, orders, trades, and positions
- Enterprise-grade scalability for thousands of concurrent strategies
- Full auditability with end-to-end traceability using Strategy ID
- High availability, multi-user collaboration, future expansion ready

---

## Quick Links

- [Architecture](01-architecture.md)
- [Quick Start](02-quick-start.md)
- [Signal Reception](05-signal-reception.md)
- [Vega Integration](15-vega-integration.md)
- [Kill Switch](13-kill-switch.md)
- [API Reference](17-api-reference.md)
- [Glossary](25-glossary.md)
