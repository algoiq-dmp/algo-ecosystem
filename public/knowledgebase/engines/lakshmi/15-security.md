# 15. Security

**Version:** 2.1.0
**Owner:** Security Engineering
**Last Updated:** 2026-07-24

---

## Overview

Lakshmi implements defence-in-depth security spanning authentication, authorization, transport encryption, and audit logging. The security model integrates with Suraksha for centralised identity and certificate management while maintaining standalone security controls for deployments without Suraksha.

---

## Authentication

### JWT-Based Authentication

All API and WebSocket connections require a valid JWT (JSON Web Token) issued by the Suraksha identity service or a pre-configured identity provider.

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

**Token Specification:**

| Parameter | Value |
|---|---|
| Algorithm | RS256 (RSA 2048-bit) |
| Issuer (`iss`) | `suraksha.algo-iq.local` or configured IDP |
| Audience (`aud`) | `lakshmi` |
| Expiry (`exp`) | 1 hour (API), 24 hours (WebSocket) |
| Refresh Window | 15 minutes before expiry |

**Token Validation Flow:**
1. Client presents JWT in `Authorization` header
2. Lakshmi validates signature against Suraksha JWKS endpoint
3. Claims extracted: `sub`, `roles`, `permissions`, `tenant_id`
4. Token cache memoizes valid JWTs for 5 minutes

### API Key Authentication (Service-to-Service)

Internal services (Ganesh, Surya, Strategy Factory) authenticate via pre-shared API keys:

```
X-API-Key: lk-api-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**API Key Requirements:**
- Minimum 256-bit entropy
- Stored hashed (SHA-256) in Lakshmi configuration
- Rotated every 90 days (automated via Suraksha)
- Scoped to specific topics and operations

### WebSocket Authentication

WebSocket clients authenticate during the upgrade handshake:

```javascript
const ws = new WebSocket('wss://lakshmi:3001/ws', {
  headers: {
    'Authorization': 'Bearer <jwt_token>'
  }
});
```

Alternatively, pass the token as a query parameter: `wss://lakshmi:3001/ws?token=<jwt_token>`.

---

## Authorization (RBAC)

### Role-Based Access Control

| Role | Topic Access | Admin Access | Rate Limit |
|---|---|---|---|
| **Admin** | All topics (read/write) | Full | Unlimited |
| **Publisher** | Assigned topics (write) | None | 10,000 msg/sec |
| **Subscriber** | Assigned topics (read) | None | 5,000 msg/sec |
| **Monitor** | None | Read-only | 100 req/min |
| **Auditor** | None | Audit log access | 50 req/min |

### Permission Scopes

Permissions are stored in JWT claims as `scope` array:

```json
{
  "scope": [
    "topic:publish:NFO_EQ",
    "topic:publish:NFO_FUT",
    "topic:subscribe:BFO_EQ",
    "admin:metrics:read"
  ]
}
```

### Topic-Level ACLs

Each topic has an access control list enforced by the Topic Manager:

```yaml
topic: NFO_EQ
  publishers: [ganesh, surya-direct]
  subscribers: [strategy-factory, trading-terminal, analytics]
  rate_limit_publish: 50000
  rate_limit_subscribe: 10000
```

---

## Transport Encryption

### TLS 1.3

All network communication uses TLS 1.3 (with TLS 1.2 fallback). Older protocols are rejected.

| Interface | Protocol | Port | Certificate |
|---|---|---|---|
| HTTP API | HTTPS (TLS 1.3) | 443 → 3001 | Suraksha-issued wildcard |
| WebSocket | WSS (TLS 1.3) | 443 → 3001 | Suraksha-issued wildcard |
| RabbitMQ | AMQPS (TLS 1.3) | 5671 | Internal CA |
| Redis | TLS (redis://+tls) | 6380 | Internal CA |
| Prometheus/metrics | HTTPS (TLS 1.3) | 9090 | Internal CA |

**Cipher Suites (TLS 1.3):**
- `TLS_AES_256_GCM_SHA384`
- `TLS_CHACHA20_POLY1305_SHA256`
- `TLS_AES_128_GCM_SHA256`

---

## Certificates

### Certificate Lifecycle

Certificates are managed by Suraksha PKI:

1. **Issue:** Automatic via ACME or Suraksha CSR API
2. **Rotate:** Every 30 days, with 7-day overlap
3. **Revoke:** Immediate on compromise, propagated via CRL and OCSP
4. **Renew:** 7 days before expiry, zero-downtime reload

### Certificate Validation

- Full chain validation against Suraksha Root CA
- OCSP stapling enabled on all endpoints
- Certificate pinning for service-to-service communication (RabbitMQ, Redis)
- Self-signed certificates **not permitted** in production

---

## OWASP Compliance

Lakshmi implements the following OWASP Top 10 (2021) mitigations:

| OWASP Category | Mitigation |
|---|---|
| A01: Broken Access Control | RBAC + JWT scope validation on every request |
| A02: Cryptographic Failures | TLS 1.3 only; no deprecated ciphers; certificates via Suraksha PKI |
| A03: Injection | Parameterized MQ routing keys; input sanitisation on topic names |
| A04: Insecure Design | Threat model reviewed quarterly; security architecture board approval |
| A05: Security Misconfiguration | Configuration hardening guide; CIS benchmarks; automated config validation |
| A06: Vulnerable Components | Dependency scanning (npm audit, Snyk); weekly patch cycle |
| A07: Auth Failures | JWT expiry enforced; rate-limited login; account lockout after 5 failures |
| A08: Software & Data Integrity | GPG-signed releases; checksum verification on install; npm integrity hashes |
| A09: Logging & Monitoring Failures | Structured audit logs; shipping to ELK; alerting on auth failures |
| A10: SSRF | Strict outbound allowlist; no user-controlled redirect targets |

---

## Suraksha Integration

Lakshmi delegates identity and policy enforcement to Suraksha:

| Function | Suraksha Module | Fallback (No Suraksha) |
|---|---|---|
| JWT issuance & validation | Suraksha Auth Service | Local JWT secret + JWKS file |
| RBAC policy store | Suraksha Policy Engine | `access-control.json` config file |
| Certificate management | Suraksha PKI | Manual certificate provisioning |
| API key management | Suraksha Key Vault | Hashed keys in `config.json` |
| Threat detection | Suraksha Sentinel | Local rate-limit heuristics |
| Audit log forwarding | Suraksha Audit Pipeline | Local file + log rotation |

Refer to [17. Suraksha Integration](17-suraksha-integration.md) for detailed configuration.

---

## Firewall Rules

### Inbound (to Lakshmi)

| Source | Port | Protocol | Purpose |
|---|---|---|---|
| Load Balancer | 443 | TCP | HTTPS / WSS client traffic |
| Monitoring Network | 9090 | TCP | Prometheus scrape |
| Narad Mesh | 5671 | TCP | RabbitMQ (AMQPS) |

### Outbound (from Lakshmi)

| Destination | Port | Protocol | Purpose |
|---|---|---|---|
| RabbitMQ Cluster | 5671 | TCP | Message broker |
| Redis Cluster | 6380 | TCP | Cache |
| InfluxDB | 8086 | TCP | Metrics storage |
| Suraksha | 8443 | TCP | Auth/cert services |
| Narad | 8100 | TCP | Service discovery |
| ELK Stack | 5044 | TCP | Log shipping |

---

## Audit Logging

### Audit Events

All security-relevant events are logged to the audit trail:

| Event | Data Logged |
|---|---|
| `auth.login` | `user_id`, `ip`, `user_agent`, `success`, `failure_reason` |
| `auth.logout` | `user_id`, `session_duration_sec` |
| `auth.token_refresh` | `user_id`, `old_expiry`, `new_expiry` |
| `access.topic_publish` | `user_id`, `topic`, `message_count`, `timestamp` |
| `access.topic_subscribe` | `user_id`, `topic`, `duration_sec` |
| `access.denied` | `user_id`, `resource`, `required_permission`, `ip` |
| `admin.config_change` | `user_id`, `key_changed`, `old_value_hash`, `new_value_hash` |
| `admin.user_modified` | `admin_id`, `target_user_id`, `changes` |
| `security.cert_rotation` | `cert_serial`, `old_expiry`, `new_expiry` |
| `security.key_rotation` | `key_id`, `key_type`, `rotation_timestamp` |

### Audit Log Format

```json
{
  "event": "access.denied",
  "timestamp": "2026-07-24T10:30:05.123Z",
  "user_id": "svc-strategy-factory-01",
  "resource": "topic:publish:BFO_OPT",
  "required_permission": "topic:publish:BFO_OPT",
  "ip": "10.20.30.40",
  "correlation_id": "req-abc123",
  "engine": "lakshmi",
  "version": "2.1.0"
}
```

### Retention

| Tier | Retention | Storage |
|---|---|---|
| Hot (searchable) | 30 days | Elasticsearch |
| Warm (archive) | 1 year | S3-compatible object store |
| Compliance | 7 years | WORM storage (write-once-read-many) |

---

## Security Checklist

- [ ] TLS 1.3 enabled on all endpoints (no TLS <1.2)
- [ ] JWT tokens use RS256 with 2048-bit keys
- [ ] API keys hashed at rest; rotated every 90 days
- [ ] RBAC policies reviewed quarterly
- [ ] All dependencies scanned weekly (npm audit, Snyk)
- [ ] Audit logs shipping to ELK; alerting on `access.denied` events
- [ ] Firewall rules reviewed per change request
- [ ] Certificates expire in >14 days (monitored via Suraksha)
- [ ] OWASP Top 10 controls tested in penetration test
- [ ] Suraksha integration health verified (heartbeat endpoint)
