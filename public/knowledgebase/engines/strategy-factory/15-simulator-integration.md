# 15 — Simulator Integration

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

After Parikshak certification, the strategy is forwarded to the Simulator for historical backtesting. The Simulator replays the strategy against real market data to validate its performance before any capital is committed.

## Integration Flow

```
Strategy Factory (SF)           Simulator
     │                              │
     ├── Send certified JSON ──────▶│
     │   (MQ or REST)               │
     │                              ├── Load historical data (Ganesh)
     │                              ├── Parse strategy logic
     │                              ├── Replay tick-by-tick
     │                              ├── Record all trades
     │                              ├── Compute metrics
     │                              ├── Generate report
     │   ◀─── Backtest Results ─────┤
     │   (MQ callback)              │
     │                              │
     ├── Store results              │
     └── Update strategy status     │
```

## Backtest Configuration

```json
{
  "instrument": "NIFTY 50",
  "startDate": "2024-01-01",
  "endDate": "2025-12-31",
  "timeframe": "1d",
  "initialCapital": 1000000,
  "brokerage": 0.05,
  "slippage": 0.1,
  "dataSource": "ganesh",
  "runMonteCarlo": true,
  "monteCarloSimulations": 1000
}
```

## Simulator Modes

| Mode | Description | Duration |
|---|---|---|
| `quick` | 6 months of 1d data, basic metrics | ~2 min |
| `standard` | 2 years of 1d data, full reports | ~15 min |
| `deep` | Multi-year tick data, Monte Carlo, walk-forward | ~2 hr |
| `custom` | User-defined date range and parameters | Variable |

## Performance Metrics

| Metric | Description | Threshold (Default) |
|---|---|---|
| Sharpe Ratio | Risk-adjusted return | > 0.5 |
| Max Drawdown % | Peak-to-trough decline | < 20% |
| Win Rate % | Percentage of winning trades | > 40% |
| Profit Factor | Gross profit / Gross loss | > 1.2 |
| CAGR % | Compound annual growth rate | > 10% |
| Calmar Ratio | CAGR / Max Drawdown | > 0.5 |

## Backtest Results Schema

```json
{
  "strategyId": "sf-abc123",
  "backtestId": "bt-xyz789",
  "mode": "standard",
  "period": { "start": "2024-01-01", "end": "2025-12-31" },
  "metrics": {
    "sharpeRatio": 1.45,
    "maxDrawdown": 12.3,
    "winRate": 52.7,
    "profitFactor": 1.85,
    "cagr": 18.4,
    "calmarRatio": 1.49
  },
  "equityCurve": [],
  "trades": [],
  "monteCarlo": {
    "medianReturn": 16.2,
    "worstCaseReturn": -8.5,
    "var95": -2.3
  },
  "passed": true
}
```

## Gate Criteria

The backtest must meet all configured thresholds:
- If all thresholds met → strategy advances to DXCC.
- If any threshold is missed → strategy returns to Strategy Factory with a detailed gap report.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/simulator/submit` | Submit strategy for backtesting |
| GET | `/api/simulator/status/{backtestId}` | Check backtest progress |
| GET | `/api/simulator/results/{backtestId}` | Retrieve results |
| GET | `/api/simulator/compare` | Compare multiple backtest runs |
