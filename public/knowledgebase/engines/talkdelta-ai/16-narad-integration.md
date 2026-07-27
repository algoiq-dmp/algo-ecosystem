# TalkDelta AI — Narad Integration

**Version:** 1.4.0 | **Owner:** AI/ML | **Last Updated:** 2026-07-25

## Narad Connector Integration

TalkDelta AI connects to **Narad** (Connector Hub) on port `3100` for service registration, health monitoring, configuration management, and inter-service communication.

## Connection Configuration

```yaml
narad:
  url: "http://192.168.190.104:3100"
  service_id: "talkdelta-ai"
  service_type: "engine"
  heartbeat_interval: 5s
  register_on_startup: true
  deregister_on_shutdown: true
```

## Service Registration

On startup, TalkDelta AI registers with Narad:

```
POST /api/v1/registry/register
{
  "service_id": "talkdelta-ai",
  "version": "1.4.0",
  "host": "192.168.190.104",
  "ports": [3010],
  "health_endpoint": "/api/v1/health",
  "metadata": {
    "layer": "Layer 2 - Opportunity Generation",
    "dependencies": "TalkDelta, MQ, Ganesh, TalkOptions, Delta XI, VYUH, SpreadWatch, Surya, Lakshmi",
    "owner": "AI/ML"
  }
}
```

## Health Heartbeat

Every 5 seconds, TalkDelta AI sends heartbeat:

```
POST /api/v1/heartbeat/talkdelta-ai
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

TalkDelta AI pulls configuration from Narad on startup and on config change events:

```
GET /api/v1/config/talkdelta-ai
Response: YAML config with all runtime parameters
```

Config changes are applied with hot-reload (no restart required for non-critical parameters).

## Deployment Management

Narad manages TalkDelta AI deployments via:
- `POST /api/v1/deploy/start` — Initiate rolling deployment
- `POST /api/v1/deploy/status` — Check deployment progress
- `POST /api/v1/deploy/rollback` — Trigger rollback

## Log Aggregation

All TalkDelta AI logs are streamed to Narad log aggregator:
- Structured JSON logging format
- Log level: `info` in production, `debug` in development
- Retention: 30 days in Elasticsearch
- Accessible via Narad dashboard at `/logs/talkdelta-ai`

## Failure Detection

Narad marks TalkDelta AI as `unhealthy` if:
- 3 consecutive heartbeat failures (15 seconds)
- Health endpoint returns non-200 status
- Service fails to respond to ping

On unhealthy status, Narad triggers:
- PagerDuty alert to AI/ML team
- Automatic restart via Narad deployment manager
- Consumer notification to all dependent services
