# 01 -- Architecture

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-08-05

## High-Level Architecture

Kuber Alpha is the centralized **web-based Strategy Management Platform** replacing the legacy TalkStrategy Desktop (EXE). It sits at Layer 3 of the Algo IQ architecture, bridging analytical engines with the Vega Execution Engine. Built on an **API-first, event-driven architecture** for scalability and modularity.

---

## Three-Tier Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    KUBER ALPHA (Layer 3)                       │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   WEB APPLICATION TIER                    │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │ │
│  │  │ Strategy │  │  Signal  │  │  Trade   │  │  Engine  │ │ │
│  │  │ Designer │  │ Dashboard│  │Dashboard │  │  Hub     │ │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │ │
│  │       │             │             │             │         │ │
│  │  ┌────▼─────────────▼─────────────▼─────────────▼─────┐  │ │
│  │  │                WEB API GATEWAY                      │  │ │
│  │  │    (REST + WebSocket + gRPC endpoints)              │  │ │
│  │  └──────────────────────┬──────────────────────────────┘  │ │
│  └─────────────────────────┼─────────────────────────────────┘ │
│                            │                                    │
│  ┌─────────────────────────▼─────────────────────────────────┐ │
│  │                   CORE SERVICES TIER                       │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │ │
│  │  │ Strategy │  │  Signal  │  │   Vega   │  │  Engine  │ │ │
│  │  │ Lifecycle│  │  Manager │  │Connector │  │  Hub     │ │ │
│  │  │ Manager  │  │          │  │          │  │          │ │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │ │
│  │       │             │             │             │         │ │
│  │  ┌────▼─────────────▼─────────────▼─────────────▼─────┐  │ │
│  │  │                EVENT BUS (MQ + Redis)              │  │ │
│  │  └────┬─────────────┬─────────────┬─────────────┬─────┘  │ │
│  │       │             │             │             │         │ │
│  │  ┌────▼─────┐  ┌───▼────┐  ┌────▼─────┐  ┌────▼─────┐  │ │
│  │  │  Kill    │  │  Trade │  │  Audit   │  │  Health  │  │ │
│  │  │  Switch  │  │  Sync  │  │  Logger  │  │  Monitor │  │ │
│  │  └──────────┘  └────────┘  └──────────┘  └──────────┘  │ │
│  └──────────────────────────┬───────────────────────────────┘ │
│                              │                                  │
│  ┌───────────────────────────▼──────────────────────────────┐ │
│  │                   DATA TIER                               │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │ │
│  │  │PostgreSQL│  │  Redis   │  │ MongoDB  │                │ │
│  │  │(Strategy │  │  (Cache  │  │ (Time-   │                │ │
│  │  │ Config)  │  │  Session)│  │  Series) │                │ │
│  │  └──────────┘  └──────────┘  └──────────┘                │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
      ┌──────────┐ ┌──────────┐ ┌──────────┐
      │   VEGA   │ │  ANALYTICS│ │   DXCC   │
      │  ENGINE  │ │  ENGINES  │ │  CONTROL │
      └──────────┘ └──────────┘ └──────────┘
```

---

## Core Components

### Web Application Tier

#### Strategy Designer
Visual interface for creating and configuring trading strategies:
- Drag-and-drop strategy builder
- Parameter configuration (entry/exit rules, position sizing, risk limits)
- Strategy template library
- Real-time validation of strategy logic
- Integration with Strategy Factory for deployment

#### Signal Dashboard
Real-time monitoring of all trading signals:
- Live signal stream from all connected strategies
- Signal status tracking (received, validated, queued, dispatched, executed)
- Filter and search by strategy, symbol, timestamp
- Signal replay and analysis

#### Trade Dashboard
Complete trade execution visibility:
- Real-time order and trade updates from Vega
- Position tracking per strategy
- P&L monitoring with MTM updates
- Execution quality metrics (slippage, fill rate, latency)

#### Engine Hub
Integration management for all analytical engines:
- Subscribe/unsubscribe strategies to specific engine data feeds
- Engine health monitoring
- Data stream configuration
- Engine-specific parameter tuning

---

### Core Services Tier

#### Strategy Lifecycle Manager
Manages complete lifecycle state machine:

```
DESIGN -> TESTING -> APPROVAL -> DEPLOYMENT -> LIVE
                                                  |
                                     ┌────────────┼────────────┐
                                     v            v            v
                                 MODIFICATION  SUSPENSION  RETIREMENT
                                     |            |
                                     v            v
                                   LIVE      REACTIVATE -> LIVE
```

- **Design**: Configure logic, parameters, execution rules
- **Testing**: Paper trading with Simulator, replay engine validation
- **Approval**: Risk compliance check, stakeholder sign-off
- **Deployment**: Production activation via Strategy Factory
- **Live**: Real-time monitoring with full operational visibility
- **Modification**: Parameter updates without disrupting other strategies
- **Suspension**: Temporary halt preserving state for later reactivation
- **Retirement**: Archive with complete audit history

#### Signal Manager
Handles the complete signal pipeline:

| Stage | Action |
|---|---|
| **Reception** | Accept signals from Delta XI, VYUH, SpreadWatch, TalkDelta AI, Suchak |
| **Validation** | Schema check, field validation, data integrity |
| **Authentication** | API key + HMAC signature verification |
| **Deduplication** | Redis SETNX check on Signal ID |
| **Risk Check** | Pre-trade risk rule evaluation |
| **Rule Check** | Strategy-specific execution parameters |
| **Prioritization** | Priority queue assignment |
| **Dispatch** | Route validated signals to Vega via TalkStrategy API |

#### Vega Connector
Standardized communication with Vega Engine:
- Sends: Strategy ID, Signal ID, Symbol, Exchange, Action, Order Type, Qty, Price, Execution Plan, Risk Params, Allocation Rules
- Receives: Internal Order ID, Broker Order ID, Exchange Order ID, Trade Confirmation, Execution Price, Filled Qty, Avg Price, Order Status, Position Updates, P&L, Rejections
- Protocol: REST API + MQ for async confirmations
- Retry logic with exponential backoff
- Circuit breaker for Vega availability

#### Engine Hub
Integration broker for all analytical engines:

| Engine | Integration | Data Flow |
|---|---|---|
| **Ganesh** | REST API | OHLC data, historical prices |
| **Suchak** | MQ | Processed market data, events |
| **Garuda** | REST API | Options analytics, margin data |
| **Manthan** | MQ | Market intelligence, data pipelines |
| **Lakshmi** | MQ | Live price distribution |
| **Surya** | REST API | BOD/EOD files, corporate actions |
| **Chitragupta** | REST API | Audit data, compliance |
| **Narad** | TCP | Network connectivity |
| **Suraksha** | REST API | Security, risk enforcement |

---

### Supporting Services

#### Kill Switch (Layer 1)
First line of emergency defense:
- Monitors margin utilization in real time (Redis pub/sub)
- Triggers at 1.01% margin breach (configurable)
- Immediately pauses all affected strategies
- Sends critical alerts via all notification channels
- Notifies DXCC, Vega, and TalkDelta on trigger
- Records complete emergency audit trail

#### Trade Synchronizer
Bidirectional trade data synchronization:
- Receives trade confirmations from Vega via MQ
- Updates strategy-wise positions in real time
- Reconciles internal position book with broker positions
- Detects and flags mismatches for manual review
- Publishes position updates to monitoring dashboards

#### Audit Logger
Immutable event recording:
- Every lifecycle event logged with timestamp and user
- Every signal event traced from reception to execution
- Every trade recorded with complete ID chain
- 7-year online retention, indefinite archive
- Full regulatory compliance support

#### Health Monitor
Real-time system observability:
- API health and latency metrics
- Engine connectivity status
- Signal throughput and queue depth
- Kill switch arming status
- All metrics exposed via Prometheus, visualized in Grafana

---

## Event Bus

High-performance pub/sub architecture for intra-engine communication:

| Channel | Purpose |
|---|---|
| `kuber.signal.received` | New signal ingested |
| `kuber.signal.validated` | Signal passed validation |
| `kuber.signal.dispatched` | Signal sent to Vega |
| `kuber.trade.confirmed` | Trade confirmation received |
| `kuber.position.updated` | Position change detected |
| `kuber.killswitch.armed` | Kill switch armed |
| `kuber.killswitch.triggered` | Kill switch activated |
| `kuber.lifecycle.changed` | Strategy lifecycle state change |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Next.js, Tailwind CSS |
| Backend Runtime | Node.js 20 |
| API | REST (Express), WebSocket, gRPC |
| State Management | Zustand (frontend), In-memory + Redis (backend) |
| Database | PostgreSQL (config/state), MongoDB (time-series), Redis (cache/session) |
| Messaging | RabbitMQ 3.12 |
| Monitoring | Prometheus, Grafana |
| Container | Docker, Kubernetes |
| CI/CD | GitHub Actions, ArgoCD |

---

## Deployment Architecture

```
[Load Balancer (NGINX)]
        |
   ┌────┴────┬────────────┐
   ▼         ▼            ▼
[Web-01]  [Web-02]   [Web-N]       <-- Stateless web tier (auto-scale)
   │         │            │
   └────┬────┴─────┬──────┘
        ▼          ▼
  [API Gateway Cluster]
        │
   ┌────┴────────────┐
   ▼                 ▼
[Core-1..N]    [Processor-1..2]     <-- Stateful (partitioned by strategy)
   │                 │
   └────┬─────┬──────┘
        ▼     ▼
[RabbitMQ Cluster] [Redis Cluster]
        │
        ▼
[PostgreSQL Primary + Replicas]
```
