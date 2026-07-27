# 06 — Volatility Regime

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Overview

The **Volatility Regime** module classifies the current volatility environment and provides forward-looking volatility expectations, enabling downstream engines to adjust position sizes and strategy selection.

## Regime Classification

| Regime | ATR Percentile | BB Width Percentile | VIX Equivalent (NIFTY) |
|--------|---------------|--------------------|------------------------|
| **Low** | < 20th | < 20th | < 12 |
| **Normal** | 20th–60th | 20th–60th | 12–18 |
| **Elevated** | 60th–85th | 60th–85th | 18–25 |
| **High** | 85th–95th | 85th–95th | 25–35 |
| **Extreme** | > 95th | > 95th | > 35 |

## Volatility Metrics Tracked

### 1. Historical Volatility (HV)

```
HV(N) = StdDev(ln(Close/Close(prev))) × sqrt(252)  (annualized)
```

| N | Timeframe |
|---|-----------|
| 10 | Short-term (2 weeks) |
| 20 | Near-term (1 month) |
| 60 | Medium-term (3 months) |

### 2. Volatility Cone

Manthan maintains a rolling volatility cone showing HV percentile ranges across tenors:

```json
{
  "hv_10": {"current": 18.2, "p25": 12.0, "p50": 15.5, "p75": 20.0, "p90": 25.0},
  "hv_20": {"current": 16.8, "p25": 11.5, "p50": 14.8, "p75": 19.2, "p90": 23.5},
  "hv_60": {"current": 15.1, "p25": 10.8, "p50": 14.0, "p75": 17.5, "p90": 21.0}
}
```

### 3. Volatility Term Structure (Contango/Backwardation)

```
Term Structure = HV(10) vs HV(20) vs HV(60)
```

| Structure | Signal |
|-----------|--------|
| Contango (ST < LT) | Volatility expected to rise |
| Backwardation (ST > LT) | Volatility expected to fall |

## Volatility Regime Strategies

| Regime | Position Sizing | Strategy Preference |
|--------|----------------|--------------------|
| Low | 100% allocation | Short options, credit spreads |
| Normal | 100% allocation | Balanced directional + non-directional |
| Elevated | 75% allocation | Reduce leverage, wider stops |
| High | 50% allocation | Hedging priority, tight stops |
| Extreme | 25% allocation | Cash, hedged positions only |

## Regime Change Detection

Manthan flags when volatility regime is changing:

| Signal | Alert |
|--------|-------|
| BB squeeze + low HV | "Volatility expansion imminent" |
| HV breaking above cone p90 | "Regime upgrading to High" |
| HV breaking below cone p10 | "Regime downgrading to Low" |
| Contango to Backwardation flip | "Volatility spike expected" |

### Output Schema

```json
{
  "symbol": "NIFTY",
  "timestamp": "2026-07-24T13:00:00Z",
  "volatility": {
    "regime": "elevated",
    "atr_percentile": 72,
    "bb_width_percentile": 68,
    "hv_10": 18.2,
    "hv_20": 16.8,
    "hv_60": 15.1,
    "term_structure": "contango",
    "regime_change_probability": 0.15,
    "expected_vol_direction": "rising",
    "recommended_position_size": "75%"
  },
  "signal": {"strength": 62}
}
```

### Performance

| Metric | Value |
|--------|-------|
| Volatility classification | < 5ms |
| Cone update (daily) | < 1s (background) |
