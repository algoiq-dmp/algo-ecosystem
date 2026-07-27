# 10 â€” Database Schema & Storage

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Storage Architecture

Narad uses PostgreSQL for durable, transactional storage and Redis for real-time caching and pub/sub messaging.

---

## PostgreSQL Schema

### services

```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64) UNIQUE NOT NULL,
    type VARCHAR(32) NOT NULL,
    version VARCHAR(16),
    owner VARCHAR(64),
    host VARCHAR(128) NOT NULL,
    port INTEGER NOT NULL,
    health_url VARCHAR(256),
    status VARCHAR(16) DEFAULT 'STARTING',
    metadata JSONB DEFAULT '{}',
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (host, port)
);
```

### servers

```sql
CREATE TABLE servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hostname VARCHAR(128) UNIQUE NOT NULL,
    ip_address INET NOT NULL,
    os VARCHAR(64),
    cpu_cores INTEGER,
    ram_gb INTEGER,
    disk_gb INTEGER,
    datacenter VARCHAR(32),
    roles TEXT[],
    narad_agent_version VARCHAR(16),
    status VARCHAR(16) DEFAULT 'ONLINE',
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ DEFAULT NOW()
);
```

### products

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64) UNIQUE NOT NULL,
    description TEXT,
    owner_team VARCHAR(64),
    repository_url VARCHAR(256),
    current_version VARCHAR(16),
    status VARCHAR(16) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### configurations

```sql
CREATE TABLE configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(64) NOT NULL,
    environment VARCHAR(16) NOT NULL,
    version INTEGER NOT NULL,
    config JSONB NOT NULL,
    changed_by VARCHAR(64),
    change_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (service_name, environment, version)
);
```

### deployments

```sql
CREATE TABLE deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(64) NOT NULL,
    version VARCHAR(16) NOT NULL,
    strategy VARCHAR(16) DEFAULT 'rolling',
    status VARCHAR(16) DEFAULT 'PENDING',
    triggered_by VARCHAR(64),
    rollback BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    details JSONB
);
```

### command_history

```sql
CREATE TABLE command_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    executor VARCHAR(64) NOT NULL,
    target_server VARCHAR(128) NOT NULL,
    target_service VARCHAR(64),
    command TEXT NOT NULL,
    status VARCHAR(16) DEFAULT 'PENDING',
    exit_code INTEGER,
    stdout TEXT,
    stderr TEXT,
    approval_id UUID,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    executed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);
```

### port_registry

```sql
CREATE TABLE port_registry (
    port INTEGER PRIMARY KEY,
    allocated_to VARCHAR(64),
    service_name VARCHAR(64),
    protocol VARCHAR(8) DEFAULT 'TCP',
    allocated_at TIMESTAMPTZ DEFAULT NOW(),
    released_at TIMESTAMPTZ
);
```

### audit_log

```sql
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    actor VARCHAR(64) NOT NULL,
    action VARCHAR(32) NOT NULL,
    resource_type VARCHAR(32),
    resource_id VARCHAR(128),
    details JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Redis Schema

| Key Pattern | Type | TTL | Purpose |
|---|---|---|---|
| `narad:service:{name}` | Hash | None | Service metadata |
| `narad:service:{name}:heartbeat` | String | 30s | Heartbeat timestamp |
| `narad:service:{name}:health` | Hash | 60s | Latest health telemetry |
| `narad:services:all` | Set | None | All registered service names |
| `narad:services:unhealthy` | Set | None | Unhealthy services |
| `narad:config:{service}:{env}:latest` | String | None | Latest config JSON |
| `narad:server:{hostname}:health` | Hash | 60s | Server health telemetry |

## Data Retention

| Data | Retention |
|---|---|
| Service registry | Indefinite (active), 1 year (deregistered) |
| Server inventory | Indefinite |
| Configuration history | Indefinite (all versions) |
| Deployment history | 2 years |
| Command history | 7 years (compliance) |
| Audit log | 7 years (compliance) |
| Health metrics | 30 days (Prometheus), summarized after |
