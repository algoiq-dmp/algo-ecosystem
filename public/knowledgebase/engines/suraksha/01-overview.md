# 01 â€” Overview

## What is Suraksha?

Suraksha is the Universal Security Layer for the Algo-IQ ecosystem. It implements a **zero-trust security model** that protects every server, engine, product, API, tunnel, database, and deployment. No component trusts any other without explicit authentication and authorization through Suraksha.

## Why Suraksha Was Developed

Before Suraksha, security was fragmented:

- **Isolated authentication** â€” each service had its own auth logic, creating inconsistencies.
- **No unified RBAC** â€” permissions scattered across services, impossible to audit globally.
- **Hardcoded secrets** â€” API keys and passwords in config files and environment variables.
- **Ad-hoc TLS** â€” certificates managed manually by each team, causing expired certs and outages.
- **No threat visibility** â€” no centralized view of security events across the ecosystem.
- **Compliance gaps** â€” no unified audit trail for regulatory requirements.

Suraksha solves these by centralizing all security functions into one platform.

## Business Objective

Implement and enforce a zero-trust security architecture across the entire Algo-IQ ecosystem, ensuring that every access is authenticated, every action is authorized, every secret is protected, and every event is audited.

## Technical Objective

- Issue and validate 10,000+ JWT tokens per second.
- Manage 500+ secrets across all services.
- Issue and renew TLS certificates for 50+ endpoints automatically.
- Process 50,000+ authorization checks per second at < 1ms latency.
- Detect threats within 10 seconds of anomalous behavior.
- Maintain 99.99% uptime for the security plane.

## Scope

| In Scope | Out of Scope |
|---|---|
| Authentication (JWT, OAuth2, API keys, MFA) | Application-level business logic |
| Authorization (RBAC, ABAC, policy enforcement) | Database-level row security |
| Encryption (TLS, at-rest) | Network firewall rules |
| Secrets management (Vault) | Hardware Security Module (HSM) operation |
| Certificate lifecycle management | Domain registration |
| Threat detection & monitoring | Incident response (handled by SOC) |
| Compliance & audit | External penetration testing |

## Target Users

| User Type | Interaction |
|---|---|
| **All Engines** | Authenticate API calls, fetch service secrets |
| **API Consumers** | Obtain JWT tokens, validate permissions |
| **DevOps** | Manage certificates, rotate secrets |
| **Security Team** | Monitor threats, audit access, enforce compliance |
| **Compliance Officers** | Generate audit reports, verify controls |

## Benefits

- **Zero-trust architecture** â€” no implicit trust between any components.
- **Single authentication point** â€” one JWT works everywhere.
- **Centralized RBAC** â€” manage all permissions from one dashboard.
- **Automated certificate lifecycle** â€” no more expired certificate outages.
- **Immutable audit trail** â€” every security event logged for 7 years.

## Inputs

| Source | Description | Protocol |
|---|---|---|
| All services | Authentication requests, authorization checks | HTTPS |
| Narad | Service registry (who needs what permissions) | HTTPS |
| Certificate Authorities | Certificate signing and validation | ACME / API |

## Outputs

| Consumer | Delivery Method | Data |
|---|---|---|
| All services | JWT tokens, authorization decisions, secrets | HTTPS / gRPC |
| Security Team | Threat alerts, dashboards | HTTPS / WebSocket |
| Compliance | Audit reports, access reviews | HTTPS / PDF |
| Narad | Security health metrics | HTTPS |
