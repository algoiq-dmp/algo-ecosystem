# 11 — Checklists

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Overview

Checklists are mandatory verification documents that ensure all critical checks are completed before a strategy, engine, or product advances. Unlike test reports (which show individual test results), checklists are binary Go/No-Go gates.

## Strategy Deployment Checklist

| # | Check | Status | Auto/Manual |
|---|---|---|---|
| 1 | Parikshak certification complete | ☐ | Auto |
| 2 | All test suites pass (100%) | ☐ | Auto |
| 3 | No critical failures | ☐ | Auto |
| 4 | No high-severity security findings | ☐ | Auto |
| 5 | Simulator backtest meets thresholds | ☐ | Auto |
| 6 | Monte Carlo simulation within bounds | ☐ | Auto |
| 7 | Walk-forward analysis confirms stability | ☐ | Auto |
| 8 | Risk rules documented and reviewed | ☐ | Manual |
| 9 | Portfolio allocation approved | ☐ | Manual |
| 10 | DXCC approval obtained | ☐ | Auto |
| 11 | Paper trading completed (min 5 days) | ☐ | Manual |
| 12 | Staged deployment milestones met | ☐ | Manual |
| 13 | Kill switch parameters configured | ☐ | Auto |
| 14 | Monitoring alerts configured | ☐ | Manual |
| 15 | Rollback plan documented | ☐ | Manual |

## Engine Release Checklist

| # | Check | Status |
|---|---|---|
| 1 | All unit tests pass | ☐ |
| 2 | All integration tests pass | ☐ |
| 3 | Performance benchmarks within SLA | ☐ |
| 4 | Security scan clean (no HIGH/CRITICAL) | ☐ |
| 5 | API backward compatibility verified | ☐ |
| 6 | Database migration tested (up + rollback) | ☐ |
| 7 | Load test within capacity limits | ☐ |
| 8 | Monitoring dashboards updated | ☐ |
| 9 | Runbook updated | ☐ |
| 10 | Changelog published | ☐ |
| 11 | Stakeholder sign-off | ☐ |

## API Release Checklist

| # | Check | Status |
|---|---|---|
| 1 | Contract tests pass (OpenAPI spec) | ☐ |
| 2 | Authentication/authorization tests pass | ☐ |
| 3 | Rate limiting tested | ☐ |
| 4 | Error responses documented | ☐ |
| 5 | Load test at 2x expected traffic | ☐ |
| 6 | Security scan passed | ☐ |
| 7 | API versioning maintained | ☐ |
| 8 | Deprecation notices for breaking changes | ☐ |
| 9 | Client library updates published | ☐ |
| 10 | Documentation updated | ☐ |

## Checklist Enforcement

| Check Type | Enforcement |
|---|---|
| **Auto checks** | System-validated; cannot be manually overridden |
| **Manual checks** | Require reviewer sign-off with timestamp and user ID |
| **Conditional checks** | Only required based on risk level or change type |

## Blocking vs. Advisory

| Category | Effect if Incomplete |
|---|---|
| **Blocking** | Prevents progression to next stage |
| **Advisory** | Warning recorded; progression allowed with justification |

## Audit Trail

Every checklist completion generates an immutable audit record:

```json
{
  "checklistId": "cl-001",
  "submissionId": "sub-001",
  "checkId": "12",
  "status": "APPROVED",
  "reviewerId": "user@algo-iq.com",
  "timestamp": "2026-07-24T15:30:00Z",
  "comments": "Paper trading completed with acceptable results"
}
```
