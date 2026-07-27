# 22 — Security

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Security Architecture

Kuber Alpha handles live trading capital and communicates with broker execution systems. Security is paramount at every layer.

## Authentication & Authorization

### Authentication

- JWT-based with 15-minute access token expiry.
- API keys for CI/CD and automated systems (90-day rotation).
- mTLS for inter-service communication (internal traffic).
- All external endpoints require TLS 1.3.

### Authorization (RBAC)

| Role | Permissions |
|---|---|
| **Strategy Viewer** | View strategy status, P&L |
| **Strategy Owner** | Deploy/pause/resume own strategies |
| **Risk Manager** | View all strategies, configure Kill Switch thresholds |
| **Ops Engineer** | Monitor health, view logs, manage deployments |
| **Admin** | Full access: all strategies, kill switch disarm, user management |

## Network Security

| Boundary | Protection |
|---|---|
| External → Kuber Alpha | TLS 1.3, JWT auth, rate limiting |
| Kuber Alpha → Vega | mTLS, dedicated VPC |
| Kuber Alpha → MQ | TLS-encrypted AMQP |
| Kuber Alpha → MongoDB | TLS, authentication, VPC-only |
| Kuber Alpha → Redis | TLS, AUTH password, VPC-only |

## Kill Switch Security

The Kill Switch is the ultimate security control:

- **Immutable threshold**: Kill Switch margin threshold can only be changed with admin + risk manager dual approval.
- **No disable in production**: The Kill Switch cannot be fully disabled; only disarmed temporarily with audit trail.
- **Tamper-proof logs**: All Kill Switch events are logged immutably.
- **Independent operation**: Kill Switch operates independently of other components — it still works even if Kuber Alpha's main process fails.

## Order Security

| Control | Description |
|---|---|
| Order authentication | Every order carries a HMAC signature |
| Quantity limits | Hard cap per order (configurable per instrument) |
| Price sanity check | Orders with price deviation > 10% from LTP are flagged |
| Frequency limits | Max orders per second per strategy |
| Duplicate prevention | Idempotency keys prevent duplicate orders |
| Vega signature verification | Orders accepted by Vega only with valid signature |

## Secret Management

| Secret | Storage | Rotation |
|---|---|---|
| JWT signing keys | HashiCorp Vault | 30 days |
| API keys | Vault (encrypted) | 90 days |
| Database passwords | Vault (dynamic secrets) | Auto-rotated |
| MQ credentials | Vault | 30 days |
| Vega API keys | Vault | 90 days |

## Audit Logging

All security-relevant events are logged immutably:

| Event | Details |
|---|---|
| Kill Switch trigger/disarm | User, timestamp, reason |
| Strategy mode change | Old mode, new mode, user |
| Capital allocation change | Amount, strategy, user |
| Manual order intervention | Order ID, action, user |
| API key usage | Key ID, endpoint, IP |
| Failed authentication | User/IP, attempt count |

## Compliance

- SEBI algorithmic trading guidelines
- Exchange (NSE, BSE) API security requirements
- ISO 27001 aligned controls
- Regular penetration testing (quarterly)
- Vulnerability scanning (daily automated)

## Incident Response

| Severity | Response Time | Escalation |
|---|---|---|
| Kill Switch triggered | 15 minutes | CISO + CTO |
| Unauthorized access | 15 minutes | Security team lead |
| Data breach | 1 hour | CISO |
| Suspicious trading pattern | 1 hour | Risk + Compliance |

## Security Contacts

- **Security Team**: security@algo-iq.com
- **Incident Hotline**: +91-XXX-XXX-XXXX (24/7)
- **Bug Bounty**: https://bugcrowd.com/algo-iq
