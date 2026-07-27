# 09 — Risk Rules

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Risk Rules define the guardrails that protect capital and enforce trading discipline. Strategy Factory's Risk Engine evaluates rules in real time during strategy construction and provides live violation feedback.

## Rule Categories

### Position-Level Rules

| Rule | Description | Example Value |
|---|---|---|
| Max Position Size | Maximum capital per trade | 10% of portfolio |
| Max Leverage | Maximum leverage multiplier | 5x |
| Min Risk-Reward Ratio | Minimum R:R for valid entry | 1:2 |
| Hard Stop Required | Stop-loss must be configured | Enabled |
| Max Slippage | Maximum acceptable slippage | 0.5% |

### Portfolio-Level Rules

| Rule | Description | Example Value |
|---|---|---|
| Max Portfolio Exposure | Total capital deployed at once | 60% |
| Max Correlated Positions | Max trades in same sector/asset | 3 |
| Max Drawdown | Portfolio-level drawdown cap | 15% |
| Daily Loss Limit | Max loss in a single day | 5% |
| Max Open Positions | Concurrent position limit | 8 |
| Concentration Limit | Max % in single instrument | 20% |

### Time-Based Rules

| Rule | Description | Example Value |
|---|---|---|
| Trading Hours | Allowed trading window | 09:15–15:30 IST |
| Cooldown Period | Min time between entries | 5 minutes |
| Max Entries Per Day | Daily entry count limit | 20 |
| Entry Blackout | Block entries during events | Earnings, FOMC |

## Rule Configuration

```json
{
  "risk": {
    "position": {
      "maxSizePercent": 10,
      "maxLeverage": 5,
      "minRiskReward": 2.0,
      "hardStopRequired": true,
      "maxSlippagePercent": 0.5
    },
    "portfolio": {
      "maxExposurePercent": 60,
      "maxCorrelatedPositions": 3,
      "maxDrawdownPercent": 15,
      "dailyLossLimitPercent": 5,
      "maxOpenPositions": 8,
      "concentrationLimitPercent": 20
    },
    "time": {
      "tradingStart": "09:15",
      "tradingEnd": "15:30",
      "cooldownMinutes": 5,
      "maxEntriesPerDay": 20
    }
  }
}
```

## Real-Time Risk Dashboard

During strategy construction, the Risk Engine provides:

- **Live Exposure Meter** — Current total exposure as % of limits
- **Violation Highlights** — Red badges on blocks that breach rules
- **Risk Score** — 0–100 composite score (higher = riskier)
- **Warning Tray** — Accumulated risk advisories with severity levels

## Risk Override Policies

| Level | Who Can Override | Audit Required |
|---|---|---|
| Position-level | Strategy Owner | No |
| Portfolio-level | Risk Manager role | Yes |
| Time-based rules | Strategy Owner | No |
| Daily loss limit | Risk Admin only | Yes, mandatory |

Overrides are logged immutably and surfaced in DXCC review.

## Best Practices

1. Always configure a hard stop-loss.
2. Keep max position size under 10% for retail strategies.
3. Use cooldown periods to prevent overtrading.
4. Set a daily loss limit and honor it.
5. Avoid more than 3 correlated positions simultaneously.
