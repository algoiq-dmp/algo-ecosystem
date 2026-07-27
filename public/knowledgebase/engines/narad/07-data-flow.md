# 07 â€” Data Flow

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Service Registration Flow

```
[Service Startup]
        |
        v
  POST /api/v1/registry/services  {name, type, version, host, port, healthUrl}
        |
        v
  [Narad Control Plane]
        |
        +---> Validate (Suraksha JWT)
        +---> Write to PostgreSQL `services` table
        +---> Update Redis: service:{name} hash
        +---> Add to Redis: services:all set
        |
        v
  [Service] --periodic heartbeat (every 15s)--> PUT /heartbeat
        |
        v
  [Narad] -- Update Redis TTL + PostgreSQL last_heartbeat
        |
        (If heartbeat missed for 30s) --> Mark UNHEALTHY --> Alert
        (If heartbeat missed for 5min) --> Mark OFFLINE --> Critical Alert
```

## Health Monitoring Flow

```
[Narad Agent on Server]
        |
        | (every 10s via gRPC stream)
        v
  Telemetry: { cpu, memory, disk, network, process_list, service_status }
        |
        v
  [Narad Health Monitor]
        |
        +---> Write to Redis: server:{host}:health (TTL 60s)
        +---> Write to Redis: service:{name}:health
        +---> Evaluate alerting rules
        +---> Push to Dashboard via WebSocket
        +---> Archive to PostgreSQL (every 60s)
```

## Configuration Flow

```
[Operator] --> POST /api/v1/config/gansh?env=production { config: {...}, reason: "Update TTL" }
        |
        v
  [Narad Config Manager]
        |
        +---> Validate config against service-specific schema
        +---> Increment version (v12 -> v13)
        +---> Write to PostgreSQL: configurations table
        +---> Update Redis: config:{service}:{env}:latest
        +---> Publish Redis Pub/Sub: config:change:{service}:{env}
        |
        v
  [Ganesh Service] (subscribed to config:change:ganesh:production)
        |
        +---> Receives new config via Pub/Sub
        +---> Hot-reloads config without restart
```

## Deployment Flow

```
[Operator] --> POST /api/v1/deploy/gansh { version: "3.2.1", strategy: "rolling" }
        |
        v
  [Narad Deployment Manager]
        |
        +---> Validate deployment request (Suraksha auth, permissions)
        +---> Create deployment record in PostgreSQL
        |
        +-- Cordon instance 1 -->
        |     +---> Health check: draining connections
        |     +---> Deploy new version
        |     +---> Health check: new version healthy?
        |     +---> YES: Uncordon instance, proceed to instance 2
        |     +---> NO: Rollback instance, mark deployment FAILED
        |
        +-- Repeat for all instances
        |
        v
  [Done] --> Update deployment record: SUCCESS --> Update Version Manager
```

## Remote Command Flow

```
[Operator] --> narad-cli exec --server ganesh-prod-1 --command "df -h"
        |
        v
  [Narad Remote Command Executor]
        |
        +---> Check: Is server in production? -> YES -> Create approval request
        |                                                     |
        |                                                     v
        |                                         [Approver] -> Approves
        |
        +---> Send gRPC ExecuteCommand to target Agent
        |
        v
  [Narad Agent on ganesh-prod-1]
        |
        +---> Execute in sandboxed shell
        +---> Stream stdout/stderr back via gRPC (real-time)
        +---> Return exit code
        |
        v
  [Narad] --> Save to command_history table --> Return to operator
```

## Log Collection Flow

```
[Narad Agent] --gRPC stream--> [Narad Log Collector]
                                      |
                                      +---> Buffer (in-memory + disk fallback)
                                      +---> Normalize (add server_id, service_name)
                                      +---> Batch ship to ELK (every 1s or 500 logs)
                                      |
                                      v
                                 [ELK Stack]
                                 (Elasticsearch + Logstash + Kibana)
```

## Error Handling

| Failure Point | Handling Strategy |
|---|---|
| Agent -> Control Plane gRPC disconnection | Agent buffers telemetry locally, reconnects with exponential backoff, replays buffered data |
| PostgreSQL unavailable | Fallback to Redis-only mode; queued writes retried |
| Redis unavailable | Direct PostgreSQL reads; health cache stale but available |
| Agent crash | Server marked UNKNOWN after 30s; alert generated |
| ELK unavailable | Log Collector buffers to disk (up to 50GB); ships on reconnect |
