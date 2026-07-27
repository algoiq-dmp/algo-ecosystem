# 09 — Pivot Levels & CPR

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Classic Pivot Levels

### Formula (Daily)

```
Pivot Point (PP) = (High + Low + Close) / 3

Resistance 1 = (2 × PP) - Low
Resistance 2 = PP + (High - Low)
Resistance 3 = High + 2 × (PP - Low)

Support 1 = (2 × PP) - High
Support 2 = PP - (High - Low)
Support 3 = Low - 2 × (High - PP)
```

### Variants Supported

| Variant | Formula for PP |
|---------|----------------|
| Classic | (H + L + C) / 3 |
| Fibonacci | (H + L + C) / 3 |
| Woodie | (H + L + 2×C) / 4 |
| Camarilla | (H + L + C) / 3 |
| DeMark | Conditional based on Open vs Close |

### Time-Based Pivots

Suchak supports multiple pivot anchor periods:

| Anchor | Reset | Use Case |
|--------|-------|----------|
| Daily | EOD | Intraday trading |
| Weekly | EOW | Swing trading |
| Monthly | EOM | Positional trading |
| Yearly | EOY | Long-term levels |
| 4-Hour | Every 4h | Short-term intraday |

### Pivot Level Psychology

Key levels where price is likely to react:
- **R1 / S1** — Most probable targets/ranges
- **R2 / S2** — Extended targets, stronger reactions
- **R3 / S3** — Extreme levels, rare but violent reactions
- **Camarilla R3/R4 & S3/S4** — Mean reversion extremes

---

## Central Pivot Range (CPR)

### Formula

```
TC (Top Central) = (PP - BC) + PP
BC (Bottom Central) = (High + Low) / 2
CPR Width = TC - BC
```

### CPR Width Analysis

| Width | Interpretation |
|-------|----------------|
| Very narrow (< 0.3%) | High probability of breakout |
| Narrow (0.3%–0.7%) | Potential breakout setup |
| Normal (0.7%–1.5%) | Range-bound trading expected |
| Wide (> 1.5%) | Wide range, trending environment |

### CPR Application

- **Price above CPR** → Bullish bias
- **Price below CPR** → Bearish bias
- **Price opening outside CPR** → Continuation likely
- **Price opening inside CPR** → Choppy / range-bound
- **Tight CPR + Price near TC/BC** → Breakout entry setup
- **Previous day CPR acts as S/R today** → High confluence zones

### Day Types (by CPR)

| Type | Condition |
|------|-----------|
| High Value CPR | TC and BC both above previous close |
| Low Value CPR | TC and BC both below previous close |
| Double Distribution | TC above, BC below previous close |
| Unchanged Value | TC and BC straddle previous close |

### Output Schema

```json
{
  "symbol": "NIFTY",
  "anchor": "daily",
  "pivots": {
    "variant": "classic",
    "pp": 24500.00,
    "r1": 24620.00, "r2": 24720.00, "r3": 24940.00,
    "s1": 24400.00, "s2": 24280.00, "s3": 24060.00
  },
  "cpr": {
    "tc": 24540.00,
    "bc": 24460.00,
    "width": 80.00,
    "width_percent": 0.33,
    "cpr_type": "narrow",
    "price_position": "above_cpr"
  },
  "signal": {
    "bias": "bullish",
    "breakout_probability": "high",
    "strength": 70
  }
}
```

### Performance

| Metric | Value |
|--------|-------|
| Pivot Compute (all variants) | < 2ms |
| CPR Compute | < 1ms |
| Multi-Timeframe Pivots | < 5ms |
