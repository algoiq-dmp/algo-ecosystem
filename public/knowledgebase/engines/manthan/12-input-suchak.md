# 12 — Input: Suchak Indicators

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Overview

Manthan is the primary downstream consumer of **Suchak indicators**. All 15+ Suchak indicators serve as feature inputs for Manthan's analysis modules.

## Indicator Dependency Matrix

| Manthan Module | Suchak Indicators Required |
|---------------|--------------------------|
| Regime Classifier | ADX, EMA(50), EMA(200), RSI, SuperTrend, MACD |
| Trend Detector | EMA Ribbon (9,20,50,200), ADX, +DI/-DI |
| Breakout Scorer | Bollinger Bands, ATR, CPR, Pivot Levels |
| Volatility Regime | ATR, Bollinger Bands (width), NATR |
| Volume Analysis | VWAP, Volume data |
| OI Analysis | OI data (passthrough from Ganesh) |
| Liquidity | Bid/Ask data (from Lakshmi) |
| Confidence | All indicator values |

## Subscription Model

Manthan subscribes to Suchak's streaming endpoint:

```
POST /ws/v4/stream
{
  "consumer_id": "manthan",
  "symbols": ["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY"],
  "timeframes": ["1m", "5m", "15m", "1h", "1d"],
  "indicators": ["all"]
}
```

## Data Flow

```
Suchak → Redis Pub/Sub → Manthan Ingest → Pipeline Stages
```

Each bar update triggers:
1. Suchak computes all indicators
2. Publishes to `suchak:indicators:{symbol}:{timeframe}` channel
3. Manthan subscriber receives and fans out to pipeline stages

## Fallback

If Suchak is unavailable, Manthan falls back to internally computing a minimal set of indicators (EMA, RSI, ADX) directly from Ganesh OHLC data. This is flagged as "degraded mode."
