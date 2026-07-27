# 03 — System Requirements

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Functional Requirements

### FR-100: Signal Ingestion

| Field | Specification |
|---|---|
| Protocol | REST (JSON) + RabbitMQ (AMQP 0-9-1) |
| Endpoint | `POST /api/v1/orders` |
| Authentication | API Key + HMAC signature |
| Payload Schema | JSON: `{ signalId, symbol, quantity, price, orderType, userId, strategyId }` |
| Response | `201 Created` with `orderId`, `202 Accepted` for async processing |

### FR-101: Order Lifecycle Management

The Order Processor MUST maintain a deterministic state machine:

```
NEW → PENDING_VALIDATION → VALIDATED → PENDING_ROUTE → ROUTED → PENDING_ACK → ACKNOWLEDGED
                                                                                              ↓
NEW → PENDING_VALIDATION → REJECTED (any stage)
VALIDATED → PENDING_CANCEL → CANCELLED
ACKNOWLEDGED → PARTIALLY_FILLED → FILLED
```

### FR-102: Broker Adapter Interface

Each broker adapter MUST implement:

| Method | Description |
|---|---|
| `connect()` | Establish FIX/REST session |
| `disconnect()` | Graceful session teardown |
| `placeOrder(order)` | Submit order to broker |
| `modifyOrder(orderId, modifications)` | Replace active order |
| `cancelOrder(orderId)` | Cancel active order |
| `getOrderStatus(orderId)` | Query order state |
| `getPositions()` | Fetch current positions |

---

## Non-Functional Requirements

### NFR-100: Performance

| Metric | Target | Measurement |
|---|---|---|
| Internal latency (signal→route) | P95 < 500 µs | In-process timer |
| End-to-end latency (signal→broker) | P99 < 5 ms | Distributed trace |
| Order throughput | 5,000 orders/sec/node | Load test |
| Broker FIX response time | < 50 ms | FIX engine heartbeat |
| Kill switch activation | < 100 ms | Event-to-action timer |

### NFR-101: Availability

| Target | Measurement |
|---|---|
| 99.99% monthly uptime | Uptime monitor + synthetic orders |
| < 5 seconds DB failover | Automatic failover test |
| < 10 seconds broker reconnection | FIX session reconnect timer |

### NFR-102: Security

| Requirement | Implementation |
|---|---|
| Encryption in transit | TLS 1.3 for REST, FIXT 1.1 for FIX sessions |
| Encryption at rest | AES-256-GCM for credentials, database TDE |
| API authentication | API key + HMAC-SHA256 signature verification |
| Audit logging | All access events logged to immutable store |
| Network isolation | Broker FIX lines on dedicated VLAN |

### NFR-103: Scalability

| Dimension | Capacity |
|---|---|
| Concurrent orders | 50,000 active orders |
| Users | 5,000 concurrent users |
| Broker sessions | 200 active FIX sessions |
| Messages/sec | 50,000 MQ messages/sec per cluster |

---

## Environment Requirements

### Production

| Resource | Minimum | Recommended |
|---|---|---|
| CPU | 8 vCPU | 16 vCPU |
| RAM | 16 GB | 32 GB |
| Disk | 100 GB SSD | 500 GB NVMe |
| Network | 1 Gbps | 10 Gbps |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

### Database

| Component | Technology | Version |
|---|---|---|
| Primary DB | PostgreSQL + TimescaleDB | 15.x + 2.10 |
| Cache | Redis Cluster | 7.x |
| Message Queue | RabbitMQ | 3.12.x |
| Audit Store | PostgreSQL (separate instance) | 15.x |

### External Dependencies

| Service | Purpose | SLA |
|---|---|---|
| Lakshmi | Market data feed | 99.95% |
| Ganesh | Symbol master data | 99.9% |
| Parikshak | Risk parameters | 99.9% |
| XTS Broker API | Order routing | As per broker SLA |
| Greeksoft Broker API | Order routing | As per broker SLA |
