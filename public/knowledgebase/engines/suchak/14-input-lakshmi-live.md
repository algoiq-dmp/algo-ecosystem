# 14 — Input: Lakshmi Live Data

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Overview

**Lakshmi** is the tick-level live market data feed providing real-time bid/ask, last traded price, and volume information. Suchak uses Lakshmi for ultra-low-latency indicator updates and VWAP calculations.

## Data Structure

### Tick Format

```json
{
  "symbol": "NIFTY",
  "exchange": "NSE",
  "timestamp": "2026-07-24T10:45:30.123+05:30",
  "ltp": 24550.75,
  "bid": 24550.50,
  "ask": 24551.00,
  "bid_qty": 1500,
  "ask_qty": 800,
  "volume": 35000,
  "oi": 125000,
  "change": 0.45,
  "spread": 0.50
}
```

## Tick Aggregation

Suchak aggregates Lakshmi ticks into OHLC bars:

### 1. Time-Based Aggregation

```
Open(t)  = First tick price in interval
High(t)  = Max(tick price) in interval
Low(t)   = Min(tick price) in interval
Close(t) = Last tick price in interval
Volume(t)= Sum(tick volume) in interval
```

### 2. Tick-Based Aggregation

Configured for renko, range bars, and volume bars:

| Bar Type | Rule |
|----------|------|
| Range Bar | New bar when |High - Low| = range_threshold |
| Volume Bar | New bar when cumulative volume = vol_threshold |
| Tick Bar | New bar after N ticks |

## Real-Time Indicator Updates

Lakshmi data enables:

1. **Streaming VWAP** — Computed tick-by-tick, resets at session boundaries
2. **Real-Time RSI** — Updated on each tick (using latest partial bar close)
3. **Live Volume Profile** — Accumulates tick volume at price levels
4. **Bid-Ask Imbalance** — Ratio of bid volume to ask volume

### Bid-Ask Imbalance Signal

```
Imbalance = (Bid Volume - Ask Volume) / (Bid Volume + Ask Volume)
```

| Imbalance | Signal |
|-----------|--------|
| > 0.3 | Strong buying pressure |
| 0.1 to 0.3 | Mild buying |
| -0.1 to 0.1 | Balanced |
| -0.3 to -0.1 | Mild selling |
| < -0.3 | Strong selling pressure |

## Connection Architecture

```
Lakshmi Tick Plant (NSE Co-location)
         │
    ┌────┴────┐
    │  FIX/FAST│ Protocol
    └────┬────┘
         │
    ┌────┴────────┐
    │ Lakshmi Hub │ (Kafka Stream)
    └────┬────────┘
         │
    ┌────┴────┐
    │ Suchak  │ Consumer Group
    └─────────┘
```

## Configuration

```yaml
lakshmi:
  bootstrap_servers:
    - lakshmi-1.internal.algoiq.io:9092
    - lakshmi-2.internal.algoiq.io:9092
  consumer_group: suchak-consumers
  topics:
    - nse.equity.ticks
    - nse.fno.ticks
    - bse.equity.ticks
  session:
    start: "09:15"
    end: "15:30"
  reconnect:
    max_attempts: unlimited
    backoff: exponential
```

## Data Quality Checks

| Check | Threshold | Action |
|-------|-----------|--------|
| Stale tick | > 5s since last tick | Flag symbol inactive |
| Price spike | > 10% in 1 tick | Discard, flag anomaly |
| Bid > Ask | Any | Swap values, log warning |
| Zero volume tick | Per tick | Accept (informational) |
| Circuit breaker | Price at limit | Flag "circuit_hit" |

## Performance

| Metric | Value |
|--------|-------|
| Tick ingestion | 100K+ ticks/sec |
| Tick-to-indicator latency | < 5ms |
| End-to-end latency (tick to signal) | < 50ms |
