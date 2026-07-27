# 23 — Security

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Security Architecture

Strategy Factory implements defense-in-depth security across all layers of the application stack.

## Authentication & Authorization

### Authentication

- **JWT-based**: Tokens issued by the central Algo-IQ auth service.
- **Token expiry**: Access tokens 15 min, refresh tokens 24 hours.
- **MFA support**: TOTP-based multi-factor authentication (optional, enforced for admin roles).

### Authorization (RBAC)

| Role | Permissions |
|---|---|
| **Viewer** | Read-only access to assigned strategies |
| **Strategy Owner** | Create, edit, export, submit own strategies |
| **Risk Manager** | Override risk rules, approve overrides |
| **DXCC Reviewer** | Review and approve/reject submissions |
| **Admin** | Full platform access, user management |

### API Security

- All requests over HTTPS (TLS 1.3).
- API rate limiting per user and per IP.
- Request validation using JSON Schema.
- Input sanitization against injection attacks.
- CORS restricted to approved origins.

## Data Security

### At Rest

- **MongoDB**: Encrypted storage (AES-256), encrypted backups.
- **Redis**: Password-protected, no persistence for cache data.
- **Logs**: No PII or secrets in log output.

### In Transit

- **Internal**: mTLS between microservices.
- **External**: TLS 1.3 for all client-facing endpoints.
- **MQ**: TLS-encrypted AMQP connections.

## Strategy Code Security

### Compiler Sandbox

The Strategy Compiler runs in an isolated sandbox:
- No filesystem access.
- No network access.
- CPU time limit: 30 seconds.
- Memory limit: 512 MB.

### JSON Payload Security

- Exported JSON is validated against a strict schema.
- No executable code or script injection allowed in any field.
- Binary data is base64-encoded and size-limited (max 1 MB).
- MQ payloads are signed with HMAC-SHA256 for integrity verification.

## Vulnerability Management

| Activity | Frequency |
|---|---|
| Dependency scanning | Daily (automated) |
| SAST (Static Analysis) | On every commit |
| DAST (Dynamic Analysis) | Weekly |
| Penetration testing | Quarterly (external firm) |
| Secret scanning | Pre-commit hook + CI pipeline |

## Audit Logging

All security-relevant events are logged immutably:

| Event | Logged Fields |
|---|---|
| User login/logout | userId, IP, timestamp, success/failure |
| Strategy export | strategyId, userId, timestamp, export version |
| Risk override | strategyId, userId, rule, oldValue, newValue |
| DXCC action | submissionId, reviewerId, action, timestamp |
| API key usage | keyId, endpoint, timestamp, IP |

## Incident Response

| Severity | Response Time | Escalation |
|---|---|---|
| Critical breach | 15 minutes | CISO + CTO |
| Data leak | 1 hour | Security team lead |
| Vulnerability disclosure | 4 hours | Engineering manager |
| Suspicious activity | 24 hours | SOC analyst |

## Compliance

- SEBI guidelines for algorithmic trading
- Exchange (NSE, BSE) API usage policies
- ISO 27001 aligned controls
- GDPR-compliant data handling for EU users

## Security Contacts

- **Security Team**: security@algo-iq.com
- **Bug Bounty**: https://bugcrowd.com/algo-iq
- **PGP Key**: https://algo-iq.com/security.asc
