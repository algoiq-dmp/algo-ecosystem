# 03 — Market Regime Classification

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Overview

The **Market Regime Classifier** categorizes the current market environment into one of eight distinct regimes, enabling downstream engines to select appropriate strategies for prevailing conditions.

## Regime Taxonomy

| ID | Regime | Description |
|----|--------|-------------|
| `STRONG_BULL` | Strong Bull | High ADX, price above key MAs, positive momentum |
| `WEAK_BULL` | Weak Bull | Modest uptrend, mixed signals, low conviction |
| `STRONG_BEAR` | Strong Bear | High ADX, price below key MAs, negative momentum |
| `WEAK_BEAR` | Weak Bear | Modest downtrend, mixed signals |
| `SIDEWAYS_HIGH` | High Range Sideways | Wide range, high volatility, no trend |
| `SIDEWAYS_LOW` | Low Range Sideways | Narrow range, low volatility, compression |
| `TRANSITION_BUY` | Transition to Bullish | Emerging from sideways/bear to bullish |
| `TRANSITION_SELL` | Transition to Bearish | Emerging from sideways/bull to bearish |

## Classification Methodology

### Feature Vector

Each bar produces a feature vector from Suchak indicators:

```json
{
  "adx": 32.5,
  "ema_50_slope": 0.002,
  "ema_200_slope": 0.001,
  "rsi_14": 62.4,
  "macd_histogram_trend": 1,
  "supertrend_direction": 1,
  "bb_width_percentile": 0.65,
  "price_vs_vwap": 0.008,
  "plus_di_minus_di": 9.6
}
```

### Decision Tree Rules

```
IF ADX > 25 AND EMA(50) slope > 0 AND RSI > 55 AND SuperTrend = UP
  → STRONG_BULL
ELSE IF ADX > 25 AND EMA(50) slope < 0 AND RSI < 45 AND SuperTrend = DOWN
  → STRONG_BEAR
ELSE IF ADX > 25 AND EMA(50) slope > 0 AND (RSI < 55 OR SuperTrend = DOWN)
  → WEAK_BULL
ELSE IF ADX > 25 AND EMA(50) slope < 0 AND (RSI > 45 OR SuperTrend = UP)
  → WEAK_BEAR
ELSE IF ADX < 20 AND BB width > 60th percentile
  → SIDEWAYS_HIGH
ELSE IF ADX < 20 AND BB width < 40th percentile
  → SIDEWAYS_LOW
ELSE IF previous_regime in [SIDEWAYS_*] AND ADX rising AND SuperTrend flips
  → TRANSITION_BUY or TRANSITION_SELL
```

## Regime-Strategy Mapping

| Regime | Recommended Strategies |
|--------|----------------------|
| STRONG_BULL | Trend following, momentum, call options |
| WEAK_BULL | Moderate trend, covered calls |
| STRONG_BEAR | Short trend, put options, inverse ETFs |
| WEAK_BEAR | Light shorts, hedging |
| SIDEWAYS_HIGH | Options strangles/straddles |
| SIDEWAYS_LOW | Iron condors, calendar spreads |
| TRANSITION_BUY | Accumulate longs, sell puts |
| TRANSITION_SELL | Reduce longs, buy puts |

## Regime Transition Detection

Manthan detects regime transitions before they complete:

```
Transition Signal = {
    current_regime != previous_regime → Regime Change (confirmed)
    transition_probability > 70% → Early Warning (1-3 bars before change)
}
```

### Output Schema

```json
{
  "symbol": "NIFTY",
  "timestamp": "2026-07-24T12:15:00Z",
  "regime": {
    "current": "STRONG_BULL",
    "previous": "WEAK_BULL",
    "duration_bars": 45,
    "confidence": 0.87,
    "transition_probability": {
      "to_sideways": 0.08,
      "to_bear": 0.05
    },
    "recommended_strategies": ["trend_following", "momentum", "covered_call"]
  },
  "signal": {"strength": 82}
}
```

### Performance

| Metric | Value |
|--------|-------|
| Regime classification | < 5ms |
| Transition detection | < 3ms |
| Accuracy (historical) | 78% (within 3-bar window) |
