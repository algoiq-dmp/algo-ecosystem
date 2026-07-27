# 07 — ADX & Stochastic

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Average Directional Index (ADX)

### Components

The ADX system consists of three lines:

1. **+DI (Positive Directional Indicator):** Measures upward price movement
2. **-DI (Negative Directional Indicator):** Measures downward price movement
3. **ADX:** Measures trend strength (non-directional)

### Formula

```
+DM = max(High - High(prev), 0)   if High - High(prev) > Low(prev) - Low else 0
-DM = max(Low(prev) - Low, 0)     if Low(prev) - Low > High - High(prev) else 0

+DI = EMA(+DM, N) / ATR(N) × 100
-DI = EMA(-DM, N) / ATR(N) × 100

DX = |+DI - -DI| / (+DI + -DI) × 100
ADX = EMA(DX, N)
```

### Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `period` | 14 | 10–30 | Smoothing periods |

### Signal Interpretation

| ADX Value | Trend Strength |
|-----------|----------------|
| 0–20 | Range-bound / No trend |
| 20–25 | Trend possible, watch for breakout |
| 25–40 | Strong trend |
| 40–60 | Very strong trend |
| 60+ | Extremely strong trend (overextended) |

**Direction** is determined by +DI vs -DI:
- +DI > -DI → Bullish trend
- -DI > +DI → Bearish trend
- ADX rising + +DI crossover → Strong buy
- ADX rising + -DI crossover → Strong sell

---

## Stochastic Oscillator

### Formula

```
%K = (Close - Lowest Low(N)) / (Highest High(N) - Lowest Low(N)) × 100
%D = SMA(%K, M)
```

### Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `k_period` | 14 | 5–30 | %K lookback |
| `d_period` | 3 | 2–10 | %D smoothing |
| `smoothing` | 3 | 2–10 | %K smoothing (Slow Stochastic) |

### Signal Interpretation

| Condition | Signal |
|-----------|--------|
| %K > 80 | Overbought |
| %K < 20 | Oversold |
| %K crosses above %D in oversold zone | Bullish crossover (buy) |
| %K crosses below %D in overbought zone | Bearish crossover (sell) |
| Stochastic divergence | Potential reversal |

### Fast vs Slow Stochastic

| Type | %K Smoothing | Characteristic |
|------|-------------|----------------|
| Fast | None (raw %K) | Noisy, more signals |
| Slow | SMA(3) of %K | Smoother, fewer false signals |
| Full | Customizable smoothing | Configurable sensitivity |

Suchak defaults to **Slow Stochastic** for reliability.

### Output Schema

```json
{
  "adx": {
    "value": 32.5,
    "plus_di": 28.3,
    "minus_di": 18.7,
    "trend_strength": "strong",
    "trend_direction": "bullish",
    "di_crossover": "bullish"
  },
  "stochastic": {
    "k_value": 65.2,
    "d_value": 58.1,
    "condition": "neutral",
    "crossover": null,
    "overbought": false,
    "oversold": false
  },
  "signal": {
    "adx_trend": "strong_bullish",
    "stoch_momentum": "neutral_rising",
    "strength": 72
  }
}
```

### Performance

| Metric | Value |
|--------|-------|
| ADX Compute | < 2ms |
| Stochastic Compute | < 1ms |
| Combined | < 3ms |
