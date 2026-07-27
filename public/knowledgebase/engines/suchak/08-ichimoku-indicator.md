# 08 — Ichimoku Cloud

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Overview

Ichimoku Kinko Hyo (一目均衡表), or "Equilibrium Chart at a Glance," is a comprehensive indicator that provides trend direction, support/resistance, and momentum signals in a single view.

## Five Components

### 1. Tenkan-sen (Conversion Line)

```
Tenkan-sen = (Highest High(9) + Lowest Low(9)) / 2
```

Represents short-term trend and acts as a minor support/resistance.

### 2. Kijun-sen (Base Line)

```
Kijun-sen = (Highest High(26) + Lowest Low(26)) / 2
```

Represents medium-term trend. Stronger support/resistance than Tenkan-sen.

### 3. Senkou Span A (Leading Span A)

```
Senkou Span A = (Tenkan-sen + Kijun-sen) / 2
```

Plotted 26 periods ahead. Forms one edge of the Kumo (Cloud).

### 4. Senkou Span B (Leading Span B)

```
Senkou Span B = (Highest High(52) + Lowest Low(52)) / 2
```

Plotted 26 periods ahead. Forms the other edge of the Kumo.

### 5. Chikou Span (Lagging Span)

```
Chikou Span = Close plotted 26 periods behind
```

Provides confirmation of trend direction and support/resistance.

## The Kumo (Cloud)

The space between Senkou Span A and Senkou Span B is the **Kumo**:

- **A > B** → Green Cloud (bullish future bias)
- **A < B** → Red Cloud (bearish future bias)
- **Price above Cloud** → Uptrend, Cloud = support
- **Price below Cloud** → Downtrend, Cloud = resistance
- **Price inside Cloud** → Consolidation / no clear trend
- **Cloud thickness** → Stronger support/resistance zone

## Signal Hierarchy

| Rank | Signal | Condition |
|------|--------|-----------|
| 1 | Strong Buy | Price > Cloud, Tenkan > Kijun, Chikou > Price |
| 2 | Buy | Price > Cloud, Tenkan > Kijun |
| 3 | Weak Buy | Tenkan > Kijun, but price near Cloud |
| 4 | Neutral | Price inside Cloud |
| 5 | Weak Sell | Tenkan < Kijun, price near Cloud |
| 6 | Sell | Price < Cloud, Tenkan < Kijun |
| 7 | Strong Sell | Price < Cloud, Tenkan < Kijun, Chikou < Price |

## TK Cross

Tenkan-sen crossing Kijun-sen:

- **Bullish TK Cross:** Tenkan crosses above Kijun (buy signal)
- **Bearish TK Cross:** Tenkan crosses below Kijun (sell signal)

Strength of TK Cross depends on position relative to Cloud:
- Cross **above** Cloud → Strong
- Cross **inside** Cloud → Neutral
- Cross **below** Cloud → Weak

## Multi-Timeframe Ichimoku

Suchak provides Ichimoku on all timeframes. Higher timeframe Cloud zones act as major support/resistance on lower timeframes.

### Output Schema

```json
{
  "symbol": "NIFTY",
  "timeframe": "1d",
  "ichimoku": {
    "tenkan_sen": 24450.00,
    "kijun_sen": 24320.00,
    "senkou_span_a": 24580.50,
    "senkou_span_b": 24100.80,
    "chikou_span": 24500.00,
    "cloud_top": 24580.50,
    "cloud_bottom": 24100.80,
    "cloud_color": "green",
    "cloud_thickness": 479.70,
    "price_vs_cloud": "above",
    "tk_cross": "bullish",
    "signal_rank": "Strong Buy",
    "signal_strength": 85
  }
}
```

### Performance

| Metric | Value |
|--------|-------|
| Full Ichimoku Compute | < 5ms |
| Cloud Projection (26 bars) | Included in compute |
| Memory per symbol | ~4KB |
