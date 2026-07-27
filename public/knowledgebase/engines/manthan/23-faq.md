# 23 — FAQ
> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24
## General
**Q: How is Manthan different from Suchak?**
A: Suchak computes raw technical indicators. Manthan performs higher-level analysis on those indicators + volume + OI + liquidity to classify market regimes, trends, and provide confidence-scored intelligence.
**Q: What is Manthan's latency?**
A: p50 < 50ms, p95 < 100ms per symbol for full pipeline analysis.
**Q: Can I request analysis for custom symbols?**
A: Yes, add symbol to watchlist config. Manthan will begin tracking within 2 minutes.
## Regime
**Q: How often does regime change?**
A: Typically every 20–50 bars. In trending markets, regime may persist for 100+ bars. In volatile/choppy markets, changes may be faster.
**Q: Can Manthan predict regime changes?**
A: Yes, via 	ransition_probability. When > 70%, a regime change is likely within 1–3 bars.
## Confidence
**Q: Why is confidence low during trending markets?**
A: Confidence measures signal agreement. Even in trends, shorter timeframes may show conflicting short-term signals. Low confidence in a trend = cautious sizing, not no trade.
**Q: What is the minimum confidence to trade?**
A: KuberAlpha default minimum is 40 for live execution. Backtesting can use lower thresholds.
## Integration
**Q: How do I subscribe to Manthan intelligence in my service?**
A: Use gRPC streaming: manthan.internal.algoiq.io:9090. Consume IntelligenceService.Subscribe(symbols, modules). See SDK docs.
