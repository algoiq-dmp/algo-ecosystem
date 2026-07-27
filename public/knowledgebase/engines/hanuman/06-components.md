# 06 — Components

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Component Inventory

### Core Components

| Component | Binary | Responsibility |
|-----------|--------|----------------|
| `hanumand` | `/opt/lakshmi/bin/hanumand` | Main daemon process |
| `vega_loader` | `libhanuman_vega.so` | Loads and validates Vega strategy definitions |
| `strategy_manager` | `libhanuman_strategy.so` | Manages strategy lifecycle and state |
| `spread_engine` | `libhanuman_spread.so` | Real-time spread and z-score calculation |
| `signal_evaluator` | `libhanuman_signal.so` | Entry/exit condition evaluation |
| `order_dispatcher` | `libhanuman_order.so` | Paired order generation and dispatch to ODIN |
| `risk_validator` | `libhanuman_risk.so` | Pre-trade risk checks against Risk Engine |
| `pnl_calculator` | `libhanuman_pnl.so` | Real-time and EOD P&L computation |

### Data Components

| Component | Binary | Responsibility |
|-----------|--------|----------------|
| `orderbook_cache` | `libhanuman_ob.so` | In-memory order book cache per instrument |
| `fill_tracker` | `libhanuman_fill.so` | Tracks partial fills and maintains leg ratios |
| `audit_logger` | `libhanuman_audit.so` | Regulatory audit trail for all strategy decisions |

### Management Components

| Component | Binary | Responsibility |
|-----------|--------|----------------|
| `hanumanctl` | `/opt/lakshmi/bin/hanumanctl` | CLI management tool |
| `hanuman_metrics` | `libhanuman_metrics.so` | Prometheus metrics exporter |

## Component Interaction

```
Market Data (MQ) ──► orderbook_cache ──► spread_engine
                                              │
                                        signal_evaluator
                                              │
                                        risk_validator ──► Risk Engine (gRPC)
                                              │
                                        order_dispatcher ──► ODIN (via MQ)
                                              │
ACE Reports (MQ) ◄────────────────────────────┘
    │
    ▼
fill_tracker ──► pnl_calculator
    │
audit_logger ──► Suraksha (audit storage)
```

## Strategy Manager Lifecycle Operations

```cpp
class StrategyManager {
public:
    // Load a strategy definition (INIT → READY)
    StrategyHandle load(const VegaStrategyDef& def);

    // Start execution (READY → RUNNING)
    void start(StrategyHandle handle);

    // Pause execution (RUNNING → PAUSED)
    void pause(StrategyHandle handle);

    // Resume execution (PAUSED → RUNNING)
    void resume(StrategyHandle handle);

    // Stop execution with position closeout
    void stop(StrategyHandle handle, bool close_positions = true);

    // Unload strategy definition
    void unload(StrategyHandle handle);

    // List all loaded strategies with state
    std::vector<StrategyStatus> list() const;
};
```

## CLI Tool Reference

```bash
hanumanctl load --file /opt/lakshmi/strategies/cal_spread.vega
hanumanctl start --id strat-001
hanumanctl status --id strat-001
hanumanctl pause --id strat-001
hanumanctl resume --id strat-001
hanumanctl stop --id strat-001 --close-positions
hanumanctl pnl --id strat-001
hanumanctl list
```
