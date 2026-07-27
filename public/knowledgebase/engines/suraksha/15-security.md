# 15 â€” Security Design

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Zero-Trust Architecture

Suraksha implements zero-trust principles:

1. **Never trust, always verify**: Every request is authenticated and authorized.
2. **Least privilege**: Services get only the permissions they need.
3. **Assume breach**: Design as if the perimeter is already compromised.
4. **Micro-segmentation**: Each service-to-service call is independently authenticated.
5. **Continuous verification**: Tokens are short-lived; trust is continuously re-evaluated.

## Suraksha Self-Security

Suraksha secures itself using its own mechanisms:
- Its own API requires JWT authentication.
- Admin access requires MFA.
- Its secrets are stored in the same Vault.
- Its audit log is immutable and chained.
- Root credentials are split (Shamir's Secret Sharing) for Vault unseal.

## Authentication Security

| Measure | Implementation |
|---|---|
| Short-lived tokens | 15-minute access tokens |
| Token replay prevention | `jti` claim tracked in Redis |
| Brute force protection | IP-based rate limiting, progressive delays |
| Credential hashing | API keys stored as SHA-256 hashes |
| MFA | TOTP for admin/root access |
| Token binding | Optionally bind tokens to IP/subnet |

## Authorization Security

| Measure | Implementation |
|---|---|
| Permission granularity | Resource + Action pairs |
| Role hierarchy | Inherited permissions with max depth |
| Temporary grants | Role expiry timestamps |
| Access review | Quarterly mandatory review of all role assignments |
| Deny-by-default | Unknown permission = DENY |

## Encryption Standards

| Data State | Algorithm | Notes |
|---|---|---|
| In transit | TLS 1.3 | ECDSA P-256 or RSA 2048+ certs |
| Secrets at rest (Vault) | AES-256-GCM | Vault's barrier encryption |
| Audit logs at rest | AES-256-GCM | PostgreSQL TDE |
| JWT signing | RS256 (RSA 2048+) | Private key in Vault |

## Key Management

| Key Type | Rotation | Storage |
|---|---|---|
| JWT signing key | Every 90 days | Vault |
| Vault unseal keys | On compromise | Shamir-5-of-3, offline |
| TLS private keys | Annually or on compromise | Vault |
| Database credentials | Every 30 days | Vault |
| API keys | On compromise | Vault |
| Master encryption key | Annually | Vault |

## Audit Integrity

Audit log entries are cryptographically chained:

```
entry[n].hash = SHA256(entry[n].prev_hash + entry[n].data)
```

Every 24 hours, a Merkle root of all entries is computed and stored in Vault. This ensures:
- No entry can be modified without detection.
- No entry can be deleted without detection.
- No entry can be inserted retroactively.

## Incident Response

1. Detect: Threat detection engine or SIEM alert.
2. Contain: Revoke affected tokens, block IPs, rotate compromised secrets.
3. Eradicate: Identify root cause, patch vulnerability.
4. Recover: Restore from clean backup if needed, reissue credentials.
5. Lessons Learned: Post-incident review, update detection rules.
