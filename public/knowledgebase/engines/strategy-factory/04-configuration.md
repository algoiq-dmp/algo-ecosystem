# 04 — Configuration

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Configuration Architecture

Strategy Factory uses a layered configuration model. Settings can be applied at the platform, user, and strategy levels, with each subsequent layer overriding the previous.

```
Platform Defaults → User Preferences → Strategy Overrides
```

## Platform Configuration

Located at `config/platform.json`:

```json
{
  "maxBlocksPerStrategy": 200,
  "maxStrategiesPerUser": 100,
  "supportedInstruments": ["NIFTY 50", "BANK NIFTY", "SENSEX", "STOCKS", "FUTURES", "OPTIONS"],
  "allowedTimeframes": ["1m", "5m", "15m", "1h", "4h", "1d", "1w"],
  "exitTypes": ["stop_loss", "take_profit", "trailing", "time_based", "signal_reversal"],
  "sizingModels": ["fixed", "percentage", "volatility_adjusted", "kelly_criterion"],
  "maxPositionSizePercent": 25,
  "maxPortfolioDrawdownPercent": 30,
  "autoSaveIntervalMs": 5000,
  "maxRevisions": 50,
  "compilerTimeoutMs": 30000
}
```

## User Preferences

Each user can override defaults at `config/user/{userId}.json`:

| Preference | Type | Default | Description |
|---|---|---|---|
| `theme` | enum | `dark` | UI theme: `dark`, `light` |
| `canvasGridSize` | int | `20` | Snap grid spacing in px |
| `autoConnect` | bool | `true` | Auto-connect adjacent blocks |
| `validationMode` | enum | `live` | `live`, `manual`, `on_export` |
| `defaultExchange` | string | `NSE` | Default exchange |
| `defaultTimeframe` | string | `1d` | Default chart timeframe |
| `exportFormat` | enum | `json` | Export format: `json`, `json+proto` |

## Strategy-Level Overrides

Each strategy can override risk and execution parameters:

```json
{
  "strategyId": "sf-abc123",
  "overrides": {
    "maxPositionSizePercent": 15,
    "maxDrawdownPercent": 10,
    "allowedInstruments": ["NIFTY 50"],
    "cooldownPeriod": "5m",
    "maxOpenPositions": 3
  }
}
```

## API Configuration

### REST Endpoint Override

```bash
export PARIKSHAK_URI=https://parikshak.internal:8080
export SIMULATOR_URI=https://simulator.internal:8081
```

### MQ Routing Keys

| Key | Purpose |
|---|---|
| `strategy.factory.created` | New strategy created |
| `strategy.factory.updated` | Strategy modified |
| `strategy.factory.exported` | Strategy exported for downstream |
| `strategy.factory.deleted` | Strategy removed |

## Config Validation

The configuration is validated on startup. Invalid values trigger:
- **Warning** — Non-critical misconfiguration, engine starts
- **Error** — Critical misconfiguration, engine refuses to start
