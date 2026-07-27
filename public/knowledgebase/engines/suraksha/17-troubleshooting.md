# 17 â€” Troubleshooting Guide

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Diagnostic Commands

```bash
curl https://localhost:3004/api/v1/health
curl https://localhost:3004/api/v1/health -H "Authorization: Bearer <token>"
vault status
redis-cli ping
psql -d suraksha -c "SELECT 1"
```

## Common Issues

### Token Validation Failing

**Symptoms**: Services reporting 401, valid tokens rejected.

**Resolution**:
```bash
# 1. Check token not expired
node -e "console.log(new Date(1721809800 * 1000))"

# 2. Check token not revoked
curl -X POST https://suraksha.algoiq.io/api/v1/auth/validate -d '{"token":"..."}'

# 3. Check JWT key ID matches current key
# Decode JWT header at jwt.io; compare kid with current key

# 4. If key was rotated, ensure old key is still in JWKS
curl https://suraksha.algoiq.io/.well-known/jwks.json
```

### Authorization Denied Unexpectedly

**Symptoms**: `allowed: false` when user should have permission.

**Resolution**:
```bash
# 1. Check user's roles
curl https://suraksha.algoiq.io/api/v1/users/{userId}/roles -H "Authorization: Bearer <admin-token>"

# 2. Check role permissions
curl https://suraksha.algoiq.io/api/v1/roles/{roleId}/permissions -H "Authorization: Bearer <admin-token>"

# 3. Check if role has expired
psql -d suraksha -c "SELECT * FROM user_roles WHERE user_id = '{userId}' AND expires_at < NOW();"

# 4. Flush RBAC cache
redis-cli KEYS "suraksha:authz:*" | xargs redis-cli DEL
```

### Vault Unavailable

**Symptoms**: Health shows Vault disconnected, secrets not retrievable.

**Resolution**:
```bash
# 1. Check Vault status
vault status

# 2. If sealed, unseal
vault operator unseal

# 3. Suraksha will serve cached secrets for 5 minutes
# If Vault is down longer, rotate all secrets after recovery
```

### Certificate Renewal Failed

**Symptoms**: `suraksha_certs_expiring_30d` > 0.

**Resolution**:
```bash
# 1. Check ACME challenge
node scripts/cert-renew.js --domain ganesh.algoiq.io --dry-run

# 2. Manual renewal
node scripts/cert-renew.js --domain ganesh.algoiq.io --force

# 3. If Let's Encrypt is down, switch to internal CA
node scripts/cert-renew.js --domain ganesh.algoiq.io --provider internal-ca
```

### Brute Force Alert

**Symptoms**: PagerDuty alert for brute force.

**Resolution**:
```bash
# 1. Check blocked IP
redis-cli GET "suraksha:threat:1.2.3.4:failed_auth"

# 2. Manually block IP
redis-cli SETEX "suraksha:blocked:1.2.3.4" 3600 "1"

# 3. Review attempts
psql -d suraksha -c "SELECT * FROM audit_log WHERE ip_address = '1.2.3.4' AND event_type = 'AUTH_FAILED' ORDER BY created_at DESC LIMIT 20;"
```

## Support Escalation

| Severity | Channel | Response Time |
|---|---|---|
| Critical (Suraksha down) | PagerDuty | 5 minutes |
| High (Auth failures) | Slack #suraksha-alerts | 15 minutes |
| Medium (Permission issue) | Jira ticket | 4 hours |
| Low (Question) | Slack #suraksha-support | 24 hours |
