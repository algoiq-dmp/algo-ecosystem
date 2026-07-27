# SpreadWatch — Configuration

**Version:** 2.8.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Configuration File

`/etc/spreadwatch/config.yaml` or environment variables with `SW_` prefix.

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `SW_PORT` | `3022` | API port |
| `SW_MQ_HOST` | `192.168.190.118` | MQ broker address |
| `SW_TALKOPTIONS_URL` | `http://192.168.190.118:8081` | TalkOptions API base URL |
| `SW_DB_HOST` | `localhost` | TimescaleDB host |
| `SW_DB_NAME` | `spreadwatch` | Database name |
| `SW_SPREAD_CHECK_INTERVAL` | `0.5` | Spread evaluation interval in seconds |
| `SW_MAX_PAIRS` | `100` | Maximum concurrent pair monitors |
| `SW_DEVIATION_THRESHOLD` | `2.0` | Standard deviation multiplier for alerts |
| `SW_COINTEGRATION_WINDOW` | `200` | Lookback periods for cointegration calc |
| `SW_FAIR_VALUE_MODEL` | `cost_of_carry` | Fair value model for calendar spreads |

## Environment-Specific

Production monitors all active F&O pairs. Staging uses a curated subset for faster evaluation cycles.
