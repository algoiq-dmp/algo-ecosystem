# 10 — Position Sizing

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Position Sizing determines how much capital is allocated to each trade. Strategy Factory offers multiple sizing models that balance risk and return according to the strategy's objectives.

## Sizing Models

### Fixed Quantity

Always trade the same number of units.

```json
{ "model": "fixed", "quantity": 100 }
```

**Use case**: Simple strategies, equal-weighted baskets.

### Fixed Percentage

Allocate a fixed % of available capital per trade.

```json
{ "model": "percentage", "percent": 5 }
```

**Use case**: Most common model; ensures position size scales with account.

### Volatility-Adjusted

Size inversely proportional to volatility — larger positions in low-volatility environments, smaller in high-volatility.

```json
{
  "model": "volatility_adjusted",
  "targetVolatility": 2.0,
  "lookbackPeriod": 20,
  "volatilityMeasure": "ATR"
}
```

| Parameter | Description |
|---|---|
| `targetVolatility` | Desired daily volatility contribution (as %) |
| `lookbackPeriod` | Bars used to compute volatility |
| `volatilityMeasure` | `ATR`, `stddev`, or `parkinson` |

### Kelly Criterion

Maximizes long-term growth by sizing based on win rate and payoff ratio.

```json
{
  "model": "kelly",
  "winRate": 0.55,
  "avgWin": 2.0,
  "avgLoss": 1.0,
  "fraction": 0.5
}
```

| Parameter | Description |
|---|---|
| `winRate` | Historical win rate (0–1) |
| `avgWin` | Average winning trade (% return) |
| `avgLoss` | Average losing trade (% return) |
| `fraction` | Kelly fraction (0.5 = Half-Kelly, conservative) |

**Formula**: `f* = (winRate × avgWin - (1 - winRate) × avgLoss) / (avgWin × avgLoss)`

### Risk-Based (Fixed Fractional)

Size based on the distance to the stop-loss.

```json
{
  "model": "risk_based",
  "riskPerTradePercent": 1.0
}
```

Position size = (Account × Risk%) / Stop-Loss distance.

## Sizing Constraints

All models respect these upper bounds, applied after calculation:

| Constraint | Default |
|---|---|
| Max position size (% of portfolio) | 10% |
| Max notional value | ₹50,00,000 |
| Min lot size (F&O) | As per exchange |
| Round-lot compliance | Auto-round to nearest lot |

## Interactive Sizing Preview

The Inspector panel shows a live sizing preview as parameters change:

```
Model: Volatility-Adjusted (ATR)
ATR (20): ₹34.50
Target Vol: 2.0%
Account: ₹10,00,000
─────────────────────────
Position Size: 580 units
Capital Used: ₹1,16,000 (11.6%)
```

## Validation

- Sizing model must be selected before export.
- Percentage-based models must not exceed `maxPositionSizePercent` from risk rules.
- Kelly model requires win rate data from Simulator or manual input.
- Fixed quantity must be ≥ 1 and ≤ exchange lot limit.
