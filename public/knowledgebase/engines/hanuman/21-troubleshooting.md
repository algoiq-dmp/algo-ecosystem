# 21 — Troubleshooting

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Diagnostic Commands

```bash
hanumanctl list                           # All strategies and states
hanumanctl status --id strat-001 --verbose  # Detailed strategy state
hanumanctl health                        # Server health
hanumanctl pnl --summary                 # P&L across all strategies
```

## Common Issues

### Issue 1: Strategy Not Generating Signals

**Symptoms:** Strategy in RUNNING state, but `hanuman_signals_total` = 0.

**Causes:**
- Market data not received for one or both legs
- Spread range not crossing entry threshold
- Strategy parameters too restrictive

**Resolution:**
```bash
# Check if market data is flowing
hanumanctl market-data-check --symbol NIFTY26JUNFUT

# Check spread calculation
hanumanctl spread --id strat-001 --watch

# Check entry thresholds vs current spread
hanumanctl params --id strat-001 | grep entry
```

### Issue 2: Orders Being Vetoed

**Symptoms:** `hanuman_risk_vetos_total` counter increasing.

**Causes:**
- Position limit reached
- Daily loss limit hit
- Margin insufficient
- Slippage guard triggered

**Resolution:**
```bash
# Check veto reason
hanumanctl veto-log --id strat-001 --last 10

# Check current position
hanumanctl position --id strat-001

# Check daily P&L
hanumanctl pnl --id strat-001 --period today

# If slippage too tight, increase max_slippage_ticks
hanumanctl update-params --id strat-001 --set max_slippage_ticks=5
```

### Issue 3: Partial Fills Causing Ratio Imbalance

**Symptoms:** Leg 1 fills 100%, Leg 2 only 30%.

**Resolution:**
```bash
# Check fill status
hanumanctl fills --id strat-001

# Check leg ratio
hanumanctl ratio --id strat-001

# If hedge needed, manually trigger
hanumanctl hedge --id strat-001

# If strategy should handle automatically, verify auto_hedge_enabled
hanumanctl params --id strat-001 | grep auto_hedge
```

### Issue 4: Strategy Stuck in INIT or READY

**Causes:**
- Vega file syntax error
- Strategy signature verification failed
- Symbol mapping error (instrument not found)

**Resolution:**
```bash
# Validate Vega file
hanumanctl validate --file /opt/lakshmi/strategies/my_spread.vega

# Check load errors
journalctl -u hanumand | grep "load.*error"

# Check symbol availability
hanumanctl symbol-check --symbol NIFTY26JUNFUT
```

### Issue 5: P&L Discrepancy

**Symptoms:** P&L calculated by Hanuman differs from back-office reconciliation.

**Resolution:**
```bash
# Export trade log for reconciliation
hanumanctl export-trades --id strat-001 --date 2026-07-25 --format csv

# Compare with ODIN trade log
odinctl trades --client-id hanuman01-mum --date 2026-07-25

# Check trading cost parameters
hanumanctl params --id strat-001 | grep -i cost
```
