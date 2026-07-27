# 18 â€” Operations Runbook

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Daily Operations

### Morning Checklist

- [ ] Verify all Suraksha instances healthy
- [ ] Verify Vault is unsealed and healthy
- [ ] Check certificate expiry dashboard (no certs expiring < 30 days)
- [ ] Review overnight threat detection alerts
- [ ] Verify JWT key not approaching rotation deadline (90 days)
- [ ] Check RBAC audit log for unauthorized changes

### End-of-Day Checklist

- [ ] Verify PostgreSQL backup completed
- [ ] Export daily audit log snapshot to secure storage
- [ ] Review access patterns for anomalies
- [ ] Check rate limit counters for abnormal activity

## Key Rotation

### JWT Signing Key (Every 90 Days)

```bash
node scripts/rotate-jwt-key.js --add-key suraksha-key-YYYY-MM
# Wait 15 minutes for all active tokens to expire
node scripts/rotate-jwt-key.js --remove-key <old-key-id>
```

### Database Credentials (Every 30 Days)

```bash
node scripts/rotate-db-credentials.js --service suraksha --env production
# Narad notifies dependent services to reload config
```

## Certificate Management

```bash
# List all certs
node scripts/cert-list.js

# Manual renewal
node scripts/cert-renew.js --domain ganesh.algoiq.io

# Revoke compromised cert
node scripts/cert-revoke.js --domain ganesh.algoiq.io --reason compromised
```

## Access Review (Quarterly)

```bash
node scripts/access-review.js --output report.pdf

# Steps:
# 1. Export all user-role assignments
# 2. Owners confirm each assignment is still needed
# 3. Remove stale assignments
# 4. Generate compliance report for SOC 2
```

## Vault Unseal

If Vault restarts and becomes sealed:

```bash
# 3 of 5 unseal keys required
vault operator unseal <key1>
vault operator unseal <key2>
vault operator unseal <key3>
vault status  # Should show "Sealed: false"
```

## Emergency Procedures

### JWT Key Compromise

```bash
# 1. Immediately add new key and revoke compromised key
node scripts/rotate-jwt-key.js --add-key suraksha-key-emergency --revoke-compromised <old-key-id>

# 2. Revoke all active tokens
node scripts/revoke-all-tokens.js

# 3. Notify all services to fetch updated JWKS
narad-cli broadcast --message "JWT key rotated. Update JWKS immediately."

# 4. Rotate all service credentials (in case keys were derived)
node scripts/rotate-all-secrets.js
```

### Suraksha Full Restart

```bash
kubectl scale deployment suraksha --replicas=0
kubectl scale deployment suraksha --replicas=3
# Verify health
curl https://suraksha.algoiq.io/api/v1/health
```

## Audit Log Export

```bash
# Export as CSV
psql -d suraksha -c "\COPY (SELECT * FROM audit_log WHERE created_at > NOW() - INTERVAL '90 days') TO '/export/audit.csv' CSV HEADER;"

# Verify integrity
node scripts/verify-audit-chain.js
```
