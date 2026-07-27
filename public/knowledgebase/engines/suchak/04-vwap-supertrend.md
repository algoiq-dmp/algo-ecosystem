# 04 — VWAP & SuperTrend

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Volume Weighted Average Price (VWAP)

### Formula

```
VWAP = Σ(Price_i × Volume_i) / Σ(Volume_i)
```

VWAP is calculated cumulatively from the start of each trading session and resets daily.

### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `reset` | `daily` | Reset cadence (daily/weekly) |
| `anchor` | `session_open` | Calculation anchor point |

### Signal Interpretation

| Condition | Interpretation |
|-----------|----------------|
| Price > VWAP | Bullish intraday bias |
| Price < VWAP | Bearish intraday bias |
| Price crosses above VWAP | Buy signal (institutions accumulating) |
| Price crosses below VWAP | Sell signal (institutions distributing) |
| Price far above VWAP (>2σ) | Overextended — reversion likely |
| Price far below VWAP (>2σ) | Oversold — bounce likely |

### Standard Deviation Bands

Suchak computes VWAP ± 1σ, 2σ, 3σ bands:

```
Upper Band(n) = VWAP + (n × VWAP_StdDev)
Lower Band(n) = VWAP - (n × VWAP_StdDev)
```

### Use in Execution

VWAP is the industry benchmark for execution quality:
- Buy below VWAP = good execution
- Sell above VWAP = good execution

---

## SuperTrend

### Formula

```
Upper Band = (High + Low) / 2 + (Multiplier × ATR)
Lower Band = (High + Low) / 2 - (Multiplier × ATR)

SuperTrend = {
    Lower Band,  if SuperTrend(prev) = Upper Band and Close > Lower Band
    Upper Band,  if SuperTrend(prev) = Lower Band and Close < Upper Band
    Upper Band,  if Close <= Lower Band (flip to downtrend)
    Lower Band,  if Close >= Upper Band (flip to uptrend)
}
```

### Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `atr_period` | 10 | 5–50 | ATR lookback |
| `multiplier` | 3.0 | 1.5–5.0 | Band width multiplier |

### Signal Interpretation

| Condition | Signal |
|-----------|--------|
| Price closes above SuperTrend | Buy / Long |
| Price closes below SuperTrend | Sell / Short |
| SuperTrend line color flips | Trend reversal |
| Narrow band | Low volatility — breakout imminent |
| Wide band | High volatility — trend likely to continue |

### Multi-Timeframe SuperTrend

Suchak supports nested SuperTrend for confirmation:

```yaml
supertrend:
  - period: 10, multiplier: 3.0, timeframe: "15m"  # Entry
  - period: 10, multiplier: 3.0, timeframe: "1h"   # Filter
```

**Rule:** Only take 15m buy signals when 1h SuperTrend is also bullish.

### Output Schema

```json
{
  "symbol": "BANKNIFTY",
  "timeframe": "15m",
  "timestamp": "2026-07-24T10:30:00Z",
  "vwap": {
    "value": 52450.75,
    "upper_1sd": 52580.20,
    "lower_1sd": 52321.30,
    "upper_2sd": 52709.65,
    "lower_2sd": 52191.85,
    "deviation_percent": 0.45
  },
  "supertrend": {
    "value": 52300.00,
    "direction": "up",
    "atr": 145.30,
    "band_width": 290.60
  },
  "signal": {
    "vwap_position": "above",
    "supertrend": "bullish",
    "confluence": true,
    "strength": 78
  }
}
```

### Performance

| Metric | Value |
|--------|-------|
| VWAP Compute | < 2ms |
| SuperTrend Compute | < 3ms |
| VWAP + Bands | < 5ms |
