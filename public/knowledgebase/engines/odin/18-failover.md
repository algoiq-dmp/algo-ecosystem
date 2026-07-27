# 18 — Failover

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Multi-Path Failover Architecture

ODIN's primary resilience mechanism is multi-path routing. Each exchange segment has at least two routing paths, typically on different servers, using different technologies.

## Adapter-Level Failover

When an adapter fails (connection lost, timeout, error response):

```
1. Adapter marks itself as UNHEALTHY
2. Order Router detects adapter unhealthy on next order
3. Order Router selects next priority adapter for the exchange
4. Order is routed through secondary path
5. Health check background thread attempts reconnection every 5 seconds
6. On reconnect, adapter marks itself as HEALTHY
7. Subsequent orders use primary path again
```

**Failover latency:** < 500ms (timeout before trying secondary adapter)

## Server-Level Failover

If an entire ODIN server fails:

1. MQ consumer group rebalances: orders for affected exchanges routed to other ODIN instances
2. Other ODIN instances process orders through their adapters
3. Orders in-flight on the failed server are recovered from MQ (if not yet acknowledged) or cancelled and re-submitted

## Cross-DC Failover

If Mumbai DC fails:

```
1. Narad detects Mumbai ODIN servers DOWN
2. Operations triggers DC failover
3. Navi Mumbai ODIN (odin01-nm) promoted
4. MQ topic partition leadership transfers to Navi Mumbai
5. Orders flow to odin01-nm
6. odin01-nm adapters connect to exchanges (may require exchange-side failover for lease lines)
```

**Cross-DC recovery time:** < 2 minutes (manual trigger)

## Order Recovery During Failover

| Order State | Recovery Action |
|-------------|----------------|
| NEW (not yet routed) | Re-routed through alternative ODIN instance |
| PENDING (routed, awaiting ack) | Wait for timeout, then cancel and re-submit |
| OPEN (acknowledged) | Order state recovered from DB; no action needed |
| PARTIALLY_FILLED | Order state recovered; execution reports continue on new path |

## Planned Failover Test

```bash
# Manual adapter failover test
odinctl adapter failover --exchange NSE --segment CM

# Verify failover
odinctl adapter status | grep NSE
# Expected: nse_neat_primary: STANDBY, nse_diet_backup: ACTIVE
```

## Failover Testing Schedule

| Test | Frequency | Procedure |
|------|-----------|-----------|
| Adapter failover | Weekly (Saturday) | Manual failover, verify order flow |
| Server failover | Monthly | Graceful stop of one server |
| DC failover | Quarterly | Full Mumbai → Navi Mumbai drill |
| Exchange simulator failover | Per release | Mock exchange failure in UAT |
