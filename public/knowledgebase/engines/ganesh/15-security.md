# 15 â€” Security Design

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Security Model

Ganesh delegates all security primitives to **Suraksha**, the ecosystem-wide security layer. Ganesh itself implements no independent authentication, authorization, or secret management.

## Authentication

All Ganesh API endpoints require a Suraksha-issued JWT token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

JWT tokens are validated against Suraksha's public key. Token validation includes:
- Signature verification (RS256)
- Expiration check (`exp` claim)
- Issuer verification (`iss` = `suraksha.algoiq.io`)
- Audience verification (`aud` = `ganesh`)

## Authorization

Ganesh implements Suraksha's Role-Based Access Control (RBAC) model:

| Role | Permissions |
|---|---|
| `ganesh.admin` | Full API access, config changes, health administration |
| `ganesh.consumer.read` | Read OHLC bars via all query endpoints |
| `ganesh.consumer.write` | Reserved for internal bar ingestion |
| `ganesh.monitor` | Health and metrics endpoints only |
| `ganesh.simulator` | Read access with higher rate limits for backtesting |

## Encryption

| Layer | Protocol | Notes |
|---|---|---|
| API Transport | TLS 1.3 | Enforced; HTTP requests are rejected |
| Redis Connection | TLS 1.3 | Stunnel or native Redis TLS |
| PostgreSQL Connection | TLS 1.3 | SSL mode `verify-full` |
| RabbitMQ Connection | AMQPS (TLS 1.3) | Certificate-based mutual authentication |
| Data at Rest | AES-256-GCM | PostgreSQL TDE (Transparent Data Encryption) |

## Secrets Management

Ganesh retrieves all secrets from Suraksha Vault at startup:

| Secret | Vault Path | Rotation |
|---|---|---|
| JWT Public Key | `secret/ganesh/jwt-public-key` | Quarterly |
| Redis Password | `secret/ganesh/redis-password` | Monthly |
| PostgreSQL Password | `secret/ganesh/pg-password` | Monthly |
| RabbitMQ Password | `secret/ganesh/mq-password` | Monthly |
| TLS Private Key | `secret/ganesh/tls-key` | Annually |
| TLS Certificate | `secret/ganesh/tls-cert` | Annually |

## Threat Mitigations

| Threat | Mitigation |
|---|---|
| Unauthorized API access | Suraksha JWT validation on every request |
| Token replay attack | Short-lived tokens (15 min TTL) + `jti` claim tracking |
| Credential leakage | All secrets from Vault, never in config files or env |
| SQL Injection | Parameterized queries exclusively |
| DDoS / API abuse | Rate limiting per consumer; Suraksha WAF at ingress |
| Man-in-the-Middle | TLS 1.3 enforced on all connections |
| Privilege escalation | Principle of least privilege; Suraksha RBAC |
| Data exfiltration | Audit logging on all read queries; anomaly detection |

## Security Compliance

| Standard | Scope |
|---|---|
| SOC 2 Type II | API access controls, data integrity, availability |
| ISO 27001 | Information security management |
| SEBI Cybersecurity Framework | Market data protection (India-specific) |
