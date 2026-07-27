---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 18 — Failover & High Availability

## Architecture Overview

Garuda Margin Engine is designed for 99.99% availability during market hours with an active-primary + standby-secondary architecture using Redis replication and PostgreSQL Patroni for automatic failover.

```
┌─────────────────────────────────────────────────────────────┐
│                    PRIMARY REGION (India Central)            │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │  K8s Cluster    │  │  K8s Cluster    │                 │
│  │  (Active)       │  │  (Active)       │                 │
│  │  AZ-1           │  │  AZ-2           │                 │
│  └────────┬────────┘  └────────┬────────┘                 │
│           │                    │                            │
│  ┌────────┼────────────────────┼────────┐                 │
│  │        ▼                    ▼        │                 │
│  │  ┌──────────┐         ┌──────────┐   │                 │
│  │  │PostgreSQL│◄─Sync──►│PostgreSQL│   │                 │
│  │  │ Primary  │         │ Replica  │   │                 │
│  │  └────┬─────┘         └──────────┘   │                 │
│  │       │ Patroni HA                    │                 │
│  │       ▼                               │                 │
│  │  ┌──────────┐  ┌──────────┐          │                 │
│  │  │  Redis   │  │  Redis   │          │                 │
│  │  │ Master 1 │  │ Master 2 │          │                 │
│  │  └──────────┘  └──────────┘          │                 │
│  └──────────────────────────────────────┘                 │
│                                                             │
│                     │ Geo-Replication                       │
│                     ▼                                       │
└─────────────────────────────────────────────────────────────┘
                      │
┌─────────────────────────────────────────────────────────────┐
│                 SECONDARY REGION (India South)               │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │  PostgreSQL     │  │  Redis          │                 │
│  │  Async Replica  │  │  (Warm Standby) │                 │
│  └─────────────────┘  └─────────────────┘                 │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │  Kafka          │  │  K8s Cluster    │                 │
│  │  MirrorMaker    │  │  (Scaled to 0)  │                 │
│  └─────────────────┘  └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## PostgreSQL High Availability (Patroni)

Patroni manages PostgreSQL HA with automatic leader election and failover.

### Configuration
```yaml
# patroni.yml
scope: garuda-postgres
namespace: /garuda/
ttl: 30
loop_wait: 10
retry_timeout: 10
maximum_lag_on_failover: 1048576  # 1 MB

postgresql:
  listen: 0.0.0.0:5432
  parameters:
    wal_level: replica
    hot_standby: "on"
    wal_keep_segments: 128
    max_wal_senders: 10
    max_replication_slots: 10
    wal_log_hints: "on"
    archive_mode: "on"
    archive_command: "/bin/true"

restapi:
  listen: 0.0.0.0:8008
```

### Failover Behavior
1. **Detection**: Patroni health check fails after `ttl` (30s) without leader heartbeat
2. **Election**: Replica with lowest replication lag promoted to primary
3. **Promotion**: ~5-10 seconds for the replica to become primary
4. **Reconfiguration**: Connection strings updated via Kubernetes service
5. **Split-Brain Prevention**: Fencing via `pg_rewind` if old primary rejoins

### Primary-Secondary Setup
```sql
-- Create replication slot on primary
SELECT * FROM pg_create_physical_replication_slot('garuda_replica_1');

-- Configure replica
-- postgresql.conf
primary_conninfo = 'host=primary-host port=5432 user=replicator'
primary_slot_name = 'garuda_replica_1'
hot_standby = on
```

## Redis High Availability

### Redis Cluster (Production)
- 6 nodes: 3 Master + 3 Replica
- Client connections via Redis Cluster protocol
- Automatic failover via Redis Sentinel
- Data sharded across masters (16384 hash slots)

### Sentinel Configuration
```
# redis-sentinel.conf
port 26379
sentinel monitor garuda-master redis-master-1 6379 2
sentinel auth-pass garuda-master {password}
sentinel down-after-milliseconds garuda-master 5000
sentinel failover-timeout garuda-master 30000
sentinel parallel-syncs garuda-master 1
```

### Failover Behavior
1. **Detection**: Sentinel detects master down after 5 seconds
2. **Quorum**: 2 out of 3 Sentinels must agree master is down
3. **Election**: Replica with highest replication offset elected
4. **Promotion**: SLAVEOF NO ONE → new master
5. **Reconfiguration**: Other replicas resync with new master
6. **Total time**: <30 seconds

## Kafka High Availability

- 5 brokers across 3 availability zones
- Replication factor: 3
- Minimum in-sync replicas: 2
- Producer acks: `all`
- Consumer isolation level: `read_committed`

### Broker Failure Tolerance
With RF=3 and minISR=2: can tolerate 1 broker failure without losing write capability. If 2 brokers fail simultaneously, topics become read-only until quorum restored.

## Auto-Failover Flow

### Health Check Cascade
```
1. Liveness Probe (per pod, every 15s)
   → Pod restarted if unresponsive >45s

2. Readiness Probe (per pod, every 5s)
   → Pod removed from service if dependencies unhealthy

3. Service Health Check (aggregated, every 30s)
   → Narad heartbeat reports overall health

4. Regional Health Check (external, every 60s)
   → Azure Front Door / Route53 monitors availability

5. DR Activation (manual, CTO authorization)
   → Primary region unreachable >5 minutes → DR failover initiated
```

### Automatic Actions

| Failure | Action | Recovery Time |
|---|---|---|
| Pod crash / OOM | Kubernetes restart (CrashLoopBackOff → 5 min max) | <30 seconds |
| Node failure | Pods rescheduled to healthy node | <2 minutes |
| PostgreSQL primary failure | Patroni auto-failover to replica | <30 seconds |
| Redis master failure | Sentinel auto-failover to replica | <30 seconds |
| Kafka broker failure | ISR shrinkage; consumer rebalance | <60 seconds |
| Single AZ failure | All services continue on remaining 2 AZs | 0 (no impact) |
| Region failure | Manual DR activation | <15 minutes |

## Graceful Shutdown

### Service Shutdown Sequence
```csharp
// Graceful shutdown handler
public async Task StopAsync(CancellationToken cancellationToken)
{
    // 1. Stop accepting new requests (readiness probe fails)
    _healthService.SetReadiness(false);

    // 2. Wait for in-flight requests to complete (max 30s)
    await Task.Delay(TimeSpan.FromSeconds(30), cancellationToken);

    // 3. Deregister from Narad
    await _naradClient.DeregisterAsync();

    // 4. Flush Kafka producers
    _kafkaProducer.Flush(TimeSpan.FromSeconds(10));

    // 5. Commit any in-progress DB transactions
    // (handled by DI scope disposal)

    // 6. Close connections
    await _dbConnection.CloseAsync();
    await _redisConnection.CloseAsync();
}
```

## DR Failover Procedure

### Pre-requisites
- PostgreSQL async replication confirmed healthy (lag <1 minute)
- Kafka MirrorMaker confirmed replicating all topics
- Blob storage RA-GRS replication confirmed
- DR cluster node count verified (scaled to 0, ready to scale up)

### Failover Commands
```bash
# 1. Promote DR PostgreSQL to primary
az postgres flexible-server replica promote \
    --resource-group garuda-dr-rg \
    --name garuda-dr-pg \
    --source-server garuda-prod-pg

# 2. Scale up DR K8s cluster
az aks scale \
    --resource-group garuda-dr-rg \
    --name garuda-dr-aks \
    --node-count 8

# 3. Deploy application
helm install garuda garuda/garuda-margin-engine \
    --namespace garuda-production \
    --values deployment/helm/values-dr.yaml

# 4. Enable Kafka consumers
kubectl scale deployment garuda-margin-engine \
    -n garuda-production --replicas=8

# 5. Update DNS
az network dns record-set a update \
    --resource-group garuda-dns-rg \
    --zone-name garuda.dev \
    --name api --set aRecords[0].ipv4Address=$DR_LB_IP

# 6. Verify
curl https://api.garuda.dev/health
```

### RTO & RPO

| Metric | Target | Last Drill Result |
|---|---|---|
| Recovery Time Objective | <15 minutes | 12 minutes |
| Recovery Point Objective | <1 minute data loss | 45 seconds |
| Full Service Restoration | <30 minutes | 22 minutes |
| DR Drill Frequency | Quarterly | 2026-06-15 |

## Circuit Breaker Patterns

### Inter-Service Communication
```
Closed → (5 failures / 60s window) → Open → (60s timeout) → Half-Open
    ↑                                                           │
    └────────────── (2 successes) ─────────────────────────────┘
```

### Configuration per dependency

| Dependency | Failure Threshold | Break Duration | Timeout |
|---|---|---|---|
| PostgreSQL | 3 failures / 30s | 30s | 5s |
| Redis | 3 failures / 30s | 30s | 3s |
| Kafka | 5 failures / 60s | 60s | 10s |
| Suraksha | 5 failures / 30s | 30s | 5s |
| Narad | 3 failures / 30s | 60s | 5s |
