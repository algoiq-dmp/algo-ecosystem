# 21 â€” Maintenance Procedures

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Maintenance Windows

| Type | Frequency | Window | Notice Required |
|---|---|---|---|
| Routine | Weekly (Sunday) | 06:00â€“08:00 IST | 48 hours |
| Emergency | As needed | Immediately | 0 (post-incident review) |
| Major Upgrade | Quarterly | Saturday 22:00 â€“ Sunday 06:00 IST | 2 weeks |

## Pre-Maintenance Checklist

- [ ] Maintenance window communicated to stakeholders
- [ ] All consumers notified via Narad broadcast
- [ ] Database backup completed and verified
- [ ] Rollback plan documented and tested
- [ ] Secondary on-call engineer available
- [ ] Monitoring dashboards confirmed operational
- [ ] Change request approved in Jira

## Routine Maintenance Tasks

### Database Maintenance

```bash
psql -d ganesh -c "VACUUM ANALYZE ohlc_bars;"
psql -d ganesh -c "REINDEX TABLE ohlc_bars;"
psql -d ganesh -c "SELECT * FROM timescaledb_information.chunks WHERE hypertable_name = 'ohlc_bars';"
```

### Redis Maintenance

```bash
redis-cli MEMORY PURGE
redis-cli INFO memory | grep mem_fragmentation_ratio
# If fragmentation > 1.5, restart Redis during maintenance window
sudo systemctl restart redis
```

### Log Rotation

```bash
find /var/log/ganesh/ -name "*.log" -mtime +7 -exec gzip {} \;
find /var/log/ganesh/ -name "*.log.gz" -mtime +90 -delete
```

## Version Upgrade Procedure

### 1. Pre-Upgrade

```bash
pgbackrest --stanza=ganesh --type=full backup
redis-cli BGSAVE
node scripts/upgrade-check.js --from 3.2.0 --to 3.2.1
```

### 2. Database Migrations

```bash
node scripts/migrate-db.js --env production --dry-run
node scripts/migrate-db.js --env production
```

### 3. Rolling Upgrade (API Servers)

```bash
kubectl set image deployment/ganesh-api ganesh=algoiq/ganesh:3.2.1
curl https://ganesh-1.internal:3002/api/v1/health/deep
kubectl rollout status deployment/ganesh-api
```

### 4. Upgrade Bar Aggregator

```bash
narad-cli restart-service --name ganesh-aggregator-standby
pm2 stop ganesh-aggregator
git pull && npm ci --production
pm2 start ganesh-aggregator
curl http://localhost:9090/metrics | grep ganesh_bars_aggregated_total
```

### 5. Post-Upgrade Verification

- [ ] All health checks passing
- [ ] Bar aggregation rate matches pre-upgrade baseline
- [ ] API latency within acceptable range
- [ ] No new Prometheus alerts firing
- [ ] Consumer integrations confirmed functional

### 6. Rollback (if needed)

```bash
kubectl rollout undo deployment/ganesh-api
pm2 stop ganesh-aggregator
git checkout v3.2.0 && npm ci --production
pm2 start ganesh-aggregator
pgbackrest --stanza=ganesh --type=time --target="<pre-upgrade-timestamp>" restore
```

## Data Archival

### Archiving OHLC Bars Older Than 10 Years

```bash
psql -d ganesh -c "\COPY (SELECT * FROM ohlc_bars WHERE bar_time < NOW() - INTERVAL '10 years') TO '/archive/ganesh_bars_pre_2016.csv' CSV HEADER;"
gzip /archive/ganesh_bars_pre_2016.csv
aws s3 cp /archive/ganesh_bars_pre_2016.csv.gz s3://algoiq-archive/ganesh/ --storage-class DEEP_ARCHIVE
psql -d ganesh -c "DELETE FROM ohlc_bars WHERE bar_time < NOW() - INTERVAL '10 years';"
```

## Certificate Rotation

TLS certificates are managed by Suraksha. Verify after rotation:

```bash
openssl s_client -connect ganesh.algoiq.io:443 -servername ganesh.algoiq.io | openssl x509 -dates
pm2 restart ganesh  # if auto-reload fails
```

## Secret Rotation

Secrets are rotated via Suraksha Vault. Ganesh automatically reloads secrets on change:

```bash
curl -X POST http://localhost:3002/api/v1/admin/reload-secrets -H "Authorization: Bearer <admin-token>"
curl http://localhost:3002/api/v1/health/deep
```

## Maintenance Automation (Cron)

```
0 2 * * * /opt/ganesh/scripts/verify-backup.sh >> /var/log/ganesh/cron.log 2>&1
0 3 * * 0 psql -d ganesh -c "VACUUM ANALYZE ohlc_bars;"
0 3 1 * * psql -d ganesh -c "REINDEX TABLE ohlc_bars;"
0 1 * * * find /var/log/ganesh/ -name "*.log" -mtime +7 -exec gzip {} \;
```
