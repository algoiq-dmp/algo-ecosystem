# 20 — Scalability Design

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Scalability Model

Vega is designed to scale **horizontally** for stateless components and **vertically** for stateful ones, with clear partitioning boundaries.

---

## Component Scalability Matrix

| Component | Scaling Model | Max Instances | Partitioning Key |
|---|---|---|---|
| TalkStrategy API | Horizontal (stateless) | 16 | None (round-robin LB) |
| TalkStrategy App | Horizontal (stateless) | 32 | None (MQ round-robin) |
| Order Processor | Horizontal (stateful) | 8 | `userId.hash % N` |
| Broker Integration — XTS | Vertical (session-bound) | 2 | Broker session ID |
| Broker Integration — Greeksoft | Vertical (session-bound) | 2 | Broker session ID |
| RabbitMQ | Horizontal (clustered) | 7 | Queue (HA mirrored) |
| Redis | Horizontal (clustered) | 15 (shards) | Key hash slot |
| PostgreSQL | Vertical + read replicas | 1 primary, 4 replicas | N/A |

---

## Horizontal Scaling: TalkStrategy API

```
                [Load Balancer (HAProxy)]
                  │      │      │      │
                  ▼      ▼      ▼      ▼
             [API-1] [API-2] [API-3] [API-4]  ...  [API-N]
                │      │      │      │
                └──────┴──────┴──────┘
                       │
                  [RabbitMQ Cluster]
```

- **Stateless:** No session affinity required
- **Scaling trigger:** CPU > 70% OR requests/sec > 1000 per pod
- **Scale out:** Add pods via HPA (Kubernetes) or ASG (VMs)
- **Scale in:** Remove pods during low traffic (post-market)
- **Warm-up time:** < 5 seconds (no cache priming needed)

---

## Horizontal Scaling: Order Processor (Stateful Partitioning)

```
                  [RabbitMQ: vega.orders.validated]
                       │
                  [Consistent Hash Exchange]
                  userId.hashCode() % N
                 ┌──┴──┬──────┬──────┐
                 ▼     ▼      ▼      ▼
            [Proc-0][Proc-1][Proc-2][Proc-3]
            (shard  (shard  (shard  (shard
              0)      1)      2)      3)
```

- **Partitioning:** Consistent hashing via RabbitMQ consistent-hash exchange
- **Why stateful?** Order Processor maintains in-memory state for active orders; a given order must always route to the same processor
- **Rebalancing:** Adding a new processor shard redistributes ~(1/N+1) of the hash ring
  - Orders already being processed are NOT redistributed
  - New orders follow the updated hash ring
- **Partition limit:** 8 shards maximum (diminishing returns beyond this)
- **Failover:** If Proc-2 dies, its queue is consumed by the next processor (with stale-state protection via Redis state rehydration)

---

## Vertical Scaling: Broker Integration (FIX Sessions)

FIX protocol requires persistent TCP connections — one session per broker endpoint:

```
[XTS FIX VM]
  ├── FIX Session 1 (VEGA-PROD-01 → XTS-BROKER)
  │   └── TCP connection: fix.xtsbroker.com:9200
  │   └── Sequence numbers persisted in Redis
  │
  └── FIX Session 2 (VEGA-PROD-01 → XTS-BROKER-BACKUP)
      └── TCP connection: fix2.xtsbroker.com:9200

[Greeksoft FIX VM]
  ├── FIX Session 1 (VEGA-PROD-01 → GREEKSOFT)
  │   └── TCP connection: fix.greeksoft.com:9201
  │
  └── FIX Session 2 (fallback REST)
      └── https://api.greeksoft.com/v2
```

- **Vertical scaling:** Upgrade VM CPU/RAM to handle higher throughput per session
- **Session limit:** Each broker typically allows 1-2 concurrent FIX sessions per firm
- **Throughput per session:** Tested up to 2,500 orders/sec on single FIX session (broker-dependent)

---

## Database Scalability

### PostgreSQL Scaling

```
[Primary (Mumbai)]
  ├── READ/WRITE: All INSERT, UPDATE, DELETE
  │   └── orders (date-partitioned), broker_configs, user_mappings
  │
  ├── [Replica 1 (Mumbai — sync)]
  │   └── READ: Order status queries, API list endpoints
  │
  ├── [Replica 2 (Mumbai — async)]
  │   └── READ: Audit queries, reporting
  │
  └── [Replica 3 (Hyderabad — async, DR)]
      └── READ: DR failover target
```

- **Read scaling:** Load balance read queries across replicas via HAProxy
- **Write scaling:** Limited by single primary — mitigated by:
  - Partitioning orders by date (monthly partitions)
  - Async audit writes (batched, non-blocking)
  - Connection pooling (50 connections max, multiplexed)
- **Sharding (future, v7.0+):** Shard orders by `userId.hash % N` across multiple primary instances

### Redis Scaling

```
[Redis Cluster — 5 shards]
  Shard 0 (slots 0-3276):   Master M0 + Replica R0
  Shard 1 (slots 3277-6553):  Master M1 + Replica R1
  Shard 2 (slots 6554-9830):  Master M2 + Replica R2
  Shard 3 (slots 9831-13107): Master M3 + Replica R3
  Shard 4 (slots 13108-16383): Master M4 + Replica R4

Key hashing: CRC16(key) % 16384 → determines shard
```

---

## Capacity Planning

### Current Capacity (v6.3.0)

| Metric | Current | Limit |
|---|---|---|
| Concurrent users | 350 | 5,000 (design limit) |
| Daily orders | ~500,000 | 50,000,000 |
| Peak orders/sec | 350 | 20,000 (cluster) |
| Active FIX sessions | 4 | 200 |
| Database size (orders) | ~50 GB | Partitioned, no limit |
| Audit events/day | ~2M | Handled by TimescaleDB compression |

### Scale Triggers

| Metric | Threshold | Action |
|---|---|---|
| API CPU > 70% sustained (5 min) | 70% | Add 2 API pods |
| MQ consumer lag > 1000 (5 min) | 1000 | Add 2 App pods |
| DB CPU > 60% (5 min) | 60% | Add read replica, review query plans |
| Redis memory > 70% | 70% | Add Redis shard |
| Order latency P99 > 50ms | 50ms | Investigate bottleneck, scale affected component |

---

## Multi-Region Scaling

```
Mumbai (Primary)
  ├── All components active
  ├── All FIX sessions active
  └── DB Primary (read/write)

Hyderabad (DR)
  ├── API/App/Processor: Warm standby (2 instances each)
  ├── FIX sessions: Standby (connected but not sending orders)
  ├── DB: Async replica
  └── Redis: Read-only replica cluster
```

### DR Promotion Time

| Step | Time |
|---|---|
| Detect Mumbai failure | < 30 seconds |
| Promote Hyderabad DB to primary | < 60 seconds |
| Activate FIX sessions in Hyderabad | < 30 seconds |
| Update DNS/Consul for Vega API | < 30 seconds |
| Verify health | < 30 seconds |
| **Total RTO** | **< 3 minutes** |

---

## Cost Optimization

| Strategy | Savings |
|---|---|
| Scale down to 2 API pods post-market (15:30–09:00 IST) | ~60% compute cost |
| Use spot instances for staging/test environments | ~70% staging cost |
| Audit data compression (TimescaleDB) | ~80% audit storage |
| DB replicas on smaller instances (4 vCPU vs 16 for primary) | ~50% DB cost |
| Reserved instances for baseline capacity | ~40% compute cost |
