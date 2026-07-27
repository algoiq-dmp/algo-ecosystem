# 17 — Consumer: Delta XI

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Overview

**Delta XI** consumes Manthan's market intelligence as high-level features for machine learning models predicting regime changes, volatility shifts, and multi-timeframe market behavior.

## Features Consumed

| Manthan Output | ML Model |
|---------------|----------|
| Regime classification | Target label for Regime Prediction Model |
| Trend score | Feature for Price Direction Classifier |
| Breakout probability | Feature for Event Prediction Model |
| Volatility regime | Feature for Volatility Forecasting LSTM |
| Volume narrative | Feature for Anomaly Detection Autoencoder |
| OI signal | Feature for Sentiment Analysis Model |
| Liquidity score | Feature for Execution Quality Predictor |
| Confidence score | Meta-feature for Ensemble Weighting |

## Feature Format

```json
{
  "timestamp": "2026-07-24T15:00:00Z",
  "symbol": "NIFTY",
  "manthan_features": {
    "regime_id": 1,
    "trend_score": 72,
    "breakout_probability": 78,
    "volatility_regime_id": 2,
    "volume_narrative_id": 1,
    "oi_signal_id": 1,
    "liquidity_score": 82,
    "confidence_score": 78
  }
}
```

## Integration

Manthan publishes features to a Redis time-series database consumed by Delta XI's feature engineering pipeline every 1 minute for online inference.
