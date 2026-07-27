# 04 — Configuration

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Configuration Layers

```
Global Defaults → Environment Overrides → Per-Submission Settings
```

## Global Configuration

`config/parikshak.json`:

```json
{
  "orchestrator": {
    "maxConcurrentSuites": 10,
    "testTimeoutMs": 600000,
    "retryFailedTests": 2,
    "retentionDays": 90
  },
  "workers": {
    "minReplicas": 2,
    "maxReplicas": 20,
    "cpuThreshold": 80,
    "queueDepthThreshold": 5
  },
  "reporting": {
    "formats": ["json", "pdf", "html"],
    "maxReportSizeMB": 50,
    "includeScreenshots": true
  },
  "thresholds": {
    "minPassRate": 100,
    "maxCriticalFailures": 0,
    "maxHighSeverityFindings": 0,
    "maxResponseTimeMs": 5000,
    "maxP99LatencyMs": 200,
    "maxErrorRate": 0.01
  },
  "security": {
    "scanTimeoutMs": 300000,
    "maxMediumSeverity": 5,
    "maxLowSeverity": 20
  }
}
```

## Threshold Configuration

| Threshold | Default | Description |
|---|---|---|
| `minPassRate` | 100% | Minimum pass rate for certification |
| `maxCriticalFailures` | 0 | Critical failures allowed (always 0) |
| `maxHighSeverityFindings` | 0 | High-severity security findings |
| `maxResponseTimeMs` | 5000 | Max API response time |
| `maxP99LatencyMs` | 200 | Max 99th percentile latency |
| `maxErrorRate` | 0.01 | Max error rate (1%) |

## Test Suite Configuration

Each test suite can override thresholds:

```json
{
  "suiteId": "strategy-full",
  "overrides": {
    "testTimeoutMs": 900000,
    "minPassRate": 98,
    "excludedTests": ["monte-carlo-10000"]
  }
}
```

## MQ Configuration

| Queue | Purpose | TTL |
|---|---|---|
| `parikshak.submissions` | Incoming test requests | 24h |
| `parikshak.results` | Test result stream | 7d |
| `parikshak.reports` | Completed reports | 30d |
| `parikshak.dlq` | Failed/dead-letter | 7d |

## Environment-Specific Configuration

| Environment | Worker Replicas | Retention Days | Log Level |
|---|---|---|---|
| Development | 2 | 7 | debug |
| Staging | 4 | 30 | info |
| Production | 8–20 (auto) | 90 | warn |

## Configuration Validation

On startup, Parikshak validates:
- All required environment variables are set.
- MongoDB, Redis, MQ are reachable.
- Test suite definitions are valid.
- Threshold values are within acceptable ranges.

Invalid configuration prevents startup.
