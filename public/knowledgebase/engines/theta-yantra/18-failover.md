# Theta Yantra - Failover & Disaster Recovery

**Version:** 3.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25


## Failover Strategy

The engine implements an active-passive failover model with automated detection and recovery mechanisms.

## Failure Scenarios

### Process-Level Failure
| Scenario | Detection | Recovery Action | RTO |
|----------|-----------|-----------------|-----|
| Process crash | PM2 heartbeat | Auto-restart | < 10s |
| Memory leak | PM2 max_memory_restart | Graceful restart | < 15s |
| Event loop blocked | Health check timeout | Force restart | < 20s |
| Unhandled rejection | Process exit event | PM2 auto-restart | < 10s |

### Dependency Failure

| Dependency | Detection | Recovery | Impact |
|------------|-----------|----------|--------|
| PostgreSQL | Connection timeout | Reconnect with backoff | Degraded (read-only cache) |
| TimescaleDB | Query failures | Reconnect with backoff | Signal logging paused |
| RabbitMQ | Heartbeat lost | Reconnect, buffer signals | Signal dispatch paused |
| Suraksha | Token refresh failure | Retry with cached token | Degraded auth |
| Narad | WebSocket disconnect | Buffer events, replay | Monitoring gap |

### Server-Level Failure
Active server failure triggers manual or automated failover to the standby node. Keepalived VIP migration ensures clients connect to the new active node. Database failover uses PostgreSQL streaming replication with automatic promotion.

## Recovery Procedures

### Database Recovery
1. Promote standby to primary (if automatic promotion failed).
2. Verify data consistency with pg_verify_checksums.
3. Update application connection strings (or rely on VIP).
4. Rebuild old primary as new standby.

### MQ Recovery
1. Verify RabbitMQ cluster quorum.
2. Replay dead-lettered messages after issue resolution.
3. Re-publish any in-memory buffered messages.

## Backup Strategy

| Data | Frequency | Retention | Storage |
|------|-----------|-----------|---------|
| PostgreSQL (full) | Daily at 02:00 UTC | 30 days | Offsite S3 |
| PostgreSQL (WAL) | Continuous | 7 days | Standby + S3 |
| TimescaleDB | Weekly full, daily incremental | 90 days | Offsite S3 |
| Config files | Daily | 90 days | Git + S3 |
| Logs | Hourly | 30 days | ELK archive |

## Disaster Recovery RTO/RPO

| Metric | Target | Notes |
|--------|--------|-------|
| RTO (Recovery Time Objective) | < 30 minutes | For full server recovery |
| RPO (Recovery Point Objective) | < 5 minutes | Data loss tolerance |
| Maximum tolerable downtime | 2 hours | During market hours |

