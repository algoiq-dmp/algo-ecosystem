# 12 — Regression Reports

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Overview

Regression Reports compare the current test submission against previous versions of the same component. They detect whether changes have introduced new failures, degraded performance, or altered behavior.

## Purpose

- **Detect regressions**: New failures introduced by recent changes.
- **Track improvements**: Previously failing tests now passing.
- **Trend analysis**: Test health over time.
- **Change impact assessment**: Quantify the effect of a change.

## Report Structure

```json
{
  "reportId": "rr-001",
  "submissionId": "sub-003",
  "baselineSubmissionId": "sub-002",
  "generatedAt": "2026-07-24T15:30:00Z",
  "comparison": {
    "totalTests": { "previous": 118, "current": 120, "delta": "+2" },
    "passRate": { "previous": 100, "current": 98.33, "delta": "-1.67%" },
    "durationMs": { "previous": 42000, "current": 45200, "delta": "+7.6%" }
  },
  "regressions": [
    {
      "testId": "boundary-gap-open",
      "previousStatus": "PASSED",
      "currentStatus": "FAILED",
      "severity": "HIGH",
      "introducedIn": "v1.2.0",
      "suspectedCause": "Entry signal refactoring in commit abc123"
    }
  ],
  "fixes": [
    {
      "testId": "risk-leverage-check",
      "previousStatus": "FAILED",
      "currentStatus": "PASSED"
    }
  ],
  "newTests": [
    {
      "testId": "boundary-circuit-limit",
      "status": "PASSED"
    }
  ],
  "performanceDelta": {
    "p50LatencyMs": { "previous": 45, "current": 48, "delta": "+6.7%" },
    "memoryMB": { "previous": 180, "current": 195, "delta": "+8.3%" }
  }
}
```

## Regression Categories

| Category | Description |
|---|---|
| **New Failure** | Test passed previously, fails now |
| **Fixed** | Test failed previously, passes now |
| **New Test** | Test added in this submission |
| **Removed Test** | Test removed since baseline |
| **Performance Regression** | Latency/memory increased beyond threshold |

## Baseline Selection

| Strategy | Description |
|---|---|
| **Last successful submission** | Compare against most recent passing run |
| **Last submission** | Compare against most recent run, pass or fail |
| **Specific version** | Compare against a tagged release |
| **Rolling average** | Compare against average of last N runs |

## Regression Thresholds

| Metric | Warning | Critical |
|---|---|---|
| Pass rate drop | > 0% | > 5% |
| New critical failures | 1+ | 1+ |
| P50 latency increase | > 10% | > 25% |
| P99 latency increase | > 10% | > 25% |
| Memory increase | > 10% | > 25% |

## Auto-Analysis

Parikshak attempts to identify the root cause of regressions:
- Correlates failures with recent code changes (from git).
- Flags the specific commit SHA suspected of introducing the regression.
- Links to the Jira ticket or PR associated with the change.

## Notification

Regression Reports trigger notifications when:
- Any new critical/high-severity failure is detected.
- Pass rate drops below threshold.
- Performance degradation exceeds warning threshold.

Notifications are sent via MQ, email, and Slack.
