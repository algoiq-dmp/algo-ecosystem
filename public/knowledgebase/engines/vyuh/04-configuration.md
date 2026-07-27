# VYUH — Configuration

**Version:** 3.0.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Configuration File

`/etc/vyuh/config.yaml` or environment variables with `VYUH_` prefix.

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `VYUH_PORT` | `3021` | API port |
| `VYUH_MQ_HOST` | `192.168.190.118` | MQ broker address |
| `VYUH_TALKOPTIONS_URL` | `http://192.168.190.118:8081` | TalkOptions API base URL |
| `VYUH_DB_HOST` | `localhost` | TimescaleDB host |
| `VYUH_DB_NAME` | `vyuh` | Database name |
| `VYUH_EVAL_INTERVAL` | `5` | Stock evaluation interval in seconds |
| `VYUH_UNIVERSE_SIZE` | `200` | Maximum stocks in evaluation universe |
| `VYUH_TREND_WEIGHT` | `0.30` | Trend factor weight in composite score |
| `VYUH_STRENGTH_WEIGHT` | `0.25` | Relative strength factor weight |
| `VYUH_SECTOR_WEIGHT` | `0.20` | Sector factor weight |
| `VYUH_OPTIONS_WEIGHT` | `0.25` | Options-derived factor weight |

## Environment-Specific

Production evaluates the full NSE F&O universe. Staging uses a reduced symbol set for faster iteration.
