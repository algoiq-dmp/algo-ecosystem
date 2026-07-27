# 11 — Support & Resistance Detection

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Overview

Suchak's **Support & Resistance (S/R) Engine** identifies key price levels where the market has historically reversed, consolidated, or accelerated. These levels are consumed by strategy engines for entry, exit, and stop-loss placement.

## Detection Methods

### 1. Pivot-Based S/R

Identifies swing highs and lows using a configurable neighborhood window:

```
Swing High:  High(i) > High(i-N..i-1) AND High(i) > High(i+1..i+N)
Swing Low:   Low(i)  < Low(i-N..i-1)  AND Low(i)  < Low(i+1..i+N)
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `pivot_window` | 5 | Bars to left and right |
| `min_touches` | 2 | Minimum price touches to qualify |

### 2. Volume Profile S/R

Builds a volume-at-price histogram and identifies high-volume nodes (HVN):

```
POC (Point of Control) = Price level with highest volume
Value Area High/Low = 70% of total volume range
```

- **HVN zones** → Strong S/R (many participants traded here)
- **Low Volume Nodes (LVN)** → Weak S/R, price moves through quickly

### 3. Moving Average S/R

Key MAs that historically acted as support/resistance:

| MA | Role |
|----|------|
| EMA 20 | Dynamic S/R in trending markets |
| EMA 50 | Intermediate S/R |
| EMA 200 | Major institutional S/R |
| VWAP | Intraday S/R anchor |

### 4. Fibonacci Retracement S/R

Derived from the most recent significant swing:

```
Fib Levels: 0%, 23.6%, 38.2%, 50%, 61.8%, 78.6%, 100%
```

Key Fibs: **38.2%**, **50%**, **61.8%** (Golden Ratio)

### 5. Round Number S/R

Psychological price levels (e.g., NIFTY 24000, 24500, 25000).

## Confluence Scoring

Levels where multiple methods agree receive a higher **Confluence Score**:

| Methods Agreeing | S/R Strength |
|-----------------|--------------|
| 4+ | Major S/R |
| 3 | Strong S/R |
| 2 | Moderate S/R |
| 1 | Minor S/R |

## Dynamic Level Updates

Levels are updated as:
- New pivots form → new levels added
- Old levels get tested and hold → strength increases
- Old levels get broken → downgraded to "broken" or removed
- Volume profile shifts → POC recalibrated

### Output Schema

```json
{
  "symbol": "BANKNIFTY",
  "timestamp": "2026-07-24T11:00:00Z",
  "support_levels": [
    {"level": 52100, "method": "pivot", "touches": 3, "strength": "strong"},
    {"level": 51950, "method": "fib_61.8", "touches": 2, "strength": "moderate"},
    {"level": 51800, "method": "volume_poc", "touches": 5, "strength": "major"}
  ],
  "resistance_levels": [
    {"level": 52800, "method": "pivot", "touches": 4, "strength": "strong"},
    {"level": 53000, "method": "round_number", "touches": 6, "strength": "major"},
    {"level": 53250, "method": "fib_38.2", "touches": 2, "strength": "moderate"}
  ],
  "nearest_support": {"level": 52100, "distance_pct": 1.2},
  "nearest_resistance": {"level": 52800, "distance_pct": 0.8},
  "range": {"low": 52100, "high": 52800, "width_pct": 1.34},
  "signal": {
    "bias": "range_bound",
    "next_move_probability": "breakout_up_55%",
    "strength": 55
  }
}
```

### Performance

| Metric | Value |
|--------|-------|
| S/R Detection (all methods) | < 5ms |
| Volume Profile Build | < 10ms (cached daily) |
