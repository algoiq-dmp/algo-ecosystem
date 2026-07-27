# 12 — Signal Dispatch

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Signal Dispatch is the final stage in Kuber Alpha's pipeline where validated, activated signals are converted into executable orders and sent to Vega (Layer 2) for execution. This is the handoff from strategy management to trade execution.

## Dispatch Pipeline

```
Activated Signal + Strategy + Capital Allocation
        │
        ▼
┌──────────────────────┐
│ 1. Order Construction │──▶ Build Vega-compatible order payload
└───────┬──────────────┘
        │
        ▼
┌──────────────────────┐
│ 2. Order Validation   │──▶ Check against Vega API contract
└───────┬──────────────┘
        │
        ▼
┌──────────────────────┐
│ 3. Risk Tagging       │──▶ Attach kill-switch params, stop-loss, take-profit
└───────┬──────────────┘
        │
        ▼
┌──────────────────────┐
│ 4. Dispatch to Vega   │──▶ Send via MQ or REST
└───────┬──────────────┘
        │
        ▼
┌──────────────────────┐
│ 5. Acknowledgment     │──▶ Track order status (ACK, REJECTED, FILLED)
└──────────────────────┘
```

## Order Types Supported

| Order Type | Description |
|---|---|
| `MARKET` | Execute immediately at best available price |
| `LIMIT` | Execute at specified price or better |
| `SL` (Stop-Loss) | Trigger when price reaches stop level |
| `SL-M` (Stop-Loss Market) | Market order triggered at stop |
| `BRACKET` | Entry + Target + Stop-Loss as a group |
| `COVER` | Entry + Stop-Loss (no target) |
| `OCO` (One-Cancels-Other) | Two orders; filling one cancels the other |

## Order Payload

```json
{
  "orderId": "ord-uuid-001",
  "correlationId": "corr-sig-001",
  "strategyId": "sf-abc123",
  "signalId": "sig-uuid-001",
  "instrument": "NIFTY 50",
  "exchange": "NSE",
  "transactionType": "BUY",
  "orderType": "LIMIT",
  "product": "MIS",
  "quantity": 50,
  "price": 24500.50,
  "triggerPrice": null,
  "validity": "DAY",
  "risk": {
    "stopLoss": 24450.00,
    "takeProfit": 24600.00,
    "trailingStop": null
  },
  "metadata": {
    "strategyVersion": "1.2.0",
    "dispatchedAt": "2026-07-24T09:16:05Z",
    "source": "kuber-alpha"
  }
}
```

## Dispatch Modes

| Mode | Behavior |
|---|---|
| `PAPER` | Order is logged but NOT sent to Vega |
| `SHADOW` | Order is sent to Vega in TEST mode (no real execution) |
| `STAGED` | Order is sent with reduced quantity per staged step |
| `LIVE` | Full order sent to Vega for real execution |

## Retry & Error Handling

| Scenario | Action |
|---|---|
| Vega unreachable | Retry 3x with 1s backoff; DLQ on failure |
| Order rejected (invalid) | Log error; do NOT retry |
| Order rejected (temporary) | Retry 3x |
| Partial fill | Accept partial; log unfilled quantity |
| Timeout (no response) | Mark as UNKNOWN; manual review flagged |
| Kill Switch triggers mid-flight | Cancel all pending orders immediately |

## Order Status Tracking

| Status | Description |
|---|---|
| `PENDING` | Dispatched to Vega, awaiting acknowledgment |
| `ACKNOWLEDGED` | Vega confirmed receipt |
| `OPEN` | Order placed at exchange, waiting to fill |
| `PARTIAL` | Partially filled |
| `COMPLETE` | Fully filled |
| `REJECTED` | Vega or exchange rejected |
| `CANCELLED` | Cancelled by Kuber Alpha or user |
| `UNKNOWN` | No response within timeout; requires investigation |

## Performance

| Metric | Target |
|---|---|
| Order construction | < 2ms |
| Dispatch to Vega | < 10ms P99 |
| Acknowledgement latency | < 50ms P99 |
| Dispatch throughput | > 500 orders/sec |
| Dispatch success rate | > 99.9% |
