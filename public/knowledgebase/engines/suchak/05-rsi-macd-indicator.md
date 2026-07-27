# 05 — RSI & MACD

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Relative Strength Index (RSI)

### Formula

```
RSI = 100 - (100 / (1 + RS))
RS = Average Gain(N) / Average Loss(N)
```

Where Average Gain/Loss uses Wilder's smoothing (exponential moving average of gains/losses).

### Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `period` | 14 | 5–30 | Lookback periods |
| `source` | `close` | OHLC | Price field |
| `overbought` | 70 | 60–90 | Overbought threshold |
| `oversold` | 30 | 10–40 | Oversold threshold |

### Signal Interpretation

| Condition | Signal | Strength |
|-----------|--------|----------|
| RSI > 70 | Overbought — potential reversal down | 60-80 |
| RSI < 30 | Oversold — potential reversal up | 60-80 |
| RSI crosses above 50 | Bullish momentum shift | 50-70 |
| RSI crosses below 50 | Bearish momentum shift | 50-70 |
| RSI divergence (price higher high, RSI lower high) | Bearish divergence | 80-100 |
| RSI divergence (price lower low, RSI higher low) | Bullish divergence | 80-100 |
| RSI > 80 | Extreme overbought | 90-100 |
| RSI < 20 | Extreme oversold | 90-100 |

### RSI-Based Strategies

- **RSI(2) Mean Reversion** — Enter when RSI(2) < 10 (buy) or > 90 (sell)
- **RSI Range Shift** — RSI staying above 60 = strong trend; below 40 = weak
- **RSI Failure Swings** — Break of RSI trendline confirming reversal

---

## Moving Average Convergence Divergence (MACD)

### Formula

```
MACD Line = EMA(12) - EMA(26)
Signal Line = EMA(9) of MACD Line
Histogram = MACD Line - Signal Line
```

### Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `fast_period` | 12 | 8–50 | Fast EMA period |
| `slow_period` | 26 | 15–100 | Slow EMA period |
| `signal_period` | 9 | 5–20 | Signal line smoothing |

### Signal Interpretation

| Condition | Signal |
|-----------|--------|
| MACD crosses above Signal | Bullish crossover |
| MACD crosses below Signal | Bearish crossover |
| MACD crosses above Zero | Trend turning bullish |
| MACD crosses below Zero | Trend turning bearish |
| Histogram rising | Momentum accelerating |
| Histogram falling | Momentum decelerating |

### Divergence Detection

Suchak automatically detects MACD divergences:

- **Bullish Divergence:** Price lower low + MACD higher low
- **Bearish Divergence:** Price higher high + MACD lower high
- **Hidden Bullish Divergence:** Price higher low + MACD lower low (trend continuation)
- **Hidden Bearish Divergence:** Price lower high + MACD higher high (trend continuation)

### Output Schema

```json
{
  "rsi": {
    "value": 62.4,
    "condition": "neutral",
    "divergence": null,
    "overbought": false,
    "oversold": false
  },
  "macd": {
    "macd_line": 45.20,
    "signal_line": 38.10,
    "histogram": 7.10,
    "crossover": "bullish",
    "zero_cross": "above",
    "divergence": null
  },
  "signal": {
    "rsi_momentum": "bullish",
    "macd_trend": "bullish",
    "confluence": true,
    "strength": 68
  }
}
```

### Performance

| Metric | Value |
|--------|-------|
| RSI Compute | < 1ms |
| MACD Compute | < 2ms |
| Combined | < 3ms |
