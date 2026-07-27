# 05 — Breakout Probability

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Overview

The **Breakout Probability** module scores the likelihood and direction of price breakouts from consolidation zones, using volatility compression, volume patterns, and level proximity.

## Breakout Score Components

### 1. Compression Score (40% weight)

```
Compression = f(BB_width_percentile, CPR_width, ATR_percentile)
```

| Compression Level | Score | Signal |
|------------------|-------|--------|
| Extreme squeeze | 90-100 | Breakout imminent |
| Strong squeeze | 70-89 | Breakout likely |
| Moderate squeeze | 50-69 | Watch for breakout |
| No compression | < 50 | No breakout expected |

### 2. Level Proximity Score (30% weight)

Measures how close price is to key support/resistance:

```
Level_Score = 1 / (distance_to_level / ATR)
```

Closer to a level = higher breakout probability.

### 3. Volume Confirmation (20% weight)

| Volume Pattern | Score |
|---------------|-------|
| Volume spike > 2× avg on approach to level | +30 |
| Volume spike > 1.5× avg | +15 |
| Normal volume | +0 |
| Volume declining | -10 |

### 4. Momentum Alignment (10% weight)

| Momentum | Score |
|----------|-------|
| ROC accelerating toward level | +20 |
| ROC flat | +0 |
| ROC decelerating | -10 |

## Directional Probability

Breakout direction is determined by:

```
Direction_Score = 0.4 × Trend_Direction + 0.3 × Level_Type + 0.3 × Order_Flow
```

- Approaching resistance from below → Breakout UP more likely
- Approaching support from above → Breakout DOWN more likely
- Strong trend approaching level → Follow-through breakout
- Weak trend approaching level → Reversal at level

## False Breakout Detection

| Signal | False Breakout Risk |
|--------|---------------------|
| Low volume on breakout candle | High |
| Immediate reversal within 3 bars | Very High |
| Breakout against higher TF trend | High |
| Breakout without momentum confirmation | Moderate |

### Output Schema

```json
{
  "symbol": "NIFTY",
  "timestamp": "2026-07-24T12:45:00Z",
  "breakout": {
    "probability": 78,
    "direction": "up",
    "compression_score": 85,
    "level_proximity_score": 72,
    "volume_confirmation": 25,
    "momentum_alignment": 15,
    "nearest_level": {"type": "resistance", "price": 24800, "distance_pct": 1.2},
    "false_breakout_risk": "low",
    "estimated_bars_to_breakout": 3
  },
  "signal": {"strength": 78}
}
```

### Performance

| Metric | Value |
|--------|-------|
| Breakout scoring | < 5ms |
| False breakout risk | < 2ms |
