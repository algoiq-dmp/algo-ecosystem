# Suchak Engine

> **Version:** 4.1.0 | **Owner:** Analytics | **Health:** 99.9% | **Last Updated:** 2026-07-24

## Overview

Suchak is the **Trading Technical Indicator Engine** within the Strategy Intelligence Layer of the Algo IQ Ecosystem. It computes 15+ battle-tested technical indicators on streaming market data and serves indicator signals to downstream consumers.

## Key Metrics

| Metric | Value |
|--------|-------|
| Indicators Supported | 15+ |
| Data Sources | Ganesh OHLC, Lakshmi Live |
| Uptime SLA | 99.9% |
| Avg. Computation Latency | < 50ms |
| Consumers | DXCC, KuberAlpha, Strategy Builder, Delta XI, TalkDelta AI |

## Indicator Catalog

| # | Indicator | Category |
|---|-----------|----------|
| 1 | EMA (Exponential Moving Average) | Trend |
| 2 | SMA (Simple Moving Average) | Trend |
| 3 | VWAP (Volume Weighted Average Price) | Volume |
| 4 | SuperTrend | Trend |
| 5 | RSI (Relative Strength Index) | Momentum |
| 6 | MACD (Moving Average Convergence Divergence) | Momentum |
| 7 | Bollinger Bands | Volatility |
| 8 | ATR (Average True Range) | Volatility |
| 9 | ADX (Average Directional Index) | Trend Strength |
| 10 | Stochastic Oscillator | Momentum |
| 11 | Ichimoku Cloud | Composite |
| 12 | Pivot Levels | Support/Resistance |
| 13 | CPR (Central Pivot Range) | Support/Resistance |

## Output Signals

- **Indicator Values** — Raw and normalized indicator readings
- **Signal Strength** — Bullish/Bearish intensity scoring (0-100)
- **Support & Resistance** — Key price levels derived from pivots and bands
- **Momentum** — Rate-of-change and trend acceleration metrics

## Quick Links

- [Overview & Purpose](01-overview.md)
- [Architecture](02-architecture.md)
- [API Reference](20-api-endpoints.md)
- [Configuration](21-configuration.md)
- [Glossary](24-glossary.md)
