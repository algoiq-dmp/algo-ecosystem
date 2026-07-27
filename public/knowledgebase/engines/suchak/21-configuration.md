# 21 — Configuration

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Configuration File

Suchak configuration is stored in `suchak.yaml` and supports hot-reload via configmap changes.

```yaml
suchak:
  version: "4.1.0"
  environment: production
  log_level: info

server:
  host: "0.0.0.0"
  port: 8080
  grpc_port: 9090
  max_connections: 5000
  request_timeout_ms: 5000

data_sources:
  ganesh:
    host: "ganesh.internal.algoiq.io"
    port: 8080
    tls: true
    cert_path: "/etc/certs/ganesh-client.pem"
    key_path: "/etc/certs/ganesh-client-key.pem"
    reconnect_max_attempts: 10
    reconnect_backoff_ms: 1000

  lakshmi:
    bootstrap_servers:
      - "lakshmi-1.internal.algoiq.io:9092"
      - "lakshmi-2.internal.algoiq.io:9092"
    consumer_group: "suchak-v4"
    topics:
      - "nse.equity.ticks"
      - "nse.fno.ticks"
    session_timeout_ms: 30000

indicators:
  default_timeframes: ["1m", "5m", "15m", "1h", "1d"]
  compute_threads: 8
  window_cache_size: 5000

  ema:
    periods: [9, 13, 20, 34, 50, 72, 100, 200]
    sources: ["close"]

  sma:
    periods: [20, 50, 100, 200]
    sources: ["close"]

  vwap:
    reset: "daily"
    anchor: "session_open"
    bands: [1, 2, 3]

  supertrend:
    atr_period: 10
    multiplier: 3.0

  rsi:
    period: 14
    source: "close"
    overbought: 70
    oversold: 30
    extreme_overbought: 80
    extreme_oversold: 20

  macd:
    fast_period: 12
    slow_period: 26
    signal_period: 9
    divergence_lookback: 50

  bollinger_bands:
    period: 20
    stddev_multiplier: 2.0
    squeeze_lookback_months: 6
    squeeze_threshold_percent: 6

  atr:
    period: 14
    smoothing: "wilder"

  adx:
    period: 14
    trend_strength_thresholds:
      no_trend: 20
      potential: 25
      strong: 40
      extreme: 60

  stochastic:
    k_period: 14
    d_period: 3
    smoothing: 3
    overbought: 80
    oversold: 20

  ichimoku:
    tenkan_period: 9
    kijun_period: 26
    senkou_b_period: 52
    displacement: 26

  pivot_levels:
    variants: ["classic", "fibonacci", "camarilla"]
    anchors: ["daily", "weekly", "monthly"]

  cpr:
    width_threshold_narrow: 0.3
    width_threshold_wide: 1.5

signal_strength:
  weights:
    ema_200: 15
    macd: 12
    rsi: 10
    supertrend: 10
    ichimoku: 12
    pivot_cpr: 10
    bollinger: 8
    adx: 8
    vwap: 5
    atr: 5
    stochastic: 5
  confidence:
    high_agreement_threshold: 8
    medium_agreement_threshold: 5
    low_agreement_threshold: 3
    divergence_dampen_factor: 0.70

redis:
  host: "suchak-redis.internal.algoiq.io"
  port: 6379
  db: 0
  pool_size: 50
  timeout_ms: 200

monitoring:
  prometheus:
    enabled: true
    port: 9091
    path: "/metrics"
  health_check_interval_ms: 5000

symbols:
  watchlist_file: "/etc/suchak/watchlist.yaml"
  max_symbols: 1000
```

## Watchlist Configuration

```yaml
# watchlist.yaml
indices:
  - NIFTY
  - BANKNIFTY
  - FINNIFTY
  - MIDCPNIFTY

futures:
  - NIFTY-I
  - NIFTY-II
  - BANKNIFTY-I

equities:
  - RELIANCE
  - TCS
  - HDFCBANK
  - INFY
  - ICICIBANK
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SUCHAK_ENV` | Environment name | `development` |
| `SUCHAK_LOG_LEVEL` | Log verbosity | `info` |
| `SUCHAK_REDIS_URL` | Redis connection string | Redis config |
| `SUCHAK_MAX_SYMBOLS` | Max active symbols | `1000` |
| `SUCHAK_COMPUTE_THREADS` | Indicator compute threads | `8` |

## Hot Reload

Config changes via Kubernetes ConfigMap are detected within 60 seconds:

```bash
kubectl edit configmap suchak-config -n algo-iq-prod
# Suchak detects change and reloads without restart
```

Eligible for hot reload:
- Indicator parameters (periods, multipliers)
- Signal strength weights
- Watchlist
- Log level
- Rate limits

Requires restart:
- Server host/port
- Data source endpoints
- Redis connection details
