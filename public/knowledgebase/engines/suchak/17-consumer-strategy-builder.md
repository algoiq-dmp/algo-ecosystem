# 17 — Consumer: Strategy Builder

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Overview

**Strategy Builder** is the visual strategy construction and backtesting platform. It consumes Suchak's indicator catalog and historical data to allow users to design, test, and deploy algorithmic trading strategies.

## Indicators Consumed

| Feature | Suchak Data Used |
|---------|-----------------|
| Indicator Palette | Full catalog of 15+ indicators |
| Parameter Ranges | Valid ranges, defaults, descriptions |
| Historical Values | 5+ years of indicator history for backtesting |
| Signal Definitions | Buy/sell signal logic per indicator |
| Composite Signals | Signal strength and confluence scoring |

## Integration Pattern

```
┌──────────┐     REST API      ┌──────────────┐
│ Strategy  │<────────────────>│ Suchak Query  │
│ Builder   │                   │ Service       │
│           │<────────────────>│               │
│ (Browser) │     WebSocket     │ Historical    │
│           │                   │ + Realtime    │
└──────────┘                   └──────────────┘
```

## Key Endpoints Consumed

### Indicator Catalog

```
GET /api/v4/indicators/catalog
```

Returns all available indicators with metadata:

```json
{
  "indicators": [
    {
      "id": "ema",
      "name": "Exponential Moving Average",
      "category": "trend",
      "parameters": [
        {"name": "period", "type": "int", "default": 20, "min": 5, "max": 200}
      ],
      "signals": ["cross_above", "cross_below", "price_position"],
      "documentation_url": "03-ema-sma-indicator.md"
    }
  ]
}
```

### Historical Indicator Data

```
GET /api/v4/indicators/historical?symbol=NIFTY&timeframe=1d&indicators=ema_20,rsi_14,macd&from=2025-01-01&to=2026-07-24
```

### Replay Mode

```
POST /api/v4/indicators/replay
{
  "symbol": "NIFTY",
  "timeframe": "1d",
  "speed": "10x",
  "from": "2025-01-01"
}
```

Streams indicator values as if they were live, enabling walk-forward testing.

## Strategy Building Blocks

Strategy Builder presents Suchak indicators as drag-and-drop blocks:

```
┌──────────────────────────────────────┐
│  ENTRY CONDITIONS                     │
│  ┌────────────┐    ┌──────────────┐  │
│  │ EMA(9) >   │    │ RSI(14) < 30 │  │
│  │ EMA(21)    │    │              │  │
│  └────────────┘    └──────────────┘  │
│                        AND            │
│  ┌────────────────────────────────┐  │
│  │ ADX(14) > 25                  │  │
│  └────────────────────────────────┘  │
│                                       │
│  EXIT CONDITIONS                      │
│  ┌────────────┐    ┌──────────────┐  │
│  │ RSI > 70   │ OR │ SuperTrend   │  │
│  │            │    │ flips down   │  │
│  └────────────┘    └──────────────┘  │
└──────────────────────────────────────┘
```

## Backtest Metrics (Powered by Suchak)

| Metric | Description |
|--------|-------------|
| Win Rate | % of profitable trades |
| Sharpe Ratio | Risk-adjusted returns |
| Max Drawdown | Largest peak-to-trough decline |
| Profit Factor | Gross profit / Gross loss |
| Avg. Holding Period | Derived from signal durations |

## SLA

| Metric | Target |
|--------|--------|
| Catalog load | < 100ms |
| Historical query (1yr) | < 2s |
| Replay stream latency | < 50ms |
