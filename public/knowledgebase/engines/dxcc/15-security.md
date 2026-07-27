# DXCC — Security Architecture

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## Authentication Flow

DXCC uses OAuth2 with JWT for authentication:

```
[User] --> [DXCC Login Page] --> [SSO Provider (Keycloak)]
                                       |
                        +--------------+--------------+
                        |                             |
                  [Authorization Code]          [OIDC ID Token]
                        |                             |
                        +--------------+--------------+
                                       |
                              [DXCC Auth Endpoint]
                                       |
                              [JWT Issued (RS256)]
                                       |
                              [Set in HttpOnly Cookie]
                                       |
                              [Attach to All API/WS Calls]
```

### Token Structure

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "dxcc-signing-key-2026"
  },
  "payload": {
    "sub": "user-abc-123",
    "username": "trader1",
    "email": "trader1@internal.com",
    "role": "trader",
    "permissions": [
      {"action": "strategy.*", "resource": "*"},
      {"action": "order.*", "resource": "*"},
      {"action": "market.*", "resource": "*"}
    ],
    "iat": 1690000000,
    "exp": 1690003600,
    "iss": "dxcc-auth-service",
    "aud": "dxcc-api"
  },
  "signature": "..."
}
```

---

## SSO Integration

DXCC supports the following SSO protocols:

| Provider Type | Protocol | Configuration |
|---------------|----------|---------------|
| Keycloak | OIDC | `auth.issuer_url`, `auth.client_id`, `auth.client_secret` |
| Azure AD | OIDC | Standard OIDC discovery |
| Okta | OIDC | Standard OIDC discovery |
| Generic SAML | SAML 2.0 | Metadata XML upload |

### SSO Claim Mapping

| IDP Claim | DXCC Attribute | Required |
|-----------|---------------|----------|
| `sub` | User ID | Yes |
| `preferred_username` | Username | Yes |
| `email` | Email | Yes |
| `name` | Display Name | Yes |
| `groups` | Role Mapping | Yes |
| `dxcc_permissions` | Custom Permissions | No |

---

## Multi-Factor Authentication

MFA is enforced for the following roles:

| Role | MFA Required | Method |
|------|-------------|--------|
| Admin | Yes | TOTP (authenticator app) |
| Trader | Yes | TOTP (authenticator app) |
| Quant | Yes | TOTP (authenticator app) |
| Auditor | No | Optional |
| Viewer | No | Optional |

MFA verification is enforced at the SSO provider level. DXCC validates the `amr` (Authentication Methods Reference) claim in the JWT to ensure MFA was performed.

---

## Role-Based Access Control

### Five Built-in Roles

| Role | Description | UI Access |
|------|-------------|-----------|
| **Admin** | Full platform access | All 20 modules; user/role management; system config |
| **Trader** | Strategy and order management | Strategy Command, Execution Monitor, Portfolio Command, Market Operations, Risk Center (read) |
| **Quant** | Research and analytics | Analytics Center, AI Operations, Intelligence Center, Strategy Command (read) |
| **Auditor** | Compliance and audit | Audit Center, User Activity, Configuration History, Exports |
| **Viewer** | Read-only observation | All modules (read-only); no modifications allowed |

### Permission Model

Permissions follow the format `{action}.{resource}`:

| Permission | Scope |
|-----------|-------|
| `*` | All actions on all resources (Admin) |
| `strategy.*` | All strategy actions |
| `strategy.read` | View strategies only |
| `strategy.deploy` | Deploy new strategies |
| `order.*` | All order-related actions |
| `risk.*` | All risk-related actions |
| `risk.write` | Modify risk rules |
| `risk.override` | Approve risk overrides |
| `audit.*` | All audit actions |
| `audit.export` | Export audit data |
| `user.*` | All user management (Admin only) |
| `config.*` | All configuration changes |
| `admin.*` | System administration |

---

## UI Conditional Rendering

Client-side permission checks control UI visibility (never for security — server validates all actions):

```typescript
function AdminPanel() {
  const { isAdmin } = useUserPermissions();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <AdminPanelContent />;
}

function StrategyDeployButton({ strategy }: Props) {
  const { can } = useUserPermissions();

  return (
    <Button
      onClick={() => deployStrategy(strategy.id)}
      disabled={!can('strategy.deploy', `strategies.${strategy.id}`)}
    >
      Deploy Strategy
    </Button>
  );
}
```

---

## Server-Side Authorization

Every API request is validated server-side using Open Policy Agent (OPA):

```go
func AuthMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        token := extractJWT(r)
        claims := validateJWT(token)

        input := map[string]interface{}{
            "user": claims,
            "action": r.Method,
            "resource": r.URL.Path,
        }

        allowed, err := opa.Decision("dxcc/authz/allow", input)
        if err != nil || !allowed {
            http.Error(w, "Forbidden", http.StatusForbidden)
            return
        }

        next.ServeHTTP(w, r)
    })
}
```

**OPA Policy (Rego):**

```rego
package dxcc.authz

default allow = false

allow {
    input.user.role == "admin"
}

allow {
    input.user.role == "trader"
    input.action == "GET"
    startswith(input.resource, "/api/strategies")
}

allow {
    input.user.role == "auditor"
    startswith(input.resource, "/api/audit")
}
```

---

## Session Management

| Parameter | Value | Description |
|-----------|-------|-------------|
| Idle Timeout | 30 minutes | Auto-logout after inactivity |
| Absolute Timeout | 12 hours | Forced logout regardless of activity |
| Concurrent Sessions | 3 max | Additional logins terminate oldest session |
| Cookie Name | `dxcc_session` | Session identifier |
| Cookie Flags | HttpOnly, Secure, SameSite=Strict | Prevent XSS and CSRF |
| Token Storage | HttpOnly cookie | Never in localStorage or sessionStorage |

---

## Audit Logging (Chitragupta Integration)

Every user action in DXCC is audited:

### What Is Audited

- **Page Views:** Which module, how long viewed
- **Button Clicks:** What was clicked, when, from which IP
- **API Calls:** Method, endpoint, request body (sanitized), response status
- **Configuration Changes:** Before/after diff with actor and timestamp
- **Risk Overrides:** Full override request with justification and approval chain
- **Data Access:** Who accessed PII, API keys, strategy code, trade data
- **Session Events:** Login, logout, session expiry, MFA challenge
- **Export Actions:** What data was exported, in what format

### Audit Record Format

```json
{
  "event_id": "uuid-v4",
  "event_time": "2026-07-24T09:30:01.123Z",
  "actor": "trader1",
  "actor_ip": "10.10.20.100",
  "action": "strategy.deploy",
  "resource_type": "strategy",
  "resource_id": "strat-456",
  "status": "success",
  "request_id": "req-uuid",
  "before_state": null,
  "after_state": {"status": "live", "symbols": ["NIFTY"]},
  "merkle_hash": "sha256...",
  "prev_hash": "sha256..."
}
```

---

## Security Hardening Checklist

- [ ] TLS 1.2+ enforced; TLS 1.0/1.1 disabled
- [ ] HSTS header set with 1-year max-age
- [ ] Content-Security-Policy header configured
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] All secrets in environment variables, never in config files
- [ ] JWT keys rotated every 90 days
- [ ] Dependencies scanned weekly (npm audit, go vet, Trivy)
- [ ] Rate limiting enabled on all public endpoints
- [ ] WAF rules active via Kraken API Gateway
- [ ] Database connections encrypted (TLS)
- [ ] Redis connections encrypted (TLS) and authenticated
- [ ] Session cookies HttpOnly, Secure, SameSite=Strict
- [ ] MFA enforced for Admin, Trader, Quant roles
- [ ] Audit log tamper detection active (Merkle tree verification)

---

> **Next:** See [16-narad-integration.md](16-narad-integration.md) for Narad Event Bus WebSocket integration details.
