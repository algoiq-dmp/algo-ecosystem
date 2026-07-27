# 18 â€” Operations Runbook

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Daily Operations

### Morning Checklist (before market open)

- [ ] Verify all Ganesh API instances are healthy
- [ ] Verify deep health checks pass on all instances
- [ ] Check RabbitMQ tick queue depth (< 10,000)
- [ ] Verify bar freshness for top 10 symbols
- [ ] Review overnight Prometheus alerts
- [ ] Confirm no pending corporate actions from Surya
- [ ] Check Redis memory usage below 70%
- [ ] Verify PostgreSQL replication lag < 1 second

### End-of-Day Checklist

- [ ] Verify all 1D bars generated for all active symbols
- [ ] Check PostgreSQL backup completed
- [ ] Review daily performance report
- [ ] Archive logs older than 7 days
- [ ] Run data integrity check on the day's bars

## Routine Maintenance

### Weekly

```bash
psql -d ganesh -c "ANALYZE ohlc_bars;"
psql -d ganesh -c "SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;"
redis-cli MEMORY PURGE
```

### Monthly

- Review and rotate secrets via Suraksha Vault
- Apply OS security patches
- Review capacity trends and plan scaling
- Test disaster recovery failover

### Quarterly

- Load test with 120% of peak production load
- Review and update runbook
- Audit consumer API usage patterns
- Archive PostgreSQL data older than 10 years

## Scaling Operations

### Scaling API Servers (Horizontal)

```bash
kubectl scale deployment ganesh-api --replicas=5
```

### Scaling Bar Aggregator (Vertical-first)

Increase vCPUs/RAM, increase `workerThreads`, increase `ringBufferSize`.

### Scaling Redis

Enable cluster mode in config: `"cluster": true, "clusterNodes": [...]`

### Scaling PostgreSQL

Enable read replicas, increase instance size, adjust TimescaleDB chunk intervals.

## Backup and Restore

```bash
# PostgreSQL
pgbackrest --stanza=ganesh --type=full backup

# Redis
redis-cli BGSAVE
aws s3 cp /var/lib/redis/dump.rdb s3://algoiq-backups/ganesh/redis/

# Restore
pgbackrest --stanza=ganesh --type=time --target="2026-07-24 09:00:00" restore
aws s3 cp s3://algoiq-backups/ganesh/redis/dump.rdb /var/lib/redis/
sudo systemctl restart redis
```

## Emergency Procedures

### Complete Service Restart

```bash
kubectl scale deployment ganesh-api --replicas=0
sudo systemctl restart redis
sudo systemctl restart postgresql
pm2 restart ganesh-aggregator
# Verify: curl http://localhost:9090/metrics | grep ganesh_bars_aggregated_total
kubectl scale deployment ganesh-api --replicas=3
```

### Data Recovery from Replica

```bash
pg_ctl promote -D /var/lib/postgresql/15/main
# Update config.json -> postgresql.host
pm2 restart ganesh
```

## Runbook Contacts

| Role | Contact |
|---|---|
| Primary On-Call | Data Engineering Lead |
| Secondary On-Call | Senior Backend Engineer |
| Escalation | VP of Engineering |
| Security Incident | Suraksha Security Team |
| Infrastructure | Narad Infrastructure Team |
