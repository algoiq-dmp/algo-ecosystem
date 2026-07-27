# TalkOffice — Configuration

**Version:** 4.0.0 | **Owner:** Operations | **Last Updated:** 2026-07-24

## Configuration File

`/etc/talkoffice/config.yaml` or environment variables with `TOF_` prefix.

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `TOF_PORT` | `3080` | API and WebSocket port |
| `TOF_VEGA_MQ_QUEUE` | `vega.trade.confirmations` | Vega confirmation queue |
| `TOF_DB_HOST` | `localhost` | PostgreSQL host |
| `TOF_DB_NAME` | `talkoffice` | Database name |
| `TOF_MTM_INTERVAL` | `1` | MTM recalculation interval in seconds |
| `TOF_MARGIN_REFRESH` | `60` | Margin data refresh interval in seconds |
| `TOF_RISK_CHECK_INTERVAL` | `5` | Risk limit check interval in seconds |
| `TOF_ALERT_THRESHOLD` | `80` | Margin utilization alert threshold (%) |
| `TOF_RETENTION_DAYS` | `365` | Trade/position data retention |

## Environment-Specific

Production connects to Vega on ALGO IQ 6. Broker API credentials managed via Suraksha secrets vault.
