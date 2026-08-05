# 06 -- Component Descriptions

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-08-05

---

## Component Inventory

Vega Engine comprises **3 major components** and **6 infrastructure services**:

| Component | Type | Purpose |
|---|---|---|
| **Vega MAM** | Stateful Service | Multi-account management, broker connectivity, fund allocation, centralized risk |
| **Talk Strategy API** | Stateless HTTP Service | Signal standardization, validation, routing |
| **Order Processor** | Stateful Order FSM | Order lifecycle, books, positions, execution plans, kill switch, audit |
| MQ Bridge | Infrastructure | RabbitMQ abstraction layer |
| Credential Manager | Infrastructure | Encrypted broker credential store |
| Kill Switch | Infrastructure | Multi-tier emergency control monitor |
| Audit Logger | Infrastructure | Immutable append-only event log |
| Broker Adapters | Infrastructure | Protocol-specific broker connectors (FIX, REST, WebSocket) |
| Monitoring Stack | Infrastructure | Prometheus + Grafana observability |

---

## Component #1: Vega MAM (Multi Account Manager)

**Type:** Stateful Account & Broker Management Service
**Location:** `src/mam/`
**Ports:** 9095, 9096

### Purpose

Vega MAM manages multiple trading accounts across multiple broker/vendor APIs. Instead of strategies communicating directly with brokers, all execution requests pass through MAM for centralized control, allocation, validation, and execution. This enables one trading signal to execute across hundreds or thousands of client accounts.

### Multi-Broker Support

| Broker | Protocol | Authentication | Status |
|---|---|---|---|
| **XTS** | FIX 4.4 / REST | API Key + HMAC | Production |
| **ODIN APIs** | REST / FIX | Token-based | Production |
| **REST APIs** | HTTPS REST | API Key | Production |
| **FIX Gateways** | FIX 4.4 / 5.0 | Session credentials | Production |
| **WebSocket APIs** | WSS | Token-based | Production |

### Multi-Account Management

Maintains complete client information:

| Field | Description |
|---|---|
| Client ID | Unique client identifier |
| Trading ID | Broker-assigned trading account |
| Exchange Mapping | NSE, BSE, MCX segment mappings |
| Product Permissions | Equity, F&O, Currency, Commodity |
| Segment Access | Intraday, Delivery, Derivatives |
| Account Status | Active, Suspended, Closed |
| Risk Limits | Per-account risk thresholds |
| Broker Mapping | Which broker routes to use |
| API Credentials | Encrypted broker API keys |
| Activation Status | Live, Paper, Disabled |

### Fund Allocation Engine

| Allocation Method | Description |
|---|---|
| Fixed Quantity | Execute specific share/contract count |
| Fixed Capital | Execute to specific capital amount |
| Percentage Allocation | Allocate % of available capital |
| Margin-based Allocation | Size based on margin requirement |
| Dynamic Quantity | Calculate quantity from market conditions |
| Strategy-based Allocation | Strategy-defined sizing rules |
| Portfolio Allocation | Weight-based portfolio distribution |
| Risk-based Sizing | Size proportional to risk budget |

### Signal Distribution

One signal can distribute to:

- Single account
- Selected accounts
- Account groups
- Client baskets
- Portfolio groups
- Institutional accounts

### Signal Transformation

Converts generic trading signals into broker-specific execution requests automatically, including broker-specific format conversions, price precision adjustments, quantity lot size normalization, and exchange token mappings.

### Centralized Risk Validation

Before forwarding any order:
- Margin verification
- Quantity validation
- Product validation
- Exchange validation
- Client permission checks
- RMS validation
- Strategy permission checks

---

## Component #2: Talk Strategy API

**Type:** Stateless HTTP/gRPC Service
**Location:** `src/api/`
**Ports:** 3140 (REST), 3141 (gRPC)

### Purpose

Communication layer between trading strategies and Vega. Every strategy inside the Algo IQ ecosystem communicates through this standardized API, creating a common language for all strategies.

### Strategy Integration Layer

Accepts signals from:

| Source | Type | Protocol |
|---|---|---|
| Delta Strategies | Automated | REST / MQ |
| Option Strategies | Automated | REST / MQ |
| Future Strategies | Automated | REST / MQ |
| AI Strategies | Automated | REST / MQ |
| Statistical Models | Automated | REST |
| Manual Signals | Human | REST / gRPC |
| External Systems | Third-party | REST |

### Standard Signal Format

Every strategy sends signals using a common structure:

| Field | Type | Required | Description |
|---|---|---|---|
| Strategy ID | String | Yes | Unique strategy identifier |
| Signal ID | String | Yes | Unique signal identifier |
| Symbol | String | Yes | Trading symbol |
| Exchange | String | Yes | NSE, BSE, MCX |
| Transaction Type | Enum | Yes | BUY, SELL |
| Quantity | Integer | Yes | Order quantity |
| Price | Decimal | No | Limit price (optional for MARKET) |
| Order Type | Enum | Yes | MARKET, LIMIT, STOP, STOP_LIMIT |
| Product Type | String | Yes | MIS, NRML, CNC |
| Time | Timestamp | Yes | Signal generation time |
| Validity | Enum | Yes | DAY, IOC, GTC |
| Priority | Integer | No | Execution priority |
| Risk Parameters | Object | No | Max slippage, stop loss |
| Execution Rules | Object | No | Iceberg, slicing parameters |

### Common Identity (Strategy ID)

The Strategy ID becomes the common identity through the complete execution journey:

```
Strategy -> Talk Strategy API -> Vega MAM -> Order Processor -> Broker -> Exchange -> Trade -> Position -> Audit
```

### Validation Layer

| Check | Description |
|---|---|
| Structure Validation | Validates signal against JSON schema |
| Parameter Validation | Range checks on price, quantity, etc. |
| Strategy Authentication | Verifies API key and HMAC signature |
| Permission Validation | Checks strategy access rights |
| Duplicate Signal Detection | Redis SETNX with TTL |
| Version Compatibility | API version negotiation |
| Data Integrity | Checksum validation |

### Routing Engine

Routes validated signals to the correct execution destination based on:
- Broker availability
- Client account mapping
- Strategy configuration
- Execution policy
- Risk configuration
- Load balancing

### Key Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/signals` | Submit new trade signal |
| GET | `/api/v1/signals/:id` | Query signal status |
| PUT | `/api/v1/signals/:id` | Modify pending signal |
| DELETE | `/api/v1/signals/:id` | Cancel pending signal |
| GET | `/api/v1/signals?strategyId=X` | List strategy signals |
| GET | `/api/v1/status?strategyId=X` | Get strategy execution status |

---

## Component #3: Order Processor

**Type:** Stateful Order State Machine
**Location:** `src/processor/`
**Instances:** 2 per cluster (partitioned by userId hash)
**Ports:** 9096, 9097

### Purpose

The Order Processor is the execution heart of Vega. It receives standardized signals, converts them into executable orders, manages the full order lifecycle, maintains complete trading records, and provides kill switch and audit capabilities.

### Order Creation

| Input | Output |
|---|---|
| Strategy ID | Internal Order ID |
| Execution Plan | Broker Order Request |
| Signal Details | Exchange Order Request |
| Risk Parameters | Fund Allocation Record |
| Allocation Information | Audit Log Entry |

### Internal Order Identity Mapping

```
Strategy Signal (Strategy ID + Signal ID)
          |
          v
    Internal Order ID
          |
          v
    Broker Order ID
          |
          v
    Exchange Order ID
          |
          v
    Trade ID
          |
          v
    Position Update
```

### Order Lifecycle Management

| State | Description |
|---|---|
| NEW | Order created, pending validation |
| VALIDATED | Pre-trade checks passed |
| PENDING_ROUTE | Awaiting broker assignment |
| ROUTED | Sent to broker adapter |
| PENDING_ACK | Awaiting broker acknowledgment |
| ACKNOWLEDGED | Broker accepted order |
| PARTIALLY_FILLED | Partial execution received |
| FILLED | Complete execution |
| PENDING_CANCEL | Cancel request submitted |
| CANCELLED | Order cancelled |
| REJECTED | Order rejected |
| TIMED_OUT | No response within timeout |
| REPLACED | Modified order active |

### Pending Order Management

Intelligently modifies pending orders:
- Price updates based on market movement
- Quantity updates from allocation changes
- Trigger price updates for stop orders
- Time validity extensions
- Retry after broker rejection
- Dynamic execution adjustments

### Strategy-wise Order Book

Independent order books per strategy:

| Book | Contents |
|---|---|
| Open Orders | Active, awaiting fill |
| Pending Orders | Awaiting broker ack |
| Cancelled Orders | Cancelled by user/system |
| Rejected Orders | Rejected by broker/exchange |
| Completed Orders | Fully filled |
| Order History | Complete historical log |

### Strategy-wise Trade Book

Complete trade history per strategy:

| Field | Description |
|---|---|
| Trade ID | Unique trade identifier |
| Buy/Sell | Transaction direction |
| Quantity | Executed quantity |
| Execution Price | Fill price |
| Average Price | Weighted average |
| Execution Time | Fill timestamp |
| Charges | Brokerage, taxes, etc. |
| P&L | Realized profit/loss |

### Strategy-wise Net Position

Independent positions per strategy:

| Position | Description |
|---|---|
| Long Position | Buy-side holdings |
| Short Position | Sell-side holdings |
| Net Quantity | Long - Short |
| Average Price | Weighted average cost |
| MTM | Mark-to-market value |
| Realized P&L | Closed trade profit/loss |
| Unrealized P&L | Open position P&L |
| Portfolio Exposure | Total risk exposure |

### Execution Plan Engine

Every strategy defines its own execution plan:

| Parameter | Description |
|---|---|
| Max Order Quantity | Largest single order allowed |
| Iceberg Execution | Visible + hidden quantity slices |
| Time-based Slicing | TWAP/VWAP execution algorithms |
| Market Protection | Order rejection if price moves against |
| Slippage Limits | Max acceptable price deviation |
| Price Protection | Max/min execution price bounds |
| Retry Rules | How to handle rejected orders |
| Fill Policies | Partial fill acceptance rules |
| Position Limits | Max net position per strategy |
| Exposure Limits | Max total exposure per strategy |

### Kill Switch System

Multi-tier emergency control:

| Level | Actions |
|---|---|
| **Strategy Kill Switch** | Stop orders for one strategy, cancel pending |
| **Client Kill Switch** | Stop all orders for a client, cancel all pending |
| **Broker Kill Switch** | Stop orders to one broker, cancel pending on that broker |
| **Exchange Kill Switch** | Stop orders to one exchange |
| **Global Emergency Stop** | Stop ALL orders, cancel ALL pending, disable ALL execution |
| **Auto Kill (Layer 3)** | Triggered at 1.50% margin drawdown -- automatic |

Kill Switch actions:
1. Stop accepting new orders
2. Cancel all pending orders
3. Submit square-off orders for open positions
4. Disable strategy execution
5. Block signal processing
6. Notify administrators and Kavach

### Strategy-wise Square Off

| Operation | Scope |
|---|---|
| Square off one strategy | Single strategy position closure |
| Square off selected accounts | Targeted position liquidation |
| Square off complete client | All client strategy closure |
| Square off broker-wise | Per-broker position exit |
| Portfolio-level square off | Entire portfolio liquidation |
| Emergency exit | Maximum speed market close |

### Real-Time Monitoring

| Metric | Description |
|---|---|
| Order Status | Live state of every order |
| Exchange Response | Broker/exchange ack times |
| Trade Confirmation | Fill notifications |
| Broker Connectivity | Session health and heartbeats |
| Latency | Internal + external round-trip time |
| Rejections | Rate and reason tracking |
| Pending Orders | Queue depth per strategy |
| Position Changes | Delta from fills and cancels |
| Execution Quality | Slippage, fill rate, rejection rate |

### Audit & Traceability

Every event logged with complete context:

| Field | Description |
|---|---|
| Strategy ID | Strategy that generated the signal |
| Signal ID | Original signal identifier |
| Internal Order ID | Vega-assigned order ID |
| Broker Order ID | Broker-assigned order ID |
| Exchange Order ID | Exchange-assigned order ID |
| Trade ID | Exchange-assigned trade ID |
| User ID | Operator/user identifier |
| Timestamp | Event time (NTP-synced) |
| API Response | Raw broker/exchange response |
| Execution Status | Current order state |

### State Transition Rules

```
allowedTransitions = {
  NEW: ['PENDING_VALIDATION'],
  PENDING_VALIDATION: ['VALIDATED', 'REJECTED'],
  VALIDATED: ['PENDING_ROUTE'],
  PENDING_ROUTE: ['ROUTED', 'REJECTED'],
  ROUTED: ['PENDING_ACK'],
  PENDING_ACK: ['ACKNOWLEDGED', 'REJECTED', 'TIMED_OUT'],
  ACKNOWLEDGED: ['PENDING_CANCEL', 'PARTIALLY_FILLED'],
  PARTIALLY_FILLED: ['FILLED', 'PENDING_CANCEL', 'PARTIALLY_FILLED'],
  PENDING_CANCEL: ['CANCELLED', 'ACKNOWLEDGED'],
  FILLED: [],       // Terminal
  CANCELLED: [],    // Terminal
  REJECTED: [],     // Terminal
  TIMED_OUT: [],    // Terminal
  REPLACED: ['ACKNOWLEDGED'],  // Replacement order active
}
```

---

## Infrastructure Services

### MQ Bridge

| Aspect | Detail |
|---|---|
| Exchange | `vega.orders` (topic exchange) |
| Queues | `vega.signals.incoming`, `vega.signals.validated`, `vega.orders.routed`, `vega.orders.responses`, `vega.orders.confirmations` |
| Dead Letter | `vega.orders.dlq` -- messages failing 3 retries |
| Ack Mode | Manual (exactly-once semantics) |

### Credential Manager

| Aspect | Detail |
|---|---|
| Encryption | AES-256-GCM with per-key IV |
| Key Storage | HashiCorp Vault (prod), env-encrypted file (dev) |
| Rotation | Cron-triggered rotation daily at 08:30 IST |
| Access Audit | Every read operation logged |

### Kill Switch

| Aspect | Detail |
|---|---|
| Data Source | Redis pub/sub channels per entity |
| Evaluation Interval | Every 100 ms |
| Threshold (Layer 3) | 1.50% running margin drawdown |
| Actions | Stop new + cancel pending + square off + alert |
| Reset | Manual intervention only (NO auto-reset) |

### Audit Logger

| Aspect | Detail |
|---|---|
| Storage | TimescaleDB hypertable `audit.order_events` |
| Event Types | SIGNAL_RECEIVED, ORDER_CREATED, ORDER_VALIDATED, ORDER_ROUTED, BROKER_ACK, ORDER_FILLED, ORDER_CANCELLED, ORDER_REJECTED, KILL_SWITCH_ACTIVATED, SQUARE_OFF_TRIGGERED, POSITION_UPDATED |
| Retention | 7 years online, indefinite archive |
| Query API | `GET /api/v1/audit/orders?from=&to=&strategyId=` |
