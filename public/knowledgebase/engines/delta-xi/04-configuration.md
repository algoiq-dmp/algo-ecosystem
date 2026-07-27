# Delta XI — Configuration

**Version:** 3.2.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Configuration File

`/etc/delta-xi/config.yaml` or environment variables with `DXI_` prefix.

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `DXI_PORT` | `3020` | API port |
| `DXI_MQ_HOST` | `192.168.190.118` | MQ broker address |
| `DXI_TALKOPTIONS_URL` | `http://192.168.190.118:8081` | TalkOptions API base URL |
| `DXI_DB_HOST` | `localhost` | TimescaleDB host |
| `DXI_DB_NAME` | `delta_xi` | Database name |
| `DXI_SCAN_INTERVAL` | `1` | Scanner evaluation interval in seconds |
| `DXI_MAX_SYMBOLS` | `500` | Maximum concurrently scanned symbols |
| `DXI_SIGNAL_TTL` | `300` | Signal expiry time in seconds |
| `DXI_MIN_CONFIDENCE` | `0.5` | Minimum confidence to publish a signal |

## Environment-Specific

Production points to TalkOptions on ALGO IQ 18 and MQ on the primary broker. Staging uses mock option data for screener testing.
