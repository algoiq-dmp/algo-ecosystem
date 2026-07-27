# 18 — Failover

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Failover Architecture

The Feed Server implements multiple layers of failover to ensure continuous market data availability.

### Layer 1: Lease Line Failover (Intra-Server)

Each feed has a primary and secondary lease line. Both are ingested simultaneously by separate pipeline instances on the same server. The primary publishes to MQ; the secondary tracks sequence numbers in standby mode.

```
Primary Line ──► feedd-primary ──► MQ (active publish)
Secondary Line ──► feedd-standby ──► (sequence tracking only, no publish)
```

**Failover trigger:** Primary misses heartbeat for 250ms.

**Failover action:**
1. Standby signals primary to demote (via local Unix socket)
2. Standby begins publishing to MQ using its sequence cursor
3. Primary begins TCP replay gap recovery from secondary line
4. Once primary catches up, roles may swap back or remain (configurable)

**Impact:** Zero data loss; < 1 ms of duplicate messages (downstream consumers deduplicate by global_seq).

### Layer 2: Server Failover (Intra-DC)

If an entire server fails, another server in the same DC takes over the affected exchange feeds.

```
feed01-mum (NSE-CM active)
     │
     │ FAILURE
     ▼
feed02-mum (NSE-CM takes over)
```

**Prerequisites:**
- Both servers have physical connections to the same exchange circuits (via patch panel)
- Both maintain synchronized symbol master caches
- Narad monitors heartbeat and triggers failover

### Layer 3: Cross-DC Failover

If an entire data center fails, the secondary DC takes over:

```
Mumbai DC ──► FAILURE ──► Navi Mumbai DC becomes primary
```

**Cross-DC state sync:**
- Ring buffer cursor positions synchronized every 100ms over dark fiber
- Last committed sequence number replicated
- MQ topic partition leadership transferred via MQ cluster consensus

### Failover Decision Matrix

| Scenario | Detection Time | Failover Time | Data Impact |
|----------|---------------|---------------|-------------|
| Primary line outage | 250 ms | < 1 ms | Zero loss |
| Server NIC failure | 1 s | < 100 ms | < 100 ms gap |
| Server OS crash | 5 s | < 500 ms | < 5 s gap (recovered via replay) |
| Full DC outage | 10 s | < 2 s | < 10 s gap (recovered via replay) |
| Exchange gateway outage | Exchange-dependent | N/A | Gap until exchange restores |

## Testing Failover

### Scheduled Tests
- **Weekly:** Lease line failover during pre-market window (09:00 IST)
- **Monthly:** Server failover test on Saturday
- **Quarterly:** Full DC failover (Mumbai → Navi Mumbai) during exchange holiday

### Test Validation Criteria
- [ ] No sequence gaps remain after recovery
- [ ] Gap recovery completes within SLA (30 seconds)
- [ ] All downstream consumers reconnect and resume within 10 seconds
- [ ] Audit logs show no missing batches
- [ ] Narad events correctly document the failover timeline

## Automated Failover Configuration

```yaml
failover:
  lease_line:
    heartbeat_interval_ms: 100
    heartbeat_timeout_ms: 250
    auto_failback: true
    failback_delay_sec: 300
  server:
    enabled: true
    narad_coordination: true
    promotion_timeout_sec: 10
  dc:
    enabled: true
    sync_interval_ms: 100
    mq_partition_preference: "mumbai"  # preferred DC for partition leadership
```
