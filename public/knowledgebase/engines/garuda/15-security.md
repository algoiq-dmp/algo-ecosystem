---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 15 — Security

## Security Architecture

Garuda implements a **defense-in-depth** strategy with controls at every layer:

```
Layer 7: Application — Input validation, output encoding, anti-CSRF, CORS, CSP
Layer 6: AuthN/AuthZ — OAuth2 + JWT, RBAC, API Keys, MFA/TOTP, SAML 2.0
Layer 5: API Security — Rate limiting, HMAC signing, IP whitelisting, WAF
Layer 4: Transport — TLS 1.3, mTLS (service mesh), HSTS, DNSSEC
Layer 3: Data — AES-256-GCM at rest, TLS in transit, database TDE
Layer 2: Infrastructure — Network policies, firewall, private endpoints
Layer 1: Governance — Audit logging, SIEM, pen testing, vulnerability mgmt
```

## Authentication & Authorization

### OAuth 2.0 + JWT
- Access tokens: 15-minute TTL
- Refresh tokens: 24-hour TTL with rotation
- Token family tracking for reuse detection
- RS256 signing with key managed in Azure Key Vault

### JWT Token Structure
```json
{
  "sub": "usr_a1b2c3d4",
  "iss": "garuda-margin-engine",
  "aud": "garuda-api",
  "broker_id": "BRK001",
  "role": "RiskManager",
  "permissions": ["margin.view", "margin.export"],
  "iat": 1751378400,
  "exp": 1751379300,
  "jti": "unique-token-id"
}
```

### API Key Authentication
- Format: `garuda_{environment}_{broker_id}_{64-char-random}`
- Stored as SHA-256 hash (plain key shown once at creation)
- Optional IP whitelist (per key)
- Optional HMAC signature verification for enhanced security

### RBAC Roles

| Role | Scope | Key Permissions |
|---|---|---|
| **SuperAdmin** | Platform-wide | All permissions; manage any broker |
| **BrokerAdmin** | Single broker | User mgmt, config, reporting, audit |
| **RiskManager** | Single broker | View/export margins, configure alerts, manage positions |
| **Dealer** | Assigned clients | View margins, strategy builder |
| **Viewer** | Assigned clients | Read-only margin view |
| **APIUser** | Single broker | API access via key; no dashboard access |

## Encryption

### At Rest (AES-256-GCM)
| Data | Method | Rotation |
|---|---|---|
| PostgreSQL | TDE (AES-256) | 365 days |
| Redis | Enterprise tier encryption | Platform-managed |
| Blob Storage | Storage Service Encryption | Automatic |
| Backups | AES-256-GCM | 365 days |
| Sensitive Config | Application-level AES-256-GCM | 180 days |

### In Transit (TLS 1.3)
- External: TLS 1.3 with HSTS (max-age: 365 days, includeSubDomains, preload)
- Internal: mTLS via Linkerd service mesh
- Certificate auto-rotation via cert-manager
- All ciphers restricted to strong algorithms only

## API Security

### Rate Limiting
| Tier | Rate Limit | Daily Limit |
|---|---|---|
| BASIC | 100 req/sec | 10,000 req/day |
| STANDARD | 1,000 req/sec | 100,000 req/day |
| ENTERPRISE | 10,000 req/sec | Unlimited |

Rate limit headers in every response:
- `X-RateLimit-Remaining` — Remaining in window
- `X-RateLimit-Reset` — Reset timestamp
- `Retry-After` — Retry delay on 429

### Request Signing (HMAC)
For enhanced security, API keys can be configured to require HMAC-SHA256 request signing:
```
Signature = HMAC-SHA256(api_secret, method + path + timestamp + body)
```

## Secret Management

All secrets stored in Azure Key Vault / HashiCorp Vault. Never in configuration files, environment variables (except references), or source code.

| Secret | Storage | Rotation |
|---|---|---|
| Database password | Key Vault | 90 days |
| JWT signing key | Key Vault | 180 days |
| Data encryption key | Key Vault / KMS | 365 days |
| Redis password | Key Vault | 90 days |
| Kafka SASL password | Key Vault | 90 days |
| API encryption key | Key Vault | 180 days |

## OWASP Top 10 Mitigations

| Vulnerability | Mitigation |
|---|---|
| A01 — Broken Access Control | RBAC with API-level permissions, JWT validation, resource-scoped queries |
| A02 — Cryptographic Failures | TLS 1.3, AES-256-GCM, Argon2id passwords, HMAC signing |
| A03 — Injection | Parameterized queries (EF Core + Dapper), input validation |
| A04 — Insecure Design | Threat modeling per feature, STRIDE analysis |
| A05 — Security Misconfiguration | Hardened base images, CSP headers, config validation at startup |
| A06 — Vulnerable Components | Dependabot, Snyk scanning, SBOM, automated patching |
| A07 — Auth Failures | MFA, rate-limited login, account lockout, password complexity |
| A08 — Software Integrity | Signed commits, signed containers (cosign), SBOM, dependency pinning |
| A09 — Logging Failures | Comprehensive audit logging, SIEM integration, real-time alerting |
| A10 — SSRF | Network egress policies, URL whitelisting, private endpoints |

## Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; frame-ancestors 'none'
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## Penetration Testing Schedule

| Frequency | Type | Scope |
|---|---|---|
| Annual | Full external penetration test | All public endpoints |
| Quarterly | Internal penetration test | Internal services, K8s |
| Monthly | Automated DAST scan (OWASP ZAP) | All API endpoints |
| Per Release | Manual security review | Changed components |
| Continuous | Bug bounty program | All public assets |

## Audit Logging

### Events Logged
- Authentication: Login success/failure, token refresh, logout, MFA events
- Authorization: Permission changes, role assignment, access denied
- Margin Operations: Every calculation (inputs + outputs), reconciliation results
- Position Management: CRUD, bulk uploads, closures
- Configuration: Exchange config changes, threshold modifications
- Admin Actions: User CRUD, broker management

### Retention
| Data | Duration |
|---|---|
| Margin Calculations | 7 years |
| Audit Logs | 7 years |
| Position History | 7 years |
| API Usage | 90 days |
| Session Data | 24 hours |

## WAF Rules (Azure Front Door)
- Managed rule set: Microsoft_DefaultRuleSet 2.1 (Block mode)
- Bot manager rule set: Microsoft_BotManagerRuleSet 1.0
- Custom rate limit: 600 requests/min per IP
- Geo-filtering: Restrict non-India IPs for sensitive endpoints

## Security Incident Response

| Severity | Acknowledgment | Resolution Target |
|---|---|---|
| Critical (S1) | 15 minutes | 1 hour |
| High (S2) | 1 hour | 4 hours |
| Medium (S3) | 4 hours | 24 hours |

## Data Privacy

| Classification | Examples | Controls |
|---|---|---|
| **PII** | PAN, email, phone, name | Encrypted at rest, masked in logs, access audit |
| **Financial** | Margin values, P&L | Encryption, access control, audit trail |
| **Confidential** | SPAN params, configs | Access control, encryption |
| **Internal** | Logs, metrics, health | Access control |

### Data Deletion
- PII: Hard delete on verified request (30-day grace period)
- Financial data: 7-year mandatory retention (SEBI)
- API usage: Purged after 1 year
- Sessions: Purged on expiry / logout
