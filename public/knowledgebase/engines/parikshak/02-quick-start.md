# 02 — Quick Start Guide

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Prerequisites

- Access to Algo-IQ platform with QA role permissions
- Component to test (strategy, engine build, API, or product)
- Understanding of the test report types

## Quick Start: Test a Strategy

### Step 1: Submit Strategy for Testing

Strategies are submitted from Strategy Factory automatically. To manually submit:

```bash
curl -X POST https://api.algo-iq.com/parikshak/v2/submit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "strategy",
    "source": "strategy-factory",
    "strategyId": "sf-abc123",
    "payload": { },
    "testSuites": ["full"]
  }'
```

### Step 2: Monitor Test Progress

```bash
curl https://api.algo-iq.com/parikshak/v2/submissions/sub-001
```

Response:
```json
{
  "status": "TESTING",
  "progress": { "completed": 45, "total": 120, "percent": 37.5 },
  "currentSuite": "integration-tests",
  "estimatedCompletion": "2026-07-24T15:35:00Z"
}
```

### Step 3: Review Results

When status is `COMPLETED`:

```bash
curl https://api.algo-iq.com/parikshak/v2/submissions/sub-001/reports
```

Available reports:
- `test-report.json` — Individual test case results
- `checklist.pdf` — Mandatory checks status
- `regression-report.json` — Version comparison
- `readiness-report.json` — Go/No-Go recommendation
- `performance-report.json` — Benchmarks
- `security-report.json` — Vulnerability scan

### Step 4: Take Action

| Result | Action |
|---|---|
| **All Passed, Readiness Green** | Proceed to next lifecycle stage |
| **Partial Failures** | Review failures, fix in source, resubmit |
| **Critical Failures** | Block further progression; escalate to QA lead |

## Quick Start: Test an Engine

```bash
curl -X POST https://api.algo-iq.com/parikshak/v2/submit \
  -H "Authorization: Bearer <token>" \
  -d '{
    "type": "engine",
    "engineName": "kuber-alpha",
    "version": "1.8.0",
    "testSuites": ["regression", "performance", "security"]
  }'
```

## Quick Start: Test an API

```bash
curl -X POST https://api.algo-iq.com/parikshak/v2/submit \
  -H "Authorization: Bearer <token>" \
  -d '{
    "type": "api",
    "apiSpec": "https://api.algo-iq.com/strategy-factory/v3/openapi.json",
    "testSuites": ["contract", "load", "security"]
  }'
```

## What's Next?

- Understand the [Test Framework](05-test-framework.md)
- Learn about [Strategy Testing](09-strategy-testing.md)
- Read the [Certification](16-certification.md) requirements
