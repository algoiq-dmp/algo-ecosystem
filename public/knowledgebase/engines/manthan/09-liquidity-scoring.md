# 09 — Liquidity Scoring

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Overview

The **Liquidity Scoring** module evaluates market depth, bid-ask spreads, and impact cost to produce a liquidity quality score. This is critical for execution engines to determine optimal order sizing and execution strategies.

## Liquidity Dimensions

### 1. Bid-Ask Spread (30% weight)

```
Spread% = (Ask - Bid) / ((Ask + Bid) / 2) × 100
```

| Spread% | Score | Interpretation |
|---------|-------|---------------|
| < 0.01% | 100 | Excellent (tightest spreads) |
| 0.01–0.03% | 85 | Good |
| 0.03–0.05% | 65 | Average |
| 0.05–0.10% | 40 | Below average |
| > 0.10% | 15 | Poor (avoid large orders) |

### 2. Market Depth (35% weight)

```
Depth Ratio = Sum(Bid_Qty at top 5 levels) / Avg_Daily_Volume
```

| Depth Ratio | Score |
|-------------|-------|
| > 10% | 100 (deep market) |
| 5–10% | 75 |
| 2–5% | 50 |
| < 2% | 20 (thin market) |

### 3. Impact Cost (25% weight)

```
Impact Cost = Price movement caused by hypothetical Rs. 10 Lakh order
```

| Impact Cost | Score |
|-------------|-------|
| < 0.05% | 100 (negligible impact) |
| 0.05–0.10% | 80 |
| 0.10–0.25% | 55 |
| 0.25–0.50% | 30 |
| > 0.50% | 10 (high impact, avoid) |

### 4. Volume Consistency (10% weight)

```
Vol_CV = StdDev(Volume_5m, 20) / Mean(Volume_5m, 20)
```

| CV | Score |
|----|-------|
| < 0.3 | 100 (consistent liquidity) |
| 0.3–0.5 | 75 |
| > 0.5 | 40 (erratic liquidity) |

## Composite Liquidity Score

```
Liquidity_Score = 0.30 × Spread_Score + 0.35 × Depth_Score + 0.25 × Impact_Score + 0.10 × Consistency_Score
```

| Score | Rating | Max Order Size |
|-------|--------|---------------|
| 85–100 | Excellent | > Rs. 1 Crore |
| 70–84 | Good | Rs. 50 Lakh – 1 Crore |
| 50–69 | Average | Rs. 10 Lakh – 50 Lakh |
| 30–49 | Poor | Rs. 1 Lakh – 10 Lakh |
| < 30 | Illiquid | < Rs. 1 Lakh |

## Liquidity Regime Alerts

| Condition | Alert |
|-----------|-------|
| Spread suddenly widens 3× | "Liquidity shock — potential news event" |
| Depth drops 50% in 5 min | "Liquidity evaporation — reduce order size" |
| Impact cost doubles | "Execution risk elevated — use limit orders" |
| Score < 30 persistent | "Illiquid period — avoid execution" |

### Output Schema

```json
{
  "symbol": "TCS",
  "timestamp": "2026-07-24T14:00:00Z",
  "liquidity": {
    "score": 82,
    "rating": "good",
    "spread_pct": 0.02,
    "depth_ratio_pct": 7.5,
    "impact_cost_pct": 0.08,
    "max_recommended_order": "Rs. 75 Lakh",
    "volume_consistency_cv": 0.28
  },
  "signal": {"strength": 82}
}
```

### Performance

| Metric | Value |
|--------|-------|
| Liquidity scoring | < 5ms |
| Depth calculation | < 2ms |
