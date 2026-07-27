# 22 â€” Frequently Asked Questions

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## General

**Q: What is Suraksha?**
A: Suraksha is the Universal Security Layer that protects every component in the Algo-IQ ecosystem. It provides authentication, authorization, encryption, secrets management, certificate management, RBAC, threat detection, and compliance.

**Q: What is "zero trust"?**
A: A security model where no component is trusted by default. Every request must be authenticated, every action authorized, regardless of network location or prior trust.

**Q: What's Suraksha's uptime target?**
A: 99.99% (< 52 minutes downtime per year). Auth and authZ are critical path for every API call.

## Authentication

**Q: How do I get a JWT token?**
A: POST your client_id and client_secret to `/api/v1/auth/token`. Tokens are valid for 15 minutes.

**Q: Why 15-minute tokens?**
A: Short-lived tokens minimize the damage window if a token is stolen. Use refresh tokens for longer sessions.

**Q: Can services validate tokens without calling Suraksha?**
A: Yes. Services can download the JWKS from `/.well-known/jwks.json` and validate tokens locally.

## Authorization

**Q: How does RBAC work?**
A: Users are assigned roles, roles have permissions (resource + action). When a user attempts an action, Suraksha checks if any of their roles grant the required permission.

**Q: Can permissions be inherited?**
A: Yes. Roles can have parent roles. A child role inherits all permissions from its parent.

**Q: How fast is authorization checking?**
A: < 1ms p99 for cached checks. 98% of checks hit the cache.

## Secrets

**Q: Where are secrets stored?**
A: All secrets are stored in HashiCorp Vault, encrypted with AES-256-GCM. Services fetch secrets from Suraksha, which proxies to Vault.

**Q: How often are secrets rotated?**
A: Database credentials: 30 days. JWT keys: 90 days. TLS certs: 90 days (Let's Encrypt). Master keys: annually.

## Certificates

**Q: Who manages TLS certificates?**
A: Suraksha's Certificate Manager. It auto-renews certificates 30 days before expiry via ACME (Let's Encrypt).

**Q: What if a cert expires?**
A: Suraksha alerts the Security Team 30 days, 14 days, 7 days, and 1 day before expiry. If it expires, manual renewal takes < 30 seconds.

## Security Incidents

**Q: What if a JWT key is compromised?**
A: Emergency key rotation in < 2 minutes. All existing tokens are revoked. New key deployed. Services notified.

**Q: How do I report a security vulnerability?**
A: Email security@algoiq.io. Do NOT file a public issue. Response within 4 hours for critical vulnerabilities.
