# 16 — Consumer: Kavach

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Overview

**Kavach** consumes Manthan's market intelligence to calibrate delta neutrality targets and risk parameters based on current market conditions.

## Data Consumed

| Manthan Output | Kavach Application |
|---------------|-------------------|
| Market Regime | Delta neutrality target (tighter in sideways) |
| Trend Score | Directional delta allowance |
| Volatility Regime | Gamma/Theta risk limits, vega exposure caps |
| Breakout Probability | Pre-hedge positioning |
| Liquidity Score | Hedge instrument selection |
| Confidence Score | Hedge aggressiveness |

## Regime-Based Neutrality Targets

| Regime | Max Delta/Exposure | Vega Limit | Theta Target |
|--------|-------------------|-----------|--------------|
| STRONG_BULL | ±3% of portfolio | 1.5% | Positive |
| STRONG_BEAR | ±2% of portfolio | 1.0% | Positive |
| SIDEWAYS | ±0.5% of portfolio | 0.5% | High positive |
| Extreme Vol | ±0.2% of portfolio | 0.2% | Neutral |

## Integration

```
Manthan ──> Kafka ──> Kavach Regime Listener
                            │
                       ┌────┴──────────┐
                       │ Neutrality Calibrator │
                       │ Hedge Requirement Engine │
                       └──────────────────────┘
```

Kavach subscribes to `manthan.regime.changes` topic for rapid response to regime transitions.
