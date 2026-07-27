# 07 — Delta XI Integration

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Delta XI is a quantitative signal engine that generates systematic trading signals based on statistical models, machine learning, and quantitative finance techniques. Kuber Alpha ingests Delta XI signals with high precision requirements due to their systematic nature.

## Signal Profile

| Property | Description |
|---|---|
| Source | Quantitative models (statistical, ML, quant finance) |
| Medium | Automated signal pipeline |
| Typical signals/day | 500–5000 |
| Instruments | All NSE-listed instruments (equity, F&O, currency) |
| Timeframe | Multi-timeframe (1m, 5m, 15m, 1h, 1d) |
| Confidence | Model-derived probability (0.0–1.0) |

## Integration Flow

```
Delta XI Engine
        │
        ├── Model generates signal
        ├── Backtesting validation
        ├── Confidence score assigned
        │
        ▼
    MQ: delta-xi.signal.{product}.{type}
        │
        ▼
  Kuber Alpha Signal Ingestor
        │
        ├── Validate model signature
        ├── Cross-reference with Ganesh data
        ├── Match to strategy
        ├── Apply position sizing
        └── Dispatch to Vega
```

## Signal Format (Delta XI-Specific)

```json
{
  "signalId": "dxi-20260724-001",
  "source": "delta-xi",
  "timestamp": "2026-07-24T09:16:00Z",
  "expiresAt": "2026-07-24T09:17:00Z",
  "instrument": "RELIANCE",
  "exchange": "NSE",
  "direction": "SHORT",
  "type": "ENTRY",
  "confidence": 0.92,
  "metadata": {
    "modelId": "lstm-v3",
    "modelVersion": "3.2.1",
    "productType": "FUTURES",
    "strategyId": "sf-dxi-momentum",
    "backtestSharpe": 1.8,
    "features": ["momentum", "volatility", "volume_profile"]
  },
  "payload": {
    "entryPrice": 2450.00,
    "targetPrice": 2425.00,
    "stopPrice": 2462.50,
    "quantity": 250,
    "positionSizeModel": "volatility_adjusted"
  }
}
```

## Model Signature Verification

Delta XI signals include a model signature for authenticity:

```
HMAC-SHA256(modelId + signalId + timestamp, shared_secret)
```

Kuber Alpha verifies this signature before processing. Invalid signatures are rejected and logged as security events.

## Strategy Matching

| Method | Priority |
|---|---|
| Explicit `strategyId` in metadata | 1 (highest) |
| Model-to-strategy mapping table | 2 |
| Instrument + Direction + Timeframe | 3 |
| Default fallback strategy | 4 (lowest) |

## Position Sizing Override

Delta XI can suggest a position sizing model that overrides the strategy default:

| Model | Behavior |
|---|---|
| `volatility_adjusted` | Size based on current ATR |
| `kelly` | Size based on model's historical edge |
| `fixed` | Fixed quantity from signal payload |
| `strategy_default` | Use strategy's configured model |

## Monitoring

| Metric | Description |
|---|---|
| `dxi.signals.received` | Signals from Delta XI |
| `dxi.signals.invalid_signature` | Rejected due to signature mismatch |
| `dxi.signals.model_performance` | Per-model activation and P&L |
| `dxi.signals.confidence_distribution` | Histogram of confidence levels |
| `dxi.signals.latency_ms` | Time from Delta XI publish to Kuber Alpha receipt |
