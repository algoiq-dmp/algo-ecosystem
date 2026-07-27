# 05 â€” Low-Level Design

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Service Registry Design

The Service Registry is a distributed, eventually-consistent registry using PostgreSQL as the source of truth and Redis as a read-optimized cache.

### Registration Flow

1. Service starts up and calls `POST /api/v1/registry/services` with its metadata.
2. Narad validates the request (Suraksha auth, schema check).
3. Service record written to PostgreSQL `services` table.
4. Redis cache updated: `service:{name}` hash with endpoint, version, health URL.
5. Heartbeat TTL set in Redis: `service:{name}:heartbeat` with 30s expiry.
6. Service sends heartbeat every 15 seconds via `PUT /api/v1/registry/services/:name/heartbeat`.

### Deregistration

- Graceful: Service calls `DELETE /api/v1/registry/services/:name` on shutdown.
- Ungraceful: Heartbeat TTL expires after 30 seconds, service marked `UNHEALTHY`, after 5 minutes marked `OFFLINE`.

### Redis Schema (Service Registry)

| Key | Type | TTL | Purpose |
|---|---|---|---|
| `narad:service:{name}` | Hash | None | Service metadata |
| `narad:service:{name}:heartbeat` | String | 30s | Heartbeat timestamp |
| `narad:service:{name}:health` | Hash | None | Latest health status |
| `narad:services:all` | Set | None | All registered service names |
| `narad:services:unhealthy` | Set | None | Currently unhealthy services |

### PostgreSQL Schema (Services)

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

CREATE INDEX idx_services_status ON services (status);
CREATE INDEX idx_services_type ON services (type);
```

## Configuration Manager Design

Configurations are stored as versioned JSON documents in PostgreSQL with Redis caching for fast reads.

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

### Config Fetch Flow

1. Service requests `GET /api/v1/config/:serviceName?env=production`.
2. Narad checks Redis: `config:{serviceName}:production:latest`.
3. Cache hit: return immediately.
4. Cache miss: query PostgreSQL for latest version, populate Redis, return.

### Config Change Notification

When a config changes, Narad publishes to Redis Pub/Sub channel `config:change:{serviceName}:{env}`. Services subscribed to this channel receive the new config within 100ms.

## Remote Command Execution

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

### Command Execution Flow

1. Operator submits command via CLI or API.
2. For production servers, approval request created; approver must confirm.
3. Narad sends gRPC `ExecuteCommand` to target server's Agent.
4. Agent executes command in a sandboxed shell.
5. stdout/stderr streams back to Narad in real-time via gRPC streaming.
6. Command history record updated with exit code and output.

## API Routes

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/registry/services` | Register a new service |
| GET | `/api/v1/registry/services` | List all services |
| GET | `/api/v1/registry/services/:name` | Get service details |
| DELETE | `/api/v1/registry/services/:name` | Deregister a service |
| PUT | `/api/v1/registry/services/:name/heartbeat` | Send heartbeat |
| GET | `/api/v1/registry/servers` | List all servers |
| POST | `/api/v1/config/:serviceName` | Create/update config |
| GET | `/api/v1/config/:serviceName` | Get latest config |
| GET | `/api/v1/config/:serviceName/history` | Get config history |
| POST | `/api/v1/deploy/:serviceName` | Trigger deployment |
| POST | `/api/v1/command/execute` | Execute remote command |
| GET | `/api/v1/command/:id` | Get command status |
| GET | `/api/v1/health` | Narad health check |
| GET | `/api/v1/health/ecosystem` | All services health summary |
