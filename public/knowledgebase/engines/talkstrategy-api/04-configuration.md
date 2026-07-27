# TalkStrategy API — Configuration

**Version:** 2.8.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

## Configuration File

`/etc/talkstrategy-api/config.yaml` or environment variables with `TSA_` prefix.

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `TSA_PORT` | `3140` | API port |
| `TSA_APP_URL` | `http://192.168.190.106:3141` | TalkStrategy App middleware URL |
| `TSA_REDIS_HOST` | `localhost:6379` | Redis host for request caching |
| `TSA_RATE_LIMIT` | `50` | Max requests per second per engine |
| `TSA_REQUEST_TIMEOUT` | `5` | Request timeout in seconds |
| `TSA_MAX_BATCH_SIZE` | `20` | Maximum orders per batch request |
| `TSA_VALIDATOR_STRICT` | `true` | Enable strict validation mode |
| `TSA_RETRY_ATTEMPTS` | `3` | Retry attempts on middleware failure |
| `TSA_RETRY_BACKOFF` | `1000` | Retry backoff in milliseconds |

## Environment-Specific

Production enforces strict validation and full rate limiting. Staging allows relaxed validation for testing.
