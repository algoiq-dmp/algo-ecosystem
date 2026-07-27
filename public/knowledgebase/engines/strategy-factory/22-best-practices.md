# 22 — Best Practices

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Strategy Design Principles

### 1. Start Simple, Iterate

Build the minimal viable strategy first. Validate it through the full lifecycle (Parikshak → Simulator → DXCC → Kuber Alpha) before adding complexity.

### 2. Always Include a Hard Stop-Loss

Every strategy must have a fixed stop-loss. This is the last line of defense. Platform policy strongly enforces this, and DXCC will reject strategies without one.

### 3. Use Cooldown Periods

Prevent overtrading by setting a cooldown between entries. Recommended: 5–15 minutes for intraday, 1–24 hours for positional strategies.

### 4. Limit Position Size

- **Intraday**: Max 5–10% of portfolio per trade
- **Positional**: Max 10–15% per trade
- **Options/Futures**: Max 5% per trade (higher leverage)

### 5. Diversify Exit Types

Use a combination of exits:
- Fixed stop-loss for capital protection
- Take-profit for disciplined profit booking
- Trailing stop to capture trends
- Time-based exit to avoid overnight risk

### 6. Test Multiple Market Regimes

Run backtests across bull, bear, and sideways markets. A strategy that works only in one regime is fragile.

### 7. Account for Slippage and Brokerage

Set realistic slippage (0.1–0.5%) and brokerage in the Simulator. Optimistic assumptions lead to disappointing live results.

### 8. Monitor Correlation

If deploying multiple strategies in a portfolio, ensure they are not highly correlated (> 0.7). Use the Portfolio Allocation tools to visualize correlation.

### 9. Version Every Change

- Increment patch version for parameter tweaks.
- Increment minor version for new blocks.
- Increment major version for structural changes.
- Always add a changelog note.

### 10. Review Parikshak Reports Thoroughly

Do not skip the security report or the performance report. A green readiness report does not guarantee profitability — it certifies that the strategy meets quality standards.

## Development Workflow

```
┌──────────┐   ┌──────────┐   ┌───────────┐   ┌──────────┐
│  Create   │──▶│  Test    │──▶│  Backtest  │──▶│  Deploy  │
│  Strategy │   │(Parikshak)│  │(Simulator) │   │(Kuber)   │
└──────────┘   └──────────┘   └─────┬─────┘   └──────────┘
       ▲                             │              │
       │         ┌───────────────────┘              │
       └─────────┤  If metrics fail,                │
                 │  iterate and retest              │
                 └──────────────────────────────────┘
```

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Strategy Name | Descriptive + type | `NIFTY Trend Following v1` |
| Block Label | Purpose + parameter | `Entry: MA Cross 20/50` |
| Portfolio | Risk level + market | `Conservative NIFTY Basket` |

## Common Pitfalls

| Pitfall | Solution |
|---|---|
| Overfitting to historical data | Use Monte Carlo; limit parameter count |
| Curve-fitting indicator periods | Test on out-of-sample data |
| Ignoring market hours | Configure time-based rules |
| No exit plan | Always add at least 2 exit types |
| Unrealistic performance expectations | Backtest with realistic costs |
| Skipping Parikshak | Never bypass the testing stage |
| Deploying without DXCC | Every live strategy needs DXCC approval |

## Performance Targets

| Metric | Conservative | Moderate | Aggressive |
|---|---|---|---|
| Sharpe Ratio | > 0.5 | > 1.0 | > 1.5 |
| Max Drawdown | < 10% | < 20% | < 30% |
| Win Rate | > 45% | > 50% | > 55% |
| CAGR | > 12% | > 20% | > 30% |
