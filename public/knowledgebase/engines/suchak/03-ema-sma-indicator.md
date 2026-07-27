# 03 — EMA & SMA Indicators

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Exponential Moving Average (EMA)

### Formula

```
EMA(t) = (Price(t) × k) + (EMA(t-1) × (1 - k))
where k = 2 / (N + 1)
```

### Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `period` | 20 | 5–200 | Lookback periods |
| `source` | `close` | OHLC | Price field used |
| `timeframe` | `1d` | All | Supported timeframes |

### Signal Interpretation

| Condition | Signal |
|-----------|--------|
| Price > EMA | Bullish (uptrend) |
| Price < EMA | Bearish (downtrend) |
| EMA slope increasing | Momentum strengthening |
| EMA slope flattening | Trend weakening |
| Fast EMA crosses above Slow EMA | Golden Cross (bullish) |
| Fast EMA crosses below Slow EMA | Death Cross (bearish) |

### Common Periods

| Period | Usage |
|--------|-------|
| 9 | Short-term trend / scalping |
| 20 | Swing trading |
| 50 | Intermediate trend |
| 200 | Long-term trend / institutional |

---

## Simple Moving Average (SMA)

### Formula

```
SMA = (P₁ + P₂ + ... + Pₙ) / N
```

### Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `period` | 20 | 5–200 | Lookback periods |
| `source` | `close` | OHLC | Price field used |

### EMA vs. SMA Comparison

| Feature | EMA | SMA |
|---------|-----|-----|
| Responsiveness | High (weights recent data) | Low (equal weight) |
| Lag | Less lag | More lag |
| Noise Sensitivity | Higher | Lower |
| Best For | Trending markets | Range-bound markets |
| Crossovers | Earlier signals | Fewer false signals |

### Ribbon Configuration

Suchak supports multi-EMA/SMA "ribbon" mode:

```yaml
ema_ribbon:
  periods: [9, 13, 20, 34, 50, 72, 100, 200]
  display_order: ascending
```

When ribbon is ascending (short < long) → strong uptrend.
When ribbon is descending (short > long) → strong downtrend.

### Output Schema

```json
{
  "symbol": "NIFTY",
  "timeframe": "1d",
  "timestamp": "2026-07-24T10:15:00Z",
  "ema": {
    "9": 24532.50,
    "20": 24410.30,
    "50": 24100.75,
    "200": 23500.00
  },
  "sma": {
    "20": 24405.10,
    "50": 24115.20
  },
  "signal": {
    "ema_cross": "bullish",
    "price_vs_ema_200": "above",
    "strength": 72
  }
}
```

### Performance

| Metric | Value |
|--------|-------|
| Compute Time (single EMA) | < 1ms |
| Compute Time (8-EMA ribbon) | < 3ms |
| Memory per symbol | ~2KB |
