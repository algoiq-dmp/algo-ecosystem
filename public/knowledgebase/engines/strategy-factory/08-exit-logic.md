# 08 — Exit Logic

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Exit Logic governs when and how a strategy closes open positions. Robust exit rules are as critical as entry signals — they protect capital, lock in profits, and prevent emotional decision-making.

## Exit Types

### Stop-Loss (Fixed)

Closes position when price moves against the trade by a fixed amount or percentage.

| Parameter | Description |
|---|---|
| `lossPercent` | Maximum loss as % of entry price |
| `lossAbsolute` | Maximum loss in currency terms |
| `referencePrice` | `entry` (default) or `trailing_high` |

```json
{ "type": "fixed_stop", "lossPercent": 2.0 }
```

### Trailing Stop-Loss

Dynamically adjusts the stop level as price moves favorably, locking in profits.

| Parameter | Description |
|---|---|
| `trailPercent` | Distance maintained from the best price |
| `activationPercent` | Profit % at which trailing begins |
| `stepSize` | Minimum price tick for adjustment |

```json
{ "type": "trailing_stop", "trailPercent": 1.5, "activationPercent": 1.0 }
```

### Take-Profit

Closes position when a profit target is reached.

| Parameter | Description |
|---|---|
| `profitPercent` | Target profit as % of entry |
| `profitAbsolute` | Target profit in currency |
| `partialClose` | Close only a fraction (e.g., 50%) |

```json
{ "type": "take_profit", "profitPercent": 4.0, "partialClose": 50 }
```

### Time-Based Exit

Closes position after a specified duration, regardless of P&L.

| Parameter | Description |
|---|---|
| `duration` | Time to hold (e.g., "30m", "1h", "1d") |
| `exitTime` | Specific market time (e.g., "15:15") |
| `forceClose` | Close at exact time even if partial |

### Signal Reversal

Closes the current position when an opposite signal is generated.

| Parameter | Description |
|---|---|
| `reverseOnSignal` | Signal type that triggers reversal |
| `flipDirection` | If true, opens opposite position instead of flat |

## Exit Priority & Stacking

Multiple exit rules can be active simultaneously. Priority order:

1. **Hard Stop-Loss** (never overridden)
2. **Take-Profit** (when reached)
3. **Trailing Stop** (dynamically adjusted)
4. **Time-Based Exit** (at scheduled time)
5. **Signal Reversal** (on opposite signal)

The first exit condition triggered closes the position. Subsequent exits for the same position are ignored.

## Exit JSON Schema

```json
{
  "exits": [
    { "type": "fixed_stop", "lossPercent": 2.0, "priority": 1 },
    { "type": "take_profit", "profitPercent": 4.0, "partialClose": 50, "priority": 2 },
    { "type": "trailing_stop", "trailPercent": 1.5, "activationPercent": 1.0, "priority": 3 },
    { "type": "time_based", "duration": "1d", "priority": 4 }
  ]
}
```

## Validation

- At least one exit rule is mandatory.
- A stop-loss is strongly recommended (warning if absent).
- Take-profit without stop-loss triggers a risk advisory warning.
- Signal reversal without a hard stop is flagged as high risk.
