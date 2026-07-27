# 06 â€” Component Descriptions

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Component Inventory

| Component | Type | Criticality |
|---|---|---|
| Authentication Service | Service | Critical |
| Authorization Service (RBAC) | Service | Critical |
| Encryption Service | Service | Critical |
| Vault Integration | Service | Critical |
| Certificate Manager | Service | High |
| RBAC Engine | Service | Critical |
| Threat Detection Engine | Service | High |
| Security Monitor (SIEM) | Service | High |
| Compliance Engine | Service | Medium |
| Audit Logger | Service | Critical |
| Token Blacklist | Infrastructure (Redis) | High |
| JWT Key Manager | Service | Critical |

---

## Authentication Service

Handles all authentication flows: JWT token issuance, refresh, validation, and revocation. Supports client credentials (service accounts), authorization code (user login), and API key (legacy/automation) flows. Issues short-lived tokens (15 min) with refresh token support (24 hours). Tracks `jti` claims in Redis to prevent replay attacks.

## Authorization Service (RBAC)

The central policy decision point for the ecosystem. Accepts `{ user, resource, action }` tuples and returns `ALLOW` or `DENY` with sub-ms latency. Uses Redis caching for performance and PostgreSQL for durable storage. Supports role hierarchy (parent roles inherit child permissions), temporary role grants with expiry, and permission wildcards.

## Encryption Service

Manages all encryption operations: TLS termination for the Suraksha API, key generation for new services, encryption/decryption of data at rest. Derives keys from Vault. Enforces minimum encryption standards: TLS 1.3, AES-256-GCM, RSA 2048+.

## Vault Integration

Abstraction layer over HashiCorp Vault. Services never talk to Vault directly â€” they query Suraksha, which proxies the request with audit logging. Supports secret creation, rotation scheduling, version history, and access control per service.

## Certificate Manager

Full lifecycle management for TLS certificates across the ecosystem. Integrates with Let's Encrypt via ACME for public-facing certs and internal CA for internal service certs. Automates renewal 30 days before expiry. Provides dashboard showing all certificates, their status, and expiry timeline.

## RBAC Engine

The policy evaluation engine. Resolves a user's effective permissions by walking their role assignments, role hierarchy, and permission grants. Outputs a set of `{ resource, action }` pairs that the user is authorized to perform. Results are cached aggressively for performance.

## Threat Detection Engine

Real-time anomaly detection for security events. Processes the authentication and authorization event stream, applies detection rules, and generates alerts. Uses sliding windows for rate-based rules (brute force, API abuse) and machine learning for behavioral anomalies (unusual access patterns).

## Security Monitor (SIEM)

Aggregates all security events into a real-time dashboard. Provides searchable, filterable event log. Integrates with external SIEM platforms (Splunk, Elastic Security). Generates automated reports for SOC review.

## Compliance Engine

Generates compliance reports for SOC 2, ISO 27001, SEBI Cybersecurity Framework. Tracks control implementation status. Schedules periodic access reviews (quarterly RBAC audit). Exports audit logs in standard formats.

## Audit Logger

Immutable, append-only audit log for all security events. Every authentication, authorization, secret access, certificate operation, and RBAC change is logged. Uses cryptographic chaining (Merkle tree) to ensure tamper evidence. Retained for minimum 7 years with automatic archival.

## Token Blacklist

Redis-based blacklist for revoked JWTs. When a token is revoked, its `jti` is added to the blacklist with TTL matching the token's original expiry. All JWT validation checks the blacklist before accepting a token.

## JWT Key Manager

Manages JWT signing keys. Supports key rotation: new keys are added while old keys remain valid until all tokens signed by them expire. Keys are stored in Vault and cached in memory for performance. Supports multiple active keys for seamless rotation.
