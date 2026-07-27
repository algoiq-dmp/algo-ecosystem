# 21 â€” Maintenance Procedures

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Maintenance Windows

| Type | Frequency | Window | Downtime |
|---|---|---|---|
| Routine CP update | Monthly | Sunday 06:00â€“08:00 IST | None (rolling) |
| Agent upgrade | Monthly | Sunday 06:00â€“08:00 IST | Per-server (30s) |
| Database maintenance | Weekly | Sunday 04:00â€“05:00 IST | 0 (read replicas) |
| Major upgrade | Quarterly | Saturday 22:00 â€“ Sunday 06:00 IST | < 5 min |

## Agent Upgrade

```bash
# Upgrade all agents (rolling, one by one)
narad-cli agent upgrade --version 3.0.1 --all --strategy rolling

# Upgrade specific agent
narad-cli agent upgrade --version 3.0.1 --hostname ganesh-prod-1

# Verify after upgrade
narad-cli agent version-report
```

## Database Maintenance

```bash
psql -d narad -c "VACUUM ANALYZE;"
psql -d narad -c "REINDEX DATABASE narad;"
```

## Audit Log Archival

```bash
# Archive audit logs older than 7 years
psql -d narad -c "\COPY (SELECT * FROM audit_log WHERE created_at < NOW() - INTERVAL '7 years') TO '/archive/narad_audit.csv' CSV HEADER;"
psql -d narad -c "DELETE FROM audit_log WHERE created_at < NOW() - INTERVAL '7 years';"
```

## Version Upgrade

```bash
# 1. Database migration
node scripts/migrate-db.js --env production --dry-run
node scripts/migrate-db.js --env production

# 2. Rolling CP upgrade
kubectl set image deployment/narad-control-plane narad-cp=algoiq/narad-control-plane:3.0.1

# 3. Verify
curl https://narad.algoiq.io/api/v1/health

# 4. Rolling agent upgrade
narad-cli agent upgrade --version 3.0.1 --all --strategy rolling

# 5. Final verification
narad-cli health ecosystem
```
