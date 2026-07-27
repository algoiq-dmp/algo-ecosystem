# DXCC — Failover & Disaster Recovery

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## WebSocket Reconnection

When the WebSocket connection to Narad WS Gateway is lost, DXCC follows a tiered recovery strategy:

### Automatic Reconnection (0-30 seconds)

| Attempt | Delay | Strategy |
|---------|-------|----------|
| 1 | Immediate | Fast reconnect (likely transient) |
| 2 | 1 second | Short delay |
| 3 | 2 seconds | Moderate delay |
| 4-10 | 3 seconds | Steady retry with jitter (+/- 500ms) |

During this phase, the UI shows a "Reconnecting..." status bar. Widgets display the last known data with a "Stale" indicator.

### REST Fallback Mode (after 30 seconds)

If all 10 reconnection attempts fail:

1. WebSocket connection attempts continue in the background at 30-second intervals
2. Active widgets switch to REST API polling at 5-second intervals
3. A persistent yellow banner appears: "Real-time data unavailable. Showing cached data. Retrying connection..."
4. Widget data is served from Redis cache (if available) or fetched fresh from REST APIs
5. When WebSocket reconnects, polling stops and real-time flow resumes

### Manual Recovery

If automatic recovery fails, the user can:

1. Click "Retry Connection" in the status bar
2. This forces an immediate reconnect attempt
3. If persistent, the user may need to refresh the page (full reconnect with fresh JWT)

---

## REST API Fallback (5-Second Interval)

```typescript
class DataSourceManager {
  private wsMode = true;
  private pollInterval: number | null = null;

  switchToRestPolling() {
    this.wsMode = false;
    this.pollInterval = setInterval(() => {
      this.refreshAllActiveQueries();
    }, 5000);
    this.notifyUI('fallback');
  }

  switchToWebSocket() {
    this.wsMode = true;
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.notifyUI('live');
  }

  getData<T>(queryKey: string): T {
    if (this.wsMode) {
      return this.wsStore.get(queryKey);
    }
    return this.restCache.get(queryKey);
  }
}
```

### Data Freshness Guarantees

| Mode | Max Staleness | Indicator |
|------|--------------|-----------|
| WebSocket (Live) | <1 second | Green dot |
| WebSocket (Reconnecting) | <30 seconds | Yellow dot + countdown |
| REST Fallback | <5 seconds | Orange dot + "REST" label |
| REST Fallback (API Down) | Cache duration | Red dot + "Cached" label |

---

## Session Persistence via Redis

User sessions are stored in Redis, enabling session survival across backend restarts:

```
[User Session]
      |
      v
[Redis: session:{sessionId}]
      |
      +-- userId
      +-- username
      +-- role
      +-- permissions (JSON)
      +-- jwt_token (encrypted)
      +-- created_at
      +-- last_activity
      +-- expires_at
```

### Session Failover Behavior

When a backend instance restarts:
1. User's WebSocket connects to the new backend instance
2. Backend looks up session in Redis by cookie session ID
3. Session restored with all roles and permissions
4. User may see a brief reconnection but no login required
5. Widget subscriptions are re-established automatically

---

## Database Failover

### PostgreSQL High Availability

DXCC uses Patroni for PostgreSQL HA:

```
[Patroni Cluster]
      |
+-----+------+
|            |
v            v
[Primary]  [Standby]
10.10.20.10  10.10.20.11
      |
      v
[Synchronous Replication]
      |
      v
[etcd Cluster (leader election)]
```

### Failover Procedure

1. Primary PostgreSQL becomes unavailable
2. Patroni detects failure via etcd (10-second timeout)
3. Standby is promoted to primary
4. etcd updates the leader key
5. DXCC backend receives connection error on primary
6. Connection pool reconnects; pgx resolves new primary via etcd
7. Applications resume with minimal disruption

### Connection String with Failover

```
postgresql://dxcc_app@localhost:5432/dxcc?target_session_attrs=read-write
```

The `target_session_attrs=read-write` ensures connections only go to the writable primary.

---

## Redis Failover

### Redis Sentinel Configuration

```
[Redis Sentinel Cluster]
      |
+-----+------+
|            |
v            v
[Redis Master]  [Redis Replica]
10.10.20.20     10.10.20.21
      |
      v
[Async Replication]
```

### Failover Behavior

1. Redis Master becomes unavailable
2. Sentinel detects failure (5-second quorum)
3. Replica is promoted to master
4. DXCC Go Redis client auto-discovers new master via Sentinel
5. Session data may have small window of loss (async replication)

---

## Regional Disaster Recovery

DXCC supports active-passive disaster recovery across two regions:

```
[Mumbai Region (Active)]          [Singapore Region (Passive)]
      |                                    |
[DXCC Backend x2]                   [DXCC Backend x1 (standby)]
[PostgreSQL Primary]                 [PostgreSQL Standby (async)]
[Redis Master]                       [Redis Replica]
[Narad WS Gateway]                   [Narad WS Gateway (standby)]
      |                                    |
      +-----------[Cross-Region]-----------+
                  [Async Replication]
                  [DNS Failover Ready]
```

### Recovery Time Objective (RTO): 5 Minutes

1. Detect primary region failure (1 minute — health check timeout)
2. Promote standby PostgreSQL to primary (1 minute)
3. Promote standby Redis to master (30 seconds)
4. Start DXCC backend in Singapore (30 seconds)
5. Update DNS to point to Singapore (60 seconds — TTL 60s)
6. Verify health checks pass (1 minute)
7. Total: ~5 minutes

### Recovery Point Objective (RPO): <1 Minute

- PostgreSQL: async streaming replication with ~1 second lag
- Redis: async replication; last few seconds of session data may be lost
- Stateless frontend: no data loss (served as static files)

---

## Graceful Degradation

When specific dependencies are unavailable, DXCC degrades gracefully rather than failing entirely:

| Dependency Down | Impact | Degradation |
|----------------|--------|-------------|
| Narad Event Bus | No real-time data | REST polling mode; all widgets show cached data |
| PostgreSQL | No config changes, no user management | Read operations served from Redis cache; write operations queued |
| Redis | Slower session lookups; no widget cache | Sessions validated from JWT directly; widgets fetch fresh data |
| Kraken API Gateway | No REST API access | Real-time Narad data continues; config changes unavailable |
| Chitragupta (Audit) | Audit search unavailable | Audit events buffered locally; catch-up when restored |
| AlertManager | No alert inbox updates | Historical alerts still visible; new alerts missed until restore |

---

## Failover Testing Schedule

| Test | Frequency | Scope |
|------|-----------|-------|
| WebSocket reconnect | Weekly | Automated chaos test |
| PostgreSQL failover | Monthly | Staging environment |
| Redis failover | Monthly | Staging environment |
| Regional DR drill | Quarterly | Full DR simulation |
| Backup restore test | Monthly | Restore latest backup to staging |

---

> **Next:** See [19-performance.md](19-performance.md) for performance targets and optimization strategies.
