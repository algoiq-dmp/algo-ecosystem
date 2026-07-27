# 09 — Strategy Testing

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Overview

Strategy Testing is Parikshak's core competency — the comprehensive validation of algorithmic trading strategies before they reach production. Every strategy from Strategy Factory must pass this test suite.

## Test Suite Structure

```
strategy-full
├── 01-schema-validation
├── 02-logic-integrity
├── 03-risk-compliance
├── 04-boundary-testing
├── 05-data-quality
├── 06-performance-benchmark
└── 07-security-scan
```

## 01 — Schema Validation

Validates the exported JSON against the strategy schema:

| Check | Description |
|---|---|
| Required fields present | id, name, version, entry, exits, risk |
| Field types correct | Strings are strings, numbers are numbers |
| Enum values valid | Direction is LONG/SHORT/BOTH |
| Array lengths | At least 1 exit rule; entry signals > 0 |
| Nested schema | Each block has valid params |

## 02 — Logic Integrity

| Check | Description |
|---|---|
| No orphan blocks | Every block must be connected or be root |
| No circular dependencies | Graph must be a DAG |
| Reachability | All blocks reachable from entry point |
| Dead code detection | Blocks that can never execute |
| Conflicting rules | e.g., LONG and SHORT on same trigger |
| Redundant blocks | Two identical filters in sequence |

## 03 — Risk Compliance

| Check | Failure Condition |
|---|---|
| Hard stop required | No stop-loss configured |
| Max position size | > platform maximum |
| Max leverage | > platform maximum |
| Min R:R ratio | Risk-reward below minimum |
| Max drawdown | No portfolio-level drawdown rule |
| Cooldown missing | No cooldown on high-frequency strategy |
| Daily loss limit missing | No daily circuit breaker |

## 04 — Boundary Testing

| Scenario | Expected Behavior |
|---|---|
| Zero volume bar | Signal not triggered |
| Circuit limit hit | No new entries |
| Gap open beyond stop | Stop executes at market |
| Instrument delisted | Strategy auto-pauses |
| Data feed gap | Signal skipped for that bar |
| Negative price | Invalid; strategy rejects |
| Zero capital | No position opened |
| Max positions reached | Entry signal ignored |

## 05 — Data Quality

| Check | Validation |
|---|---|
| Instrument exists in Ganesh | Confirmed |
| Timeframe data available | Historical and live |
| Quality score ≥ threshold | Min 80 required |
| Data freshness | Within max age |
| No data gaps in lookback | Required for indicators |

## 06 — Performance Benchmark

| Metric | Threshold |
|---|---|
| Compilation time | < 200ms |
| JSON payload size | < 5MB |
| Memory footprint | < 256MB |
| CPU time | < 100ms |
| Signal evaluation latency | < 10ms (simulated) |

## 07 — Security Scan

| Check | Description |
|---|---|
| No injected code | JSON fields sanitized |
| No external URLs | Strategy must not reference external resources |
| Auth token not embedded | No secrets in strategy payload |
| Binary content | Base64 size < 1MB |

## Pass Criteria

- 100% pass rate on schema, logic, and security.
- 100% pass rate on risk compliance (critical rules).
- 100% pass rate on boundary tests.
- Performance within thresholds.
- Data quality score ≥ 80.
