# DXCC — Configuration

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## Configuration File: `config.json`

```json
{
  "narad": {
    "ws_url": "wss://narad-gateway.internal:443/ws",
    "reconnect_interval_ms": 3000,
    "max_reconnect_attempts": 10,
    "heartbeat_interval_sec": 10,
    "topics": {
      "subscribe": [
        "engine.health.*",
        "market.*",
        "strategy.*",
        "order.*",
        "risk.*",
        "audit.*",
        "alert.*",
        "narad.metrics"
      ]
    }
  },
  "api": {
    "base_url": "https://kraken-api-gateway.internal/api/v2",
    "timeout_sec": 30,
    "retry_attempts": 3,
    "retry_backoff_ms": 500
  },
  "auth": {
    "provider": "keycloak",
    "issuer_url": "https://auth.internal/realms/dxcc",
    "client_id": "dxcc-frontend",
    "redirect_uri": "https://dxcc.internal/callback",
    "token_refresh_buffer_sec": 300
  },
  "session": {
    "timeout_inactivity_sec": 1800,
    "timeout_absolute_sec": 43200,
    "cookie_name": "dxcc_session",
    "secure": true,
    "same_site": "strict"
  },
  "theme": {
    "default": "dark",
    "modes": ["light", "dark", "high-contrast"],
    "brand_color_primary": "#3b82f6",
    "brand_logo_url": "/assets/logo.svg"
  },
  "widgets": {
    "max_per_dashboard": 20,
    "default_refresh_ms": 0,
    "cache_ttl_sec": 30,
    "max_table_rows": 100000
  },
  "monitoring": {
    "sentry_dsn": "https://...",
    "grafana_url": "https://grafana.internal",
    "prometheus_url": "https://prometheus.internal"
  },
  "notifications": {
    "slack_webhook_url": "https://hooks.slack.com/...",
    "pagerduty_integration_key": "...",
    "email_from": "dxcc@internal.com"
  },
  "database": {
    "postgresql": {
      "host": "localhost",
      "port": 5432,
      "database": "dxcc",
      "user": "dxcc_app",
      "password_env": "DXCC_DB_PASSWORD",
      "max_connections": 25,
      "max_idle_connections": 5,
      "connection_lifetime_sec": 300
    },
    "redis": {
      "host": "localhost",
      "port": 6379,
      "password_env": "DXCC_REDIS_PASSWORD",
      "db": 0,
      "max_retries": 3
    }
  }
}
```

---

## Environment Variables

All secrets must be provided via environment variables, never committed to configuration files.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DXCC_DB_PASSWORD` | Yes | — | PostgreSQL password |
| `DXCC_REDIS_PASSWORD` | No | — | Redis password |
| `DXCC_JWT_PRIVATE_KEY` | Yes | — | RSA private key for JWT signing (PEM) |
| `DXCC_JWT_PUBLIC_KEY` | No | — | RSA public key for JWT verification (PEM) |
| `DXCC_SESSION_SECRET` | Yes | — | 32-byte secret for session encryption |
| `DXCC_OAUTH2_CLIENT_SECRET` | Yes | — | OAuth2 client secret |
| `DXCC_SLACK_WEBHOOK_URL` | No | — | Slack webhook for alerts |
| `DXCC_PAGERDUTY_KEY` | No | — | PagerDuty integration key |
| `DXCC_SENTRY_DSN` | No | — | Sentry error tracking DSN |
| `DXCC_ENV` | No | `development` | Environment: `development`, `staging`, `production` |
| `DXCC_LOG_LEVEL` | No | `info` | Log level: `debug`, `info`, `warn`, `error` |
| `DXCC_PORT` | No | `8080` | Backend API server port |

---

## Per-User Customization Settings

Stored in the `user_preferences` PostgreSQL table, these settings control the individual user experience:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `theme` | enum | `dark` | UI color mode: `light`, `dark`, `high-contrast` |
| `font_size` | enum | `medium` | Base font size: `small`, `medium`, `large` |
| `default_view` | string | `executive-dashboard` | Module loaded on login |
| `dashboard_layout` | JSON | System default | Widget grid layout for Executive Dashboard |
| `watchlists` | JSON | `[]` | Custom symbol watchlists for Market Operations |
| `notification_channels` | JSON | `{}` | Per-severity channel map: `{"P0":["slack","pagerduty"],"P1":["slack"]}` |
| `quiet_hours_start` | time | `null` | Start of quiet hours (HH:MM) |
| `quiet_hours_end` | time | `null` | End of quiet hours (HH:MM) |
| `quiet_hours_timezone` | string | `Asia/Kolkata` | Timezone for quiet hours |
| `digest_mode` | boolean | `false` | Batch alerts into periodic summaries |
| `digest_interval_min` | integer | `60` | Interval for digest summaries |
| `table_page_size` | integer | `50` | Rows per page in data tables |
| `chart_timeframe` | string | `1h` | Default chart timeframe |
| `timezone` | string | `Asia/Kolkata` | Display timezone |

---

## Organization Customization

Configuration applied globally at the organization level:

| Setting | Type | Purpose |
|---------|------|---------|
| `branding.logo_url` | URL | Custom logo in header and login page |
| `branding.company_name` | string | Organization name throughout the UI |
| `branding.primary_color` | hex | Primary UI accent color |
| `branding.secondary_color` | hex | Secondary UI accent color |
| `roles.custom` | JSON array | Custom RBAC role definitions beyond the 5 built-in |
| `dashboard.templates` | JSON array | Pre-built layout templates for different teams |
| `reports.templates` | JSON array | Custom report formats and schedules |
| `sso.provider_config` | JSON | OIDC/SAML provider endpoint and claim mappings |
| `audit.retention_days` | integer | Override default 10-year retention for audit logs |
| `session.timeout_sec` | integer | Override default session timeout |

---

## Configuration Loading Order

DXCC resolves configuration values in this priority order (highest wins):

1. **Command-line flags** (e.g., `--port=9090`)
2. **Environment variables** (e.g., `DXCC_PORT=9090`)
3. **Configuration file** (`config.json`)
4. **Defaults** (hardcoded in application)

The Viper library handles this resolution automatically:

```go
viper.SetConfigName("config")
viper.SetConfigType("json")
viper.AddConfigPath(".")
viper.AddConfigPath("/etc/dxcc/")
viper.AddConfigPath("$HOME/.dxcc/")
viper.AutomaticEnv()
viper.SetEnvPrefix("DXCC")
viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
```

---

> **Next:** See [12-installation.md](12-installation.md) for step-by-step installation instructions.
