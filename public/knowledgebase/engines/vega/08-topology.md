# 08 -- Ecosystem Topology

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-08-05

---

## Vega Engine in the Algo-IQ Ecosystem

Vega Engine sits at the **execution layer** (Layer 4) of the Algo-IQ ecosystem, bridging strategy engines with external broker gateways. It depends on upstream engines for market data, symbol masters, and risk parameters, while serving as the sole conduit for order flow to exchange destinations.

---

## Upstream Dependencies

| Engine | Data Provided | Protocol | Criticality |
|---|---|---|---|
| **Strategy Engines** (via Talk Strategy API) | Trade signals, execution plans | REST, MQ | CRITICAL -- Order source |
| **Kuber Alpha** | Aggregated strategy signals | REST, MQ | CRITICAL -- Primary signal aggregator |
| **Lakshmi** | Real-time market data, LTP feed | MQ, WebSocket | HIGH -- Price validation |
| **Ganesh** | Symbol master, instrument tokens, lot sizes | REST, MQ | HIGH -- Symbol resolution |
| **Surya** | BOD/EOD data, corporate actions, margin files | REST | HIGH -- Reference data |
| **Rakshak** | Protective action commands, risk parameters | MQ | HIGH -- Risk enforcement |
| **Kavach** | Kill switch activation commands, circuit breakers | MQ | CRITICAL -- Emergency control |
| **Narad** | Network connectivity, VPN, authentication | TCP | CRITICAL -- Network layer |

---

## Downstream Consumers

| System | Data Received | Protocol | Purpose |
|---|---|---|---|
| **TalkDelta** | Trade confirmations, order status, position updates | MQ | Post-trade analytics, dashboard updates |
| **TalkOffice** | Trade confirmations, RMS data | MQ | Risk monitoring, trader workflows |
| **DXCC** | Execution quality metrics, monitoring data | MQ, REST | Operational dashboard |
| **Chitragupta** | Immutable audit events | MQ, DB | Compliance, post-trade audit |
| **Kuber Alpha** | Trade confirmations, position snapshots | MQ | Portfolio analytics, signal feedback |
| **XTS Broker** | FIX order messages | FIX 4.4/TCP | Exchange routing |
| **ODIN API Broker** | FIX/REST order messages | FIX/REST | Exchange routing |
| **REST API Brokers** | HTTPS order requests | REST | Exchange routing |
| **FIX Gateway Brokers** | FIX messages | FIX 4.4/5.0 | Exchange routing |
| **WebSocket Brokers** | Real-time order streaming | WebSocket | Exchange routing |

---

## Detailed Three-Component Topology

```
                           ┌───────────────────────────────┐
                           │      STRATEGY ENGINES           │
                           │  TalkDelta  │ Delta XI │ VYUH   │
                           │ SpreadWatch │ Suchak  │ Manthan│
                           │ Strategy Factory │ TalkDelta AI │
                           └───────────────┬───────────────┘
                                           │ Signals (REST/MQ)
                           ┌───────────────▼───────────────┐
                           │      KUBER ALPHA                │
                           │  (Signal Aggregation Engine)    │
                           └───────────────┬───────────────┘
                                           │ Aggregated Signals
                   ┌───────────────────────┼───────────────────────┐
                   │                       ▼                        │
                   │  ┌──────────────────────────────────────┐     │
                   │  │     TALK STRATEGY API                 │     │
                   │  │  [Vega Component #2]                  │     │
                   │  │  - Signal Standardization             │     │
                   │  │  - Validation & Auth                  │     │
                   │  │  - Duplicate Detection                │     │
                   │  │  - Routing Engine                     │     │
                   │  │  - Strategy ID Assignment             │     │
                   │  └──────────────────┬───────────────────┘     │
                   │                     │ Validated Signals        │
                   │  ┌──────────────────▼───────────────────┐     │
                   │  │         VEGA MAM                      │     │
                   │  │  [Vega Component #1]                  │     │
                   │  │  - Multi-Broker Management            │     │
                   │  │  - Multi-Account Management           │◄────┼──── Surya (BOD/EOD)
                   │  │  - Fund Allocation Engine             │     │
                   │  │  - Signal Distribution                │◄────┼──── Rakshak (Risk Params)
                   │  │  - Signal Transformation              │     │
                   │  │  - Centralized Risk Validation        │     │
                   │  └──────────────────┬───────────────────┘     │
                   │                     │ Execution Instructions   │
                   │  ┌──────────────────▼───────────────────┐     │
                   │  │       ORDER PROCESSOR                 │     │
                   │  │  [Vega Component #3]                  │     │
                   │  │  - Order Lifecycle Management         │     │
                   │  │  - Order Book / Trade Book            │     │
                   │  │  - Net Position Tracking              │◄────┼──── Kavach (Kill Switch)
                   │  │  - Execution Plan Engine              │     │
                   │  │  - Kill Switch System                 │     │
                   │  │  - Strategy-wise Square Off           │     │
                   │  │  - Real-Time Monitoring               │     │
                   │  │  - Audit & Traceability               │     │
                   │  └──────────────────┬───────────────────┘     │
                   │                     │                          │
                   └─────────────────────┼──────────────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │     BROKER ADAPTERS                      │
                    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
                    │  │ XTS  │ │ ODIN │ │ REST │ │ FIX  │   │
                    │  │FIX   │ │ API  │ │ API  │ │GW    │   │
                    │  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘   │
                    │     │        │        │        │        │
                    └─────┼────────┼────────┼────────┼────────┘
                          │        │        │        │
                    ┌─────▼────────▼────────▼────────▼────────┐
                    │           NARAD (Network Layer)           │
                    └──────────────────┬───────────────────────┘
                                       │
                    ┌──────────────────▼───────────────────────┐
                    │              EXCHANGE                      │
                    │         (NSE / BSE / MCX)                  │
                    └──────────────────────────────────────────┘
```

---

## Signal Flow: End-to-End

```
Strategy Signal
  │  Strategy ID: STRAT-001
  │  Signal ID: SIG-20260805-0001
  ▼
Talk Strategy API
  │  Validate, authenticate, assign Strategy ID
  ▼
Vega MAM
  │  Map to client accounts, allocate funds, transform signal
  │  Account: ACC-100, ACC-200, ACC-300
  │  Broker: XTS (FIX)
  ▼
Order Processor
  │  Internal Order ID: ORD-VEGA-20260805-0001
  │  Broker Order ID: BROK-XTS-20260805-0001
  ▼
Broker Adapter (XTS FIX)
  │  FIX NewOrderSingle (MsgType=D)
  │  ClOrdID=ORD-VEGA-20260805-0001
  ▼
Exchange
  │  Exchange Order ID: EXCH-NSE-20260805-0001
  ▼
Trade Confirmation
  │  Trade ID: TRD-NSE-20260805-0001
  ▼
Position Update
  │  Strategy: STRAT-001 | Account: ACC-100
  │  Net Qty: +100 | Avg Price: 2450.50
  ▼
Audit Log (Chitragupta)
  │  Complete trace: Strategy->Signal->Order->Broker->Exchange->Trade->Position
```

---

## Network Topology

```
                    ┌─────────────────────────────┐
                    │     Algo-IQ Core VLAN          │
                    │  ┌────────┐  ┌────────────┐   │
                    │  │Lakshmi │  │Strategy Eng│   │
                    │  └───┬────┘  └─────┬──────┘   │
                    │      │              │          │
                    │  ┌───┴────┐  ┌─────┴──────┐   │
                    │  │Ganesh  │  │ Kuber Alpha│   │
                    │  └───┬────┘  └─────┬──────┘   │
                    │  ┌───┴────┐  ┌─────┴──────┐   │
                    │  │ Surya  │  │  Rakshak   │   │
                    │  └───┬────┘  └─────┬──────┘   │
                    │      │              │          │
                    │  ┌───┴──────────────┴──────┐   │
                    │  │        Kavach            │   │
                    │  └────────────┬─────────────┘   │
                    └───────────────┼─────────────────┘
                                    │
                    ┌───────────────┼─────────────────┐
                    │               ▼                   │
                    │  ┌──────────────────────────┐    │
                    │  │       VEGA ENGINE          │    │
                    │  │   (Execution VLAN)          │    │
                    │  │  ┌────────────────────┐    │    │
                    │  │  │ Talk Strategy API   │    │    │
                    │  │  │        │             │    │    │
                    │  │  │        ▼             │    │    │
                    │  │  │    Vega MAM          │    │    │
                    │  │  │        │             │    │    │
                    │  │  │        ▼             │    │    │
                    │  │  │  Order Processor     │    │    │
                    │  │  │  ┌──────┴──────┐    │    │    │
                    │  │  │  │ Kill Switch │    │    │    │
                    │  │  │  │  Audit Log  │    │    │    │
                    │  │  └─┴─────────────┴────┘    │    │
                    │  └──────────────────────────┘    │
                    └────────────────┬─────────────────┘
                                     │
                    ┌────────────────┼─────────────────┐
                    │    Broker Connectivity VLAN        │
                    │                │                   │
                    │  ┌─────────────┴─────────────┐    │
                    │  │    FIX Gateway Servers      │    │
                    │  └──────┬──────────┬──────────┘    │
                    │         │          │               │
                    └─────────┼──────────┼───────────────┘
                              │          │
                    ┌─────────▼──┐  ┌────▼──────────┐
                    │ XTS Lease  │  │ ODIN/Greeksoft │
                    │ Line Router│  │ VPN Tunnel     │
                    └─────────┬──┘  └────┬──────────┘
                              │          │
                              ▼          ▼
                       [NSE/BSE/MCX Exchange]
```

---

## Service Discovery

| Component | Mechanism | Details |
|---|---|---|
| Talk Strategy API | Consul DNS | `vega-api.service.consul:3140` |
| Vega MAM | Consul DNS | `vega-mam.service.consul:9095` |
| Order Processor | Consul DNS | `vega-processor.service.consul:9096` |
| RabbitMQ | Static cluster config | `mq[1-3].algoiq.internal:5672` |
| Redis | Sentinel discovery | `redis-sentinel.service.consul:26379` |
| PostgreSQL | HAProxy VIP | `pg-ro.algoiq.internal:5432` |

---

## Data Center Distribution

### Primary DC (Mumbai)

| Service | Instances |
|---|---|
| Talk Strategy API | 4 |
| Vega MAM | 3 |
| Order Processor | 2 |
| XTS Adapter | 2 |
| ODIN Adapter | 1 |
| REST API Adapter | 2 |
| RabbitMQ | 3 (cluster) |
| Redis | 6 (3 master + 3 replica) |
| PostgreSQL | 3 (1 primary + 2 replica) |

### DR DC (Hyderabad)

| Service | Instances |
|---|---|
| Talk Strategy API | 2 (warm standby) |
| Vega MAM | 1 (warm standby) |
| Order Processor | 1 (warm standby) |
| PostgreSQL | 1 (async replica) |
| Redis | 3 (replica only, read-only) |

### Failover Strategy

| Scenario | Action | RTO |
|---|---|---|
| Single node failure | Auto-scaling group replaces | < 60 seconds |
| AZ failure | Traffic shifts to remaining nodes | < 5 seconds |
| Full DC failure (Mumbai) | Manual promotion of DR DC | < 5 minutes |
| Broker line failure | Auto-failover to alternate broker | < 2 seconds |
| Kill switch activation | Immediate halt + square-off | < 100 ms |

---

## Port Allocation

| Service | Port | Protocol |
|---|---|---|
| Talk Strategy API (REST) | 3140 | HTTPS (TLS 1.3) |
| Talk Strategy API (gRPC) | 3141 | TLS |
| Vega MAM | 9095 | HTTPS (TLS 1.3) |
| Order Processor | 9096 | HTTPS (TLS 1.3) |
| Order Processor (Internal) | 9097 | HTTPS |
| Prometheus Metrics | 9090 | HTTP |
| FIX -- XTS | 9200 | TCP/TLS |
| FIX -- ODIN | 9201 | TCP/TLS |
| FIX -- Generic | 9202 | TCP/TLS |
| RabbitMQ | 5672 | AMQP |
| RabbitMQ Management | 15672 | HTTPS |
| Redis | 6379 | TCP |
| PostgreSQL | 5432 | TCP |
