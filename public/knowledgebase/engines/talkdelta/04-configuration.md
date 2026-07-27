# TalkDelta — Configuration

**Version:** 5.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Configuration File

`/etc/talkdelta/config.yaml` or environment variables with `TD_` prefix.

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `TD_API_PORT` | `3005` | REST API port |
| `TD_WS_PORT` | `3006` | WebSocket dashboard port |
| `TD_VEGA_MQ_QUEUE` | `vega.trade.confirmations` | Vega trade confirmation queue |
| `TD_TALKOPTIONS_URL` | `http://192.168.190.118:8081` | TalkOptions API base URL |
| `TD_DB_HOST` | `localhost` | PostgreSQL host |
| `TD_DB_NAME` | `talkdelta` | Database name |
| `TD_TIMESCALE_HOST` | `localhost` | TimescaleDB host |
| `TD_REDIS_HOST` | `localhost:6379` | Redis cache host |
| `TD_PNL_CALC_INTERVAL` | `5` | P&L recalculation interval (seconds) |
| `TD_RETENTION_DAYS` | `90` | Trade data retention period |

## Environment-Specific

Production connects to Vega on ALGO IQ 6 (192.168.190.106). Staging uses simulated trade data.
