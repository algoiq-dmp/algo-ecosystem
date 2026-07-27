# 18 â€” Operations Runbook

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Daily Operations

### Morning Checklist

- [ ] Verify all Narad CP nodes healthy
- [ ] Verify all Agents connected
- [ ] Check ecosystem health summary
- [ ] Review overnight deployment failures
- [ ] Check PagerDuty for unresolved alerts
- [ ] Verify ELK log pipeline throughput

### End-of-Day Checklist

- [ ] Verify PostgreSQL backup completed
- [ ] Review command audit log for anomalies
- [ ] Check agent version compliance report
- [ ] Archive audit logs if approaching retention limits

## Agent Management

```bash
# List all agents
narad-cli agent list

# Agent health
narad-cli agent status --hostname ganesh-prod-1

# Restart agent remotely
narad-cli agent restart --hostname ganesh-prod-1

# Upgrade agent
narad-cli agent upgrade --version 3.0.1 --all
```

## Service Management

```bash
# Register service
narad-cli registry register --name my-service --type engine --host 10.0.1.100 --port 3005

# Deregister service
narad-cli registry deregister --name my-service

# Force heartbeat update
narad-cli registry heartbeat --name my-service
```

## Emergency Procedures

### Narad Control Plane Full Restart

```bash
kubectl scale deployment narad-control-plane --replicas=0
# Wait 30s
kubectl scale deployment narad-control-plane --replicas=3
# Verify all agents reconnected
curl http://localhost:3003/api/v1/health | jq .connectedAgents
```

### Agent Not Reconnecting

```bash
ssh ganesh-prod-1
sudo systemctl stop narad-agent
sudo rm -f /var/lib/narad-agent/state.db
sudo systemctl start narad-agent
```

## Backup and Restore

```bash
# PostgreSQL
pgbackrest --stanza=narad --type=full backup

# Redis
redis-cli BGSAVE

# Restore
pgbackrest --stanza=narad --type=time --target="2026-07-24 09:00:00" restore
```
