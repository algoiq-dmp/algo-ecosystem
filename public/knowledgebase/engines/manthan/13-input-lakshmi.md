# 13 — Input: Lakshmi Live Data

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Overview

Manthan consumes **Lakshmi live tick data** for microstructure analysis, liquidity scoring, and real-time order flow assessment.

## Data Consumed

| Field | Module |
|-------|--------|
| LTP | Real-time price for all calculations |
| Bid/Ask | Spread analysis, liquidity scoring |
| Bid/Ask Qty | Depth assessment, order book imbalance |
| Tick Volume | Micro-volume analysis |
| Tick Timestamp | Latency monitoring |

## Order Flow Metrics

### Order Book Imbalance

```
OI_Imbalance = (Bid_Qty_Total - Ask_Qty_Total) / (Bid_Qty_Total + Ask_Qty_Total)
```

- > 0.3: Strong buying pressure
- < -0.3: Strong selling pressure

### Tick Direction Classification

Each tick is classified:
- **Up tick**: LTP > Previous LTP
- **Down tick**: LTP < Previous LTP
- **Flat tick**: LTP = Previous LTP

### Cumulative Delta

```
Delta = Σ(Up_Tick_Volume) - Σ(Down_Tick_Volume)
```

| Delta | Signal |
|-------|--------|
| Large positive | Aggressive buyers |
| Large negative | Aggressive sellers |
| Oscillating near zero | Balanced market |

## Connection

```yaml
lakshmi:
  bootstrap_servers: ["lakshmi-1:9092", "lakshmi-2:9092"]
  consumer_group: manthan-v2
  topics: ["nse.equity.ticks", "nse.fno.ticks"]
```
