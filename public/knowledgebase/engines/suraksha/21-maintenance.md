# 21 â€” Maintenance Procedures

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Maintenance Windows

| Type | Frequency | Window | Downtime |
|---|---|---|---|
| Routine | Monthly | Sunday 06:00â€“08:00 IST | None (rolling) |
| JWT key rotation | Quarterly | Sunday 06:00â€“06:30 IST | None |
| Vault maintenance | As needed by Vault | Negotiated | < 5 min |
| Major upgrade | Quarterly | Saturday 22:00 â€“ Sunday 06:00 IST | < 5 min |

## JWT Key Rotation

```bash
# 1. Add new key
node scripts/rotate-jwt-key.js --add-key suraksha-key-2026-08

# 2. Verify JWKS endpoint has both keys
curl https://suraksha.algoiq.io/.well-known/jwks.json | jq '.keys[].kid'

# 3. Wait 15 minutes for all old tokens to expire

# 4. Remove old key
node scripts/rotate-jwt-key.js --remove-key suraksha-key-2026-07
```

## Secret Rotation

```bash
# Rotate all secrets for a service
node scripts/rotate-secrets.js --service ganesh

# Rotate specific secret
node scripts/rotate-secrets.js --service ganesh --key redis-password

# Schedule automatic rotation
node scripts/rotate-secrets.js --schedule --service ganesh --interval 30d
```

## Database Maintenance

```bash
psql -d suraksha -c "VACUUM ANALYZE;"
# Reindex quarterly
psql -d suraksha -c "REINDEX DATABASE suraksha;"
```

## Version Upgrade

```bash
node scripts/migrate-db.js --env production --dry-run
node scripts/migrate-db.js --env production
kubectl set image deployment/suraksha suraksha=algoiq/suraksha:2.0.1
curl https://suraksha.algoiq.io/api/v1/health
```
