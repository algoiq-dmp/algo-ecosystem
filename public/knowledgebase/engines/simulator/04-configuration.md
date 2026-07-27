# Simulator — Configuration

**Version:** 3.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Configuration File

`/etc/simulator/config.yaml` or environment variables with `SIM_` prefix.

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `SIM_PORT` | `3070` | API port |
| `SIM_TALKDELTA_URL` | `http://192.168.190.104:3005` | TalkDelta API base URL |
| `SIM_MQ_HOST` | `192.168.190.118` | MQ broker address |
| `SIM_DB_HOST` | `localhost` | PostgreSQL host |
| `SIM_DB_NAME` | `simulator` | Database name |
| `SIM_TIMESCALE_HOST` | `localhost` | TimescaleDB host |
| `SIM_REPLAY_SPEED` | `1` | Replay speed multiplier (1=real-time, 60=1min/sec) |
| `SIM_SLIPPAGE_MODEL` | `fixed` | Slippage model (fixed/percentage/adaptive) |
| `SIM_MAX_CONCURRENT_RUNS` | `5` | Maximum simultaneous backtests |
| `SIM_MINUTE_DATA_RANGE` | `365` | Maximum lookback days for minute data |

## Environment-Specific

Production uses dedicated DB replicas to prevent backtesting load from affecting live systems. Staging has a reduced data retention of 90 days.
