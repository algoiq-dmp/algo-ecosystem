# 19 — Consumer: TalkDelta AI

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Overview

**TalkDelta AI** is the conversational intelligence layer that provides natural language market insights to users. It consumes Suchak's indicator data to generate human-readable market commentary, alert narratives, and Q&A responses.

## Data Consumed

| Data Type | Application |
|-----------|-------------|
| Signal strength summary | "Market is showing strong bullish momentum" |
| Indicator crossovers | "EMA 9 just crossed above EMA 21" |
| Divergence alerts | "Bearish RSI divergence detected on daily chart" |
| S/R levels | "Key resistance at 24800, support at 24350" |
| Volatility metrics | "ATR indicates elevated volatility today" |
| Momentum data | "Momentum is accelerating to the upside" |

## Integration Pattern

```
Suchak ──> gRPC ──> TalkDelta NLP Pipeline
                          │
                     ┌────┴────┐
                     │ Template Engine │
                     │ LLM (GPT-based)│
                     │ Voice TTS      │
                     └─────────┘
```

## Alert Templates

TalkDelta converts Suchak signals into natural language:

### Template: Trend Change

```
"{{symbol}} has flipped to a {{direction}} trend on the {{timeframe}} chart.
SuperTrend turned {{direction}} at {{st_value}}. 
Signal strength: {{strength}}/100."
```

### Template: Divergence Alert

```
"Caution: {{divergence_type}} divergence detected on {{symbol}} {{timeframe}}.
Price made a {{price_action}} while {{indicator}} made a {{indicator_action}}.
This suggests a potential {{reversal_type}} reversal."
```

### Template: S/R Test

```
"{{symbol}} is approaching {{level_type}} {{level_name}} at {{price_value}}.
This level has been tested {{touches}} times.
A breakout above could target {{next_resistance}}."
```

## Sentiment Classification

| Signal Strength Range | TalkDelta Sentiment |
|----------------------|---------------------|
| 80–100 | "Strongly Bullish" |
| 60–79 | "Bullish" |
| 40–59 | "Moderately Bullish" |
| -39 to 39 | "Neutral / Range-bound" |
| -59 to -40 | "Moderately Bearish" |
| -79 to -60 | "Bearish" |
| -100 to -80 | "Strongly Bearish" |

## User Interaction Flows

### 1. "What's the market doing?"

```
TalkDelta → Suchak gRPC: GetSignalStrength("NIFTY", "1d")
Suchak → TalkDelta: {strength: 72.5, category: "bullish", confluence: "all_tf"}
TalkDelta → User: "NIFTY is showing strong bullish momentum at 72/100. 
All timeframes from 15m to daily are aligned bullish. 
Key support at 24350, resistance at 24800."
```

### 2. "Should I buy RELIANCE?"

```
TalkDelta → Suchak: GetFullIndicator("RELIANCE")
Suchak → TalkDelta: Full indicator package
TalkDelta → User: "RELIANCE technicals are mixed. RSI at 62 is neutral-bullish, 
MACD is bullish but histogram is flattening. SuperTrend is up. 
Ichimoku shows strong buy signal above the cloud. 
Best entry near VWAP at 2450. Caution: approaching resistance at 2520."
```

## SLA

| Metric | Target |
|--------|--------|
| gRPC response time | < 30ms |
| Alert generation latency | < 100ms |
| Voice TTS end-to-end | < 1s |
