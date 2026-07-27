# 05 — Signal Reception

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Signal Reception is the entry point for all trading opportunities into Kuber Alpha. The Signal Ingestor listens on dedicated MQ queues for signals from upstream engines and validates them before passing them to the Strategy Activator.

## Signal Sources

```
Layer 4: Signal Sources
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│  Aalap   │ │ Delta XI │ │  VYUH   │ │ TalkDelta AI │
│  Calls   │ │          │ │         │ │              │
└────┬─────┘ └────┬─────┘ └────┬────┘ └──────┬───────┘
     │            │            │              │
     └────────────┴────────────┴──────────────┘
                         │
                    MQ Queues
                         │
                         ▼
              ┌──────────────────┐
              │ SIGNAL INGESTOR   │
              │ (Kuber Alpha)     │
              └──────────────────┘
```

## Signal Schema

All signals must conform to the standard signal schema:

```json
{
  "signalId": "sig-uuid-001",
  "source": "aalap-calls",
  "timestamp": "2026-07-24T09:16:00Z",
  "expiresAt": "2026-07-24T09:16:30Z",
  "instrument": "NIFTY 50",
  "exchange": "NSE",
  "direction": "LONG",
  "type": "ENTRY",
  "confidence": 0.85,
  "metadata": {
    "strategyId": "sf-abc123",
    "signalStrength": "STRONG",
    "timeframe": "15m"
  },
  "payload": {
    "entryPrice": 24500.50,
    "targetPrice": 24600.00,
    "stopPrice": 24450.00,
    "quantity": 50
  }
}
```

## Validation Rules

| Rule | Failure Action |
|---|---|
| Schema valid | Reject + DLQ |
| Timestamp not expired | Reject (stale signal) |
| Source is whitelisted | Reject (unknown source) |
| Instrument exists in Ganesh | Reject (unknown instrument) |
| Direction is LONG/SHORT | Reject (invalid direction) |
| Confidence ≥ threshold | Warn (low confidence) |
| No duplicate within dedup window | Drop (duplicate) |

## Deduplication

Signals are deduplicated within a configurable window (`dedupWindowMs`, default 5000ms):

```
Signal 1 (sig-001, 09:16:00.000) → Accepted
Signal 2 (sig-001, 09:16:02.500) → Dropped (duplicate, within 5s window)
Signal 3 (sig-001, 09:16:06.000) → Accepted (window expired)
```

## Signal Priority

| Priority | Source | Handling |
|---|---|---|
| **HIGH** | TalkDelta AI (high confidence) | Processed immediately |
| **NORMAL** | Aalap Calls, Delta XI | Processed in FIFO order |
| **LOW** | Low-confidence signals | Processed after normal queue |

## Signal Lifecycle

```
Received → Validated → Deduplicated → Prioritized → Activated → Dispatched
   │            │            │              │            │
   ▼            ▼            ▼              ▼            ▼
 REJECT       DLQ         DROPPED        QUEUED      TO VEGA
```

## Performance

| Metric | Target |
|---|---|
| Signal ingestion rate | 5000 signals/sec |
| Signal validation latency | < 5ms |
| End-to-end (receive → dispatch) | < 50ms P99 |
| Queue depth max | 10000 (backpressure) |

## Monitoring

| Metric | Description |
|---|---|
| `signals.received.total` | Total signals ingested |
| `signals.rejected.total` | Signals rejected (invalid) |
| `signals.dropped.total` | Signals dropped (duplicate) |
| `signals.processed.total` | Signals forwarded to Activator |
| `signals.latency.p99` | 99th percentile processing latency |
| `signals.queue.depth` | Current queue depth |
