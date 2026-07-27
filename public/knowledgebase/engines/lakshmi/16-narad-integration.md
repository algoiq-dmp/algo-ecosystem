# 16. Narad Integration

**Version:** 2.1.0
**Owner:** Platform Engineering
**Last Updated:** 2026-07-24

---

## Overview

Narad is the Algo-IQ ecosystem service mesh and discovery layer. Lakshmi registers with Narad to announce its presence, enable dynamic routing, and participate in the mesh health heartbeat. This integration ensures that upstream publishers and downstream subscribers can locate Lakshmi without hard-coded endpoints.

---

## Service Registration

### Registration Lifecycle

```
[Lakshmi Start] → [Discover Narad via DNS SRV] → [Register with Narad] → [Heartbeat Loop] → [Deregister on Shutdown]
```

### Registration Payload

On startup, Lakshmi sends a registration request to Narad:

```json
POST /api/v1/register
{
  "service": "lakshmi",
  "instance_id": "lakshmi-node-3",
  "version": "2.1.0",
  "host": "10.20.30.41",
  "port": 3001,
  "metadata": {
    "zone": "primary",
    "region": "mumbai",
    "capacity": "production",
    "max_connections": 5000,
    "protocols": ["http", "ws", "amqps"],
    "topics": ["NFO_EQ", "NFO_FUT", "NFO_OPT", "BFO_EQ", "BFO_FUT"],
    "health_endpoint": "/api/v1/health",
    "metrics_endpoint": "/api/v1/metrics"
  },
  "checks": [
    {
      "type": "http",
      "interval": "10s",
      "timeout": "2s",
      "http": "http://10.20.30.41:3001/api/v1/health"
    }
  ]
}
```

### Deregistration

On graceful shutdown (SIGTERM/SIGINT):

```json
PUT /api/v1/deregister/lakshmi-node-3
```

If Lakshmi crashes without deregistration, Narad's health check will mark the instance as `critical` after 30 seconds and remove it from the service pool after 60 seconds.

---

## Service Discovery

### Upstream Discovery

Lakshmi queries Narad to discover upstream data sources:

```json
GET /api/v1/discover?service=ganesh
GET /api/v1/discover?service=surya
GET /api/v1/discover?tag=exchange-feed
```

**Response:**
```json
{
  "service": "ganesh",
  "instances": [
    {
      "id": "ganesh-feed-1",
      "host": "10.20.30.10",
      "port": 4000,
      "healthy": true,
      "zone": "primary",
      "weight": 100
    }
  ]
}
```

### Downstream Registration

Lakshmi itself is discoverable by downstream consumers:

```
GET /api/v1/discover?service=lakshmi
GET /api/v1/discover?tag=market-data
GET /api/v1/discover?service=lakshmi&zone=primary
```

---

## Routing

### Dynamic Topic Routing via Narad

Narad maintains a topic registry that maps topics to Lakshmi instances:

```yaml
narad.topics:
  NFO_EQ:
    primary: lakshmi-node-1
    secondary: lakshmi-node-2
    subscribers: [strategy-factory, analytics, web-terminal]
  NFO_FUT:
    primary: lakshmi-node-1
    secondary: lakshmi-node-3
    subscribers: [strategy-factory, risk-engine]
```

**Routing Algorithm:**
1. Subscriber queries Narad: `GET /api/v1/route/NFO_EQ`
2. Narad returns primary Lakshmi host + fallback hosts
3. Subscriber connects to primary; on failure, connects to fallback

### Traffic Weighting

Narad supports traffic splitting for canary deployments:

```yaml
lakshmi:
  instances:
    - id: lakshmi-stable-1
      weight: 90
    - id: lakshmi-canary-1
      weight: 10
```

---

## Health Heartbeat

### Heartbeat Protocol

Lakshmi sends a heartbeat to Narad every 10 seconds:

```json
PUT /api/v1/heartbeat/lakshmi-node-3
{
  "status": "healthy",
  "metrics": {
    "cpu_percent": 42.3,
    "memory_mb": 3200,
    "messages_per_sec": 287000,
    "latency_p99_ms": 4.2,
    "active_ws_connections": 1234,
    "queue_depth_max": 342
  },
  "timestamp": "2026-07-24T10:30:00Z"
}
```

### Health States

| Narad State | Condition | Consequence |
|---|---|---|
| `healthy` | Heartbeat received within 10s, all checks pass | In service pool |
| `degraded` | Heartbeat received but partial check failure | Reduced weight (50%) |
| `critical` | No heartbeat for 30s | Removed from pool; alert triggered |
| `draining` | Graceful shutdown initiated | No new connections; existing connections maintained |

---

## Auto-Reconnect

### Connection Manager

Lakshmi maintains a persistent connection to Narad with automatic reconnection:

```
+-------------------+       +-------------------+
|     Lakshmi       |       |      Narad        |
+-------------------+       +-------------------+
        |                            |
        |----- Register ------------>|
        |<---- 201 Created ----------|
        |                            |
        |===== Heartbeat (10s) =====>|
        |                            |
        |--- Connection Lost --------|
        |                            |
        |-- Reconnect (backoff) ---->|
        |----- Register ------------>|
        |===== Heartbeat (10s) =====>|
```

**Reconnection Strategy:**
1. Detect connection loss (TCP close or heartbeat timeout)
2. Exponential backoff: 1s → 2s → 4s → 8s → 16s → 30s (max)
3. Jitter: ±25% random variation to avoid thundering herd
4. Max retry duration: 5 minutes before escalating to alert
5. On reconnect: re-register, re-sync configuration, rejoin topic routes

### Grace Period

During Narad disconnection, Lakshmi continues operating with its last-known configuration and peer list. It will not route to new instances or accept new route assignments until reconnected.

---

## Monitoring Integration

### Metrics Sent to Narad

Lakshmi includes operational metrics in every heartbeat. Narad aggregates these for cluster-wide visibility:

- Aggregate throughput across all Lakshmi nodes
- Cluster latency heatmap
- Node CPU/memory utilisation
- Websocket connection distribution
- Topic-to-node mapping health

### Narad Dashboard

The Narad service mesh dashboard provides:
- Lakshmi cluster health overview
- Node-level drill-downs
- Connection topology graph
- Topic routing table (live)

---

## Configuration Sync

### Distributed Configuration

Narad acts as a configuration distribution hub. Lakshmi subscribes to configuration change events:

```json
Narad Event: "config.changed"
{
  "service": "lakshmi",
  "key": "topics.nfo_eq.rate_limit",
  "old_value": "100000",
  "new_value": "150000",
  "applied_at": "2026-07-24T10:35:00Z"
}
```

**Configurable Items via Narad:**
- Topic rate limits
- Queue TTL values
- Feature flags
- Log level (dynamic)
- Alert thresholds

Lakshmi applies configuration changes within 5 seconds of receiving the Narad event, without requiring a restart.

---

## Remote Commands

Narad can issue operational commands to Lakshmi instances:

| Command | Purpose | Impact |
|---|---|---|
| `drain` | Gracefully drain connections | Pre-shutdown traffic migration |
| `reload_config` | Force configuration reload | Applies pending config changes immediately |
| `rotate_certs` | Trigger certificate rotation | Zero-downtime TLS cert refresh |
| `flush_cache` | Clear Redis cache for specific topic | Resets stale cache entries |
| `start_profiling` | Enable CPU/memory profiling | Performance debugging (auto-stops after 5 min) |
| `set_log_level` | Change log level dynamically | Debugging without restart |
| `block_topic` | Temporarily block a topic | Emergency topic isolation |
| `unblock_topic` | Unblock a previously blocked topic | Restore topic traffic |

### Command Execution Flow

```
[Narad Operator] → [Narad API: POST /command/lakshmi-node-3/drain]
                     → [Narad forwards to Lakshmi via WebSocket]
                       → [Lakshmi validates command + permissions]
                         → [Lakshmi executes]
                           → [Lakshmi returns result to Narad]
                             → [Narad notifies operator]
```

---

## Connection Configuration

```json
// lakshmi config: narad section
{
  "narad": {
    "enabled": true,
    "hosts": ["narad-1.algo-iq.local:8100", "narad-2.algo-iq.local:8100"],
    "register": true,
    "instance_id": "lakshmi-node-${HOSTNAME}",
    "health_check_interval_sec": 10,
    "heartbeat_interval_sec": 10,
    "reconnect_backoff_base_sec": 1,
    "reconnect_backoff_max_sec": 30,
    "reconnect_max_duration_sec": 300,
    "config_sync": true,
    "remote_commands": true,
    "tls": {
      "enabled": true,
      "ca": "/etc/lakshmi/certs/narad-ca.pem",
      "cert": "/etc/lakshmi/certs/lakshmi-narad.pem",
      "key": "/etc/lakshmi/certs/lakshmi-narad-key.pem"
    }
  }
}
```

---

## Troubleshooting

| Symptom | Possible Cause | Resolution |
|---|---|---|
| Lakshmi not appearing in Narad | Registration failed; Narad unreachable | Check `narad.hosts` config; verify network connectivity to port 8100 |
| Stale instance in Narad | Lakshmi crashed without deregistration | Narad auto-removes after 60s; manually cleanup via Narad API if needed |
| Config changes not applied | `config_sync` disabled; Narad event missed | Enable `config_sync`; trigger `reload_config` command |
| Heartbeat timeout | Network partition; Lakshmi overloaded | Check network; increase `heartbeat_interval_sec` temporarily |
| Remote command not executing | Command disabled; permissions issue | Verify `remote_commands: true`; check JWT scope includes `narad:command` |
