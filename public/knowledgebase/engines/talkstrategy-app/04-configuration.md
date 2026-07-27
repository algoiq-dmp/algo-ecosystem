# TalkStrategy App — Configuration

**Version:** 2.5.0 | **Owner:** Frontend | **Last Updated:** 2026-07-24

## Configuration File

`/etc/talkstrategy-app/config.yaml` or environment variables with `TSAPP_` prefix.

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `TSAPP_PORT` | `3141` | HTTP and WebSocket port |
| `TSAPP_API_URL` | `http://192.168.190.106:3140` | TalkStrategy API base URL |
| `TSAPP_VEGA_URL` | `http://192.168.190.106:9095` | Vega Order Processor URL |
| `TSAPP_RETRY_ATTEMPTS` | `5` | Max delivery retry attempts |
| `TSAPP_RETRY_BACKOFF` | `500` | Retry backoff in milliseconds |
| `TSAPP_ACK_TIMEOUT` | `10` | Max wait for Vega acknowledgment (seconds) |
| `TSAPP_WS_HEARTBEAT` | `30` | WebSocket heartbeat interval (seconds) |
| `TSAPP_UI_ENABLED` | `true` | Enable strategy management UI |

## Environment-Specific

Production routes to Vega on ALGO IQ 6:9095. Staging uses a simulated order processor for UI testing.
