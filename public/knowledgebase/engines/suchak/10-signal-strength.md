# 10 — Signal Strength Scoring

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Overview

The **Signal Strength Engine** aggregates raw indicator outputs into a unified, normalized score (0–100) representing the directional confidence of the current market state.

## Scoring Methodology

### Step 1: Per-Indicator Normalization

Each indicator output is mapped to a -100 to +100 scale:

```
Signal(i) = f(raw_value, parameters) ∈ [-100, +100]
```

| Indicator | Bullish (+ve) | Bearish (-ve) | Neutral (0) |
|-----------|--------------|---------------|-------------|
| EMA | Price > EMA(20) | Price < EMA(20) | Price ≈ EMA(20) |
| RSI | RSI > 50 | RSI < 50 | RSI ≈ 50 |
| MACD | MACD > Signal | MACD < Signal | MACD ≈ Signal |
| SuperTrend | ST = Up | ST = Down | N/A |
| ADX+DI | +DI > -DI | -DI > +DI | +DI ≈ -DI |
| BB %B | %B > 0.8 | %B < 0.2 | %B ≈ 0.5 |
| Ichimoku | Rank ≤ 3 | Rank ≥ 5 | Rank = 4 |

### Step 2: Weighted Aggregation

```
Composite Score = Σ(w_i × Signal_i) / Σ(w_i)
```

### Default Weights

| Indicator | Weight | Rationale |
|-----------|--------|-----------|
| EMA (200) | 15 | Long-term trend anchor |
| MACD | 12 | Momentum + trend |
| RSI | 10 | Overbought/oversold |
| ADX | 8 | Trend strength confirmation |
| SuperTrend | 10 | Directional bias |
| Bollinger Bands | 8 | Volatility context |
| Ichimoku | 12 | Multi-component confirmation |
| VWAP | 5 | Intraday bias |
| Pivot/CPR | 10 | Key level reactions |
| Stochastic | 5 | Short-term momentum |
| ATR | 5 | Volatility adjustment |

### Step 3: Confidence Adjustment

```
Final Strength = Composite Score × Confidence Multiplier
```

### Confidence Multiplier

| Condition | Multiplier |
|-----------|------------|
| 8+ indicators aligned | 1.0 (full confidence) |
| 5–7 indicators aligned | 0.85 |
| 3–4 indicators aligned | 0.65 |
| < 3 indicators aligned | 0.40 (chop) |
| Divergence detected | 0.70 (dampen) |

## Signal Categories

| Score Range | Category | Action |
|-------------|----------|--------|
| 80–100 | Strong Bullish | Aggressive long entries |
| 60–79 | Bullish | Long with confirmation |
| 40–59 | Mild Bullish | Cautious long |
| -40 to 39 | Neutral | Stay out or hedge |
| -40 to -59 | Mild Bearish | Cautious short |
| -60 to -79 | Bearish | Short with confirmation |
| -80 to -100 | Strong Bearish | Aggressive short entries |

## Multi-Timeframe Confluence

Suchak computes signal strength on all timeframes and identifies confluence:

```json
{
  "1m": 45, "5m": 55, "15m": 68, "1h": 72, "1d": 65
}
```

**Rule:** Higher timeframe signals carry more weight. A 1d buy signal overrides a 5m sell signal for positional traders.

### Output Schema

```json
{
  "symbol": "RELIANCE",
  "timestamp": "2026-07-24T10:45:00Z",
  "signal_strength": {
    "composite_score": 72.5,
    "category": "bullish",
    "confidence": 0.85,
    "indicators_aligned": 8,
    "indicators_total": 13,
    "divergence_detected": false,
    "timeframe_confluence": {
      "15m": 68,
      "1h": 72,
      "1d": 65,
      "confluence": "bullish_all"
    }
  }
}
```

### Performance

| Metric | Value |
|--------|-------|
| Signal Computation | < 3ms |
| All-Timeframe Aggregation | < 8ms |
