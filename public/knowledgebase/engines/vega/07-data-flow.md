# 07 — Data Flow

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Order Lifecycle Data Flow

### Flow 1: New Order — Happy Path

```
Step 1: Signal Ingestion
  Strategy Factory → [REST/gRPC] → TalkStrategy API
  Data: { signalId, symbol, quantity, price, orderType, userId, strategyId }
  Action: Validate auth, schema, rate limit → Publish to MQ

Step 2: Order Enrichment
  TalkStrategy API → [RabbitMQ: vega.orders.incoming] → TalkStrategy App
  Action: Add broker mapping, instrument details → Publish to MQ

Step 3: Order Processing
  TalkStrategy App → [RabbitMQ: vega.orders.validated] → Order Processor
  Action: Pre-trade checks, idempotency, state machine → Publish to MQ

Step 4: Broker Routing
  Order Processor → [RabbitMQ: vega.orders.routed] → Broker Integration
  Action: Serialize to FIX → Transmit to XTS/Greeksoft

Step 5: Exchange Execution
  Broker Integration → [FIX/TLS] → Broker Server → Exchange
  Broker → [FIX] → ExecutionReport → Broker Integration

Step 6: Response Processing
  Broker Integration → [RabbitMQ: vega.orders.responses] → Order Processor
  Action: Update state machine, emit events

Step 7: Notification
  Order Processor → [RabbitMQ: vega.orders.notifications] → Strategy Factory
  Data: { orderId, state, filledQuantity, averagePrice }
```

---

### Flow 2: Order Rejection (Pre-Trade)

```
TalkStrategy API accepts signal
  → TalkStrategy App: Symbol not in tradable list
  → Publishes rejection to vega.orders.responses (state=REJECTED, reason=INVALID_SYMBOL)
  → Notification sent back to Strategy Factory
  → Order NOT forwarded to Order Processor
```

### Flow 3: Order Modification

```
Strategy Factory → PUT /api/v1/orders/:id { price: 2451.00 }
  → TalkStrategy API validates request
  → Publishes to vega.orders.incoming with action=MODIFY
  → TalkStrategy App routes to correct processor instance
  → Order Processor: validates state allows modification (ACKNOWLEDGED or PARTIALLY_FILLED)
  → Increments version, transitions to PENDING_MODIFY
  → Publishes to vega.orders.routed with msgType=CANCEL_REPLACE
  → Broker Integration sends FIX OrderCancelReplaceRequest (MsgType=G)
  → Broker responds with ExecutionReport (MsgType=8) confirming modification
  → Order Processor updates state back to ACKNOWLEDGED, increments version
```

### Flow 4: Kill Switch Activation

```
Running P&L from Parikshak → Redis pub/sub (risk.user.pnl)
  → Kill Switch monitor detects { userId: 'USR-0042', drawdown: 0.0152 }
  → 1.52% > 1.50% threshold → ACTIVATE
  → Step 1: Redis SET KS:USR-0042:halted = true
  → Step 2: Publish KS_HALT to vega.orders.routed (all broker adapters consume)
  → Step 3: Broker adapters send FIX OrderCancelRequest for ALL open orders
  → Step 4: TalkStrategy API reads KS flag, rejects new orders with 403
  → Step 5: Alert via PagerDuty, email, Slack

Active until manual reset:
  Redis DEL KS:USR-0042:halted (requires admin API key)
  Kill switch re-arms; new orders accepted
```

---

## MQ Message Schemas

### Incoming Order Message

```json
{
  "header": {
    "messageId": "uuid",
    "correlationId": "uuid",
    "timestamp": "ISO8601",
    "messageType": "ORDER_NEW",
    "version": "1.0"
  },
  "payload": {
    "signalId": "string",
    "symbol": "string",
    "quantity": "number",
    "price": "number",
    "orderType": "MARKET|LIMIT|STOP|STOP_LIMIT",
    "transactionType": "BUY|SELL",
    "userId": "string",
    "strategyId": "string",
    "productType": "MIS|NRML|CNC",
    "validity": "DAY|IOC|GTC"
  }
}
```

### Order Response Message

```json
{
  "header": {
    "messageId": "uuid",
    "correlationId": "uuid",
    "timestamp": "ISO8601",
    "messageType": "ORDER_RESPONSE",
    "version": "1.0"
  },
  "payload": {
    "orderId": "string",
    "brokerOrderId": "string",
    "state": "ACKNOWLEDGED|REJECTED|FILLED|PARTIALLY_FILLED|CANCELLED",
    "filledQuantity": "number",
    "averagePrice": "number",
    "rejectionReason": "string|null",
    "brokerTimestamp": "ISO8601"
  }
}
```

---

## Redis Key Schema

| Key Pattern | Type | TTL | Purpose |
|---|---|---|---|
| `USR:{userId}:broker` | Hash | None | User → Broker mapping |
| `USR:{userId}:account` | String | None | Broker account ID |
| `SYM:{symbol}:details` | Hash | 1 hour | Instrument master cache |
| `STRAT:{strategyId}:position` | Hash | None | Strategy running position |
| `idem:{idempotencyKey}` | String | 24 hours | Order deduplication |
| `KS:{userId}:halted` | String | None | Kill switch flag |
| `FIX:seq:{sender}:{target}` | String | None | FIX sequence number |
| `order:{orderId}:state` | Hash | 24 hours | Active order state cache |
| `rate:{userId}:counter` | String | 1 second | Rate limit counter |

---

## Data Retention Policy

| Data Type | Storage | Hot Retention | Cold Retention |
|---|---|---|---|
| Order records | PostgreSQL | 90 days | 7 years (archive) |
| Audit events | TimescaleDB | 365 days | 7 years (S3 archive) |
| FIX message log | File / S3 | 30 days | 5 years |
| Performance metrics | InfluxDB | 90 days | 2 years |
| Application logs | Elasticsearch | 30 days | 1 year (S3) |

---

## Error Data Flow

```
Any component encounters error:
  1. Log error with correlationId, stack trace, context
  2. If retryable → publish to dead-letter queue with retry count
  3. If non-retryable → set order state to REJECTED with reason
  4. Notify upstream via vega.orders.notifications
  5. Increment error counter metric with label { component, error_type }
  6. If error rate exceeds threshold → trigger alert
```
