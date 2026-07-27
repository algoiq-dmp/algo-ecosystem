# 13 — Readiness Reports

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Overview

The Readiness Report is the definitive Go/No-Go recommendation produced by Parikshak. It consolidates all test outcomes, checklists, regression data, and performance metrics into a single, actionable verdict.

## Report Structure

```json
{
  "reportId": "rdr-001",
  "submissionId": "sub-001",
  "generatedAt": "2026-07-24T15:30:00Z",
  "component": {
    "type": "strategy",
    "id": "sf-abc123",
    "version": "1.2.0"
  },
  "verdict": "GO",
  "confidence": 98,
  "summary": {
    "testPassRate": 100,
    "checklistComplete": true,
    "regressionFree": true,
    "performanceWithinSLA": true,
    "securityClear": true
  },
  "gates": [
    { "gate": "Unit Tests", "status": "PASSED", "details": "120/120 passed" },
    { "gate": "Integration Tests", "status": "PASSED", "details": "45/45 passed" },
    { "gate": "Security Scan", "status": "PASSED", "details": "0 findings" },
    { "gate": "Performance", "status": "PASSED", "details": "All metrics within SLA" },
    { "gate": "Checklist", "status": "PASSED", "details": "15/15 checks complete" },
    { "gate": "Regression", "status": "PASSED", "details": "No regressions detected" }
  ],
  "risks": [],
  "recommendations": [
    "Proceed to Simulator backtesting",
    "Consider increasing cooldown period based on backtest volatility"
  ],
  "approvals": [
    { "role": "QA Lead", "status": "APPROVED", "user": "qa-lead@algo-iq.com" },
    { "role": "Strategy Owner", "status": "APPROVED", "user": "owner@algo-iq.com" }
  ]
}
```

## Verdict Types

| Verdict | Meaning |
|---|---|
| **GO** | All gates passed. Ready for next stage. |
| **CONDITIONAL GO** | All critical gates passed; non-critical warnings present. Proceed with caution. |
| **NO-GO** | One or more critical gates failed. Cannot proceed. |
| **PENDING** | Manual review gates awaiting sign-off. |

## Gates

Each gate is a mandatory checkpoint:

| Gate | Auto/Manual | Weight |
|---|---|---|
| Unit Tests | Auto | Critical |
| Integration Tests | Auto | Critical |
| API Tests | Auto | Critical |
| Strategy Tests | Auto | Critical |
| Security Scan | Auto | Critical |
| Performance | Auto | Critical |
| Data Quality | Auto | Critical |
| Checklist | Mixed | Critical |
| Regression | Auto | High |
| Code Review | Manual | High |
| Stakeholder Sign-off | Manual | Critical |

## Confidence Score

A 0–100 score reflecting the reliability of the verdict:
- **100**: All gates auto-passed, zero warnings.
- **80–99**: All critical gates passed, minor advisory warnings.
- **60–79**: Conditional GO — some gates have warnings.
- **40–59**: NO-GO — at least one high-severity gate failed.
- **0–39**: NO-GO — critical gates failed.

## Risks

Risks are non-blocking concerns documented in the report:

```json
{
  "risks": [
    {
      "severity": "MEDIUM",
      "description": "Strategy has no cooldown period configured",
      "mitigation": "Add a 5-minute cooldown before deploying live"
    }
  ]
}
```

## Lifecycle Impact

| Report To | Used By |
|---|---|
| Strategy Factory | Updates strategy status; enables next stage button |
| Simulator | Receives certified strategy for backtesting |
| DXCC | Primary input for compliance review |
| Kuber Alpha | Receives deployment approval signal |

## Report Delivery

- Published to MQ topic: `parikshak.readiness.{submissionId}`
- Available via API: `GET /v2/submissions/{id}/reports/readiness`
- Emailed to: Strategy Owner, QA Lead, DXCC Reviewer
- Archived for audit: 90 days (production), 30 days (staging)
