# 17 — Error Handling

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Error Handling Philosophy

Vega employs a **fail-safe, fail-fast** error handling strategy. Errors are caught at the earliest possible point, classified as retryable or terminal, and propagated with full context. All errors produce audit trails and metrics.

---

## Error Classification

| Category | Definition | Examples | Action |
|---|---|---|---|
| **VALIDATION** | Input does not meet requirements | Invalid symbol, price out of band | Reject order immediately |
| **BUSINESS** | Valid input, business rule violation | Rate limit exceeded, kill switch active | Reject with reason |
| **SYSTEM** | Internal infrastructure failure | DB connection lost, Redis timeout | Retry with backoff |
| **BROKER** | Broker-side failure | FIX session down, broker rejection | Failover or reject |
| **FATAL** | Process cannot continue | Corrupt state, unrecoverable DB loss | Crash + alert |

---

## Error Response Structure

All API errors follow a consistent structure:

```json
{
  "error": {
    "code": "ORDER_VALIDATION_FAILED",
    "message": "Symbol RELIANCE is not in tradable list for user USR-0042",
    "correlationId": "b3f2c1d4-8a6e-4f3b-9c2d-1e5f7a8b3c4d",
    "details": {
      "symbol": "RELIANCE",
      "userId": "USR-0042",
      "reason": "SYMBOL_NOT_TRADABLE"
    }
  }
}
```

---

## Error Codes Reference

### Validation Errors (4xx)

| Code | HTTP | Description |
|---|---|---|
| `INVALID_REQUEST_BODY` | 400 | JSON schema validation failed |
| `MISSING_REQUIRED_FIELD` | 400 | Required field not provided |
| `INVALID_ORDER_TYPE` | 400 | Order type not recognized |
| `INVALID_SYMBOL` | 400 | Symbol not in master list |
| `INVALID_QUANTITY` | 400 | Quantity outside allowed range |
| `INVALID_PRICE` | 400 | Price outside price band |
| `AUTH_FAILED` | 401 | Invalid API key or signature |
| `TIMESTAMP_DRIFT` | 401 | Request timestamp > 5 seconds off |
| `KILL_SWITCH_ACTIVE` | 403 | User trading halted by kill switch |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `ORDER_NOT_FOUND` | 404 | Order ID does not exist |
| `ORDER_NOT_MODIFIABLE` | 409 | Order in non-modifiable state |
| `DUPLICATE_ORDER` | 409 | Signal already processed |

### System Errors (5xx)

| Code | HTTP | Description |
|---|---|---|
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `SERVICE_UNAVAILABLE` | 503 | Downstream service unavailable |
| `BROKER_UNAVAILABLE` | 503 | All broker sessions down |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `MQ_ERROR` | 500 | Message queue operation failed |
| `REDIS_ERROR` | 500 | Redis operation failed |

---

## Retry Strategy

### Retryable Operations

| Operation | Max Retries | Backoff | Strategy |
|---|---|---|---|
| MQ publish | 3 | 100ms, 200ms, 400ms | Exponential |
| MQ consume (ack) | 3 | 100ms, 200ms, 400ms | Exponential |
| DB query (idempotent) | 2 | 50ms, 100ms | Exponential |
| Redis GET | 2 | 50ms, 100ms | Exponential |
| Redis SET (non-critical) | 1 | 100ms | Immediate |
| Broker REST call | 1 | 0ms | Immediate (fallback) |
| FIX message transmit | 0 | N/A | No retry (FIX handles at session layer) |

### Non-Retryable Operations

- Duplicate signal (idempotency hit)
- Kill switch active rejection
- Order state machine invalid transitions
- Credential validation failure
- Schema validation failure

### Dead Letter Queue (DLQ)

Messages failing all retries are routed to `vega.orders.dlq`:

```json
{
  "originalMessage": { /* full message */ },
  "error": "MQ publish failed after 3 retries",
  "failedAt": "2026-07-24T09:16:45.123Z",
  "retryCount": 3,
  "component": "TalkStrategyApp",
  "correlationId": "b3f2c1d4-..."
}
```

DLQ messages are monitored; alerts fire when DLQ depth > 50.

---

## Component Error Handlers

### TalkStrategy API

```javascript
app.use((err, req, res, next) => {
  const errorCode = err.code || 'INTERNAL_ERROR';
  const statusCode = err.statusCode || 500;

  logger.error('API error', {
    errorCode,
    correlationId: req.correlationId,
    path: req.path,
    userId: req.body?.userId,
    message: err.message
  });

  res.status(statusCode).json({
    error: {
      code: errorCode,
      message: err.message,
      correlationId: req.correlationId
    }
  });
});
```

### Order Processor

```javascript
async function processOrder(order) {
  try {
    // Validate state transition
    if (!isValidTransition(order.state, 'VALIDATED')) {
      throw new BusinessError('INVALID_STATE_TRANSITION', {
        currentState: order.state,
        expectedState: 'NEW'
      });
    }

    // Idempotency check
    const existingOrder = await redis.get(`idem:${order.idempotencyKey}`);
    if (existingOrder) {
      throw new BusinessError('DUPLICATE_ORDER', { existingOrderId: existingOrder });
    }

    // Proceed with processing...

  } catch (err) {
    if (err instanceof BusinessError) {
      // Terminal — set REJECTED, notify upstream
      await setOrderState(order.orderId, 'REJECTED', err.code);
      await notifyUpstream(order, 'REJECTED', err);
    } else {
      // Retryable — publish back to queue with retry count
      await publishToQueue('vega.orders.validated', order, { retryCount: (order.retryCount || 0) + 1 });
    }
    throw err; // Re-throw for MQ to nack
  }
}
```

### Broker Integration (FIX)

```javascript
fixSession.on('error', async (err) => {
  logger.error('FIX session error', {
    broker: 'XTS',
    errorCode: err.code,
    message: err.message
  });

  if (err.code === 'CONNECTION_LOST') {
    // Attempt reconnect with backoff
    await reconnectWithBackoff(fixSession);
  } else if (err.code === 'SEQUENCE_MISMATCH') {
    // Send ResendRequest to sync
    await fixSession.sendResendRequest(err.expectedSeq, err.receivedSeq);
  } else if (err.code === 'LOGOUT_RECEIVED') {
    // Broker initiated logout — reconnect after delay
    await delay(5000);
    await fixSession.connect();
  }
});
```

---

## Circuit Breaker Pattern

For external dependencies (broker REST APIs, Ganesh API), Vega implements circuit breakers:

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeoutMs = options.resetTimeoutMs || 30000;
    this.failureCount = 0;
    this.state = 'CLOSED'; // CLOSED | OPEN | HALF_OPEN
  }

  async call(fn) {
    if (this.state === 'OPEN') {
      throw new CircuitBreakerError('Circuit is OPEN');
    }

    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failureCount = 0;
      }
      return result;
    } catch (err) {
      this.failureCount++;
      if (this.failureCount >= this.failureThreshold) {
        this.state = 'OPEN';
        setTimeout(() => { this.state = 'HALF_OPEN'; }, this.resetTimeoutMs);
      }
      throw err;
    }
  }
}
```

---

## Broker Failover Flow

```
Order to XTS fails (FIX session down)
  │
  ▼
Check Greeksoft availability
  ├── Greeksoft available → Route order to Greeksoft
  │   └── Update order.broker = 'GREEKSOFT'
  │
  └── Both brokers down
      ├── Set order state = PENDING_ROUTE
      ├── Alert: BROKER_UNAVAILABLE (both)
      └── Retry every 5 seconds for 60 seconds
          ├── Any broker available → route order
          └── 60 seconds elapsed → REJECT order
              └── Reason: ALL_BROKERS_UNAVAILABLE
```
