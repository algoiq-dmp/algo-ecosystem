# 25 — Glossary

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## A

| Term | Definition |
|---|---|
| **ACK (Execution Report)** | FIX ExecutionReport message (MsgType=8) confirming order status from broker |
| **ACKNOWLEDGED** | Order state: broker has accepted the order but not yet filled |
| **AES-256-GCM** | Advanced Encryption Standard with 256-bit key in Galois/Counter Mode — used for credential encryption |
| **AMQP** | Advanced Message Queuing Protocol (0-9-1) — used by RabbitMQ for inter-component messaging |
| **API Key** | Unique identifier used to authenticate API requests — paired with HMAC signature |
| **Async Mode** | Order processing mode where API returns 202 Accepted immediately; order processed asynchronously |

---

## B

| Term | Definition |
|---|---|
| **Blue-Green Deployment** | Deployment strategy with two identical environments; traffic switched from old (green) to new (blue) |
| **BRACKET** | Order type with entry order + attached profit target + stop loss |
| **Broker Integration** | Fourth component of Vega architecture; translates internal order model to broker-specific FIX/REST |
| **Broker Order ID** | Order identifier assigned by the broker (e.g., `XT-20260724-998877`) — different from Vega orderId |

---

## C

| Term | Definition |
|---|---|
| **CANCELLED** | Terminal order state; order was successfully cancelled before execution |
| **Circuit Breaker** | Pattern that prevents cascading failures by stopping calls to a failing external service |
| **ClOrdID** | FIX Tag 11 — Client Order ID; Vega's unique order identifier sent to the broker |
| **CNC** | Cash N Carry — delivery-based product type (vs MIS intraday) |
| **Correlation ID** | UUID assigned at TalkStrategy API; propagated through all components for traceability |
| **Credential Manager** | Component that securely stores, retrieves, and rotates broker credentials |

---

## D

| Term | Definition |
|---|---|
| **Dead Letter Queue (DLQ)** | MQ queue for messages that failed processing after all retries (`vega.orders.dlq`) |
| **Disclosed Quantity** | Portion of order quantity shown to the market (iceberg orders) — FIX Tag 111 (MaxFloor) |
| **Drawdown** | Percentage decline in trading capital from peak; kill switch triggers at 1.50% |

---

## E

| Term | Definition |
|---|---|
| **Execution Report** | FIX message (MsgType=8) from broker informing about order fills, rejects, cancels |
| **Exponential Backoff** | Retry strategy where wait time doubles after each failure: 100ms → 200ms → 400ms → 800ms |

---

## F

| Term | Definition |
|---|---|
| **FILLED** | Terminal order state; order has been completely executed |
| **FIX Protocol** | Financial Information eXchange — industry-standard messaging protocol for securities trading |
| **FIX Session** | Persistent TCP connection between Vega and broker; identified by SenderCompID+TargetCompID |
| **FIX 4.4** | FIX protocol version used by XTS broker adapter |
| **FIX 5.0 SP2** | FIX protocol version used by Greeksoft broker adapter |

---

## G

| Term | Definition |
|---|---|
| **Ganesh** | Algo-IQ engine providing symbol master data and instrument tokens |
| **Greeksoft** | Broker supported by Vega; connectivity via FIX 5.0 SP2 (primary) and REST (fallback) |
| **gRPC** | Google Remote Procedure Call — Vega supports gRPC endpoints alongside REST for high-performance |

---

## H

| Term | Definition |
|---|---|
| **HashiCorp Vault** | Secrets management platform used to store and manage broker credentials |
| **Heartbeat** | FIX administrative message (MsgType=0) exchanged between Vega and broker every 30 seconds |
| **HMAC** | Hash-based Message Authentication Code (SHA256) used for API request signing |
| **HPA** | Horizontal Pod Autoscaler — Kubernetes mechanism to auto-scale pods based on metrics |

---

## I

| Term | Definition |
|---|---|
| **Idempotency Key** | Unique key derived from signalId to prevent duplicate order creation (SHA256 hash) |
| **IOC** | Immediate or Cancel — order that executes immediately; any unfilled portion is cancelled |
| **Instrument Token** | Numeric identifier for a trading symbol; sourced from Ganesh engine |

---

## K

| Term | Definition |
|---|---|
| **Kill Switch** | Hard circuit breaker that halts ALL trading for a user when margin drawdown exceeds threshold |
| **Kill Switch Layer 3** | Third and final risk control layer in Vega; triggers at 1.50% margin drawdown |

---

## L

| Term | Definition |
|---|---|
| **Lakshmi** | Algo-IQ engine providing real-time market data and LTP feeds |
| **LIMIT** | Order type that executes at a specified price or better |
| **Logon** | FIX administrative message (MsgType=A) to establish a FIX session |
| **Logout** | FIX administrative message (MsgType=5) to terminate a FIX session |

---

## M

| Term | Definition |
|---|---|
| **MARKET** | Order type that executes immediately at the best available price |
| **MIS** | Margin Intraday Square-off — intraday product type (vs CNC delivery) |
| **MsgSeqNum** | FIX Tag 34 — sequential message number for FIX session integrity |
| **MsgType** | FIX Tag 35 — identifies the FIX message type (D=Order, 8=ExecReport, etc.) |

---

## O

| Term | Definition |
|---|---|
| **OCO** | One Cancels Other — pair of linked orders where execution of one cancels the other |
| **Order Processor** | Third component of Vega architecture; manages order state machine and pre-trade validation |
| **Order State Machine** | Deterministic FSM governing order lifecycle: NEW → VALIDATED → ROUTED → FILLED |
| **Order Types** | MARKET, LIMIT, STOP, STOP_LIMIT, IOC, BRACKET, COVER, OCO |

---

## P

| Term | Definition |
|---|---|
| **Parikshak** | Algo-IQ engine providing risk parameters and running P&L data |
| **PARTIALLY_FILLED** | Order state; some but not all quantity has been executed |
| **PENDING_ACK** | Order state; order sent to broker, awaiting ExecutionReport acknowledgment |
| **PENDING_CANCEL** | Order state; cancellation request sent to broker, awaiting confirmation |
| **PENDING_ROUTE** | Order state; validated order waiting to be transmitted to broker |
| **PENDING_VALIDATION** | Order state; order received, awaiting business rule validation |
| **Price Band** | Allowable price range around LTP (±20% default) for order validation |
| **Product Type** | MIS (intraday), NRML (normal/delivery), CNC (cash n carry) |

---

## R

| Term | Definition |
|---|---|
| **Rate Limiting** | Token bucket algorithm restricting API calls per user per second (default: 500/sec) |
| **ROUTED** | Order state; order has been transmitted to broker via FIX/REST |
| **Running P&L** | Real-time profit/loss calculation for active positions; monitored by Kill Switch |

---

## S

| Term | Definition |
|---|---|
| **SenderCompID** | FIX Tag 49 — sender's FIX identifier (e.g., `VEGA-PROD-01`) |
| **Sequence Number** | FIX Tag 34 — monotonically increasing message counter per FIX session |
| **Signal ID** | Unique identifier for a trade signal; used for idempotency and traceability |
| **STOP** | Order type that triggers a market order when stop price is reached |
| **STOP LIMIT** | Order type that triggers a limit order when stop price is reached |
| **Sync Mode** | Order processing mode where API waits for broker acknowledgment before responding (201) |

---

## T

| Term | Definition |
|---|---|
| **TalkStrategy API** | First component of Vega; REST/gRPC endpoint receiving trade signals |
| **TalkStrategy App** | Second component of Vega; enriches orders with account/risk parameters |
| **TargetCompID** | FIX Tag 56 — target's FIX identifier (e.g., `XTS-BROKER`) |
| **TimescaleDB** | Time-series PostgreSQL extension used for immutable audit event storage |
| **Token Bucket** | Rate limiting algorithm allowing bursts up to a configurable limit |

---

## V

| Term | Definition |
|---|---|
| **VALIDATED** | Order state; order passed all enrichment and business validation checks |
| **Validity** | Order duration: DAY (valid for current session), IOC (immediate or cancel), GTC (good till cancelled) |
| **Vega** | Algo-IQ order execution engine; responsible for routing orders to broker gateways |
| **Version (Order)** | Incrementing counter tracking number of modifications to an order |

---

## X

| Term | Definition |
|---|---|
| **XState** | JavaScript state machine library used by Order Processor for order lifecycle management |
| **XTS** | Broker supported by Vega; connectivity via FIX 4.4 protocol over dedicated lease line |
