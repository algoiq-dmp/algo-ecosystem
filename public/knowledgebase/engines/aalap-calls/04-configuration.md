# AALAP Calls — Configuration

**Version:** 2.5.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Configuration File

`/etc/aalap-calls/config.yaml` or environment variables with `AALAP_` prefix.

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `AALAP_SIGNALS_PORT` | `3030` | Signal aggregator API port |
| `AALAP_STRATEGY_PORTS` | `3031-3044` | Individual strategy API ports |
| `AALAP_MQ_HOST` | `192.168.190.118` | MQ broker address |
| `AALAP_TALKOPTIONS_URL` | `http://192.168.190.118:8081` | TalkOptions API base URL |
| `AALAP_DB_HOST` | `localhost` | TimescaleDB host |
| `AALAP_DB_NAME` | `aalap_calls` | Database name |
| `AALAP_STRATEGY_COUNT` | `15` | Number of active strategy engines |
| `AALAP_SIGNAL_DEDUP_WINDOW` | `5` | Deduplication window in seconds |
| `AALAP_MIN_SIGNAL_INTERVAL` | `10` | Minimum seconds between signals per strategy |

## Environment-Specific

Each strategy has its own parameter set in `/etc/aalap-calls/strategies/<id>.yaml`. Production runs all 15; staging runs a subset of 5 for validation.
