# 10 — Test Reports

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Overview

Parikshak generates detailed Test Reports for every submission. This is the primary output that stakeholders use to assess whether a strategy, engine, API, or product is ready for the next phase.

## Report Structure

```json
{
  "reportId": "rpt-001",
  "submissionId": "sub-001",
  "generatedAt": "2026-07-24T15:30:00Z",
  "type": "test-report",
  "summary": {
    "totalTests": 120,
    "passed": 118,
    "failed": 2,
    "skipped": 0,
    "passRate": 98.33,
    "durationMs": 45200
  },
  "bySuite": [
    {
      "suiteId": "schema-validation",
      "status": "PASSED",
      "tests": 15,
      "passed": 15
    },
    {
      "suiteId": "logic-integrity",
      "status": "PASSED",
      "tests": 22,
      "passed": 22
    }
  ],
  "failures": [
    {
      "testId": "boundary-gap-open",
      "suite": "boundary-testing",
      "status": "FAILED",
      "message": "Strategy attempted entry on gap-open beyond stop",
      "expected": "No entry when gap exceeds stop-loss",
      "actual": "Entry signal fired at 09:15:01",
      "severity": "HIGH"
    }
  ],
  "trend": {
    "previousPassRate": 100,
    "currentPassRate": 98.33,
    "regression": true
  }
}
```

## Report Formats

| Format | Use Case |
|---|---|
| JSON | Machine consumption, API integration |
| PDF | Human review, DXCC submission, audit records |
| HTML | Interactive dashboard, drill-down analysis |
| CSV | Spreadsheet analysis, bulk processing |

## Report Delivery

Reports are delivered via:
- **MQ Topic**: `parikshak.reports.{submissionId}` — for automated consumers.
- **REST API**: `GET /v2/submissions/{id}/reports/{type}` — on-demand retrieval.
- **Webhook**: Configured callback URL — pushed on completion.
- **Email**: Summary PDF — for manual review workflows.

## Report Retention

| Environment | Retention Period |
|---|---|
| Development | 7 days |
| Staging | 30 days |
| Production | 90 days (configurable) |

## Report Sections

### Summary Section
- Total/passed/failed/skipped counts
- Overall pass rate (%)
- Duration
- Timestamp

### Suite Breakdown
- Per-suite pass/fail counts
- Suite-level status (PASSED/FAILED/ERROR)
- Duration per suite

### Failure Details
- Test case identifier
- Suite name
- Error message
- Expected vs. Actual
- Severity (CRITICAL/HIGH/MEDIUM/LOW)
- Stack trace (if applicable)
- Screenshot (if applicable)

### Trend Analysis
- Comparison with previous submission
- Regression flag
- New failures vs. previously seen failures

### Recommendations
- Auto-generated based on failure patterns
- Suggested fixes
- Links to relevant documentation

## Report Status Flow

```
QUEUED → GENERATING → READY → DELIVERED
                          │
                          └── ERROR (generation failed)
```
