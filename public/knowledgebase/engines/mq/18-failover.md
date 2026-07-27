# 18 — Failover

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Failover Architecture

MQ's high availability is built on partition-level replication with Raft consensus. Failover happens automatically at the partition level, not the broker level.

## Partition Leader Failover

When a partition leader broker fails:

```
1. Follower detects leader heartbeat timeout (150-300ms)
2. Follower initiates Raft leader election
3. Candidate requests votes from other followers
4. Candidate with majority votes becomes new leader
5. New leader notifies producers and consumers
6. Producers redirect produce requests to new leader
7. Consumers redirect fetch requests to new leader
```

**Total failover time:** typically < 2 seconds.

## Broker Failure Scenarios

### Single Broker Failure (1 of 3)

```
Before:  Broker-1(leader-P0,P3), Broker-2(leader-P1,P4), Broker-3(leader-P2,P5)
After:   Broker-1(DOWN), Broker-2(leader-P0,P1,P3,P4), Broker-3(leader-P2,P5)
```

- Remaining brokers take over leadership of partitions previously led by the failed broker
- If `replication_factor = 3` and `min.insync.replicas = 2`: producers can still write (2 replicas available)
- If all replicas of a partition were on the failed broker: partition is offline (requires broker recovery)

### Two Broker Failures (2 of 3)

```
Before:  Broker-1(leader-P0,P3), Broker-2(leader-P1,P4), Broker-3(leader-P2,P5)
After:   Broker-1(DOWN), Broker-2(DOWN), Broker-3(leader-all)
```

- Remaining broker takes over all partitions
- If `min.insync.replicas = 2`: producers receive errors (ISR count < 2)
- **Temporary trade-off:** availability vs. durability. Configure `min.insync.replicas = 1` on critical topics if availability is prioritized over durability.

### Controller Failover

The controller is the broker responsible for managing partition leadership and ISR membership. Controller election is automatic:

1. All brokers watch the controller znode in cluster metadata.
2. If the controller heartbeat fails, the broker with the lowest ID initiates election.
3. New controller elected within < 1 second.

## Consumer Group Failover

When a consumer fails:
1. Group coordinator detects heartbeat timeout (`session.timeout.ms = 30s`)
2. Coordinator triggers rebalance
3. Remaining consumers receive partition reassignment
4. Consumption resumes from last committed offsets

**Consumer failover time:** `session.timeout.ms + rebalance time` (approximately 35 seconds).

## Cross-DC Failover

If the entire Mumbai DC fails:
1. Narad detects all Mumbai brokers are unreachable
2. Operations team triggers DC failover (manual or automated via Narad)
3. Navi Mumbai brokers are promoted as the primary cluster
4. Cross-DC mirror consumers resume from last mirrored offset
5. Producers are redirected to Navi Mumbai brokers

## Failover Testing

| Test | Frequency | Procedure |
|------|-----------|-----------|
| Single broker restart | Weekly (Saturday) | `systemctl restart mqd` on one broker, validate cluster health |
| Controller failover | Weekly (Saturday) | Kill controller process, validate new controller elected |
| Partition leader re-election | Monthly | Manually demote partition leader via `mqctl` |
| Full cluster restart | Quarterly | Rolling restart of all brokers |
| DC Failover | Quarterly | Full Mumbai → Navi Mumbai failover drill |

## Configuration for Failover

```yaml
replication:
  default_factor: 3
  min_insync_replicas: 2
  unclean_leader_election: false

raft:
  election_timeout_ms: 150
  election_timeout_jitter_ms: 150
  heartbeat_interval_ms: 50

failover:
  dc_failover_enabled: true
  dc_failover_mode: "manual"  # or "auto"
  dc_promotion_timeout_sec: 60
```
