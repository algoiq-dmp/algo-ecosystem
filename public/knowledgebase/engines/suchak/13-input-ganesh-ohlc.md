# 13 — Input: Ganesh OHLC

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Overview

**Ganesh** is the historical and real-time OHLC data service that serves as the primary price data source for Suchak. It provides candlestick data across multiple timeframes for all tradable instruments.

## Data Structure

### OHLC Bar Format

```json
{
  "symbol": "NIFTY",
  "timeframe": "1d",
  "timestamp": "2026-07-24T09:15:00+05:30",
  "open": 24450.00,
  "high": 24600.00,
  "low": 24400.00,
  "close": 24550.00,
  "volume": 125000,
  "oi": 450000
}
```

### Supported Timeframes

| Code | Duration | Bars per Day | Use Case |
|------|----------|-------------|----------|
| `1m` | 1 minute | 375 | Scalping, execution |
| `5m` | 5 minutes | 75 | Intraday trading |
| `15m` | 15 minutes | 25 | Swing / intraday |
| `1h` | 1 hour | 6 | Positional intraday |
| `1d` | 1 day | 1 | Swing / positional |
| `1wk` | 1 week | ~0.2 | Long-term trend |

## Data Delivery Modes

### 1. Historical Bulk Fetch

```yaml
request:
  symbol: "NIFTY"
  timeframe: "1d"
  from: "2024-01-01"
  to: "2026-07-24"
```

Used for initializing indicator windows and backtesting.

### 2. Real-Time Streaming

WebSocket subscription for live bar updates:

```json
{
  "action": "subscribe",
  "symbols": ["NIFTY", "BANKNIFTY", "FINNIFTY"],
  "timeframes": ["1m", "5m", "15m", "1h"]
}
```

- Bar closes trigger indicator recomputation
- Partial bars (in-progress) optionally available for real-time RSI/MACD

## Data Quality

| Check | Action |
|-------|--------|
| Missing bars | Linearly interpolate up to 3 missing bars |
| Out-of-sequence timestamps | Reorder and flag |
| Zero/negative prices | Discard, use previous bar |
| Volume spikes (>10× avg) | Flag anomaly, use raw |
| Corporate actions (splits/bonus) | Adjusted automatically |

## Caching Strategy

```
┌────────────┐     ┌──────────────┐     ┌───────────────┐
│ Ganesh API │────>│ Suchak Ingest│────>│ Redis Cache   │
└────────────┘     └──────────────┘     └───────────────┘
                                                │
                                          ┌─────┴─────┐
                                          │ Indicators │
                                          └───────────┘
```

- **Warm cache:** 200 bars per symbol per timeframe (sufficient for longest indicator)
- **TTL:** Bars forever; partial bars TTL 2 minutes
- **Eviction:** LRU when memory pressure

## Connection Parameters

```yaml
ganesh:
  host: ganesh.internal.algoiq.io
  port: 8080
  tls: true
  auth: mtls
  reconnect:
    max_attempts: 10
    backoff: exponential
    max_backoff: 30s
```

## Error Handling

| Error | Behavior |
|-------|----------|
| Connection lost | Buffer incoming ticks; reconnect with backoff |
| Data gap > 5 min | Flag indicator values as "stale" |
| Symbol delisted | Remove from active list; notify consumers |
| Rate limit hit | Queue requests; priority to real-time feeds |

## Performance

| Metric | Value |
|--------|-------|
| Historical fetch (1yr, 1d) | < 500ms |
| WebSocket latency | < 10ms |
| Throughput | 10,000 bars/sec |
