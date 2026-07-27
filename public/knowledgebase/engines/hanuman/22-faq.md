# 22 — FAQ

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## General

**Q: Why only 2-leg strategies? What about 3+ legs?**
A: Hanuman is purpose-built for 2-leg strategies (spreads, pairs, arbitrage). Multi-leg strategies (> 2 legs) are handled by other Lakshmi execution engines. 2-leg is the most common algorithmic trading pattern and benefits from specialized optimization.

**Q: Can I run the same strategy on multiple instruments simultaneously?**
A: Yes, via parametrized strategies in Vega. Define one strategy template and instantiate it with different symbol parameters. Each instance is independent.

**Q: What happens if the exchange circuit breaker triggers mid-strategy?**
A: If either leg's instrument hits an exchange circuit breaker, the strategy pauses. Open positions are held. When the circuit breaker lifts, the strategy re-evaluates and resumes. Auto-hedge is NOT triggered for exchange-level halts.

## Strategy Development

**Q: How do I backtest a strategy before production deployment?**
A: Use `hanumanctl backtest` with historical tick data. Minimum backtest period: 3 months of data. Must show positive expectancy and acceptable drawdown before production approval.

**Q: Can I modify strategy parameters without restarting?**
A: Yes. Use `hanumanctl update-params`. Supports hot changes to: spread thresholds, position limits, order type, slippage tolerance. Structure changes (leg instruments, hedge ratio) require strategy restart.

**Q: What is the Vega DSL and where is it documented?**
A: Vega is the Lakshmi Strategy Definition Language. See the Vega documentation at `public/knowledgebase/engines/vega/`. Vega DSL files are plain text with a C-like syntax.

## Operations

**Q: What happens to open positions during EOD (15:30 IST)?**
A: By default, strategies with intraday positions will attempt to exit positions between 15:15-15:25 IST (configurable). Any residual positions are flagged for manual intervention. Carry-forward positions (e.g., futures spreads held overnight) are explicitly configured per strategy.

**Q: How are corporate actions handled for spread strategies?**
A: The symbol master cache is updated daily at 08:00 IST. If a corporate action affects a strategy's leg, the strategy pauses and alerts the Execution desk. Manual review is required before resumption.

**Q: Can multiple Hanuman instances run the same strategy?**
A: No. Each strategy instance has a unique ID and runs on exactly one Hanuman server. The standby has a replica that takes over on failover, but at any given moment only one instance is active.
