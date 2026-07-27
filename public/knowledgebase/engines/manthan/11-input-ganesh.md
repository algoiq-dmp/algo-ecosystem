# 11 — Input: Ganesh OHLC

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Overview

Manthan consumes **Ganesh OHLC** data as its primary price input for regime classification, trend analysis, breakout detection, volatility measurement, and volume analysis.

## Data Requirements

| Field | Used By |
|-------|---------|
| Open | Gap analysis, CPR, pivot calculations |
| High | True Range, SuperTrend feed, swing detection |
| Low | True Range, SuperTrend feed, swing detection |
| Close | All moving averages, RSI, MACD, ROC |
| Volume | Volume analysis, VWAP, volume profile |

## Timeframe Requirements

Manthan requires multi-timeframe data for consistency analysis:

| Timeframe | Min Bars Required | Purpose |
|-----------|------------------|---------|
| 1m | 375 | Intraday microstructure |
| 5m | 200 | Short-term trend & volume |
| 15m | 200 | Swing analysis |
| 1h | 200 | Medium-term trend |
| 1d | 500 | Long-term regime & volatility cone |

## Data Quality Rules

| Issue | Handling |
|-------|----------|
| Missing bar | Interpolate; flag as "estimated" |
| Gap > 3 bars | Skip; flag regime as "uncertain" |
| Anomalous volume | Exclude from RVOL calculation |
| Corporate action date | Request adjusted data from Ganesh |

## Connection

```yaml
ganesh:
  host: ganesh.internal.algoiq.io
  grpc_port: 9090
  service: GaneshDataService
  stream_method: SubscribeOHLC
  reconnect:
    strategy: exponential_backoff
    max_interval: 30s
```
