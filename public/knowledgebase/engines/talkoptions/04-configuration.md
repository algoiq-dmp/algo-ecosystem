# TalkOptions — Configuration

**Version:** 4.7.2 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Configuration File

`/etc/talkoptions/config.yaml` or environment variables with `TO_` prefix.

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `TO_SERVER_PORT` | `8081` | HTTP API port |
| `TO_SSL_PORT` | `8444` | HTTPS API port |
| `TO_MQ_HOST` | `192.168.190.118` | RabbitMQ broker address |
| `TO_MQ_QUEUE` | `talkoptions.marketdata` | MQ queue for market data |
| `TO_DB_HOST` | `localhost` | PostgreSQL host |
| `TO_DB_NAME` | `talkoptions` | Database name |
| `TO_INFLUX_HOST` | `localhost:8086` | InfluxDB connection string |
| `TO_GREEKS_MODEL` | `black_scholes` | Pricing model (black_scholes/binomial) |
| `TO_CACHE_TTL` | `5` | API response cache TTL in seconds |
| `TO_RATE_LIMIT` | `1000` | Max requests per minute per consumer |
| `TO_MAX_EXPIRIES` | `12` | Maximum expiry series to compute |

## Environment-Specific

Production and pre-production use separate MQ vhosts and database schemas. Staging points to replicated PostgreSQL read replica.
