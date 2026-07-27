# 19 — Configuration
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Main Config: rakshak.yaml
~~~yaml
rakshak:
  version: "2.3.0"
  environment: production

hedge_requirements:
  volatility_factors: {low: 0.8, normal: 1.0, elevated: 1.3, high: 1.6, extreme: 2.0}
  tail_factors: {low: 1.0, medium: 1.2, high: 1.5, extreme: 2.0}
  regime_factors: {STRONG_BULL: 0.7, STRONG_BEAR: 0.7, SIDEWAYS: 1.0, TRANSITION: 1.3}
  min_hedge_efficiency: 2.0

tail_risk:
  var_confidence: 99
  stress_scenarios: {flash_crash: -8, gap_down: -5, circuit_breaker: -10, black_swan: -15}

gap_risk:
  instruments:
    NIFTY: {avg_gap_pct: 0.6, max_gap_pct: 4.2, std_dev_pct: 0.9}
    BANKNIFTY: {avg_gap_pct: 0.8, max_gap_pct: 6.5, std_dev_pct: 1.2}
    DEFAULT: {avg_gap_pct: 1.5, max_gap_pct: 12.0, std_dev_pct: 2.5}

dynamic_hedging:
  recalc_interval_sec: 300
  beta_volatility: 0.5
  correlation_threshold: 0.7

emergency_exit:
  triggers: {pnl_drop_5min_pct: 5, neutrality_collapse: 10, risk_critical: 85}
  cooldown_min: 15
  max_slippage: {short_options: 2, futures: 1, equity: 0.5}

disaster:
  vix_hedge_pct: 3
  gold_hedge_pct: 2
  dr_failover_sec: 30

event_calendar:
  db: "postgresql://rakshak-db.internal.algoiq.io/events"
  pre_event_days: {high: [3, 1, 0], medium: [1], low: [1]}
~~~
