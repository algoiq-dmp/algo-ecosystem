# 11 — Configuration

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Configuration File

Primary: `/etc/lakshmi/hanuman/config.yaml`

```yaml
hanuman:
  instance_id: "hanuman01-mum"
  data_center: "mumbai"

vega:
  strategy_path: "/opt/lakshmi/strategies"
  auto_load: true
  auto_start: false
  max_strategies: 500

spread:
  default_hedge_ratio: 1.0
  price_source: "ltp"          # ltp, mid, vwap
  stale_price_timeout_ms: 5000
  zscore_window: 20

execution:
  default_time_in_force: "DAY"
  default_order_type: "LIMIT"
  max_slippage_ticks: 5
  partial_fill_timeout_ms: 10000
  auto_hedge_enabled: true

risk:
  engine_endpoint: "risk-engine.internal:50090"
  max_position_lots_default: 50
  max_order_value_default: 10000000
  max_daily_loss_default: 500000
  circuit_breaker:
    enabled: true
    max_consecutive_losses: 5
    cooldown_minutes: 15

pnl:
  mtm_interval_ms: 100         # Mark-to-market frequency
  trading_cost:
    brokerage_per_lot: 20.0    # Flat per lot
    stt_percent: 0.001         # Securities Transaction Tax
    exchange_fee_per_lot: 2.0

state:
  checkpoint_interval_sec: 60
  checkpoint_dir: "/opt/lakshmi/hanuman/checkpoints"
  replay_log_dir: "/opt/lakshmi/hanuman/replay_log"

mq:
  brokers: ["mq01-mum:9092", "mq02-mum:9092"]
  client_id: "hanuman01-mum"
  subscribe_topics:
    - "feed.NSE.FO.tick"
    - "feed.NSE.CM.tick"
    - "executions.*"
  publish_topics:
    signals: "hanuman.signals"
    pnl: "hanuman.pnl"

narad:
  agent_address: "localhost:50060"

audit:
  enabled: true
  suraksha_endpoint: "localhost:50070"
  log_level: "all"  # all, signals_only, orders_only

metrics:
  prometheus_port: 9194
```

## Strategy-Specific Parameters

Loaded from Vega DSL files and overridable at runtime:

| Parameter | Type | Description |
|-----------|------|-------------|
| `hedge_ratio` | float | Leg2 quantity = Leg1 quantity / ratio |
| `entry_spread_min` | float | Minimum spread for entry |
| `entry_spread_max` | float | Maximum spread for entry |
| `exit_spread_target` | float | Profit target spread |
| `stop_loss_spread` | float | Stop loss spread |
| `max_position_lots` | int | Maximum position in lots |
| `max_slippage_ticks` | int | Max allowed price movement before veto |
| `order_type` | string | LIMIT or MARKET |
