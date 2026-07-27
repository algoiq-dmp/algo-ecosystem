# 21 — Best Practices

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Deployment Best Practices

### 1. Always Start in PAPER Mode

Never deploy a strategy directly to LIVE. Graduate through the stages:
```
PAPER (5 days) → STAGED 25% (5 days) → STAGED 50% (5 days) → LIVE
```

### 2. Set Conservative Capital Allocations

- Start with 5–10% of available capital for a new strategy.
- Increase allocation only after consistent positive performance.
- Never allocate more than 25% of total capital to a single strategy.

### 3. Configure Generous Kill Switch Thresholds

While the default is 1.01%, for new strategies consider:
- Margin threshold: 0.85% (early warning before 1.01%).
- Daily loss limit: Start at 2% of allocated capital.

### 4. Monitor Conversion Rate

A healthy strategy converts > 70% of signals to trades:
- < 50% → Investigate why signals are being dropped.
- < 30% → Strategy rules may be too restrictive.

### 5. Diversify Signal Sources

Use multiple signal sources to avoid single-source dependency:
- Aalap Calls → Human insight
- Delta XI → Quantitative systematic
- VYUH → Portfolio orchestration
- TalkDelta AI → AI-driven analysis

### 6. Review Kill Switch Drills

- Weekly automated tests must all pass.
- Monthly manual drills with the team.
- Every drill should produce an after-action report.

### 7. Keep Strategy Definitions Fresh

- Update strategy JSON when market conditions change.
- Re-certify through Parikshak after any logic change.
- Archive underperforming strategies (not just pause).

### 8. Set Realistic Expectations

| Metric | Realistic Target |
|---|---|
| Sharpe Ratio | 0.8–1.5 |
| Win Rate | 45–55% |
| Max Drawdown | < 15% |
| Monthly Return | 2–5% |

### 9. Use Alerts Effectively

- Configure alerts for YOUR strategies, not every alert globally.
- Set up P&L threshold alerts (e.g., strategy P&L drops by 5% in a day).
- Silence alerts during known maintenance windows.

### 10. Maintain an Incident Runbook

Document recovery procedures for:
- Kill Switch trigger
- Vega disconnection
- Strategy runaway (excessive orders)
- Position mismatch
- Capital exhaustion

## Anti-Patterns

| Anti-Pattern | Why It's Bad |
|---|---|
| Deploying directly to LIVE | No validation of signal-to-order pipeline |
| 100% capital allocation to one strategy | Single point of failure |
| Disabling Kill Switch for convenience | Defeats the safety net |
| Ignoring dropped signal rate | Hidden issues in strategy matching |
| Overriding risk limits without review | Masking real risk exposure |
| Running outdated strategy definitions | May not reflect current market conditions |
| No diversification in signal sources | Single-source failure stops all trading |

## Operational Checklist

| Activity | Frequency |
|---|---|
| Review strategy performance | Daily |
| Check Kill Switch status | Daily |
| Review alert configurations | Weekly |
| Kill Switch drill | Weekly (auto), Monthly (manual) |
| Audit capital allocation | Weekly |
| Review dropped signals | Weekly |
| Update strategy definitions | As needed (min monthly) |
| Full system health review | Monthly |
| Disaster recovery test | Quarterly |
