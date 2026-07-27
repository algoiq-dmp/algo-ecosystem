# TalkStrategy API - Configuration

**Version:** 2.8.0 | **Owner:** Execution | **Last Updated:** 2026-07-25


## Configuration Files

The engine uses a layered configuration approach with TOML files:

1. **Default Config:** Shipped with the package (base.config.toml)
2. **Environment Config:** Overrides for specific environments (env.config.toml)
3. **Runtime Config:** Hot-reloaded overrides via API or Suraksha Vault

## Key Configuration Sections

### Server Settings

```toml
[server]
host = "0.0.0.0"
port = 3000
request_timeout_ms = 30000
max_payload_size_mb = 10
```

### Database Settings

```toml
[database]
host = ""
port = 5432
name = "algo_iq"
pool_max = 20
pool_idle_timeout_ms = 30000
```

### MQ Settings

```toml
[mq]
host = "localhost"
port = 5672
vhost = "/algo"
exchange = "algo.signals"
reconnect_interval_ms = 5000
```

### Strategy Settings (AALAP Calls specific)

```toml
[strategies]
symbols = ["NIFTY", "BANKNIFTY", "FINNIFTY"]
timeframe = "1m"
signal_cooldown_seconds = 30
max_positions_per_symbol = 3
```

### Logging

```toml
[logging]
level = "info"
format = "json"
output = ["stdout", "file"]
file_path = "/var/log/algo/engine.log"
max_file_size_mb = 100
```

## Environment Variables

All config values can be overridden via environment variables using double-underscore notation:

```
ALGO__SERVER__PORT=3001
ALGO__DATABASE__HOST=db.internal
ALGO__LOGGING__LEVEL=debug
```

## Encrypted Configuration

Sensitive values (passwords, API keys) are encrypted via Suraksha Vault. The engine fetches them at startup using the Vault SDK with automatic token renewal.

