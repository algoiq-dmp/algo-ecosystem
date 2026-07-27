# 06 — Aalap Calls Integration

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Aalap Calls is a voice-based trading signal service that delivers actionable trade recommendations. Kuber Alpha ingests Aalap Calls signals, maps them to registered strategies, and activates appropriate trade flows.

## Signal Profile

| Property | Description |
|---|---|
| Source | Human analysts + AI-assisted recommendations |
| Medium | Voice calls transcribed to structured JSON |
| Typical signals/day | 50–200 |
| Instruments | Primarily NIFTY 50, BANK NIFTY, high-volume stocks |
| Timeframe | Intraday (1m–15m) and positional (1d) |
| Confidence | Analyst-assigned rating (0.0–1.0) |

## Integration Flow

```
Aalap Calls Platform
        │
        ├── Voice call recorded
        ├── Transcription → NLP parsing
        ├── Structured JSON signal generated
        │
        ▼
    MQ: aalap.signal.{instrument}.{timeframe}
        │
        ▼
  Kuber Alpha Signal Ingestor
        │
        ├── Validate schema
        ├── Check expiry
        ├── Match strategy
        ├── Activate
        └── Dispatch to Vega
```

## Signal Format (Aalap-Specific)

```json
{
  "signalId": "aalap-20260724-001",
  "source": "aalap-calls",
  "timestamp": "2026-07-24T09:16:00Z",
  "expiresAt": "2026-07-24T09:46:00Z",
  "instrument": "NIFTY 50",
  "exchange": "NSE",
  "direction": "LONG",
  "type": "ENTRY",
  "confidence": 0.80,
  "metadata": {
    "analyst": "analyst-007",
    "callType": "INTRADAY",
    "strategyId": "sf-aalap-trend",
    "rationale": "Breakout above resistance"
  },
  "payload": {
    "entryPrice": 24500.50,
    "target1": 24550.00,
    "target2": 24600.00,
    "stopPrice": 24450.00,
    "quantity": 50
  }
}
```

## Strategy Matching

Kuber Alpha maps Aalap Calls signals to strategies using:
1. Explicit `strategyId` in signal metadata (preferred).
2. Instrument + Timeframe + Direction matching.
3. Default strategy if configured for the instrument.

## Confidence Thresholds

| Confidence | Action |
|---|---|
| ≥ 0.80 | Auto-activate (HIGH priority) |
| 0.60–0.79 | Activate with risk overlay (NORMAL priority) |
| 0.40–0.59 | Activate with reduced position size (LOW priority) |
| < 0.40 | Drop (below minimum confidence) |

## Error Handling

| Scenario | Response |
|---|---|
| Signal expired | Reject; log warning |
| No matching strategy | Reject; notify analyst |
| Strategy paused | Queue signal (TTL: expiry time) |
| Kill Switch armed | Reject all signals until disarmed |
| Vega unavailable | Retry 3x with backoff; DLQ on failure |

## Monitoring

| Metric | Description |
|---|---|
| `aalap.signals.received` | Signals received from Aalap |
| `aalap.signals.activated` | Signals that activated a strategy |
| `aalap.signals.rejected` | Signals rejected (validation fail) |
| `aalap.signals.expired` | Signals expired before processing |
| `aalap.analyst.performance` | Per-analyst activation rate |
