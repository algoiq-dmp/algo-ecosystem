# 15 — Consumer: KuberAlpha

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Overview

**KuberAlpha** is the heaviest Manthan consumer. It uses market intelligence for strategy rotation, position sizing, risk adjustment, and portfolio allocation decisions.

## Data Consumed

| Manthan Output | KuberAlpha Application |
|---------------|----------------------|
| Market Regime | Strategy selection and rotation |
| Trend Score | Directional bias and position sizing |
| Breakout Probability | Entry timing optimization |
| Volatility Regime | Stop-loss width, position sizing factor |
| Volume Analysis | Entry/exit confirmation |
| OI Analysis | Sentiment confirmation for directional trades |
| Liquidity Score | Maximum position size per instrument |
| Confidence Score | Overall conviction; trade sizing |

## Strategy Rotation Logic

```python
if regime == "STRONG_BULL" and confidence > 70:
    allocate("trend_following", 60%)
    allocate("momentum", 30%)
    allocate("mean_reversion", 10%)
elif regime == "SIDEWAYS_LOW":
    allocate("mean_reversion", 50%)
    allocate("options_selling", 40%)
    allocate("trend_following", 10%)
elif volatility_regime == "extreme":
    allocate("cash", 50%)
    allocate("hedged", 30%)
    allocate("trend_following", 20%)
```

## Position Sizing

```
Position_Size = Base_Size × Regime_Factor × Volatility_Factor × Confidence_Factor × Liquidity_Factor
```

| Factor | STRONG_BULL | SIDEWAYS | Vol=Extreme |
|--------|-------------|----------|-------------|
| Regime | 1.0 | 0.5 | 0.25 |
| Volatility | 1.0 | 1.0 | 0.3 |
| Confidence | 1.0 | 0.5 | 0.3 |

## Integration

Manthan publishes to Kafka topic `manthan.intelligence`; KuberAlpha consumes and caches in Redis for real-time strategy decisions.
