# SpreadWatch — Failover & High Availability

**Version:** 2.8.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## HA Architecture

SpreadWatch maintains 99.5% uptime through redundant deployment and automated failover mechanisms.

## Redundancy Model

```
          ┌─ Load Balancer (Narad) ─┐
          │                          │
    ┌─────▼─────┐            ┌──────▼─────┐
    │ Instance 1│◄───MQ─────►│ Instance 2 │
    │  (Active) │            │ (Standby)  │
    └─────┬─────┘            └──────┬─────┘
          │                          │
    ┌─────▼──────────────────────────▼─────┐
    │         Shared TimescaleDB              │
    └──────────────────────────────────────┘
```

## Failover Triggers

| Trigger | Detection | Response Time | Action |
|---------|-----------|---------------|--------|
| Instance crash | Narad heartbeat miss | < 15s | Auto-restart instance |
| Health check fail | `/health` returns error | < 30s | Mark unhealthy, route away |
| Database failure | Connection timeout | < 10s | Switch to standby DB |
| MQ disconnection | Consumer timeout | < 20s | Reconnect with backoff |
| High error rate | > 5% for 2 min | < 120s | Trigger blue-green swap |
| Memory exhaustion | OOM threshold | < 60s | Graceful restart |

## Recovery Procedures

### Instance Recovery
```bash
narad restart spreadwatch --instance 1 --graceful
```

### Database Failover
```bash
# Automatic: PostgreSQL streaming replication with Patroni
# Manual override:
narad failover-db spreadwatch --target standby-algo-iq-4
```

### Full Service Recovery
```bash
narad restore spreadwatch --from-backup --backup-date latest
```

## Data Redundancy

| Component | Replication | RPO | RTO |
|-----------|-------------|-----|-----|
| Database | Synchronous streaming | 0 seconds | < 30 seconds |
| MQ messages | Mirrored queues | < 1 second | < 10 seconds |
| Cache | Redis Sentinel | < 5 seconds | < 60 seconds |
| Configuration | Narad multi-master | Immediate | < 5 seconds |

## Disaster Recovery

### DR Site
- **Location:** Secondary data center (Mumbai DC2)
- **Sync:** Near-real-time database replication
- **Standby:** Warm instance ready for activation

### DR Activation
```bash
narad dr-activate spreadwatch --site dr-mumbai
```

### RTO/RPO Targets
- **Recovery Time Objective (RTO):** < 15 minutes
- **Recovery Point Objective (RPO):** < 1 minute of data loss
- **DR tested:** Monthly automated failover drill

## Graceful Degradation

If downstream dependencies are partially unavailable:
1. **Ganesh down:** Serve from last-known cache (stale data flag set)
2. **MQ down:** Buffered writes, flush on reconnection
3. **Surya down:** Use cached reference data, alert operations
4. **Lakshmi down:** Fall back to Ganesh REST polling at higher frequency

## Monitoring During Failover
- All failover events logged to Chitragupta audit
- Real-time status updates published to DXCC dashboard
- On-call engineer paged for any unplanned failover
- Post-mortem document created within 24 hours
