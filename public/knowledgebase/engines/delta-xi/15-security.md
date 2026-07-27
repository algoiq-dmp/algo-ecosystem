# Delta XI — Security Architecture

**Version:** 3.2.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## Security Overview

Delta XI security is managed by **Suraksha** (Security Layer), providing authentication, authorization, encryption, RBAC, and audit logging for all API access.

## Authentication

All requests to Delta XI must include a valid JWT token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

- Token issued by Suraksha `/auth/token` endpoint
- Token expiry: 60 minutes (configurable)
- Refresh token validity: 24 hours
- Token includes: user_id, roles, permissions, exp

## Authorization (RBAC)

| Role | Permissions |
|------|-------------|
| `admin` | Full CRUD, configuration changes, deployment |
| `operator` | Read all, execute queries, view dashboards |
| `analyst` | Read analytics, query data, export reports |
| `strategy` | Read analytics for assigned symbols only |
| `viewer` | Read-only access to public endpoints |

## Encryption

### Data in Transit
- All external API traffic: **TLS 1.3** with AES-256-GCM
- Internal service communication: **mTLS** with Suraksha-issued certificates
- MQ connections: **TLS** with client certificate authentication

### Data at Rest
- Database: AES-256 encryption via PostgreSQL TDE
- Redis: Encrypted with AWS KMS-managed keys
- Configuration secrets: HashiCorp Vault (via Suraksha secrets engine)

## Secrets Management

All secrets are stored in Suraksha Vault:
- Database credentials → auto-rotated every 90 days
- API keys → rotated on demand
- JWT signing keys → rotated every 24 hours
- Broker credentials → encrypted at rest, decrypted at runtime

## Audit Logging

Every API call is logged to Suraksha audit trail:
```json
{
  "timestamp": "2026-07-25T10:30:00+05:30",
  "service": "delta-xi",
  "user": "analyst@algoiq.com",
  "action": "GET /api/v1/analytics/NIFTY",
  "source_ip": "192.168.190.104",
  "status": "success",
  "latency_ms": 12
}
```

## Rate Limiting

| Client Type | Requests/Minute | Burst |
|------------|-----------------|-------|
| Internal service | 10,000 | 200 |
| Strategy engine | 5,000 | 100 |
| Dashboard user | 1,000 | 20 |
| External API | 600 | 10 |

## Security Compliance

- OWASP Top 10 mitigation implemented
- Quarterly penetration testing via Parikshak security scanner
- Dependency vulnerability scanning on every build
- SOC 2 Type II audit trail maintained
- SEBI cybersecurity framework compliant
