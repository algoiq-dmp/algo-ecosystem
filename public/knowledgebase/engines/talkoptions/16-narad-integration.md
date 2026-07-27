# TalkOptions Platform — Narad Integration

**Version:** 4.7.2 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## Narad Connector Integration

TalkOptions Platform connects to **Narad** (Connector Hub) on port `3100` for service registration, health monitoring, configuration management, and inter-service communication.

## Connection Configuration

```yaml
narad:
  url: "http://192.168.190.118:3100"
  service_id: "talkoptions"
  service_type: "engine"
  heartbeat_interval: 5s
  register_on_startup: true
  deregister_on_shutdown: true
```

## Service Registration

On startup, TalkOptions Platform registers with Narad:

```
POST /api/v1/registry/register
{
  "service_id": "talkoptions",
  "version": "4.7.2",
  "host": "192.168.190.118",
  "ports": [8081, 8444],
  "health_endpoint": "/api/v1/health",
  "metadata": {
    "layer": "Layer 1 - Core Data",
    "dependencies": "Ganesh, MQ, Surya, Lakshmi, Theta Yantra",
    "owner": "Analytics"
  }
}
```

## Health Heartbeat

Every 5 seconds, TalkOptions Platform sends heartbeat:

```
POST /api/v1/heartbeat/talkoptions
{
  "status": "healthy",
  "uptime_seconds": 86400,
  "metrics": {
    "cpu_percent": 45.2,
    "memory_mb": 2048,
    "active_connections": 120,
    "messages_processed": 500000
  }
}
```

## Configuration Sync

TalkOptions Platform pulls configuration from Narad on startup and on config change events:

```
GET /api/v1/config/talkoptions
Response: YAML config with all runtime parameters
```

Config changes are applied with hot-reload (no restart required for non-critical parameters).

## Deployment Management

Narad manages TalkOptions Platform deployments via:
- `POST /api/v1/deploy/start` — Initiate rolling deployment
- `POST /api/v1/deploy/status` — Check deployment progress
- `POST /api/v1/deploy/rollback` — Trigger rollback

## Log Aggregation

All TalkOptions Platform logs are streamed to Narad log aggregator:
- Structured JSON logging format
- Log level: `info` in production, `debug` in development
- Retention: 30 days in Elasticsearch
- Accessible via Narad dashboard at `/logs/talkoptions`

## Failure Detection

Narad marks TalkOptions Platform as `unhealthy` if:
- 3 consecutive heartbeat failures (15 seconds)
- Health endpoint returns non-200 status
- Service fails to respond to ping

On unhealthy status, Narad triggers:
- PagerDuty alert to Analytics team
- Automatic restart via Narad deployment manager
- Consumer notification to all dependent services
