# Simulator — API Reference

**Version:** 3.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Base URL

```
http://192.168.190.104:3070/api/v3
```

## Authentication

Bearer token via Suraksha. Include `Authorization: Bearer <token>` header.

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/backtest` | Start a new backtesting run |
| GET | `/backtest/:id` | Backtest status and results |
| GET | `/backtest/:id/report` | Detailed performance report |
| POST | `/paper-trade` | Start a paper trading session |
| GET | `/paper-trade/:id` | Paper trading session status |
| GET | `/metrics/:run_id` | Performance metrics (Sharpe, drawdown, etc.) |
| GET | `/history` | List of past simulation runs |
| DELETE | `/backtest/:id` | Cancel a running backtest |

## Example Request

```
POST /api/v3/backtest
{ "strategy_id": "STRAT-042", "start_date": "2026-01-01", "end_date": "2026-06-30", "capital": 1000000 }
```

## Response Format

`{ "success": true, "data": { "run_id": "BT-789", "status": "running", "progress": 45.2 } }`.
