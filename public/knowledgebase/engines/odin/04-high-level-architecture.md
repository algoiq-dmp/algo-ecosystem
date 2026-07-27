# 04 — High-Level Architecture

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Architecture Overview

ODIN follows a layered architecture with protocol adapters that abstract away the differences between dealer terminal APIs and direct exchange APIs. All layers communicate via lock-free queues and event-driven callbacks.

## Architecture Layers

### Layer 1: Order Ingestion
- Subscribes to MQ topics: `orders.{exchange}.{segment}`
- Deserializes Lakshmi canonical order format
- Validates basic structure (required fields, valid enums)
- Assigns internal order ID (pre-exchange-assigned ID)

### Layer 2: Order Validation
- **Price band check:** Order price within exchange-defined price band
- **Quantity check:** Order quantity meets lot size, within freeze limits
- **RMS check:** Validates against Risk Management System (position limit, margin)
- **Circuit filter check:** Instrument is not in circuit breaker
- **Rate limiter:** Client not exceeding order rate limits

### Layer 3: Protocol Adapter

Abstract `ExchangeAdapter` interface:

```cpp
class ExchangeAdapter {
public:
    virtual OrderResult submitOrder(const CanonicalOrder&) = 0;
    virtual OrderResult modifyOrder(const OrderModifyRequest&) = 0;
    virtual OrderResult cancelOrder(const OrderCancelRequest&) = 0;
    virtual void subscribeExecutions(Callback<ExecutionReport>) = 0;
    virtual ExchangeStatus getStatus() = 0;
};
```

### Adapter Implementations

| Adapter | Protocol | Exchange |
|---------|----------|----------|
| `OdinDietAdapter` | ODIN Diet XML API | NSE, BSE |
| `OmnesysNestAdapter` | Omnesys Nest TCP API | MCX, NCDEX |
| `NseNeatAdapter` | NSE NEAT FIX API | NSE (direct) |
| `BseBoltAdapter` | BSE BOLT API | BSE (direct) |
| `UTradeAdapter` | uTrade REST API | Multi-exchange |

### Layer 4: Order Router

Decides which adapter to use for each order:
1. Try primary path (direct exchange API, lowest latency)
2. If primary fails or times out (500ms): try secondary path (dealer terminal)
3. If both fail: reject order with `NO_ROUTE_AVAILABLE`

### Layer 5: Execution Processor
- Receives execution reports from all adapters
- Normalizes into canonical execution report format
- Updates order state in Order State Store
- Publishes execution to MQ: `executions.{exchange}.{segment}`

## Order State Machine

```
NEW ──► VALIDATED ──► PENDING ──► OPEN
                          │          │
                          ▼          ▼
                      REJECTED   PARTIALLY_FILLED
                                      │
                                      ├──► COMPLETE
                                      └──► CANCELLED
                                              │
                                          REJECTED (cancel rejected)
```
