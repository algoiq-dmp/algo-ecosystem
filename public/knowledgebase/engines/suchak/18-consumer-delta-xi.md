# 18 — Consumer: Delta XI

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Overview

**Delta XI** is the AI/ML model layer of the Algo IQ Ecosystem. It consumes Suchak's indicator data as features for machine learning models that predict price direction, volatility, and regime shifts.

## Data Consumed

| Data Type | ML Application |
|-----------|---------------|
| Raw indicator values | Feature vectors for prediction models |
| Normalized signals (-100 to +100) | Input normalization for neural networks |
| Signal strength (0-100) | Confidence weighting in ensemble models |
| Support/Resistance levels | Target price prediction |
| Momentum data | Trend classification labels |
| Divergence flags | Binary features for reversal prediction |
| Multi-timeframe indicator snapshots | Temporal feature engineering |

## Integration Pattern

```
Suchak ──> WebSocket Stream ──> Delta XI Feature Pipeline
                                       │
                                  ┌────┴────┐
                                  │ Feature Store │
                                  │ (Redis/Flink) │
                                  └────┬────┘
                                       │
                                  ┌────┴────┐
                                  │ ML Models │
                                  │ (PyTorch) │
                                  └─────────┘
```

## Feature Engineering

Delta XI transforms Suchak outputs into ML-ready features:

### 1. Indicator Ratios

```
EMA_Ratio = EMA(20) / EMA(50)
RSI_Normalized = (RSI - 50) / 20
BB_Position = %B (already 0-1)
```

### 2. Temporal Features

```
RSI_Change_5m = RSI(t) - RSI(t-5min)
MACD_Histogram_Slope = Histogram(t) - Histogram(t-3)
Volume_Delta = Volume / SMA(Volume, 20)
```

### 3. Cross-Sectional Features

```
Relative_Strength = Symbol_ROC / Sector_ROC
ATR_Quotient = Symbol_ATR / Index_ATR
```

## Model Types Consuming Suchak

| Model | Suchak Features Used |
|-------|---------------------|
| Price Direction Classifier (LSTM) | 15-indicator vector per timestep |
| Volatility Predictor (XGBoost) | ATR, BB width, ADX |
| Regime Classifier (Random Forest) | ADX, RSI, MACD, SuperTrend |
| Anomaly Detector (Autoencoder) | Full indicator suite for reconstruction error |
| Reinforcement Learning Agent | Signal strength + support/resistance as state |

## Feature Store Schema

```json
{
  "feature_vector": {
    "timestamp": "2026-07-24T12:00:00Z",
    "symbol": "NIFTY",
    "features": [
      {"name": "ema_9", "value": 24530.5},
      {"name": "ema_20", "value": 24480.2},
      {"name": "rsi_14", "value": 62.4},
      {"name": "macd_histogram", "value": 7.1},
      {"name": "adx", "value": 32.5},
      {"name": "bb_percent_b", "value": 0.62},
      {"name": "atr_natr", "value": 0.60},
      {"name": "supertrend_direction", "value": 1},
      {"name": "signal_strength", "value": 72.5}
    ]
  }
}
```

## Online Inference

- Feature vectors compiled **every 1 minute**
- Models predict **next 5-min, 15-min, 1-hour** direction
- Predictions fed back to KuberAlpha and Vega for strategy adjustments

## SLA

| Metric | Target |
|--------|--------|
| Feature freshness | < 5s |
| Throughput | 1000+ feature vectors/sec |
| Historical export | 5 years available |
