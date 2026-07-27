# 16 — Consumer: KuberAlpha

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Overview

**KuberAlpha** is the strategy execution and portfolio management engine. It is the heaviest consumer of Suchak indicators, using them for entry/exit signals, position sizing, stop-loss placement, and strategy rotation.

## Indicators Consumed

| Indicator | KuberAlpha Application |
|-----------|----------------------|
| Signal Strength (composite) | Entry confidence filter |
| SuperTrend | Primary trend direction for directional strategies |
| RSI | Overbought/oversold entry and exit triggers |
| MACD | Trend-following strategy signals |
| EMA Ribbon | Multi-timeframe trend alignment |
| ADX | Trend strength filter (avoid low ADX chop) |
| ATR | Dynamic position sizing and trailing stops |
| Bollinger Bands | Mean reversion entry zones |
| Support/Resistance | Profit target and stop-loss levels |
| Ichimoku | Comprehensive trend + momentum confirmation |
| CPR | Intraday breakout setups |
| Momentum | Trend acceleration / deceleration alerts |

## Integration Pattern

```
Suchak ──> Kafka Topic (suchak.indicators) ──> KuberAlpha Strategy Engines
                                                     │
                                                ┌────┴────┐
                                                │ Signal Bus │
                                                │ Order Manager │
                                                │ Risk Check │
                                                └─────────┘
```

## Strategy-Specific Configurations

### Directional Strategies

```yaml
strategy: "ema_crossover"
indicators:
  - type: EMA
    fast: 9
    slow: 21
  - type: ADX
    filter: 25  # Min ADX for entry
```

### Mean Reversion Strategies

```yaml
strategy: "bollinger_reversal"
indicators:
  - type: BollingerBands
    period: 20
    entry_zone: "%b < 0.1 or %b > 0.9"
  - type: RSI
    period: 2
    entry: "RSI < 5 or RSI > 95"
```

### Breakout Strategies

```yaml
strategy: "cpr_breakout"
indicators:
  - type: CPR
    width_threshold: 0.4%  # Narrow CPR
  - type: Volume
    surge_factor: 1.5x     # Volume confirmation
```

## Portfolio-Level Usage

KuberAlpha uses Suchak signals for **strategy rotation**:

| Market Condition | Suchak Signal | Active Strategies |
|-----------------|---------------|-------------------|
| Strong trend, high ADX | Bullish + ADX > 30 | Trend following |
| Range-bound, low ADX | ADX < 20 | Mean reversion |
| High volatility | ATR > 1.5x avg | Options selling |
| Low volatility | BB squeeze | Breakout anticipation |

## Position Sizing with ATR

```
Shares = (Account Risk %) / (ATR × Stop Multiplier)
```

## SLA

| Metric | Target |
|--------|--------|
| Throughput | 500+ signals/sec |
| Latency | < 30ms |
| Reliability | 99.95% |
