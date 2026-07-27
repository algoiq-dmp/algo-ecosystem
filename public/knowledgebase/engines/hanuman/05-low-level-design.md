# 05 — Low-Level Design

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Spread Calculation Engine

The core of Hanuman is the real-time spread calculation between two instruments.

### Spread Formula (Calendar Spread)

```
Spread = Price(Leg1) - Price(Leg2) × Beta
```

Where:
- `Price(Leg1)` = LTP of near-month instrument
- `Price(Leg2)` = LTP of far-month instrument
- `Beta` = Hedge ratio (configurable, default: 1.0)

### Z-Score Calculation

For statistical strategies (pair trades):

```
Z = (Spread - SMA(Spread, window)) / StdDev(Spread, window)
```

Configurable parameters: `window` (default 20 periods), `entry_threshold` (default ±2.0), `exit_threshold` (default 0.0).

### Order of Operations on Each Tick

```
1. Update order book for affected instrument
2. If both legs have valid prices:
   a. Calculate spread
   b. If strategy is RUNNING and has no open position:
      - Check entry conditions
      - If ENTRY: generate TradeSignal
   c. If strategy has open position:
      - Check exit conditions
      - If EXIT: generate closing TradeSignal
      - Mark-to-market unrealized P&L
3. Check risk limits
4. Dispatch orders if signal generated
```

## Vega Strategy Definition (Example)

```cpp
// Calendar spread strategy: NSE NIFTY Jun vs Jul futures
STRATEGY calendar_spread_nifty_jun_jul {
    VERSION "1.0";
    TYPE "calendar_spread";

    LEG leg1 {
        EXCHANGE "NSE";
        SEGMENT "FO";
        SYMBOL "NIFTY26JUNFUT";
        SIDE BUY;
        QUANTITY 75;  // 1 lot
    }

    LEG leg2 {
        EXCHANGE "NSE";
        SEGMENT "FO";
        SYMBOL "NIFTY26JULFUT";
        SIDE SELL;
        QUANTITY 75;
    }

    PARAMS {
        hedge_ratio: 1.0;
        entry_spread_min: 15.0;
        entry_spread_max: 25.0;
        exit_spread_target: 5.0;
        stop_loss_spread: 35.0;
        max_position_lots: 10;
        max_slippage_ticks: 3;
        time_in_force: "DAY";
        order_type: "LIMIT";
    }

    RISK {
        max_order_value: 5000000;   // Rs. 50 lakh
        max_daily_loss: 200000;      // Rs. 2 lakh
        require_margin_check: true;
    }
}
```

## Order Dispatch Logic

### Paired Order Generation

```cpp
struct TradeSignal {
    uint64_t strategy_id;
    SignalType type;  // ENTRY, EXIT, HEDGE
    LegOrder leg1;
    LegOrder leg2;
    uint64_t timestamp_ns;
};

struct LegOrder {
    std::string symbol;
    OrderSide side;   // BUY, SELL
    int32_t quantity;
    double limit_price;  // 0 for market orders
    OrderType type;   // LIMIT, MARKET
    TimeInForce tif;
};
```

### Partial Fill Handling

When Leg 1 fills partially (quantity Q1 < Q_target):
1. Cancel Leg 2 order immediately
2. Recalculate Leg 2 quantity: Q2_new = Q1 / hedge_ratio
3. Round to lot size (floor)
4. If rounded quantity < 1 lot: trigger hedge on Leg 1 (market sell)
5. Otherwise: submit new Leg 2 order with Q2_new

### Auto-Hedge on Leg Failure

If Leg 2 is rejected (exchange error, circuit breaker, insufficient margin):
1. Leg 1 confirmed fills are locked
2. Auto-hedge order generated for Leg 1: market order, opposite side, full filled quantity
3. Strategy transitions to PAUSED state
4. Alert sent to Narad: `HanumanLegFailure`
