# 23 â€” Changelog & Release Notes

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Version 2.0.0 (2026-07-24)

### Added
- Complete zero-trust security architecture.
- RBAC engine with role hierarchy, temporary grants, and permission wildcards.
- Immutable audit log with cryptographic chaining and Merkle tree verification.
- Certificate Manager with ACME auto-renewal (Let's Encrypt integration).
- Threat Detection Engine with brute force, token replay, and anomaly detection.
- JWT key rotation automation with zero-downtime transitions.
- Secret rotation scheduler with automatic Vault integration.
- Compliance Engine for SOC 2, ISO 27001, and SEBI reports.
- SIEM dashboard with real-time security event monitoring.
- MFA support for admin/root access (TOTP).

### Changed
- Token TTL reduced from 1 hour to 15 minutes for enhanced security.
- JWT algorithm upgraded from HS256 to RS256 (asymmetric).
- RBAC storage migrated from Redis-only to PostgreSQL + Redis cache.
- Audit log enhanced with cryptographic chaining.
- Vault integration rewritten for better caching and failover.

### Fixed
- Token replay vulnerability with `jti` claim tracking.
- RBAC cache inconsistency during role hierarchy changes.
- Secret exposure in Suraksha error logs.
- Timing attack vector on token validation endpoint.

---

## Version 1.5.0 (2026-03-15)

### Added
- RBAC with role-based permissions.
- Vault integration for secrets management.
- JWT token issuance and validation.
- Basic audit logging.

### Fixed
- Memory leak in token validation cache.

---

## Version 1.0.0 (2025-09-01)

### Added
- Initial release: JWT-based authentication.
- API key validation.
- Basic RBAC.
- TLS certificate management.
- Audit logging.
