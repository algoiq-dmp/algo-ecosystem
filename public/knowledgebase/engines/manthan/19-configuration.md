# 19 — Configuration

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## Main Config: manthan.yaml

```yaml
manthan:
  version: "2.0.0"
  environment: production
  log_level: info

server:
  host: "0.0.0.0"
  port: 8080
  grpc_port: 9090

modules:
  regime:
    enabled: true
    adx_thresholds: {no_trend: 20, potential: 25, strong: 40}
    transition_probability_threshold: 0.70

  trend:
    enabled: true
    timeframes: ["1m","5m","15m","1h","1d"]
    alignment_weight: 0.3
    exhaustion_adx_threshold: 60

  breakout:
    enabled: true
    compression_weight: 0.4
    false_breakout_bars: 3

  volatility:
    enabled: true
    hv_periods: [10, 20, 60]
    percentile_windows: [20, 60, 85, 95]

  volume:
    enabled: true
    rvol_threshold_high: 2.0
    climax_multiplier: 3.0

  oi:
    enabled: true
    pcr_extreme_bearish: 1.5
    pcr_extreme_bullish: 0.5

  liquidity:
    enabled: true
    min_depth_ratio: 0.02
    impact_order_size: 1000000

  confidence:
    enabled: true
    decay_half_life_min: 14
    agreement_threshold_low: 3

data_sources:
  ganesh:
    host: "ganesh.internal.algoiq.io:9090"
  suchak:
    host: "suchak.internal.algoiq.io:9090"
  lakshmi:
    bootstrap_servers: ["lakshmi-1:9092","lakshmi-2:9092"]

redis:
  host: "manthan-redis.internal.algoiq.io:6379"

symbols:
  watchlist: ["NIFTY","BANKNIFTY","FINNIFTY","MIDCPNIFTY"]
  max_symbols: 500
```

## Environment Variables

| Variable | Default |
|----------|---------|
| `MANTHAN_ENV` | `development` |
| `MANTHAN_LOG_LEVEL` | `info` |
| `MANTHAN_REDIS_URL` | from config |
