# 16 — Certification

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Overview

Parikshak Certification is the formal seal of approval indicating that a strategy, engine, API, or product has passed all mandatory testing gates and is eligible for production deployment. **No component goes live without Parikshak certification.**

## Certification Process

```
Submission → Test Execution → Report Generation → Gate Evaluation → Certification
                                                                         │
                                                    ┌────────────────────┘
                                                    ▼
                                           ┌────────────────┐
                                           │  CERTIFIED     │
                                           │  Certificate   │
                                           │  Generated     │
                                           └────────────────┘
```

## Certification Requirements

### For Strategies

| Requirement | Threshold |
|---|---|
| Schema validation | 100% pass |
| Logic integrity | 100% pass |
| Risk compliance | 100% pass (critical rules) |
| Boundary tests | 100% pass |
| Security scan | 0 CRITICAL, 0 HIGH |
| Performance | Within all SLAs |
| Data quality | Score ≥ 80 |
| Checklist | All blocking items complete |
| Regression | No critical regressions |

### For Engines

| Requirement | Threshold |
|---|---|
| Unit tests | 100% pass, ≥ 90% coverage |
| Integration tests | 100% pass |
| Performance | Within all SLAs |
| Security scan | 0 CRITICAL, 0 HIGH |
| API contract | 100% compatible |

### For APIs

| Requirement | Threshold |
|---|---|
| Contract tests | 100% pass |
| Functional tests | 100% pass |
| Load test | Within throughput SLA |
| Security scan | 0 CRITICAL, 0 HIGH |

## Certificate Structure

```json
{
  "certificateId": "cert-001",
  "component": {
    "type": "strategy",
    "id": "sf-abc123",
    "version": "1.2.0"
  },
  "issuedAt": "2026-07-24T15:30:00Z",
  "issuedBy": "parikshak-v2.0.0",
  "validUntil": "2026-08-24T15:30:00Z",
  "status": "ACTIVE",
  "gates": [],
  "signatures": [
    {
      "role": "QA_ENGINE",
      "algorithm": "HMAC-SHA256",
      "signature": "abc123..."
    }
  ]
}
```

## Certificate Lifecycle

| State | Description |
|---|---|
| `ACTIVE` | Certificate is valid and current |
| `EXPIRED` | Validity period exceeded; recertification required |
| `REVOKED` | Manually revoked due to discovered issues |
| `SUPERSEDED` | Replaced by a newer version's certificate |

## Recertification Triggers

A new certification is required when:
- Strategy logic is modified (any block change).
- Risk parameters are changed (beyond minor tweaks).
- Engine version is updated.
- API contract changes (breaking or non-breaking).
- Security vulnerability is discovered and patched.
- Certificate expires (30-day validity for strategies).

## Certificate Verification

Any engine can verify a certificate:

```bash
curl https://api.algo-iq.com/parikshak/v2/certificates/cert-001/verify
# {"valid": true, "component": "sf-abc123", "status": "ACTIVE"}
```

## Enforcement

DXCC enforces certification:
- Strategies without a valid certificate are rejected.
- Expired certificates block deployment.
- Revoked certificates trigger strategy pause in Kuber Alpha.
- Attempted bypass is logged as a security incident.

## Audit Trail

Every certification action is immutably logged:
- Certificate issuance
- Certificate verification
- Certificate revocation
- Certificate expiry
- Recertification events
