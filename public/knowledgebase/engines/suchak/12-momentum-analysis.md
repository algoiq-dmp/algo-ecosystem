# 12 — Momentum Analysis

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Overview

The **Momentum Engine** measures the rate and acceleration of price change, providing early warning of trend strength changes before they manifest in price action.

## Momentum Indicators

### 1. Rate of Change (ROC)

```
ROC(N) = ((Close - Close(N bars ago)) / Close(N bars ago)) × 100
```

| Parameter | Default | Range |
|-----------|---------|-------|
| `roc_period` | 12 | 5–50 |

- **ROC > 0** → Upward momentum
- **ROC < 0** → Downward momentum
- **ROC extreme (±5% daily)** → Overextended

### 2. Relative Momentum Index (RMI)

RSI variant using price change instead of absolute price:

```
RMI = RSI(Close - Close(N_bars_ago))
```

Captures momentum continuations that RSI misses.

### 3. Chande Momentum Oscillator (CMO)

```
CMO = ((Sum of Ups - Sum of Downs) / (Sum of Ups + Sum of Downs)) × 100
```

| CMO Value | Momentum |
|-----------|----------|
| > 50 | Strong bullish momentum |
| 0 to 50 | Mild bullish momentum |
| -50 to 0 | Mild bearish momentum |
| < -50 | Strong bearish momentum |

### 4. Momentum Divergence

Suchak detects momentum divergences in real-time:

**Class A Divergence (Reversal):**
- Price higher high + ROC lower high → Bearish divergence
- Price lower low + ROC higher low → Bullish divergence

**Class B Divergence (Continuation):**
- Price higher low + ROC lower low → Bullish hidden divergence
- Price lower high + ROC higher high → Bearish hidden divergence

### 5. Momentum Burst Detection

Identifies explosive price moves:

```
Momentum Burst = |ROC(1)| > 3 × ATR(14) / Close
```

These bursts often signal the start of sustained moves.

## Trend Acceleration

Suchak computes the **second derivative** of price:

```
Acceleration = ROC(ROC(N))
```

| Acceleration | Interpretation |
|-------------|----------------|
| Positive & increasing | Trend accelerating (strong entry) |
| Positive & decreasing | Trend decelerating (tighten stops) |
| Negative & decreasing | Counter-trend accelerating |
| Near zero | Trend stalling (exit signal) |

## Momentum Flow by Timeframe

Momentum is computed per timeframe and aggregated:

```
Momentum Flow = Σ(timeframe_momentum × timeframe_weight)
```

| Timeframe | Weight |
|-----------|--------|
| 1d | 40% |
| 1h | 30% |
| 15m | 20% |
| 5m | 10% |

### Output Schema

```json
{
  "symbol": "TATAMOTORS",
  "timestamp": "2026-07-24T11:15:00Z",
  "momentum": {
    "roc_12": 3.2,
    "rmi": 62.1,
    "cmo": 45.3,
    "acceleration": 0.12,
    "burst_detected": false,
    "divergence": null,
    "regime": "bullish_accelerating",
    "flow_score": 68
  },
  "signal": {
    "momentum_direction": "bullish",
    "strength": "strong",
    "trend_phase": "acceleration",
    "strength": 74
  }
}
```

### Performance

| Metric | Value |
|--------|-------|
| Momentum Computation | < 2ms |
| Burst Detection | < 1ms |
| Full Suite | < 4ms |
