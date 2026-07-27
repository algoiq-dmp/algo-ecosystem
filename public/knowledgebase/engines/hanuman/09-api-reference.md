# 09 — API Reference

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## gRPC Management API

Hanuman exposes a gRPC API on port 50052 for strategy management.

### Service: HanumanAdmin

```protobuf
service HanumanAdmin {
    rpc LoadStrategy(LoadStrategyRequest) returns (LoadStrategyResponse);
    rpc UnloadStrategy(UnloadStrategyRequest) returns (UnloadStrategyResponse);
    rpc StartStrategy(StartStrategyRequest) returns (StartStrategyResponse);
    rpc StopStrategy(StopStrategyRequest) returns (StopStrategyResponse);
    rpc PauseStrategy(PauseStrategyRequest) returns (PauseStrategyResponse);
    rpc ResumeStrategy(ResumeStrategyRequest) returns (ResumeStrategyResponse);
    rpc GetStrategyStatus(StatusRequest) returns (StatusResponse);
    rpc ListStrategies(ListRequest) returns (ListResponse);
    rpc GetStrategyPnL(PnLRequest) returns (PnLResponse);
    rpc UpdateStrategyParams(UpdateParamsRequest) returns (UpdateParamsResponse);
}
```

### LoadStrategyRequest

```protobuf
message LoadStrategyRequest {
    string vega_file_path = 1;   // "/opt/lakshmi/strategies/cal_spread.vega"
    string strategy_name = 2;    // defaults to name in file
    map<string, string> params = 3;  // runtime parameter overrides
}
```

### StatusResponse

```protobuf
message StatusResponse {
    string strategy_id = 1;
    string name = 2;
    StrategyState state = 3;
    Position position = 4;
    PnLSummary pnl = 5;
    uint64 signals_generated = 6;
    uint64 orders_dispatched = 7;
    uint64 fills_received = 8;
    Timestamp last_activity = 9;
}
```

### PnLSummary

```protobuf
message PnLSummary {
    double realized_pnl = 1;
    double unrealized_pnl = 2;
    double total_pnl = 3;
    double daily_pnl = 4;
    double total_trading_cost = 5;  // brokerage + STT + exchange fees
}
```

## MQ Topics Used

| Topic | Direction | Purpose |
|-------|-----------|---------|
| `feed.{exchange}.{segment}.tick` | Subscribe | Market data for strategy instruments |
| `orders.{exchange}.{segment}` | Publish | Order requests to ODIN |
| `executions.{exchange}.{segment}` | Subscribe | Execution reports from ODIN |
| `hanuman.signals` | Publish | Signal events (for monitoring) |
| `hanuman.pnl.{strategy_id}` | Publish | Real-time P&L updates |

## CLI: hanumanctl

```bash
# Load and start a strategy
hanumanctl load --file /opt/lakshmi/strategies/cal_spread.vega
hanumanctl start --name calendar_spread_nifty_jun_jul

# Monitor
hanumanctl status --id strat-001 --watch

# P&L
hanumanctl pnl --id strat-001 --period today

# Update parameters (runtime)
hanumanctl update-params --id strat-001 --set entry_spread_min=20.0

# Emergency stop all strategies
hanumanctl emergency-stop --all
```

## Prometheus Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `hanuman_strategies_active` | Gauge | Currently RUNNING strategies |
| `hanuman_signals_total{strategy,type}` | Counter | Signals generated (ENTRY/EXIT/HEDGE) |
| `hanuman_orders_total{strategy,leg}` | Counter | Orders dispatched |
| `hanuman_fills_total{strategy,leg}` | Counter | Fills received |
| `hanuman_pnl_realized{strategy}` | Gauge | Realized P&L |
| `hanuman_pnl_unrealized{strategy}` | Gauge | Unrealized P&L |
| `hanuman_signal_latency_us` | Histogram | Tick-to-signal latency |
| `hanuman_risk_vetos_total{strategy,reason}` | Counter | Risk check rejections |
