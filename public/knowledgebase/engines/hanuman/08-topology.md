# 08 — Topology

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Deployment Topology

```
┌───────────────────────────────────────────┐
│            Mumbai DC (Primary)            │
│                                           │
│  ┌─────────────────┐  ┌─────────────────┐ │
│  │ hanuman01-mum   │  │ hanuman02-mum   │ │
│  │ (Equity Spreads)│  │ (F&O Spreads)   │ │
│  │ CPU: 32C/64GB  │  │ CPU: 32C/64GB  │ │
│  └────────┬────────┘  └────────┬────────┘ │
│           │                    │           │
│           └──────────┬─────────┘           │
│                      │                     │
│           ┌──────────┴──────────┐          │
│           │      MQ Cluster     │          │
│           └──────────┬──────────┘          │
│                      │                     │
└──────────────────────┼─────────────────────┘
                       │
┌──────────────────────┼─────────────────────┐
│          Navi Mumbai DC (DR)               │
│                      │                     │
│  ┌─────────────────┐ │                     │
│  │ hanuman01-nm    │ │                     │
│  │ (DR Standby)    │ │                     │
│  └─────────────────┘ │                     │
└──────────────────────┴─────────────────────┘
```

## Server Inventory

| Hostname | DC | Strategy Focus | Cores | RAM |
|----------|-----|---------------|-------|-----|
| hanuman01-mum | Mumbai | Equity pair trades, cash-futures arb | 32 | 64 GB |
| hanuman02-mum | Mumbai | Futures spreads, options spreads | 32 | 64 GB |
| hanuman01-nm | Navi Mumbai | DR standby (all strategies) | 32 | 64 GB |

## Strategy Distribution

Strategies are distributed across servers based on instrument type:
- **hanuman01-mum:** Equity pair trades, cash-futures arbitrage (approximately 200 strategies)
- **hanuman02-mum:** Calendar spreads, inter-commodity spreads, option spreads (approximately 300 strategies)
- **hanuman01-nm:** Warm standby replicating all strategies; takes over on Mumbai server failure

## Network Topology

```
Hanuman Server ──► MQ (market data + orders + executions) :9092
Hanuman Server ──► ODIN (via MQ, order routing)
Hanuman Server ──► Risk Engine (gRPC, pre-trade checks) :50090
Hanuman Server ──► Suraksha (audit storage, certs) :50070
Hanuman Server ──► Narad (monitoring) :50060
```

## High Availability

- **Active-Passive DC:** Mumbai is active, Navi Mumbai is passive standby
- **Strategy State Replication:** Strategy state (positions, P&L) replicated from active to standby every 100ms
- **Failover trigger:** Narad detects active server health failure; standby promoted
- **P&L continuity:** Standby resumes with last replicated state; no P&L data loss
- **Pending orders:** Canceled and re-submitted by standby on promotion (OCO linkage prevents double-fill)
