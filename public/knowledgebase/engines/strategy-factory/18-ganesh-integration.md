# 18 — Ganesh Integration

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

Ganesh is the data quality and validation layer for the Algo-IQ ecosystem. Strategy Factory integrates with Ganesh to ensure that all market data referenced by strategies meets quality, integrity, and freshness standards.

## Ganesh Responsibilities

- **Data Quality Scoring**: Assigns a quality score (0–100) to each data source.
- **Freshness Validation**: Verifies data is within configured staleness thresholds.
- **Consistency Checks**: Detects anomalies, gaps, and outliers in market data.
- **Data Lineage**: Tracks the origin and transformations applied to every data point.
- **Alerting**: Notifies when data quality drops below acceptable thresholds.

## Integration Points

### During Strategy Construction

When a user selects an instrument or indicator that requires market data, Strategy Factory queries Ganesh:

```json
GET /api/ganesh/data-quality?instrument=NIFTY+50&timeframe=1d
Response:
{
  "instrument": "NIFTY 50",
  "timeframe": "1d",
  "qualityScore": 98,
  "lastUpdated": "2026-07-24T15:29:00Z",
  "freshness": "REALTIME",
  "gaps": [],
  "status": "HEALTHY"
}
```

### During Parikshak Testing

Parikshak calls Ganesh to validate that test data meets quality standards before certifying a strategy.

### During Simulator Backtesting

The Simulator relies on Ganesh for clean, validated historical data. If Ganesh reports data quality issues, the backtest is aborted.

### During Kuber Alpha Operation

Ganesh continuously monitors live data feeds. If quality drops below threshold, a warning is sent to Kuber Alpha, which may pause affected strategies.

## Data Quality Thresholds

| Threshold | Action |
|---|---|
| Score ≥ 80 | Normal operation |
| Score 60–79 | Warning logged; strategy continues |
| Score 40–59 | Alert sent; strategy owner notified |
| Score < 40 | Strategy paused; requires manual review |

## MQ Events from Ganesh

| Event | Description |
|---|---|
| `ganesh.quality.drop` | Data quality fell below threshold |
| `ganesh.quality.restored` | Data quality back to normal |
| `ganesh.data.gap` | Gap detected in market data |
| `ganesh.source.outage` | Data source unreachable |

## Configuration

```json
{
  "ganesh": {
    "uri": "https://ganesh.internal:8082",
    "qualityThreshold": 80,
    "freshnessMaxAge": "5m",
    "retryAttempts": 3,
    "circuitBreakerTimeout": 30000
  }
}
```

## Circuit Breaker

If Ganesh is unreachable:
1. Strategy Factory fails gracefully — blocks requiring data show "Data Unavailable".
2. Circuit trips after 3 failed requests in 60 seconds.
3. Auto-resets after 30 seconds of successful health checks.
4. Downstream engines (Parikshak, Simulator) independently handle Ganesh unavailability.
