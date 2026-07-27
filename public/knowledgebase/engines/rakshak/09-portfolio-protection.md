# 09 — Portfolio Protection
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
**Portfolio Protection** aggregates risk across all strategies and positions to identify correlated exposures, concentration risks, and portfolio-level vulnerabilities that individual strategy monitoring might miss.
## Cross-Strategy Correlation
Rakshak computes the correlation matrix of all active strategies:
| Strategy | IC-NIFTY | STR-BNF | CAL-NIFTY | COVERED-TCS |
|----------|----------|---------|-----------|-------------|
| IC-NIFTY | 1.00 | 0.45 | 0.72 | 0.12 |
| STR-BNF | 0.45 | 1.00 | 0.38 | 0.08 |
| CAL-NIFTY | 0.72 | 0.38 | 1.00 | 0.15 |
| COVERED-TCS | 0.12 | 0.08 | 0.15 | 1.00 |
## Concentration Risk
| Concentration Type | Limit | Alert Threshold |
|-------------------|-------|-----------------|
| Single underlying | 30% of portfolio | > 25% |
| Single sector | 40% of portfolio | > 35% |
| Single strategy type | 50% of portfolio | > 40% |
| Same direction (bull/bear) | 60% of portfolio | > 50% |
| Same expiry | 40% of portfolio | > 35% |
## Portfolio Stress Test
Daily stress test across scenarios:
| Scenario | Portfolio Impact | Action |
|----------|-----------------|--------|
| NIFTY -5% | -8.2% | Within limits |
| NIFTY -10% | -18.5% | Exceeds limit — add hedge |
| BANKNIFTY -15% | -22.1% | Critical — reduce BNF exposure |
| All-correlated crash (-20%) | -35.0% | Disaster scenario — emergency plan |
## Portfolio Protection Score
PP_Score = 100 - (Concentration_Risk + Correlation_Risk + Stress_Loss_Risk)
| Score | Level |
|-------|-------|
| 80-100 | Well Protected |
| 60-79 | Adequately Protected |
| 40-59 | Under-Protected |
| < 40 | Vulnerable |
## Output
~~~json
{
  "portfolio": "KUBERALPHA_MAIN",
  "protection_score": 72,
  "concentration_risk": 12,
  "correlation_risk": 8,
  "stress_loss_risk": 8,
  "cross_strategy_correlations": {"avg": 0.28, "max_pair": ["STR-BNF", "IC-NIFTY", 0.45]},
  "top_concentration": {"type": "underlying", "name": "NIFTY", "pct": 35},
  "recommendation": "Reduce NIFTY exposure by 5% or add BNF hedge for diversification"
}
~~~
