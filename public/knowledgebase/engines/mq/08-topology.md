# 08 — Topology

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Cluster Topology

### Mumbai DC (Primary)

```
                   ┌──────────────────────────────────────┐
                   │          MQ Cluster DC1               │
                   │                                      │
                   │  ┌─────────┐  ┌─────────┐  ┌────────┐│
                   │  │ mq01-mum│  │ mq02-mum│  │mq03-mum││
                   │  │ Broker  │  │ Broker  │  │ Broker  ││
                   │  │ 48C/256G│  │ 48C/256G│  │48C/256G││
                   │  └────┬────┘  └────┬────┘  └───┬────┘│
                   │       │            │            │     │
                   │       └────────────┼────────────┘     │
                   │                    │                  │
                   │         ┌──────────┴──────────┐      │
                   │         │   Schema Registry    │      │
                   │         │   (mq04-mum)         │      │
                   │         └─────────────────────┘      │
                   └──────────────────────────────────────┘
```

### Navi Mumbai DC (DR)

```
                   ┌──────────────────────────────────────┐
                   │          MQ Cluster DC2               │
                   │                                      │
                   │  ┌─────────┐  ┌─────────┐  ┌────────┐│
                   │  │ mq01-nm │  │ mq02-nm │  │mq03-nm ││
                   │  │ Broker  │  │ Broker  │  │ Broker  ││
                   │  │ 48C/256G│  │ 48C/256G│  │48C/256G││
                   │  └────┬────┘  └────┬────┘  └───┬────┘│
                   │       │            │            │     │
                   │       └────────────┼────────────┘     │
                   │                    │                  │
                   │         ┌──────────┴──────────┐      │
                   │         │   Schema Registry    │      │
                   │         │   (mq04-nm)          │      │
                   │         └─────────────────────┘      │
                   └──────────────────────────────────────┘
```

## Server Inventory

| Hostname | DC | Role | Cores | RAM | Storage |
|----------|-----|------|-------|-----|---------|
| mq01-mum | Mumbai | Broker | 48 | 256 GB | 8x 3.84TB NVMe |
| mq02-mum | Mumbai | Broker | 48 | 256 GB | 8x 3.84TB NVMe |
| mq03-mum | Mumbai | Broker | 48 | 256 GB | 8x 3.84TB NVMe |
| mq04-mum | Mumbai | Schema Registry + Admin | 16 | 64 GB | 2x 480GB SSD |
| mq01-nm | Navi Mumbai | Broker | 48 | 256 GB | 8x 3.84TB NVMe |
| mq02-nm | Navi Mumbai | Broker | 48 | 256 GB | 8x 3.84TB NVMe |
| mq03-nm | Navi Mumbai | Broker | 48 | 256 GB | 8x 3.84TB NVMe |
| mq04-nm | Navi Mumbai | Schema Registry + Admin | 16 | 64 GB | 2x 480GB SSD |

## Network Topology

```
                    ┌──────────────┐
                    │  Core Switch  │
                    │  (Arista 7280) │
                    └──┬──┬──┬──┬───┘
                       │  │  │  │
              ┌────────┘  │  │  └────────┐
              ▼           ▼  ▼           ▼
         ┌────────┐  ┌────────┐    ┌────────┐
         │mq01-mum│  │mq02-mum│    │mq03-mum│
         └────────┘  └────────┘    └────────┘
              │           │             │
              │  25GbE LACP Bond        │
              │  (2x25GbE per server)   │
              │           │             │
              └───────────┼─────────────┘
                          │
              ┌───────────┼─────────────┐
              │   Inter-DC Dark Fiber   │
              │   (2x100GbE DWDM)       │
              └───────────┼─────────────┘
                          │
         ┌────────┐  ┌────────┐    ┌────────┐
         │mq01-nm │  │mq02-nm │    │mq03-nm │
         └────────┘  └────────┘    └────────┘
```

## Partition Distribution

Partitions are distributed across brokers in DC1 using a weighted round-robin algorithm. Each partition has 3 replicas (1 leader + 2 followers), spread across different brokers for fault tolerance.

Example for `feed.NSE.CM.tick` (16 partitions):

| Partition | Leader | Followers |
|-----------|--------|-----------|
| 0 | mq01-mum | mq02-mum, mq03-mum |
| 1 | mq02-mum | mq03-mum, mq01-mum |
| 2 | mq03-mum | mq01-mum, mq02-mum |
| ... | (round-robin) | ... |
