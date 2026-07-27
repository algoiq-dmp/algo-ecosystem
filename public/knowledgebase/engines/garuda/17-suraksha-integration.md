---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 17 — Suraksha Integration

## Overview

Suraksha is the Algo-IQ ecosystem's centralized authentication, authorization, and security service. Garuda Margin Engine delegates all authentication, RBAC enforcement, and certificate management to Suraksha, ensuring consistent security posture across the platform.

## Integration Architecture

```
┌──────────────────────────────────────┐
│           SURAKSHA SERVICE            │
│  ┌────────────────────────────────┐  │
│  │  Identity Provider (OAuth2)     │  │
│  │  JWT Issuer & Validator        │  │
│  │  RBAC Policy Engine            │  │
│  │  Certificate Authority         │  │
│  │  Audit Record Keeper           │  │
│  └────────────────────────────────┘  │
└──────────────┬───────────────────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌───────┐ ┌───────┐ ┌───────┐
│Garuda │ │ RMS   │ │ Algo  │  ← All platform services
│Margin │ │ System│ │ Engine│    validate via Suraksha
│Engine │ │       │ │       │
└───────┘ └───────┘ └───────┘
```

## Authentication Validation

Garuda validates every incoming request's authentication token against Suraksha.

### JWT Validation Flow
```
Client Request (Bearer JWT)
    → Garuda API Gateway
    → Suraksha POST /validate-token
    → Suraksha verifies: signature, expiry, issuer, audience, revocation
    → Suraksha returns: user_id, broker_id, role, permissions
    → Garuda enforces RBAC based on permissions
    → Garuda logs access to audit trail
```

### Token Validation Request
```json
{
  "token": "eyJhbGciOi...",
  "required_scopes": ["margin:read", "margin:write"],
  "client_ip": "203.0.113.45",
  "request_path": "/v3/margin/contract",
  "request_method": "POST"
}
```

### Token Validation Response
```json
{
  "valid": true,
  "user": {
    "user_id": "usr_a1b2c3",
    "username": "trader@broker.com",
    "broker_id": "BRK001",
    "role": "RiskManager",
    "permissions": ["margin.view", "margin.export", "margin.recalculate"]
  },
  "token_metadata": {
    "jti": "unique-token-jti",
    "expires_at": "2026-07-25T10:45:45Z",
    "issued_at": "2026-07-25T10:30:45Z"
  }
}
```

## RBAC Integration

Garuda uses Suraksha's centralized RBAC policy engine for access control.

### Permission Model
Suraksha maintains a hierarchical permission model. Garuda's operations map to the following permission scopes:

| Permission Scope | Garuda Operations |
|---|---|
| `margin:read` | GET margin endpoints, view margin reports |
| `margin:write` | POST margin calculation, trigger recalculation |
| `margin:export` | Download margin reports (PDF/Excel/CSV) |
| `margin:intelligence` | Access Margin Intelligence and Hedge Optimizer |
| `position:read` | View client positions |
| `position:write` | Create/edit/delete positions, bulk upload |
| `alert:config` | Configure margin alert thresholds |
| `alert:view` | View alert history and notifications |
| `user:manage` | User CRUD (broker-scoped) |
| `broker:config` | Exchange configuration, broker settings |
| `report:generate` | Generate and schedule reports |
| `audit:view` | Access audit log search |

### RBAC Validation Flow
```
Garuda: "User wants to POST /margin/contract"
    → Check local cache for user permissions (Redis, 5min TTL)
    → Cache miss: Suraksha GET /rbac/check
    → Suraksha evaluates: user role + custom permissions + broker scope
    → Returns: ALLOW (200) or DENY (403)
    → Garuda caches result for subsequent calls
```

### Suraksha RBAC Check Request
```json
{
  "user_id": "usr_a1b2c3",
  "resource": "margin:write",
  "context": {
    "broker_id": "BRK001",
    "client_code": "CL001",
    "endpoint": "/v3/margin/contract"
  }
}
```

### Suraksha RBAC Check Response
```json
{
  "allowed": true,
  "reason": "User has role RiskManager with margin:write scope for broker BRK001",
  "effective_permissions": ["margin:read", "margin:write", "margin:export"],
  "audit_id": "aud_xyz"
}
```

## Certificate Management

Garuda relies on Suraksha's Certificate Authority for all TLS/mTLS certificate lifecycle management.

### Certificate Lifecycle
1. **Provisioning**: Suraksha issues server certificates at service startup
2. **Rotation**: Certificates auto-rotated 30 days before expiry
3. **Revocation**: Compromised certificates revoked within 15 minutes
4. **Renewal**: New certificates distributed via Suraksha event `certificate.rotated`

### mTLS Configuration
All inter-service communication within the Algo-IQ ecosystem uses mutual TLS:
- Services present client certificates issued by Suraksha CA
- Server validates client certificates against Suraksha CRL
- Certificate trust chain: Suraksha Root CA → Suraksha Intermediate CA → Service Certificate

### Configuration
```json
{
  "suraksha": {
    "base_url": "https://suraksha.algo-iq.svc",
    "auth_endpoint": "/validate-token",
    "rbac_endpoint": "/rbac/check",
    "cert_endpoint": "/certificates",
    "token_cache_ttl_minutes": 5,
    "rbac_cache_ttl_minutes": 5,
    "connection_timeout_ms": 5000,
    "retry": {
      "max_attempts": 2,
      "backoff_ms": 500
    },
    "circuit_breaker": {
      "failure_threshold": 5,
      "break_duration_seconds": 30,
      "half_open_max_attempts": 2
    }
  }
}
```

## Failure Handling

### Suraksha Unavailability
If Suraksha is unreachable:
1. Garuda uses cached token validation results (5-minute TTL)
2. New tokens cannot be validated → return 503 to client
3. Cached RBAC decisions honored for duration of cache
4. Circuit breaker opens after 5 consecutive failures → fast-fail for 30 seconds
5. Critical alert triggered → PagerDuty

### RBAC Cache Strategy
- **L1 Cache (in-memory)**: Per-user permission set, 5-minute TTL
- **L2 Cache (Redis)**: Permission sets with Suraksha as source of truth
- **Invalidation**: Suraksha publishes `rbac.updated` event → Garuda clears relevant cache entries
- **Staleness tolerance**: Configurable up to 15 minutes for performance

### Token Validation Cache
- Valid JWT claims cached for duration of token (max 15 minutes)
- Cache key: `token_validation:{jti}`
- Blacklisted tokens cached until token expiry (prevent replay)

## Security Events

### Events Published to Suraksha
| Event | Trigger |
|---|---|
| `auth.access_denied` | RBAC check returns DENY |
| `auth.token_revoked` | Token found in blacklist |
| `auth.suspicious_activity` | Unusual API usage pattern detected |

### Events Consumed from Suraksha
| Event | Action |
|---|---|
| `rbac.updated` | Clear RBAC cache for affected users |
| `certificate.rotated` | Reload TLS certificates |
| `token.revoked` | Add JTI to local blacklist cache |
| `user.disabled` | Invalidate all cached tokens for user |
| `broker.suspended` | Block all requests for the broker |

## Development Mode

For local development without Suraksha:
```json
{
  "suraksha": {
    "mock_enabled": true,
    "mock_default_role": "SuperAdmin",
    "mock_default_permissions": ["*"]
  }
}
```

When mock mode is enabled:
- All tokens are accepted as valid
- All RBAC checks return ALLOW
- Self-signed certificates are used
- DEVELOPMENT MODE watermark appears in all dashboards
- Mock mode is **disabled** in production via environment validation at startup
