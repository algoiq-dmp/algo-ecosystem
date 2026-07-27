# 07 — Volume Analysis

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Overview

The **Volume Analysis** module interprets volume patterns to identify accumulation, distribution, exhaustion, and participation quality in price movements.

## Volume Metrics

### 1. Relative Volume (RVOL)

```
RVOL = Current Volume / SMA(Volume, 20)
```

| RVOL | Interpretation |
|------|---------------|
| > 3.0 | Extreme volume (climax) |
| 2.0–3.0 | High volume (significant participation) |
| 1.0–2.0 | Normal volume |
| < 1.0 | Low volume (lack of interest) |

### 2. Volume Trend (VMA)

```
VMA = EMA(Volume, 14)
```

- Volume > VMA → Active market
- Volume < VMA → Quiet market

### 3. Up/Down Volume Ratio

```
U/D Ratio = Sum(Bullish Volume, N) / Sum(Bearish Volume, N)
```

- Bullish Volume = Volume when Close > Open
- Bearish Volume = Volume when Close < Open

| Ratio | Signal |
|-------|--------|
| > 1.5 | Strong buying pressure |
| 1.0–1.5 | Mild buying |
| 0.67–1.0 | Mild selling |
| < 0.67 | Strong selling pressure |

## Volume Narratives

### Accumulation

- Price sideways + increasing volume on up bars + decreasing on down bars
- Up/Down ratio > 1.2, rising
- Score: 70–100 (strong accumulation)

### Distribution

- Price sideways + increasing volume on down bars + decreasing on up bars
- Up/Down ratio < 0.8, falling
- Score: 70–100 (strong distribution)

### Climax Volume

- Single bar volume > 3× RVOL
- If on uptrend bar → Buying Climax (potential top)
- If on downtrend bar → Selling Climax (potential bottom)
- Score: 80–100

### Volume Dry-Up

- Volume consistently < 0.5× RVOL for 5+ bars
- Indicates indecision, often before breakout
- Score: 60–80 (breakout impending)

## Volume-Price Confirmation

| Price Move | Volume | Confirmation |
|------------|--------|-------------|
| Up | Increasing | Confirmed uptrend |
| Up | Decreasing | Weak uptrend (divergence) |
| Down | Increasing | Confirmed downtrend |
| Down | Decreasing | Weak downtrend (divergence) |
| Sideways | Low | Consolidation |
| Sideways | High | Churning / indecision |

## VWAP Deviation Volume

Tracks volume at various distances from VWAP to identify value areas:

| Zone | Distance from VWAP | Interpretation |
|------|-------------------|----------------|
| Value Area | ±1 SD | Fair value (68% of volume) |
| Reaction Zone | ±2 SD | Potential reversal (95%) |
| Extreme Zone | ±3 SD | Mean reversion highly probable (99.7%) |

### Output Schema

```json
{
  "symbol": "NIFTY",
  "timestamp": "2026-07-24T13:15:00Z",
  "volume": {
    "rvol": 1.8,
    "volume_trend": "active",
    "up_down_ratio": 1.4,
    "narrative": "accumulation",
    "narrative_score": 75,
    "climax_detected": false,
    "volume_dry_up": false,
    "vwap_zone": "value_area"
  },
  "signal": {"strength": 70}
}
```

### Performance

| Metric | Value |
|--------|-------|
| Volume analysis | < 4ms |
| Narrative classification | < 2ms |
