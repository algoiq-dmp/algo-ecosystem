# 01 — Overview & Purpose

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## What is Manthan?

Manthan (मंथन) translates to "churning" — specifically the Samudra Manthan (churning of the ocean) from Indian mythology. Similarly, Manthan churns raw market data, Suchak indicators, and Lakshmi live feeds to extract deeper intelligence about market conditions.

## Core Mission

Classify, quantify, and predict market behavior across multiple dimensions — regime, trend, volatility, volume, liquidity, and confidence — providing downstream engines with contextual intelligence for superior decision making.

## Design Philosophy

1. **Multi-Dimensional** — No single indicator tells the full story. Manthan synthesizes across all dimensions.
2. **Probabilistic Outputs** — Instead of binary buy/sell, outputs are probability scores enabling risk-adjusted decisions.
3. **Adaptive Thresholds** — Regime thresholds adapt dynamically based on rolling market conditions.
4. **Temporal Hierarchy** — Short-term analysis feeds into medium-term, which feeds into long-term assessment.
5. **Explainable** — Every output is traceable to its source data and methodology.

## Data Flow

```
Ganesh OHLC ────────┐
Suchak Indicators ──┼──> Manthan Engine ──> Market Intelligence ──> Consumers
Lakshmi Live ───────┘
```

### Inputs
- **Ganesh OHLC** — Candlestick data across timeframes
- **Suchak Indicators** — 15+ technical indicators (EMA, RSI, MACD, ADX, Bollinger, etc.)
- **Lakshmi Live** — Tick data for micro-structure analysis

### Outputs

| Output | Description |
|--------|-------------|
| Market Regime | Bull/Bear/Sideways/Transition classification |
| Trend Score | Direction + strength + phase |
| Breakout Probability | 0–100% likelihood of breakout |
| Volatility Regime | Low/Normal/Elevated/Extreme with percentile |
| Volume Narrative | Accumulation/Distribution/Exhaustion |
| OI Signal | Long/Short buildup/unwinding |
| Liquidity Score | 0–100 depth and slippage assessment |
| Confidence Score | Meta-confidence across all signals |

## Consumer Ecosystem

| Consumer | Use Case |
|----------|----------|
| **DXCC** | Option strategy selection based on regime |
| **KuberAlpha** | Strategy rotation, position sizing adjustments |
| **Kavach** | Delta neutrality targets per regime |
| **Delta XI** | Feature engineering for ML regime prediction |

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2026-07-01 | Complete rewrite; added OI, Liquidity, Confidence modules |
| 1.2.0 | 2026-03-15 | Added Volatility Regime and Breakout Probability |
| 1.0.0 | 2025-09-01 | Initial release: Regime + Trend |
