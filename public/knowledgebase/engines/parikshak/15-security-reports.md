# 15 — Security Reports

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Overview

Security Reports document the results of automated vulnerability scanning, dependency checks, and security posture assessments performed by Parikshak on every submission.

## Scan Types

### Static Application Security Testing (SAST)

Code-level analysis without execution:
- Hardcoded secrets (API keys, tokens, passwords)
- SQL/NoSQL injection vectors
- Cross-site scripting (XSS) vulnerabilities
- Insecure deserialization
- Path traversal risks

### Dynamic Application Security Testing (DAST)

Runtime analysis of running components:
- OWASP Top 10 vulnerability scan
- Authentication bypass attempts
- Authorization escalation tests
- Session management weaknesses
- Input validation fuzzing

### Dependency Scanning

Analysis of third-party libraries:
- Known CVEs (Common Vulnerabilities and Exposures)
- Outdated packages with security patches
- License compliance issues
- Transitive dependency vulnerabilities

### Container Scanning

Docker image analysis:
- Base image vulnerabilities
- Misconfigurations (root user, exposed ports)
- Outdated system packages

## Severity Classification

| Severity | Description | Action |
|---|---|---|
| **CRITICAL** | Remote code execution, data breach risk | Immediate fix required; blocks release |
| **HIGH** | Authentication bypass, privilege escalation | Fix required before release |
| **MEDIUM** | Information disclosure, CSRF | Fix within 1 sprint |
| **LOW** | Best practice violations, informational | Fix when convenient |

## Report Structure

```json
{
  "reportId": "sr-001",
  "submissionId": "sub-001",
  "generatedAt": "2026-07-24T15:30:00Z",
  "summary": {
    "totalFindings": 8,
    "critical": 0,
    "high": 0,
    "medium": 3,
    "low": 5,
    "scannedDependencies": 245,
    "vulnerableDependencies": 2
  },
  "findings": [
    {
      "id": "SEC-001",
      "severity": "MEDIUM",
      "title": "Outdated lodash package",
      "cve": "CVE-2024-1234",
      "package": "lodash@4.17.20",
      "fixedIn": "4.17.21",
      "recommendation": "Upgrade to lodash@4.17.21"
    }
  ],
  "compliance": {
    "owaspTop10": "PASS",
    "sebiAlgoGuidelines": "PASS",
    "iso27001": "PASS"
  },
  "overallStatus": "PASS"
}
```

## Pass/Fail Criteria

| Criterion | Threshold |
|---|---|
| CRITICAL findings | 0 (always fail) |
| HIGH findings | 0 |
| MEDIUM findings | ≤ 5 |
| LOW findings | ≤ 20 |
| Vulnerable dependencies | 0 with known exploits |

## Remediation SLAs

| Severity | Fix Timeline |
|---|---|
| CRITICAL | 24 hours |
| HIGH | 7 days |
| MEDIUM | 30 days |
| LOW | 90 days |

## SBOM (Software Bill of Materials)

Every security report includes an SBOM:

```json
{
  "sbom": {
    "format": "CycloneDX 1.4",
    "components": [
      { "name": "express", "version": "4.18.2", "license": "MIT" },
      { "name": "mongoose", "version": "7.6.0", "license": "MIT" }
    ]
  }
}
```

## Penetration Testing

In addition to automated scans, Parikshak coordinates with external penetration testing:
- **Frequency**: Quarterly
- **Scope**: All production-facing APIs and engines
- **Provider**: Certified third-party security firm
- **Results**: Integrated into the security report
