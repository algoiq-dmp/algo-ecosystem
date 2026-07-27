# 16 — DXCC Integration

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

DXCC (Deployment & eXchange Compliance Controller) is the approval gate before a strategy can go live. It consolidates Parikshak test results, Simulator backtest reports, and regulatory compliance checks into a single approval workflow.

## Role of DXCC

- **Review Gatekeeper**: Ensures only validated, compliant strategies reach production.
- **Risk Auditor**: Verifies risk rules are appropriate and not overridden without authorization.
- **Compliance Enforcer**: Checks strategies against SEBI, exchange, and internal regulatory requirements.
- **Audit Trail**: Maintains immutable records of all approvals and rejections.

## Submission Package

Strategy Factory assembles a submission package for DXCC:

```json
{
  "submissionId": "dxcc-sub-001",
  "strategyId": "sf-abc123",
  "package": {
    "strategyJson": { },
    "parikshakReports": {
      "testReport": "...",
      "checklist": "...",
      "readinessReport": "...",
      "securityReport": "..."
    },
    "simulatorResults": {
      "backtestId": "bt-xyz789",
      "metrics": {},
      "equityCurve": []
    },
    "riskAssessment": {
      "riskScore": 35,
      "violations": [],
      "overrides": []
    }
  },
  "submittedBy": "user@algo-iq.com",
  "submittedAt": "2026-07-24T15:00:00Z"
}
```

## Approval Workflow

```
Submitted → Triage → Technical Review → Risk Review → Compliance Review → Approved/Rejected
```

### Triage
Auto-classification based on risk score:
- **Low Risk** (0–30): Fast-track review
- **Medium Risk** (31–60): Standard review
- **High Risk** (61–100): Mandatory senior reviewer

### Technical Review
- Verify Parikshak certification is current.
- Confirm Simulator backtest meets thresholds.
- Review strategy logic for obvious flaws.

### Risk Review
- Validate risk rules are within platform limits.
- Audit any overrides for proper authorization.
- Assess correlation with existing deployed strategies.

### Compliance Review
- Check for regulatory violations (SEBI, exchange rules).
- Verify instrument and market permissions.
- Confirm KYC/AML requirements.

## Approval Statuses

| Status | Description |
|---|---|
| `PENDING` | Awaiting review |
| `IN_REVIEW` | Under active review |
| `APPROVED` | Cleared for Kuber Alpha deployment |
| `APPROVED_WITH_CONDITIONS` | Approved but with constraints |
| `REJECTED` | Not approved; feedback provided |
| `WITHDRAWN` | Canceled by submitter |

## SLAs

| Risk Level | Target Review Time |
|---|---|
| Low | 4 business hours |
| Medium | 1 business day |
| High | 3 business days |

## Notifications

- Strategy Factory receives MQ notification on approval/rejection.
- Strategy status auto-updates in the UI.
- Email notification sent to strategy owner.
