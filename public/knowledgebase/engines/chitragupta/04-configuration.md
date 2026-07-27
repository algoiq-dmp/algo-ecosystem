# Chitragupta — Configuration

**Version:** 3.0.0 | **Owner:** Compliance | **Last Updated:** 2026-07-24

## Configuration File

`/etc/chitragupta/config.yaml` or environment variables with `CHG_` prefix.

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `CHG_PORT` | `3120` | API port |
| `CHG_VEGA_MQ_QUEUE` | `vega.trade.confirmations` | Vega trade confirmation queue |
| `CHG_TALKDELTA_URL` | `http://192.168.190.104:3005` | TalkDelta API base URL |
| `CHG_DB_HOST` | `localhost` | PostgreSQL host |
| `CHG_DB_NAME` | `chitragupta` | Database name |
| `CHG_ES_HOST` | `localhost:9200` | Elasticsearch host |
| `CHG_ES_INDEX` | `chitragupta-audit` | Elasticsearch index name |
| `CHG_RETENTION_DAYS` | `3650` | Audit data retention period (10 years) |
| `CHG_HASH_ALGORITHM` | `sha256` | Audit chain hash algorithm |
| `CHG_REPORT_SCHEDULE` | `0 8 * * *` | Daily report generation cron |

## Environment-Specific

Production uses Elasticsearch cluster with 3-node redundancy. Archive policy enforced by PostgreSQL partition rotation.
