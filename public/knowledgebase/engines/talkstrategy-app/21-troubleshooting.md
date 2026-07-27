# TalkStrategy App - Troubleshooting

**Version:** 2.5.0 | **Owner:** Frontend | **Last Updated:** 2026-07-25


## Common Issues

### Engine Fails to Start

**Symptoms:** PM2 shows process restarting repeatedly, startup logs show errors.

**Diagnosis:**
1. Check startup logs: 	ail -200 /var/log/algo/engine.log
2. Verify database connectivity: psql -h  -U  -d 
3. Check Suraksha Vault availability: curl https://suraksha.internal/vault/v1/sys/health

**Resolution:**
- Database connection refused: Verify credentials and network connectivity.
- Vault unreachable: Wait for Vault recovery; engine will retry for 5 minutes.
- Port already in use: Kill stale process or change port config.
- Migration failure: Run 
pm run db:migrate:status to identify stuck migration.

### Signal Generation Stops

**Symptoms:** No signals for > 5 minutes during market hours.

**Diagnosis:**
1. Check strategy status: curl /api/v1/status
2. Verify MQ consumer lag: Check RabbitMQ management console.
3. Check for data feed interruption: Verify Surya/Lakshmi connectivity.

**Resolution:**
- Restart individual strategy via API: POST /api/v1/strategies/:id/restart
- Force MQ reconnection: POST /api/v1/mq/reconnect
- Full engine restart: pm2 restart algo-engine

### High API Latency

**Symptoms:** API responses > 500ms, health check timeouts.

**Diagnosis:**
1. Check CPU usage: `top -p $(pgrep -f algo-engine)`
2. Check event loop lag: /api/v1/metrics look for event_loop_lag
3. Check DB slow queries: SELECT * FROM pg_stat_activity WHERE state = 'active'

**Resolution:**
- Event loop blocked: Identify and fix blocking synchronous operations.
- Slow queries: Add missing indexes, analyze query plan with EXPLAIN.
- Memory pressure: Increase PM2 max_memory_restart or add more RAM.
- Connection pool exhausted: Increase pool size or add read replicas.

### Database Connection Issues

**Symptoms:** DB errors in logs, query timeouts.

**Diagnosis:**
```sql
SELECT count(*) FROM pg_stat_activity WHERE datname = 'algo_iq';
SELECT * FROM pg_stat_activity WHERE wait_event IS NOT NULL;
```
**Resolution:**
- Connection pool full: Increase DB_POOL_MAX or reduce idle timeout.
- Lock contention: Identify blocking queries and optimize.
- Replication lag: Check standby lag with pg_last_wal_receive_lsn().

## Log Analysis Commands

`ash
# Search for errors in last hour
grep "ERROR" /var/log/algo/engine.log | tail -100

# Track signal generation rate
grep "signal.generated" /var/log/algo/engine.log | wc -l

# Find slow API requests
grep "duration" /var/log/algo/engine.log | awk ' > 500'
```