# 04 — Trend Detection

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Overview

The **Trend Detection** module provides multi-timeframe trend analysis including direction, strength, phase classification, and trend exhaustion warnings.

## Trend Dimensions

### 1. Trend Direction

| Direction | Criteria |
|-----------|----------|
| Uptrend | Price > EMA(20) > EMA(50) > EMA(200) |
| Downtrend | Price < EMA(20) < EMA(50) < EMA(200) |
| Mixed | MAs not aligned |

### 2. Trend Strength

```
Trend Strength = f(ADX, MA spread, DI difference, MA slopes)
```

| Strength | ADX | MA Alignment | Action |
|----------|-----|-------------|--------|
| Very Strong | > 40 | All aligned | Full position |
| Strong | 30–40 | All aligned | Normal position |
| Moderate | 25–30 | Mostly aligned | Reduced position |
| Weak | 20–25 | Mixed | Half position or skip |
| None | < 20 | No alignment | Stay out |

### 3. Trend Phase

| Phase | Characteristics |
|-------|----------------|
| **Emerging** | MA crossover just occurred, low ADX but rising |
| **Accelerating** | MAs fanning out, ADX rising rapidly, ROC positive |
| **Mature** | MAs parallel, ADX stable, consistent slope |
| **Decelerating** | MAs converging, ADX falling, ROC declining |
| **Exhausted** | MAs close together, ADX < 20, divergence signals |
| **Reversing** | MA crossover opposite direction |

## Multi-Timeframe Trend Matrix

Manthan computes trend on all timeframes and scores the alignment:

```json
{
  "trend_matrix": {
    "1m":  {"direction": "up",   "strength": 35, "phase": "accelerating"},
    "5m":  {"direction": "up",   "strength": 42, "phase": "mature"},
    "15m": {"direction": "up",   "strength": 55, "phase": "mature"},
    "1h":  {"direction": "up",   "strength": 48, "phase": "mature"},
    "1d":  {"direction": "up",   "strength": 38, "phase": "accelerating"}
  },
  "alignment": {
    "score": 92,
    "description": "All timeframes bullish",
    "strongest_tf": "15m",
    "weakest_tf": "1m"
  }
}
```

### Alignment Scoring

| Alignment | Score | Interpretation |
|-----------|-------|----------------|
| All TFs same direction | 100 | Maximum alignment |
| 4/5 TFs same | 80 | Strong alignment |
| 3/5 TFs same | 50 | Moderate alignment |
| 2/5 TFs same | 25 | Weak alignment |
| < 2 TFs same | 0 | No alignment (avoid) |

## Trend Exhaustion Warnings

| Signal | Warning |
|--------|---------|
| ADX > 60 | Trend extremely overextended |
| MA spread at 99th percentile | Unusually wide MAs |
| RSI divergence on all TFs | Momentum failing |
| MACD histogram shrinking 5+ bars | Momentum bleeding |
| Volume declining on trend bars | Participation dropping |

## Trend Score Aggregation

```
Trend Score = Direction(+/-) × (0.4 × Strength + 0.3 × Alignment + 0.3 × Phase_Score)
```

Output: -100 (strong downtrend) to +100 (strong uptrend).

### Output Schema

```json
{
  "symbol": "BANKNIFTY",
  "timestamp": "2026-07-24T12:30:00Z",
  "trend": {
    "score": 72,
    "direction": "up",
    "strength": 48,
    "phase": "mature",
    "alignment": 92,
    "exhaustion_warning": false,
    "estimated_duration_bars": 15
  },
  "signal": {"strength": 72}
}
```

### Performance

| Metric | Value |
|--------|-------|
| Single TF trend | < 3ms |
| All-TF matrix | < 10ms |
| Phase classification | < 2ms |
