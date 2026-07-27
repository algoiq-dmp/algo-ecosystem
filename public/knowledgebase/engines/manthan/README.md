# Manthan Engine

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Health:** 99.6% | **Last Updated:** 2026-07-24

## Overview

Manthan (Sanskrit: "churning" / "deep analysis") is the **Market Churning Intelligence Engine** within the Strategy Intelligence Layer. It performs deep market analysis spanning regime classification, trend detection, breakout probability, volatility regime assessment, volume/OI analysis, and liquidity scoring.

## Key Metrics

| Metric | Value |
|--------|-------|
| Analysis Modules | 8 |
| Data Sources | Ganesh OHLC, Suchak Indicators, Lakshmi Live |
| Uptime SLA | 99.6% |
| Avg. Analysis Latency | < 100ms |
| Consumers | DXCC, KuberAlpha, Kavach, Delta XI |

## Analysis Modules

| # | Module | Output |
|---|--------|--------|
| 1 | Market Regime Classification | Bull/Bear/Sideways/Trending |
| 2 | Trend Detection | Direction, strength, phase |
| 3 | Breakout Probability | Pre-breakout, post-breakout scoring |
| 4 | Volatility Regime | Low/Normal/Elevated/Extreme |
| 5 | Volume Analysis | Volume profile, anomaly detection |
| 6 | OI Analysis | Open interest trends, long/short buildup |
| 7 | Liquidity Scoring | Depth, slippage, impact cost |
| 8 | Confidence Scoring | Meta-analysis of all signals |

## Quick Links

- [Overview & Purpose](01-overview.md)
- [Architecture](02-architecture.md)
- [Market Regime Classification](03-market-regime.md)
- [Trend Detection](04-trend-detection.md)
- [API Reference](18-api-endpoints.md)
- [Glossary](24-glossary.md)
