# 06 — Component Descriptions

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Component Inventory

Vega comprises **10 core components** across 4 architectural layers, plus 3 infrastructure services.

---

## TalkStrategy API

**Type:** Stateless HTTP/gRPC Service  
**Location:** `src/api/`  
**Ports:** 3003 (REST), 3004 (gRPC)

| Aspect | Detail |
|---|---|
| Framework | Express.js + gRPC (@grpc/grpc-js) |
| Auth | API Key + HMAC-SHA256 signature validation |
| Rate Limit | Token bucket algorithm, 500 req/sec default |
| Schema Validation | AJV (JSON Schema draft-07) |
| Health Endpoint | `GET /api/v1/health` |
| Metrics Endpoint | `GET /metrics` (Prometheus format) |

### Middleware Stack

```
CORS → Request ID → Auth → Rate Limiter → Schema Validator → Controller
```

### Key Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/orders` | Submit new order |
| GET | `/api/v1/orders/:id` | Query order status |
| PUT | `/api/v1/orders/:id` | Modify active order |
| DELETE | `/api/v1/orders/:id` | Cancel active order |
| GET | `/api/v1/orders?userId=X` | List user orders |
| GET | `/api/v1/positions?userId=X` | Get user positions |

---

## TalkStrategy App

**Type:** Stateless Business Logic Worker  
**Location:** `src/app/`  
**Concurrency:** Configurable (default: 4 workers)

| Aspect | Detail |
|---|---|
| MQ Consumer | RabbitMQ consumer on queue `vega.orders.incoming` |
| MQ Producer | Publishes to exchange `vega.orders` routing key `validated` |
| Enrichment Sources | Redis (user mappings, instrument cache), Ganesh API (fallback) |
| Prefetch | 50 messages per consumer |
| Ack Mode | Manual acknowledgment after full processing |

### Validation Rules

| Rule | Source | Action on Failure |
|---|---|---|
| User exists and active | DB | Reject order |
| User mapped to broker | Redis | Reject order |
| Symbol tradable | Ganesh cache | Reject order |
| Symbol not in ban list | Redis SET | Reject order |
| Within strategy max position | Redis | Reject order |
| Market hours active | System clock | Queue for next session |

---

## Order Processor

**Type:** Stateful Order State Machine  
**Location:** `src/processor/`  
**Instances:** 2 per cluster (partitioned by userId hash)

| Aspect | Detail |
|---|---|
| State Management | Finite State Machine (FSM) using XState |
| Deduplication | Redis SETNX with 24h TTL |
| Pre-Trade Validation | Price band check, quantity limit, margin available |
| Database | PostgreSQL — `orders` table (partitioned by date) |
| MQ Consumer | Queue `vega.orders.validated` |
| MQ Producer | Exchange `vega.orders` routing key `routed` |

### State Transition Rules

```
allowedTransitions = {
  NEW: ['PENDING_VALIDATION'],
  PENDING_VALIDATION: ['VALIDATED', 'REJECTED'],
  VALIDATED: ['PENDING_ROUTE'],
  PENDING_ROUTE: ['ROUTED', 'REJECTED'],
  ROUTED: ['PENDING_ACK'],
  PENDING_ACK: ['ACKNOWLEDGED', 'REJECTED'],
  ACKNOWLEDGED: ['PENDING_CANCEL', 'PARTIALLY_FILLED'],
  PARTIALLY_FILLED: ['FILLED', 'PENDING_CANCEL'],
  PENDING_CANCEL: ['CANCELLED', 'ACKNOWLEDGED'],
  FILLED: [], // Terminal state
  CANCELLED: [], // Terminal state
  REJECTED: [], // Terminal state
}
```

---

## Broker Integration — XTS Adapter

**Type:** FIX Engine Connector  
**Location:** `src/broker/xts/`  
**Protocol:** FIX 4.4 over TCP

| Aspect | Detail |
|---|---|
| FIX Engine | Custom implementation (Node.js net module) |
| Session Management | Logon, Heartbeat (30s), Logout, ResendRequest |
| Message Types | NewOrderSingle(D), OrderCancelRequest(F), OrderCancelReplaceRequest(G), ExecutionReport(8) |
| Sequence Numbers | Persistent in Redis with disk fallback |
| Reconnection | Exponential backoff: 1s, 2s, 4s, 8s, max 30s |

### Supported FIX Tags (XTS)

| Tag | Name | Values |
|---|---|---|
| 11 | ClOrdID | VEGA-generated unique order ID |
| 21 | HandlInst | 1 (Automated) |
| 38 | OrderQty | Integer quantity |
| 40 | OrdType | 1=Market, 2=Limit, 3=Stop, 4=Stop Limit |
| 44 | Price | Decimal price (for limit orders) |
| 54 | Side | 1=Buy, 2=Sell |
| 55 | Symbol | Exchange symbol |
| 59 | TimeInForce | 0=Day, 1=GTC, 3=IOC |

---

## Broker Integration — Greeksoft Adapter

**Type:** FIX + REST Connector  
**Location:** `src/broker/greeksoft/`  
**Protocol:** FIX 5.0 SP2 (primary), REST (fallback)

| Aspect | Detail |
|---|---|
| Primary Transport | FIX 5.0 SP2 over TLS 1.3 |
| Fallback Transport | REST API with API key auth |
| Session Recovery | Store sequence numbers in Redis; auto-reconnect |
| Order Chunking | REST fallback splits large orders into 1000-unit chunks |

---

## Credential Manager

**Type:** Encrypted Key-Value Store  
**Location:** `src/security/credential-manager.js`

| Aspect | Detail |
|---|---|
| Encryption | AES-256-GCM with per-key IV |
| Key Storage | HashiCorp Vault (prod), env-encrypted file (dev) |
| Rotation | Cron-triggered rotation daily at 08:30 IST |
| Access Audit | Every read operation logged with user, timestamp, IP |
| Cache | Hot credentials cached in Redis with 1-hour TTL |

---

## Kill Switch Layer 3

**Type:** Independent Monitor Process  
**Location:** `src/risk/kill-switch.js`

| Aspect | Detail |
|---|---|
| Data Source | Redis pub/sub channel `risk.user.pnl` |
| Evaluation Interval | Every 100 ms |
| Threshold | 1.50% running drawdown |
| Actions | Cancel all orders → Set halt flag → Alert → Audit log |
| Reset | Manual intervention only (NO auto-reset) |

---

## MQ Bridge

**Type:** RabbitMQ Abstraction Layer  
**Location:** `src/mq/`

| Aspect | Detail |
|---|---|
| Exchange | `vega.orders` (topic exchange) |
| Queues | `vega.orders.incoming`, `vega.orders.validated`, `vega.orders.routed`, `vega.orders.responses` |
| Dead Letter | `vega.orders.dlq` — messages failing 3 retries |
| Prefetch | Configurable per queue |
| Ack Mode | Manual (exactly-once semantics) |

### Queue Bindings

| Queue | Routing Key |
|---|---|
| `vega.orders.incoming` | `incoming` |
| `vega.orders.validated` | `validated` |
| `vega.orders.routed` | `routed` |
| `vega.orders.responses` | `responses.#` |
| `vega.orders.dlq` | `dlq` |

---

## Audit Logger

**Type:** Append-Only Log Writer  
**Location:** `src/audit/`

| Aspect | Detail |
|---|---|
| Storage | TimescaleDB hypertable `audit.order_events` |
| Event Types | ORDER_CREATED, ORDER_VALIDATED, ORDER_ROUTED, BROKER_ACK, ORDER_FILLED, ORDER_CANCELLED, ORDER_REJECTED, KILL_SWITCH_ACTIVATED |
| Retention | 7 years online, indefinite archive |
| Query API | `GET /api/v1/audit/orders?from=&to=&userId=` |
