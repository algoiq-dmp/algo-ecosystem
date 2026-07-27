# 09 — API Reference

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## MQ Order API

Strategy engines publish order requests to MQ topics.

### Topic Pattern

`orders.{exchange}.{segment}`

Example: `orders.NSE.CM`

### Message Format: CanonicalOrder (Protobuf)

```protobuf
message CanonicalOrder {
    string client_id = 1;
    string client_order_id = 2;
    Exchange exchange = 3;
    Segment segment = 4;
    string symbol = 5;
    OrderSide side = 6;
    OrderType type = 7;
    int32 quantity = 8;
    double price = 9;
    double trigger_price = 10;
    TimeInForce tif = 11;
    string algo_id = 12;
    string strategy_tag = 13;
    uint64 timestamp_ns = 14;
}
```

### Message Format: OrderModify

```protobuf
message OrderModify {
    string client_id = 1;
    string exchange_order_id = 2;  // ODIN-assigned order ID
    int32 new_quantity = 3;
    double new_price = 4;
    double new_trigger_price = 5;
}
```

### Message Format: OrderCancel

```protobuf
message OrderCancel {
    string client_id = 1;
    string exchange_order_id = 2;
}
```

## MQ Execution Report API

ODIN publishes execution reports to MQ topics.

### Topic Pattern

`executions.{exchange}.{segment}`

### Message Format: CanonicalExecutionReport

```protobuf
message CanonicalExecutionReport {
    string order_id = 1;
    string exchange_order_id = 2;
    string client_order_id = 3;
    string trade_id = 4;           // Unique trade identifier
    Exchange exchange = 5;
    Segment segment = 6;
    string symbol = 7;
    OrderSide side = 8;
    ExecType exec_type = 9;        // NEW, REPLACED, CANCELLED, TRADE, REJECTED
    OrderStatus order_status = 10;  // OPEN, PARTIAL, COMPLETE, CANCELLED, REJECTED
    int32 last_qty = 11;           // Qty of this fill
    double last_price = 12;        // Price of this fill
    int32 cum_qty = 13;            // Cumulative filled qty
    double avg_price = 14;         // Average fill price
    int32 leaves_qty = 15;         // Remaining qty
    string reject_reason = 16;     // If rejected
    uint64 exchange_ts_ns = 17;
    uint64 odin_ts_ns = 18;
}
```

## gRPC Management API

### Service: OdinAdmin

```protobuf
service OdinAdmin {
    rpc GetOrderStatus(OrderStatusRequest) returns (OrderStatusResponse);
    rpc CancelOrder(CancelOrderRequest) returns (CancelOrderResponse);
    rpc ModifyOrder(ModifyOrderRequest) returns (ModifyOrderResponse);
    rpc GetAdapterStatus(AdapterStatusRequest) returns (AdapterStatusResponse);
    rpc ReconcileTrades(ReconcileRequest) returns (ReconcileResponse);
    rpc GetOrderStats(OrderStatsRequest) returns (OrderStatsResponse);
}
```

## CLI: odinctl

```bash
# Order operations
odinctl order status --order-id "2026072500001234"
odinctl order cancel --order-id "2026072500001234"
odinctl order modify --order-id "2026072500001234" --price 2548.00

# Adapter operations
odinctl adapter status
odinctl adapter health --adapter nse_neat
odinctl adapter failover --exchange NSE --segment CM  # manual failover

# Reconciliation
odinctl reconcile --exchange NSE --date 2026-07-25
odinctl reconcile --all --date 2026-07-25

# Statistics
odinctl stats --exchange NSE --period today
odinctl stats --adapter nse_neat --period today
```
