# 14 — Parikshak Integration

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

The Parikshak integration is the first downstream connection in the strategy lifecycle. Once a strategy is exported from Strategy Factory, it is automatically submitted to Parikshak for enterprise-grade testing and certification.

## Integration Flow

```
Strategy Factory                    Parikshak
     │                                 │
     ├── Export JSON ─────────────────▶│
     │   (MQ: parikshak.incoming)      │
     │                                 ├── Validate schema
     │                                 ├── Parse strategy logic
     │                                 ├── Generate test suite
     │                                 ├── Execute tests
     │                                 ├── Produce reports
     │   ◀─── Test Results ────────────┤
     │   (MQ: strategy.factory.result) │
     │                                 │
     ├── Update strategy status        │
     └── Notify user                   │
```

## What Parikshak Tests

| Test Category | Description |
|---|---|
| Schema Validation | JSON structure correctness |
| Logic Integrity | No unreachable paths, circular dependencies |
| Risk Rule Compliance | Strategy respects configured risk limits |
| Boundary Testing | Edge cases (zero volume, gap openings, circuit limits) |
| Integration Testing | Communication with Simulator, Kuber Alpha, MQ |
| Performance | Compilation time, JSON payload size |
| Security | Injection vectors, auth token validation |

## Parikshak Reports

| Report | Content |
|---|---|
| Test Report | Pass/fail per test case with details |
| Checklist | Mandatory checks before proceeding |
| Regression Report | Comparison against previous strategy versions |
| Readiness Report | Go/No-Go recommendation |
| Performance Report | Execution benchmarks |
| Security Report | Vulnerability scan results |

## Submission API

```json
POST /api/v1/submit-to-parikshak
{
  "strategyId": "sf-abc123",
  "strategyJson": { },
  "priority": "normal",
  "testSuite": "full",
  "callbackUrl": "https://strategy-factory/api/callback"
}
```

## Status Tracking

| Status | Meaning |
|---|---|
| `SUBMITTED` | Strategy sent to Parikshak |
| `VALIDATING` | Schema and logic validation in progress |
| `TESTING` | Test suites executing |
| `PASSED` | All tests passed, certified |
| `FAILED` | One or more tests failed |
| `ERROR` | System error during testing |

## Retry Policy

- **Schema failures**: Auto-retry disabled. Must fix in Strategy Factory.
- **Logic warnings**: Auto-retry up to 3 times with minor auto-fixes.
- **System errors**: Auto-retry up to 3 times with exponential backoff (5s, 25s, 125s).

## Certification

A strategy is "Parikshak Certified" when:
- All mandatory test suites pass (100% pass rate).
- Readiness report is green.
- No high-severity security vulnerabilities.
- Performance benchmarks are within acceptable ranges.
