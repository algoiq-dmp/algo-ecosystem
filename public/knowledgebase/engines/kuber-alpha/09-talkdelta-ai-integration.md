# 09 — TalkDelta AI Integration

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

TalkDelta AI is an AI-powered conversational trading assistant that generates signals through natural language interaction, sentiment analysis, and real-time market reasoning. It is the most advanced signal source, using large language models fine-tuned on financial data.

## Signal Profile

| Property | Description |
|---|---|
| Source | AI-powered conversational trading engine |
| Medium | NLP-generated structured signals |
| Typical signals/day | 50–500 |
| Instruments | All instruments accessible via Algo-IQ |
| Timeframe | Adaptable (intraday to swing) |
| Confidence | AI-derived probability with reasoning trace |

## Integration Flow

```
TalkDelta AI Engine
        │
        ├── User query or automated analysis
        ├── LLM processes market data + context
        ├── Signal generated with reasoning
        │
        ▼
    MQ: talkdelta.signal.{model}.{confidence}
        │
        ▼
  Kuber Alpha Signal Ingestor
        │
        ├── Validate AI model signature
        ├── Review reasoning trace
        ├── Apply confidence-based routing
        ├── Activate strategy
        └── Dispatch to Vega
```

## Signal Format (TalkDelta-Specific)

```json
{
  "signalId": "td-20260724-001",
  "source": "talkdelta-ai",
  "timestamp": "2026-07-24T09:16:00Z",
  "expiresAt": "2026-07-24T09:21:00Z",
  "instrument": "INFY",
  "exchange": "NSE",
  "direction": "LONG",
  "type": "ENTRY",
  "confidence": 0.94,
  "metadata": {
    "model": "talkdelta-finbert-v4",
    "modelVersion": "4.1.0",
    "strategyId": "sf-td-sentiment",
    "reasoning": "Positive earnings surprise detected in Q1 results. Sentiment score: 0.87. Volume spike: +300%. Technical confirmation: breakout above 50 DMA.",
    "dataSources": ["earnings_transcript", "news_sentiment", "technical_indicators", "social_media_sentiment"],
    "contextWindow": "2026-07-24T08:00:00Z/2026-07-24T09:16:00Z"
  },
  "payload": {
    "entryPrice": 1600.00,
    "targetPrice": 1650.00,
    "stopPrice": 1575.00,
    "quantity": 125,
    "aiSuggestion": "Consider scaling in: 50% now, 50% after 10:00 AM confirmation"
  }
}
```

## Confidence Routing

| Confidence | Routing | Position Size |
|---|---|---|
| ≥ 0.90 | HIGH priority, full allocation | 100% of configured size |
| 0.80–0.89 | HIGH priority, standard allocation | 100% |
| 0.70–0.79 | NORMAL priority | 75% |
| 0.60–0.69 | LOW priority | 50% |
| < 0.60 | Drop or route to manual review | 0% |

## AI Suggestions

TalkDelta can include execution suggestions:
- **Scale In**: Kuber Alpha splits the order into phases.
- **Scale Out**: Kuber Alpha sets up partial exits.
- **Contingent Orders**: "If X happens, then do Y" — Kuber Alpha sets conditional orders.

## Reasoning Transparency

Every TalkDelta signal includes a reasoning trace. Kuber Alpha:
- Logs reasoning for audit.
- Surfaces reasoning in monitoring dashboards.
- Uses reasoning quality as input to model performance tracking.

## Model Drift Detection

Kuber Alpha monitors TalkDelta model performance:
- Tracks confidence vs. actual P&L correlation.
- Alerts if model performance degrades beyond threshold.
- Can auto-reduce position sizes for underperforming models.

## Monitoring

| Metric | Description |
|---|---|
| `talkdelta.signals.received` | Signals from TalkDelta AI |
| `talkdelta.confidence.accuracy` | Confidence vs. realized P&L |
| `talkdelta.model.performance` | Per-model profitability |
| `talkdelta.reasoning.quality` | Reasoning trace length & coherence |
| `talkdelta.suggestion.adoption` | How often AI suggestions are followed |
