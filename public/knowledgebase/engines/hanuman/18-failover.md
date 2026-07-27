# 18 — Failover

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Failover Architecture

Hanuman uses active-standby with state replication for high availability. The DR standby in Navi Mumbai maintains a warm copy of all strategy state.

## State Replication

```
Hanuman Active (Mumbai) ──► State Replication Stream ──► Hanuman Standby (Navi Mumbai)
    │                            (every 100ms)                     │
    │                                                              │
    │ Replicates:                                                  │
    │  - Strategy state (RUNNING, PAUSED, etc.)                    │
    │  - Position per strategy                                     │
    │  - P&L per strategy                                          │
    │  - Pending order IDs                                         │
    │  - Last checkpoint position                                  │
```

## Failover Scenarios

### Server-Level Failover (Intra-DC)

On hanuman01-mum failure:
1. hanuman02-mum strategies unaffected
2. hanuman01-mum strategies migrated to hanuman02-mum
3. New instances start from last checkpoint + replay log
4. Pending orders canceled via ODIN; re-submitted with OCO linkage

**Recovery time:** < 30 seconds

### DC-Level Failover (Mumbai → Navi Mumbai)

On entire Mumbai DC failure:
1. Narad detects Mumbai Hanuman servers DOWN
2. Operations triggers DC failover (manual with automated assist)
3. Navi Mumbai standby promoted to active
4. Strategies resume from last replicated state
5. All pending orders canceled at exchange level
6. Strategies re-evaluate market conditions and re-enter positions if conditions still valid

**Recovery time:** < 60 seconds (manual approval step)

## Failover Procedures

### Planned Failover (Maintenance)

```bash
# 1. Gracefully stop all strategies on active
hanumanctl stop --all --server hanuman01-mum

# 2. Wait for all positions to close and orders to settle
hanumanctl verify --no-open-positions --server hanuman01-mum

# 3. Promote standby
hanumanctl promote --server hanuman01-nm

# 4. Start strategies on promoted server
hanumanctl start --all --server hanuman01-nm
```

### Emergency Failover

```bash
# 1. Isolate failed server (network level)
# iptables/firewall rule to block all traffic from failed server

# 2. Promote standby
hanumanctl promote --server hanuman01-nm --force

# 3. Cancel all pending orders via ODIN emergency API
odinctl cancel-all --client-id hanuman01-mum

# 4. Strategies on standby will re-evaluate after promotion
```

## Failover Testing

| Test | Frequency | Procedure |
|------|-----------|-----------|
| Server-level failover | Monthly | Graceful stop → promote standby → verify P&L continuity |
| DC failover | Quarterly | Mumbai DC isolation → Navi Mumbai promotion drill |
| Risk Engine failover | Monthly | Kill Risk Engine → verify strategy pauses (no orders without risk check) |
| State replication gap | Weekly | Verify `replication_lag_ms < 200` for all strategies |
