# 05 — Low-Level Design

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Order State Machine

```
                    ┌─────────┐
                    │   NEW   │
                    └────┬────┘
                         │ validate()
                         ▼
                ┌─────────────────┐
                │ PENDING_VALIDATE │
                └────────┬────────┘
                    ┌────┴────┐
                    │         │
               valid│         │invalid
                    ▼         ▼
             ┌──────────┐  ┌──────────┐
             │VALIDATED │  │ REJECTED │
             └────┬─────┘  └──────────┘
                  │ route()
                  ▼
           ┌──────────────┐
           │ PENDING_ROUTE │
           └──────┬───────┘
                  │
                  ▼
           ┌──────────────┐
           │   ROUTED     │
           └──────┬───────┘
                  │ brokerAck()
                  ▼
           ┌──────────────┐
           │ PENDING_ACK  │
           └──────┬───────┘
              ┌───┴───┐
              │       │
           ack│       │reject
              ▼       ▼
       ┌──────────┐ ┌──────────┐
       │ACKNOWLEDG│ │ REJECTED │
       └────┬─────┘ └──────────┘
            │ fill()
            ▼
     ┌───────────────┐
     │PARTIALLY_FILL │◄── fill() (loop)
     └───────┬───────┘
             │ fullyFilled()
             ▼
        ┌────────┐
        │ FILLED │
        └────────┘

ACKNOWLEDGED ── cancelRequest() ──▶ PENDING_CANCEL ── cancelConfirm() ──▶ CANCELLED
PARTIALLY_FILLED ── cancelRequest() ──▶ PENDING_CANCEL ── cancelConfirm() ──▶ CANCELLED
```

---

## Order Data Model

```javascript
{
  "orderId": "VEGA-20260724-000001-AB12",
  "signalId": "SIG-7f3a2b1c",
  "userId": "USR-0042",
  "strategyId": "STRAT-MACD-01",
  "broker": "XTS",
  "brokerAccount": "XT-ACCT-8812",
  "exchange": "NSE",
  "symbol": "RELIANCE",
  "instrumentToken": 12345678,
  "orderType": "LIMIT",
  "transactionType": "BUY",
  "quantity": 100,
  "disclosedQuantity": 0,
  "price": 2450.75,
  "triggerPrice": null,
  "productType": "MIS",
  "validity": "DAY",
  "state": "ACKNOWLEDGED",
  "filledQuantity": 0,
  "averagePrice": 0,
  "brokerOrderId": "XT-20260724-998877",
  "rejectionReason": null,
  "idempotencyKey": "IDEM-7f3a2b1c-1765432100",
  "parentOrderId": null,
  "childOrderIds": [],
  "createdAt": "2026-07-24T09:16:45.123Z",
  "updatedAt": "2026-07-24T09:16:45.234Z",
  "version": 1
}
```

---

## Signal Ingestion Flow (Low-Level)

```
1. Client → POST /api/v1/orders
   Headers: X-API-Key, X-Signature, X-Timestamp
   Body: { signalId, symbol, quantity, price, orderType, userId, strategyId }

2. TalkStrategy API:
   a. Validate X-Timestamp within 5-second drift window
   b. Reconstruct HMAC-SHA256 signature from (body + timestamp + apiKey)
   c. Compare with X-Signature header → reject if mismatch
   d. Validate JSON schema → reject if invalid
   e. Check rate limiter for userId → 429 if exceeded
   f. Generate correlationId = UUIDv4
   g. Publish to MQ exchange "vega.orders" with routing key "incoming"
   h. Return 202 { correlationId, status: "ACCEPTED" }

3. TalkStrategy App (consumer):
   a. Dequeue from "vega.orders.incoming" queue
   b. Lookup user-broker mapping from Redis: USR:{userId}:broker
   c. Fetch instrument details from Redis: SYM:{symbol}:details
   d. Validate symbol is tradable, not in ban list
   e. Apply strategy max position check: Redis GET STRAT:{strategyId}:position
   f. Enrich order with broker, instrumentToken, brokerAccount
   g. Publish to "vega.orders.validated"
```

---

## Kill Switch Implementation

```javascript
// Kill Switch Layer 3 — Margin Monitor
class KillSwitch {
  constructor(threshold = 0.015) { // 1.50%
    this.threshold = threshold;
    this.active = false;
    this.subscriber = redis.subscribe('risk.user.pnl');
  }

  async evaluate(userId, runningPnL, totalMargin) {
    const drawdownPercent = Math.abs(runningPnL) / totalMargin;
    if (drawdownPercent >= this.threshold && !this.active) {
      this.active = true;
      await this.haltAllOrders(userId);
      await this.alertRiskTeam(userId, drawdownPercent);
      await this.logKillSwitchEvent(userId, runningPnL, totalMargin);
    }
  }

  async haltAllOrders(userId) {
    // 1. Cancel all open orders for user via Broker Integration
    // 2. Set Redis key: KS:{userId}:halted = true (TTL: until manual reset)
    // 3. Reject all incoming signals for userId at TalkStrategy API layer
    // 4. Send PagerDuty alert (severity: critical)
  }
}
```

---

## FIX Session Management (XTS Adapter)

```
Session States:
  DISCONNECTED → CONNECTING → LOGGED_ON → ACTIVE → LOGGING_OUT → DISCONNECTED

Logon Sequence:
  1. TCP connection to broker FIX endpoint (host:port from config)
  2. Send Logon (MsgType=A)
     - Tag 8 (BeginString): FIX.4.4
     - Tag 49 (SenderCompID): VEGA-NODE01
     - Tag 56 (TargetCompID): XTS-BROKER
     - Tag 34 (MsgSeqNum): 1 (or next expected for reconnect)
     - Tag 98 (EncryptMethod): 0 (none)
     - Tag 108 (HeartBtInt): 30
  3. Await Logon response (MsgType=A) from broker
  4. If Logon accepted → state = LOGGED_ON
  5. Begin Heartbeat (MsgType=0) loop every 30 seconds
  6. Reset sequence numbers if both sides agree (Tag 141=Y)

Sequence Number Resend:
  - If gap detected on reconnect → send ResendRequest (MsgType=2)
  - Broker responds with SequenceReset (MsgType=4) or missing messages
  - Sync sequence before accepting new orders
```

---

## Idempotency Mechanism

```
Algorithm:
  1. Extract signalId from incoming order
  2. Compute idempotencyKey = SHA256(signalId + userId + timestamp)
  3. Redis: SETNX idem:{idempotencyKey} {orderId} EX 86400
  4. If SETNX returns 0 → order already processed → return existing orderId
  5. If SETNX returns 1 → proceed with order creation
  6. On order completion (FILLED/REJECTED/CANCELLED) → update Redis value with final state
```
