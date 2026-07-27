# 10 — Confidence Scoring

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Overview

The **Confidence Scoring** module is the meta-analysis layer that aggregates all Manthan analysis outputs into a single, calibrated confidence score representing how reliable the current market assessment is.

## Confidence Components

### 1. Signal Agreement (40%)

Measures how consistently all analysis modules point in the same direction:

```
Agreement = Count(modules agreeing on direction) / Total_Modules
```

| Agreement | Score |
|-----------|-------|
| 7-8 modules aligned | 100 |
| 5-6 modules aligned | 75 |
| 3-4 modules aligned | 45 |
| 1-2 modules aligned | 20 |

### 2. Multi-Timeframe Consistency (25%)

How consistent are signals across timeframes:

```
TF_Consistency = Max(score) / Min(score) for all TFs
```

| Consistency Ratio | Score |
|------------------|-------|
| < 1.2 | 100 (high consistency) |
| 1.2–1.5 | 75 |
| 1.5–2.0 | 45 |
| > 2.0 | 20 (conflicting TFs) |

### 3. Historical Accuracy (20%)

Weighted by the historical predictive accuracy of each module in similar conditions:

```
Historical_Weight = Past accuracy of module in current regime type
```

### 4. Data Quality (15%)

| Quality Factor | Impact |
|---------------|--------|
| All data sources connected | +0 |
| 1 source stale/degraded | -20 |
| 2+ sources degraded | -40 |
| Recent gap in data | -15 |

## Confidence Levels

| Score | Level | Action Recommendation |
|-------|-------|---------------------|
| 80–100 | Very High | Execute with full conviction |
| 60–79 | High | Execute with normal conviction |
| 40–59 | Moderate | Cautious execution; reduce size |
| 20–39 | Low | Paper trade only; no live execution |
| 0–19 | Very Low | No action; wait for clarity |

## Confidence Decay

Confidence naturally decays during periods without new data:

```
Decayed_Confidence = Confidence × e^(-λt)

λ = 0.05/min  (half-life ≈ 14 minutes)
```

## Override Signals

Certain conditions override even high confidence:

| Override | Condition |
|----------|-----------|
| **Circuit Breaker** | Price at upper/lower circuit |
| **News Event** | High-impact economic data release |
| **Liquidity Crunch** | Depth drops below threshold |
| **Extreme Volatility** | VIX > 35 equivalent |

### Output Schema

```json
{
  "symbol": "NIFTY",
  "timestamp": "2026-07-24T14:15:00Z",
  "confidence": {
    "score": 78,
    "level": "high",
    "agreement": {"modules_agreeing": 6, "total": 8, "score": 75},
    "tf_consistency": {"ratio": 1.18, "score": 100},
    "historical_weight": 0.82,
    "data_quality": 95,
    "overrides_active": [],
    "decayed": false,
    "recommended_action": "execute_with_normal_conviction"
  },
  "signal": {"strength": 78}
}
```

### Performance

| Metric | Value |
|--------|-------|
| Confidence aggregation | < 5ms |
