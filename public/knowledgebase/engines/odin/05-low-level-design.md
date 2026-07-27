# 05 — Low-Level Design

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Canonical Order Format

All Lakshmi components send orders to ODIN in this canonical format:

```protobuf
message CanonicalOrder {
    string client_id = 1;           // Strategy engine ID
    string client_order_id = 2;     // Client-generated unique ID
    Exchange exchange = 3;
    Segment segment = 4;
    string symbol = 5;
    OrderSide side = 6;             // BUY, SELL
    OrderType type = 7;             // MARKET, LIMIT, SL, SL-M
    int32 quantity = 8;
    double price = 9;               // 0 for MARKET orders
    double trigger_price = 10;      // For SL/SL-M orders
    TimeInForce tif = 11;           // DAY, IOC, GTD
    string algo_id = 12;            // SEBI algo registration ID
    string strategy_tag = 13;       // Strategy reference tag
    uint64 timestamp_ns = 14;
}
```

## Protocol Adapter: ODIN Diet API

ODIN Diet uses an XML-based command protocol over TCP.

### Place Order XML Structure

```xml
<Order>
    <Exchange>NSE</Exchange>
    <Segment>CM</Segment>
    <Symbol>RELIANCE</Symbol>
    <BuySell>B</BuySell>
    <OrderType>L</OrderType>
    <Quantity>250</Quantity>
    <Price>2547.35</Price>
    <ProductType>NRML</ProductType>
    <ClientID>LAKSHMI01</ClientID>
    <AlgoID>ALGO12345</AlgoID>
</Order>
```

Response:
```xml
<OrderResponse>
    <Status>OK</Status>
    <OrderID>2026072500001234</OrderID>
    <ExchangeOrderID>1100000001234567</ExchangeOrderID>
</OrderResponse>
```

### Adapter Implementation

```cpp
class OdinDietAdapter : public ExchangeAdapter {
    TcpConnection diet_conn_;
    std::atomic<uint64_t> next_seq_{1};

    OrderResult submitOrder(const CanonicalOrder& order) override {
        auto xml = buildOrderXml(order);
        auto seq = next_seq_++;
        diet_conn_.send(xml, seq);

        // Synchronous wait for response (ODIN Diet is request-reply)
        auto response = diet_conn_.waitForResponse(seq, timeout_ms_);

        if (response.status == "OK") {
            return OrderResult::success(response.exchange_order_id);
        }
        return OrderResult::failure(response.error_code, response.error_msg);
    }
};
```

## Protocol Adapter: NSE NEAT FIX API

NSE NEAT API uses FIX 4.4 protocol.

### New Order Single (FIX 35=D)

```
35=D|49=LAKSHMI|56=NSE|11=CLORD001|55=RELIANCE|54=1|
38=250|44=2547.35|59=0|60=20260725-09:15:00.000|10=XXX
```

### Execution Report (FIX 35=8)

```
35=8|49=NSE|56=LAKSHMI|11=CLORD001|37=1100000001234567|
17=EXEC001|150=1|39=1|54=1|55=RELIANCE|32=250|31=2547.35|
14=250|6=2547.35|60=20260725-09:15:00.123|10=XXX
```

## Order State Store

In-memory concurrent hash map:

```cpp
class OrderStateStore {
    struct OrderState {
        std::string order_id;
        std::string exchange_order_id;
        OrderStatus status;
        int32_t quantity;
        int32_t filled_quantity;
        double avg_price;
        std::string exchange;
        std::string adapter_id;   // which adapter is handling this order
        uint64_t created_at_ns;
        uint64_t last_update_ns;
    };

    folly::ConcurrentHashMap<std::string, OrderState> orders_;
};
```

## Multi-Path Routing Logic

```cpp
OrderResult route(const CanonicalOrder& order) {
    // Get adapters for this exchange, ordered by priority
    auto adapters = getAdapters(order.exchange, order.segment);

    for (auto& adapter : adapters) {
        if (!adapter->isHealthy()) continue;
        auto result = adapter->submitOrder(order);
        if (result.isSuccess()) {
            storeOrderState(order, result, adapter->id());
            return result;
        }
        logWarning("Adapter failed", adapter->id(), result.error());
    }
    return OrderResult::failure("NO_ROUTE_AVAILABLE");
}
```
