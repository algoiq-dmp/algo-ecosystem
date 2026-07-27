# 07 — Entry Logic

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Entry Logic defines the conditions under which a strategy opens a new position. Strategy Factory provides a comprehensive set of entry signal blocks that can be combined using logical gates (AND, OR, NOT) to create sophisticated entry criteria.

## Signal Categories

### Technical Indicators

| Signal | Parameters | Description |
|---|---|---|
| Moving Average Crossover | Fast MA period, Slow MA period, MA type (SMA/EMA/WMA) | Triggers when fast MA crosses above (long) or below (short) slow MA |
| RSI | Period, Oversold threshold, Overbought threshold | Triggers at RSI breach of configured thresholds |
| MACD | Fast, Slow, Signal periods | Triggers on MACD line crossing signal line |
| Bollinger Bands | Period, Std Dev multiplier | Triggers on price touching upper/lower band |
| Volume Spike | Period, Multiplier | Triggers when volume exceeds N× average |
| SuperTrend | Period, Multiplier | Trend-following trigger |

### Price Action

| Signal | Parameters | Description |
|---|---|---|
| Breakout | Lookback period, Threshold % | Triggers on price breaking above/below recent range |
| Candlestick Pattern | Pattern type | Triggers on specific candlestick formations (Doji, Engulfing, Hammer, etc.) |
| Support/Resistance | Zone tolerance % | Triggers on price approaching pre-mapped S/R zones |
| Opening Range Breakout | Range minutes | Triggers on break of the opening N-minute range |

### Derived & Composite

| Signal | Parameters | Description |
|---|---|---|
| Multi-Timeframe | Timeframes list, Signal type | Requires signal confirmation on multiple timeframes |
| News Sentiment | Source, Sentiment threshold | Triggers based on news sentiment analysis (requires Ganesh) |
| Custom Formula | Expression string | User-defined formula using OHLCV variables |

## Combining Signals

### AND Gate
All connected signals must fire simultaneously for entry.

### OR Gate
Any connected signal can trigger entry. Useful for multi-setup strategies.

### NOT Gate
Inverts a signal. E.g., "Enter when RSI < 30 AND NOT during earnings week."

### Weighted Composite
Assign weights to multiple signals. Entry fires when composite score crosses a configurable threshold.

## Entry Configuration

```json
{
  "entry": {
    "signals": [
      {
        "type": "ma_crossover",
        "params": { "fast": 20, "slow": 50, "ma_type": "EMA" }
      },
      {
        "type": "volume_spike",
        "params": { "period": 20, "multiplier": 1.5 }
      }
    ],
    "logic": "AND",
    "direction": "LONG",
    "cooldown": "5m",
    "maxEntriesPerDay": 10
  }
}
```

## Validation Rules

- At least one entry signal block is required.
- Entry direction (LONG/SHORT/BOTH) must be specified.
- Cooldown period is recommended to prevent overtrading.
- Conflicting signals (e.g., LONG + SHORT on same trigger) raise a warning.
