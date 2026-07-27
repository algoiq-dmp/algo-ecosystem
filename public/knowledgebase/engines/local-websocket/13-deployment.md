# 13 — Deployment

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Deployment Environments

| Environment | Servers | Purpose |
|-------------|---------|---------|
| Production | ws01-mum, ws02-mum, ws03-mum | Live dashboard streaming |
| Production DR | ws01-nm, ws02-nm | DR dashboard streaming |
| UAT | ws-uat-01 | User acceptance testing |
| Staging | ws-stg-01 | Pre-prod validation |
| Dev | ws-dev-01 | Development |

## Deployment Strategy

### Rolling Deployment

1. Take one instance out of the load balancer rotation (HAProxy: `set server ws_backend/ws03 state maint`)
2. Wait for existing connections to drain (max 60 seconds for idle timeout)
3. Deploy new version to the instance
4. Verify health on the instance
5. Return instance to rotation: `set server ws_backend/ws03 state ready`
6. Repeat for remaining instances

### Canary Deployment (Major Versions)

1. Deploy new version to a canary instance not in production rotation
2. Route a small percentage of traffic (5-10%) to canary via HAProxy weight
3. Monitor for 4 hours: error rates, latency, connection stability
4. If successful, promote to full rollout

## Production Deployment Checklist

### Pre-Deployment
- [ ] All tests pass in UAT and staging
- [ ] Client SDKs tested against new server version
- [ ] Load tested at 10,000 connections for 1 hour
- [ ] Change request approved
- [ ] Rollback plan documented

### During Deployment
- [ ] Deploy during low-traffic window (Saturday 16:00-18:00 IST)
- [ ] Monitor active connections in Grafana during rollout
- [ ] Each instance passes health check before proceeding to next

### Post-Deployment
- [ ] All instances on new version
- [ ] Active connections restored to pre-deployment levels
- [ ] Message throughput matches baseline
- [ ] No client-reported disconnections
- [ ] No errors in Narad for WebSocket tier

## Containerized Deployment (Alternative)

For development and non-production environments, a Docker-based deployment is available:

```dockerfile
FROM node:22-alpine
RUN npm install -g @lakshmi/ws-server@2.5.0
COPY config.yaml /etc/lakshmi/ws-server/config.yaml
EXPOSE 8080 9193
CMD ["lakshmi-ws-server", "--config", "/etc/lakshmi/ws-server/config.yaml"]
```

```bash
docker run -d \
  --name ws-server \
  -p 8080:8080 \
  -p 9193:9193 \
  -v /etc/lakshmi/ws-server:/etc/lakshmi/ws-server:ro \
  registry.internal/lakshmi/ws-server:2.5.0
```

## Monitoring After Deployment

Key metrics to watch for 60 minutes post-deployment:
- `ws_connections_active`: should match pre-deployment count
- `ws_messages_sent_total` rate: should match pre-deployment rate
- `ws_connection_errors_total`: should be near zero
- `ws_mq_latency_ms`: no more than 10% increase
- Memory usage per instance: no significant increase (> 20%)
