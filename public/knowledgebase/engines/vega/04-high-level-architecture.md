# 04 -- High-Level Architecture

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-08-05

---

## Architecture Overview

Vega Engine employs a **three-component, event-driven architecture** that separates concerns between:

1. **Vega MAM** -- Multi Account Manager (account management, broker connectivity, fund allocation, centralized risk)
2. **Talk Strategy API** -- Communication & Standardization Layer (signal ingestion, validation, routing)
3. **Order Processor** -- Execution Heart (order lifecycle, books, positions, execution plans, kill switch)

Each component communicates via well-defined interfaces (REST, MQ, FIX, WebSocket), enabling independent scaling and development.

---

## Three-Component Architecture

```
                          ALGO IQ ECOSYSTEM
                                |
                    ┌───────────┴───────────┐
                    │   Strategy Engines      │
                    │ (Delta, Option, Future, │
                    │   AI, Manual, External)  │
                    └───────────┬───────────┘
                                │ Standardized Signals
                    ┌───────────▼───────────┐
                    │  TALK STRATEGY API     │ ◄── Component #2
                    │  ┌─────────────────┐   │
                    │  │ Signal Validation│   │
                    │  │Strategy Auth     │   │
                    │  │Duplicate Detect  │   │
                    │  │Routing Engine    │   │
                    │  └────────┬────────┘   │
                    └───────────┼───────────┘
                                │ Validated Signals with Strategy ID
                    ┌───────────▼───────────┐
                    │    VEGA MAM            │ ◄── Component #1
                    │  ┌─────────────────┐   │
                    │  │Multi-Broker Mgmt │   │
                    │  │Multi-Account Mgmt│   │
                    │  │Fund Allocation   │   │
                    │  │Signal Distribution│  │
                    │  │Signal Transform  │   │
                    │  │Centralized Risk  │   │
                    │  └────────┬────────┘   │
                    └───────────┼───────────┘
                                │ Execution Instructions
                    ┌───────────▼───────────┐
                    │  ORDER PROCESSOR       │ ◄── Component #3
                    │  ┌─────────────────┐   │
                    │  │Order Lifecycle   │   │
                    │  │Order Book        │   │
                    │  │Trade Book        │   │
                    │  │Net Position      │   │
                    │  │Execution Plans   │   │
                    │  │Kill Switch       │   │
                    │  │Square Off        │   │
                    │  │Audit & Monitor   │   │
                    │  └────────┬────────┘   │
                    └───────────┼───────────┘
                                │ FIX / REST / WebSocket
                    ┌───────────▼───────────┐
                    │   BROKER / EXCHANGE    │
                    │ (XTS, ODIN, REST, FIX) │
                    └───────────────────────┘
```

---

## Component Details

### Component #1: Vega MAM (Multi Account Manager)

Vega MAM is responsible for managing multiple trading accounts across multiple broker/vendor APIs. Instead of strategies communicating directly with brokers, all execution requests first pass through Vega MAM, allowing centralized control, allocation, validation, and execution.

**Key Capabilities:**

| Capability | Description |
|---|---|
| **Multi-Broker Support** | XTS, ODIN APIs, REST APIs, FIX Gateways, WebSocket APIs simultaneously |
| **Multi-Account Management** | Client ID, Trading ID, Exchange Mapping, Product Permissions, Risk Limits, API Credentials |
| **Fund Allocation Engine** | Fixed quantity, fixed capital, percentage, margin-based, risk-based, strategy-based, portfolio |
| **Signal Distribution** | Single account, selected accounts, account groups, client baskets, portfolio groups |
| **Signal Transformation** | Converts generic trading signals into broker-specific execution requests |
| **Centralized Risk Validation** | Margin verification, quantity validation, product/exchange/client/strategy permission checks |

### Component #2: Talk Strategy API

Talk Strategy API acts as the communication layer between trading strategies and Vega. Every strategy inside the Algo IQ ecosystem communicates through this standardized API, creating a common language for all strategies regardless of their internal implementation.

**Key Capabilities:**

| Capability | Description |
|---|---|
| **Strategy Integration** | Accepts signals from Delta, Option, Future, AI, Statistical Models, Manual, External |
| **Standard Signal Format** | Strategy ID, Signal ID, Symbol, Exchange, Transaction Type, Qty, Price, Order Type, Product, Time, Validity, Priority, Risk Params, Execution Rules |
| **Common Identity** | Strategy ID persists through Strategy -> Talk Strategy API -> MAM -> Order Processor -> Broker -> Exchange -> Trade -> Position -> Audit |
| **Validation Layer** | Structure validation, parameter validation, strategy authentication, duplicate detection, versioning |
| **Routing Engine** | Routes validated signals to correct broker/client/strategy/execution policy destination |

### Component #3: Order Processor

The Order Processor is the execution heart of Vega. It receives standardized signals, converts them into executable orders, manages the full order lifecycle, and maintains complete trading records.

**Key Capabilities:**

| Capability | Description |
|---|---|
| **Order Creation** | Internal Order ID generation, broker request, exchange order request |
| **Order Lifecycle** | New, Modify, Cancel, Retry, Replace, Partial Fill, Complete Fill, Rejection, Timeout |
| **Pending Order Management** | Price updates, quantity updates, trigger price, time validity, retry after rejection |
| **Strategy-wise Order Book** | Open, Pending, Cancelled, Rejected, Completed orders per strategy |
| **Strategy-wise Trade Book** | Buy/Sell trades, partial executions, execution price, avg price, charges, P&L |
| **Strategy-wise Net Position** | Long/Short position, net quantity, average price, MTM, realized/unrealized P&L |
| **Execution Plan Engine** | Max order qty, iceberg, time-based slicing, slippage limits, price protection, retry rules |
| **Kill Switch** | Strategy, client, broker, exchange, global emergency -- stop orders, cancel pending, disable |
| **Square Off** | Strategy-wise, selected accounts, complete client, broker-wise, portfolio, emergency exit |
| **Audit & Traceability** | Strategy ID -> Signal ID -> Internal Order ID -> Broker Order ID -> Exchange Order ID -> Trade |

---

## Cross-Cutting Concerns

| Concern | Implementation |
|---|---|
| **Kill Switch** | Multi-tier (Strategy/Client/Broker/Exchange/Global); independent process on Redis Pub/Sub |
| **Audit Logging** | Append-only event log with full traceability from signal to settlement |
| **Monitoring** | Prometheus metrics on `:9090/metrics`; Grafana dashboards for execution quality |
| **Tracing** | OpenTelemetry distributed tracing with Strategy ID correlation |
| **Configuration** | Centralized config via Consul KV with broker-specific overrides |

---

## Communication Patterns

| Path | Protocol | Pattern |
|---|---|---|
| Strategy -> Talk Strategy API | HTTP REST | Synchronous request-response |
| Talk Strategy API -> Vega MAM | RabbitMQ (AMQP) | Asynchronous pub/sub |
| Vega MAM -> Order Processor | RabbitMQ (AMQP) | Asynchronous pub/sub |
| Order Processor -> Broker (XTS) | FIX 4.4 over TCP | Persistent session |
| Order Processor -> Broker (ODIN) | FIX / REST | Session based |
| Order Processor -> Broker (REST API) | HTTPS REST | Request-response |
| Kill Switch -> Order Processor | Redis Pub/Sub | Event-driven |
| Order Processor -> Audit | PostgreSQL/TimescaleDB | Direct write |
| Order Processor -> Consumers | MQ (AMQP) | Pub/Sub trade confirmations |

---

## Deployment Topology

```
[Load Balancer (HAProxy)]
        |
   ┌────┴────┬────────────┐
   ▼         ▼            ▼
[TS-API-1] [TS-API-2]  [TS-API-N]   <-- Stateless (auto-scale)
   │         │            │
   └────┬────┴─────┬──────┘
        ▼          ▼
   [RabbitMQ Cluster (3 nodes)]
        │
   ┌────┴────────────┐
   ▼                 ▼
[MAM-1..N]    [Processor-1..2]      <-- Stateful (partitioned by user)
   │                 │
   └────┬─────┬──────┘
        ▼     ▼
   [Broker-Adapter-1..N]            <-- One per broker session
        │
   ┌────┴────┐
   ▼         ▼
[Broker API] [Exchange]
```
