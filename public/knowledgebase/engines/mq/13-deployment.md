# 13 — Deployment

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Deployment Environments

| Environment | Brokers | Location | Purpose |
|-------------|---------|----------|---------|
| Production | mq01-mum, mq02-mum, mq03-mum | Mumbai DC | Live trading |
| Production DR | mq01-nm, mq02-nm, mq03-nm | Navi Mumbai DC | Disaster recovery |
| UAT | mq-uat-01, mq-uat-02, mq-uat-03 | Mumbai DC | User acceptance testing |
| Staging | mq-stg-01, mq-stg-02, mq-stg-03 | Mumbai DC | Pre-prod validation |
| Dev | mq-dev-01 | Navi Mumbai DC | Development |

## Deployment Strategy

### Rolling Upgrade (Recommended)

MQ supports rolling upgrades with zero downtime:

1. Upgrade one broker at a time, starting with followers.
2. For each broker:
   - Gracefully shut down: `systemctl stop mqd`
   - Install new version: `dnf update lakshmi-mq`
   - Start broker: `systemctl start mqd`
   - Wait for replication catch-up: `mqctl broker status --id $BROKER_ID`
   - Verify `under_replicated_partitions` returns to 0.
3. After all followers are upgraded, upgrade the leaders.
4. Raft leader elections will naturally transfer leadership during restarts.
5. Verify cluster health after all brokers upgraded.

**Total upgrade time for 3 brokers:** approximately 30 minutes.

### Canary Deployment

For major version changes, use a canary broker:
1. Add a temporary 4th broker to the cluster with the new version.
2. Assign a subset of partitions to the canary.
3. Monitor for 24 hours: compare latency, throughput, error rates.
4. If successful, proceed with rolling upgrade of remaining brokers.
5. Remove the canary broker.

## Production Deployment Checklist

### Pre-Deployment
- [ ] All tests pass in staging for 48 hours
- [ ] Performance benchmarks show no regression
- [ ] Rollback plan documented
- [ ] Change request approved (CHG-XXXXX)
- [ ] Schema compatibility verified for all topics
- [ ] Backup of all broker data completed

### During Deployment
- [ ] Deploy during low-volume window (Saturday 14:00-16:00 IST)
- [ ] Upgrade Schema Registry first, then brokers
- [ ] Monitor consumer lag during the process
- [ ] Each broker passes health check before proceeding to next

### Post-Deployment
- [ ] All brokers running new version
- [ ] Cluster health: green
- [ ] Under-replicated partitions: 0
- [ ] Consumer lag within expected bounds
- [ ] Monitor for full trading day before declaring success

## Rollback

```bash
# 1. Stop broker gracefully
systemctl stop mqd

# 2. Downgrade package
dnf downgrade lakshmi-mq-5.1.2

# 3. Restore RocksDB from pre-upgrade checkpoint (if needed)
mqctl storage restore --checkpoint /data/mq/checkpoints/pre-upgrade

# 4. Start broker
systemctl start mqd

# 5. Repeat for all brokers
```

## Monitoring After Deployment

Key metrics to watch for 60 minutes post-deployment:
- `mq_messages_in_total` rate: must match pre-deployment baseline
- `mq_produce_latency_ms` p99: no more than 10% increase
- `mq_consumer_lag`: should trend toward 0
- `mq_under_replicated_partitions`: must stay at 0
- `mq_raft_leader_elections_total`: no unexpected spikes
