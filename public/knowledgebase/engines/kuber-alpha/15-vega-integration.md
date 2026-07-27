# 15 — Vega Integration

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Vega is the order execution engine at Layer 2 of the Algo-IQ architecture. Kuber Alpha dispatches validated orders to Vega, which handles broker connectivity, order routing, and trade confirmation. The integration between Kuber Alpha and Vega is performance-critical — every millisecond matters in trade execution.

## Integration Architecture

```
Kuber Alpha (Layer 3)
        │
        ├── Order construction
        ├── Risk tagging
        │
        ▼
    MQ: kuber.outgoing.order  (primary)
    REST: POST /vega/orders   (fallback)
        │
        ▼
  Vega (Layer 2)
        │
        ├── Broker API routing
        ├── Order management
        ├── Trade confirmation
        │
        ▼
    MQ: vega.order.status  (status updates)
    MQ: vega.trade.confirm  (trade confirmations)
        │
        ▼
  Kuber Alpha (update order status, P&L)
```

## Communication Protocols

| Direction | Primary | Fallback | Description |
|---|---|---|---|
| KA → Vega | MQ | REST | Order dispatch |
| Vega → KA | MQ | WebSocket | Order status + trade confirms |
| Vega → KA | MQ | — | Heartbeat (every 1s) |

## Order Types Supported by Vega

| Order Type | KA Support | Vega Support |
|---|---|---|
| MARKET | Yes | Yes |
| LIMIT | Yes | Yes |
| SL (Stop-Loss) | Yes | Yes |
| SL-M | Yes | Yes |
| BRACKET | Yes | Yes |
| COVER | Yes | Yes |
| OCO | Yes | Yes |
| AMO (After Market) | Yes | Yes |

## Order Lifecycle Tracking

```
PENDING → ACKNOWLEDGED → OPEN → PARTIAL → COMPLETE
   │           │            │        │
   └───────────┴────────────┴────────┘
              REJECTED / CANCELLED / UNKNOWN
```

Kuber Alpha tracks every order from dispatch to final state:

```json
{
  "orderId": "ord-uuid-001",
  "vegaOrderId": "vega-ord-xyz",
  "status": "COMPLETE",
  "timeline": [
    { "event": "PENDING", "timestamp": "09:16:05.000" },
    { "event": "ACKNOWLEDGED", "timestamp": "09:16:05.015" },
    { "event": "OPEN", "timestamp": "09:16:05.120" },
    { "event": "COMPLETE", "timestamp": "09:16:05.450" }
  ],
  "fills": [
    { "quantity": 50, "price": 24500.50, "timestamp": "09:16:05.450" }
  ]
}
```

## Position Synchronization

Kuber Alpha reconciles its internal position state with Vega's confirmed positions:

| Interval | Description |
|---|---|
| Every trade | Real-time update on fill |
| Every 5 seconds | Batch reconciliation |
| End of day | Full position audit |

Mismatches trigger immediate investigation and are logged as `POSITION_MISMATCH` events.

## Error Handling

| Vega Response | KA Action |
|---|---|
| `ORDER_REJECTED_INVALID` | Log; DO NOT retry |
| `ORDER_REJECTED_RISK` | Log; notify risk team |
| `ORDER_REJECTED_MARGIN` | Check Kill Switch; may trigger |
| `CONNECTION_TIMEOUT` | Retry 3x; fallback to REST |
| `VEGA_UNAVAILABLE` | Queue orders; alert ops team |
| `PARTIAL_FILL` | Accept; update position |

## Circuit Breaker

If Vega becomes unhealthy:
1. MQ connection lost → automatic reconnection (exponential backoff).
2. REST API timeout on 3 consecutive requests → circuit opens.
3. Orders queued in Redis until circuit closes.
4. Circuit half-opens after 30 seconds with a probe request.
5. Kill Switch monitors margin independently — can still trigger.

## Performance

| Metric | Target |
|---|---|
| Order dispatch → Vega ACK | < 15ms P99 |
| Vega ACK → exchange OPEN | < 50ms P99 |
| Fill notification → KA update | < 20ms P99 |
| Position reconciliation | < 1s |
| Vega heartbeat interval | 1s |
| Missed heartbeats before alert | 3 |

## Monitoring

| Metric | Description |
|---|---|
| `vega.orders.dispatched` | Orders sent to Vega |
| `vega.orders.acknowledged` | Orders confirmed by Vega |
| `vega.orders.rejected` | Orders rejected |
| `vega.latency.dispatch_to_ack` | P50/P95/P99 latency |
| `vega.connection.status` | 1 = healthy, 0 = unhealthy |
| `vega.position.mismatches` | Position sync discrepancies detected |
