# 06 — Bollinger Bands & ATR

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Bollinger Bands

### Formula

```
Middle Band = SMA(N)
Upper Band = SMA(N) + (K × StdDev(N))
Lower Band = SMA(N) - (K × StdDev(N))
```

### Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `period` | 20 | 10–50 | SMA lookback |
| `stddev_multiplier` | 2.0 | 1.0–3.0 | Standard deviation multiplier |
| `source` | `close` | OHLC | Price field |

### Signal Interpretation

| Condition | Signal |
|-----------|--------|
| Price touches Upper Band | Overbought — potential reversal |
| Price touches Lower Band | Oversold — potential reversal |
| Price walks the Upper Band | Strong uptrend continuation |
| Price walks the Lower Band | Strong downtrend continuation |
| Bandwidth narrowing (squeeze) | Volatility contraction — breakout imminent |
| Bandwidth expanding | Volatility expansion — trend strengthening |

### Bollinger Squeeze Detection

```yaml
squeeze_threshold: 0.06  # 6% — narrowest in 6 months
```

When Bandwidth drops below 6-month minimum, Suchak flags a **Squeeze Alert**:

```
%B = (Price - Lower Band) / (Upper Band - Lower Band)
```

- %B > 1.0 → Price above upper band
- %B < 0.0 → Price below lower band
- %B = 0.5 → Price at middle band

### Bandwidth Formula

```
Bandwidth = (Upper Band - Lower Band) / Middle Band
```

---

## Average True Range (ATR)

### Formula

```
True Range = max(
    High - Low,
    |High - Close(prev)|,
    |Low - Close(prev)|
)
ATR = EMA(True Range, N)
```

### Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `period` | 14 | 5–50 | Smoothing periods |
| `smoothing` | `wilder` | wilder/sma/ema | Smoothing method |

### Applications

| Use Case | Formula |
|----------|---------|
| Trailing Stop | Entry ± (ATR × multiplier) |
| Position Sizing | Risk Amount / ATR |
| Volatility Filter | Skip trades when ATR < threshold |
| Breakout Confirmation | Price move > ATR × factor |

### ATR-Based Stop Loss

Suchak provides recommended stop levels:

```
Long Stop = Entry Price - (ATR × 2)
Short Stop = Entry Price + (ATR × 2)
```

### Normalized ATR (NATR)

```
NATR = (ATR / Close) × 100
```

NATR enables cross-symbol volatility comparison. E.g., NIFTY NATR of 1.2% vs BANKNIFTY NATR of 2.1%.

### Output Schema

```json
{
  "bollinger_bands": {
    "upper": 24650.30,
    "middle": 24410.30,
    "lower": 24170.30,
    "bandwidth": 0.0197,
    "percent_b": 0.62,
    "squeeze": false
  },
  "atr": {
    "value": 145.50,
    "natr_percent": 0.60,
    "stop_loss_long": 24119.00,
    "stop_loss_short": 24701.00
  },
  "signal": {
    "bb_position": "neutral",
    "squeeze_alert": false,
    "volatility_regime": "normal",
    "strength": 55
  }
}
```

### Performance

| Metric | Value |
|--------|-------|
| BB Compute | < 2ms |
| ATR Compute | < 1ms |
| Combined | < 3ms |
