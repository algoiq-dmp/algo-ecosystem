# DXCC — Suraksha Integration

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## Overview

Suraksha is the security framework that governs authentication, certificate management, and security audit across the Delta XI ecosystem. DXCC integrates deeply with Suraksha for identity validation, RBAC synchronization, and threat detection.

---

## Suraksha Auth Validation

### JWT Validation Flow

Every API request and WebSocket message passes through Suraksha validation:

```
[Request Arrives]
        |
        v
[Extract JWT from Authorization Header]
        |
        v
[Validate JWT Signature against Suraksha Public Key]
        |
        v
   [Signature Valid?]
    /            \
  YES             NO
   |               |
   v               v
[Check expiry]  [401 Unauthorized]
   |
   v
[Validate issuer (iss) claim against trusted issuers]
   |
   v
[Check token not in revocation list (Redis)]
   |
   v
[Extract role and permissions from claims]
   |
   v
[Pass to OPA for resource-level authorization]
   |
   v
[Allow / Deny]
```

### Trusted Issuer Configuration

```json
{
  "suraksha": {
    "trusted_issuers": [
      {
        "iss": "dxcc-auth-service",
        "jwks_url": "https://auth.internal/realms/dxcc/protocol/openid-connect/certs",
        "algorithms": ["RS256"],
        "audience": "dxcc-api"
      }
    ],
    "token_revocation_check": true,
    "revocation_cache_ttl_sec": 60
  }
}
```

---

## Certificate Management

Suraksha manages TLS certificates across the platform. DXCC integrates with Suraksha's certificate monitoring:

### Certificate Health Monitoring

DXCC displays certificate status in the Infrastructure Monitor:

| Field | Description |
|-------|-------------|
| Certificate Domain | Domain the cert covers |
| Issuer | CA that issued the cert |
| Expiry Date | When the cert expires |
| Days Remaining | Countdown to expiry |
| Status | Valid, Expiring (<30 days), Expired |
| Auto-Renewal | Whether auto-renewal via cert-manager is active |

### Alert Thresholds

| Condition | Severity | Alert |
|-----------|----------|-------|
| Cert expires in <30 days | P3 | Warning notification |
| Cert expires in <7 days | P2 | Urgent notification |
| Cert expired | P1 | Critical alert |
| Auto-renewal failed | P2 | Manual intervention required |

---

## RBAC Synchronization

DXCC synchronizes its role and permission definitions with Suraksha's central identity store:

### Synchronization Flow

```
[Suraksha Identity Store]
        |
        | (periodic sync, configurable interval)
        v
[DXCC Role Sync Service]
        |
        +-- Reads roles and permissions from Suraksha
        +-- Compares with local PostgreSQL roles table
        +-- Updates local roles if changes detected
        +-- Logs diff in audit trail
        |
        v
[PostgreSQL roles + permissions tables]
        |
        v
[UI reflects updated permissions within 60 seconds]
```

### Conflict Resolution

When a role exists in both Suraksha and DXCC:

1. Suraksha is the source of truth for role assignments
2. DXCC's local permissions cache is updated to match Suraksha
3. Custom DXCC-only roles (marked `is_system = false`) are not overwritten
4. Conflicts are logged and surfaced in the Admin Panel

### Sync Configuration

```json
{
  "suraksha": {
    "rbac_sync": {
      "enabled": true,
      "interval_sec": 300,
      "source": "https://identity.internal/api/v1/rbac/export",
      "conflict_resolution": "suraksha_wins"
    }
  }
}
```

---

## Security Audit Integration

DXCC feeds its audit events to Suraksha's central security audit pipeline:

### Audit Event Flow

```
[DXCC User Action]
        |
        v
[DXCC audits locally via Chitragupta]
        |
        +-- [Narad topic: audit.events.dxcc]
                |
                v
        [Suraksha Security Audit Collector]
                |
                v
        [Suraksha SIEM / Analytics]
                |
                v
        [Threat Detection Engine]
                |
        +-- [Anomaly detected?] --> [Notification Center Alert]
        +-- [Compliance report generated]
```

### Security Events Forwarded to Suraksha

| Event Type | Description |
|-----------|-------------|
| `auth.login_failed` | Failed login attempt |
| `auth.mfa_challenge_failed` | Failed MFA challenge |
| `auth.session_hijack_detected` | Session used from unexpected IP |
| `rbac.permission_escalation` | Role or permission change |
| `config.sensitive_change` | Security-related configuration change |
| `audit.export` | Audit data export |
| `api.rate_limit_exceeded` | Rate limiting triggered |
| `api.unauthorized_access` | Access denied by OPA |

---

## Threat Detection Alerts in Notification Center

Suraksha's threat detection engine can generate alerts that appear in the DXCC Notification Center:

### Alert Types

| Alert | Severity | Description | Action Required |
|-------|----------|-------------|-----------------|
| Multiple Failed Logins | P2 | 5+ failed logins from same IP in 5 min | Investigate; possibly block IP |
| Session from New Location | P3 | Login from previously unseen geo-location | Verify with user |
| Off-Hours Admin Activity | P2 | Admin actions outside business hours | Verify legitimacy |
| Sensitive Data Access Spike | P2 | Unusual pattern of PII or strategy code access | Investigate intent |
| Permission Change Audit | P1 | Role or permission modification | Verify authorization |
| API Key Anomaly | P1 | API key used from unexpected source | Rotate key immediately |
| Audit Log Tamper Detected | P0 | Merkle tree hash chain broken | Incident response |
| Certificate Expiry Critical | P1 | Certificate expiring in <24 hours | Manual renewal |

### Alert Display

```
+------------------------------------------------------------------+
| [P1] Suraksha: Permission Change Detected        2 min ago       |
| User "admin2" modified role "trader" permissions                 |
| Added: "risk.write"                                               |
| Source IP: 10.10.30.45                                           |
| [Acknowledge] [Create Incident] [View Details]                   |
+------------------------------------------------------------------+
```

---

## Suraksha Score Integration

DXCC displays Suraksha risk scores in the Risk Center:

### Score Components Displayed

| Component | Weight | Source |
|-----------|--------|--------|
| Vega Exposure | 25% | Talkdelta |
| Drawdown Risk | 20% | Rakshak |
| Value at Risk (VaR) | 20% | Kavach |
| Concentration Risk | 15% | Rakshak |
| Liquidity Risk | 10% | Ganesh |
| Churn Rate | 10% | Manthan |

### Score Interpretation

| Score Range | Color | Action |
|------------|-------|--------|
| 0-30 | Red | High risk; reduce positions |
| 31-60 | Yellow | Elevated risk; monitor closely |
| 61-85 | Green | Acceptable risk |
| 86-100 | Green | Low risk |

Scores above 85 for any symbol trigger a Durga circuit breaker auto-trip.

---

## Security Compliance Reports

Suraksha generates compliance reports accessible from the DXCC Audit Center:

- **Daily Security Summary:** Failed logins, permission changes, sensitive data access
- **Weekly Risk Report:** Suraksha score trends, violation patterns, circuit breaker events
- **Monthly Compliance Report:** Audit integrity verification, access review, policy compliance
- **Quarterly SEBI Report:** Signed PDF export with full audit trail for regulatory submission

---

> **Next:** See [18-failover.md](18-failover.md) for failover and disaster recovery procedures.
