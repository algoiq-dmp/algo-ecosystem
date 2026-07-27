# 04 â€” High-Level Architecture

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Architectural Overview

Suraksha follows a defense-in-depth architecture with the principle of zero trust at its core. Every layer is independently secured, and no component implicitly trusts any other.

```
+------------------------------------------------------------------+
|                    SURAKSHA SECURITY GATEWAY                      |
|                                                                   |
|  Inbound Request --> [WAF] --> [TLS Termination] --> [AuthN]     |
|                                                |                  |
|                                                v                  |
|                            +-------------------+----------------+ |
|                            |                                    | |
|                    +-------v-------+                    +-------v-------+
|                    | JWT Validation|                    | API Key Check |
|                    | (RS256)       |                    | (SHA-256)     |
|                    +-------+-------+                    +-------+-------+
|                            |                                    | |
|                            +-----------+------------+-----------+ |
|                                        |                         |
|                                +-------v-------+                 |
|                                | Authorization |                 |
|                                | (RBAC Engine) |                 |
|                                +-------+-------+                 |
|                                        |                         |
|                +-----------------------+-------+                 |
|                |                       |       |                 |
|        +-------v------+  +-----v----+ +--v-----------+         |
|        | Permission    |  | Role     | | Policy       |         |
|        | Resolver      |  | Resolver | | Enforcer     |         |
|        +-------+------+  +-----+----+ +--+-----------+         |
|                |                |         |                      |
|                +--------+-------+---------+                      |
|                         |                                        |
|                 +-------v-------+                                |
|                 | Audit Logger  |                                |
|                 | (Immutable)   |                                |
|                 +---------------+                                |
|                                                                   |
|  +------------------+  +----------------+  +------------------+  |
|  | Vault            |  | Cert Manager   |  | Threat Detection |  |
|  | (Secrets Mgmt)   |  | (TLS/ACME)     |  | (Anomaly Engine) |  |
|  +------------------+  +----------------+  +------------------+  |
|                                                                   |
|  [REST API :3004] [gRPC :50052] [Prometheus :9092]              |
+--------------------------+---------------------------------------+
                           |
              +------------+-------------+
              |            |             |
     +--------v----+ +----v-----+ +----v------+
     |  Lakshmi    | | Ganesh   | | All Other |
     |  (Secured)  | | (Secured)| | Services  |
     +-------------+ +----------+ +-----------+
```

## Tier Descriptions

### Gateway Layer

The WAF and TLS termination handle all inbound traffic. TLS 1.3 is enforced; older protocols are rejected. The WAF blocks common attack patterns (SQL injection, XSS, CSRF).

### Authentication Layer

Two parallel authentication paths: JWT validation (for service-to-service and user-to-service calls) and API key validation (for service accounts and automation). JWT tokens are validated against Suraksha's public key; API keys are hashed and compared against the secure store.

### Authorization Layer

The RBAC Engine resolves permissions through a three-step pipeline: permission resolver identifies the required permission for the requested action, role resolver finds the caller's roles, and policy enforcer makes the allow/deny decision. Decision results are cached in Redis with a 60-second TTL for performance.

### Security Services

- **Vault**: HashiCorp Vault stores and manages all secrets with automatic rotation and audit.
- **Certificate Manager**: Issues and renews TLS certificates via ACME protocol. Maintains certificate inventory and expiry calendar.
- **Threat Detection**: Analyzes auth patterns in real-time to detect anomalies, brute force, and privilege escalation.

### Audit Layer

Every authentication attempt, authorization decision, token issuance, secret access, and certificate operation is logged to an immutable audit trail. The audit logger uses a cryptographic chain (similar to blockchain) to ensure log integrity.

## Design Decisions

| Decision | Rationale |
|---|---|
| RS256 (RSA) for JWT | Widely supported, allows offline validation by services |
| Short-lived tokens (15 min) | Minimizes impact of token theft |
| RBAC cache in Redis | Sub-ms authorization decisions at scale |
| Vault as root of trust | Industry standard for secrets management |
| ACME for certs | Automated, free (Let's Encrypt), industry standard |
| Cryptographic audit chain | Tamper-proof compliance logging |
| Stateless auth servers | Horizontal scalability behind load balancer |
