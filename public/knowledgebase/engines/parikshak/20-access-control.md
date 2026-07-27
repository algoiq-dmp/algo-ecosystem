# 20 — Access Control

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Overview

Parikshak implements role-based access control (RBAC) to ensure that only authorized users can submit tests, view results, and manage test configurations. Access is aligned with the broader Algo-IQ platform RBAC model.

## Roles

| Role | Permissions |
|---|---|
| **QA Viewer** | View test results and reports (read-only) |
| **QA Analyst** | Submit tests, view results, generate reports |
| **QA Lead** | Override test thresholds, approve checklists, issue certificates |
| **Strategy Owner** | Submit own strategies, view own results |
| **Engine Developer** | Submit engine tests, view engine results |
| **Product Manager** | View product test results and readiness reports |
| **DXCC Reviewer** | View all reports for strategies under review |
| **Admin** | Full access: users, configuration, settings |

## Permission Matrix

| Action | Viewer | Analyst | Lead | Admin |
|---|---|---|---|---|
| View reports | ✓ | ✓ | ✓ | ✓ |
| Submit tests | ✗ | ✓ | ✓ | ✓ |
| Cancel submission | ✗ | ✓ | ✓ | ✓ |
| Re-run tests | ✗ | ✓ | ✓ | ✓ |
| Override thresholds | ✗ | ✗ | ✓ | ✓ |
| Approve checklist items | ✗ | ✗ | ✓ | ✓ |
| Issue certificate | ✗ | ✗ | ✓ | ✓ |
| Revoke certificate | ✗ | ✗ | ✓ | ✓ |
| Manage users | ✗ | ✗ | ✗ | ✓ |
| Configure engine | ✗ | ✗ | ✗ | ✓ |
| View audit logs | ✗ | ✗ | ✓ | ✓ |

## Resource-Level Access

### Strategy Owners

- Can only test their own strategies.
- Can only view results for their own strategies.
- Cannot view results for other users' strategies.

### Engine Developers

- Can test engines they are assigned to.
- Cannot modify test thresholds.

### Product Managers

- Can view product test results.
- Cannot submit or cancel tests.

## API Key Authentication

For CI/CD and automated systems, API keys provide programmatic access:

| Key Type | Permissions | Expiry |
|---|---|---|
| `ci-submit` | Submit tests only | 90 days |
| `ci-read` | Read results only | 90 days |
| `ci-full` | Submit + read | 30 days |
| `admin` | Full access | 7 days (rotation enforced) |

## Audit Logging

All access events are logged:

```json
{
  "eventId": "audit-001",
  "timestamp": "2026-07-24T15:30:00Z",
  "userId": "user@algo-iq.com",
  "role": "QA_Analyst",
  "action": "SUBMIT_TEST",
  "resourceId": "sub-001",
  "ip": "192.168.1.100",
  "userAgent": "parikshak-cli/2.0.0"
}
```

## Session Management

- JWT access tokens: 15-minute expiry.
- Refresh tokens: 24-hour expiry.
- Concurrent session limit: 3 per user.
- Automatic logout after 30 minutes of inactivity.

## Security Enforcement

- Failed login attempts: 5 max → account locked for 15 minutes.
- API key brute force: 10 failures → key revoked.
- Suspicious activity detection: Unusual patterns flagged for review.
- IP whitelisting: Optional for API key access.
