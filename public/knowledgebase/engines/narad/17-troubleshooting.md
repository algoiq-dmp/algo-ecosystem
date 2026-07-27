# 17 â€” Troubleshooting Guide

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Diagnostic Commands

```bash
# Narad health
curl http://localhost:3003/api/v1/health
curl http://localhost:3003/api/v1/health/ecosystem

# Service registry
curl http://localhost:3003/api/v1/registry/services
curl http://localhost:3003/api/v1/registry/services/ganesh

# Agent status
curl http://localhost:3003/api/v1/registry/servers

# Metrics
curl http://localhost:9091/metrics | grep narad
```

## Common Issues

### Agent Disconnected

**Symptoms**: `narad_agents_disconnected` > 0, service shows OFFLINE.

**Resolution**:
```bash
# On target server
sudo systemctl status narad-agent
sudo journalctl -u narad-agent -f

# Check agent connectivity
narad-agent ping

# Restart agent
sudo systemctl restart narad-agent
```

### Service Not in Registry

**Symptoms**: Service not discoverable, `GET /registry/services/:name` returns 404.

**Resolution**:
```bash
# Check if service registered properly
curl http://localhost:3003/api/v1/registry/services

# Manually register (if needed)
curl -X POST http://localhost:3003/api/v1/registry/services -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"name":"ganesh","type":"engine",...}'
```

### Configuration Not Updating

**Symptoms**: Service has stale config, config version not incrementing.

**Resolution**:
```bash
# Check latest config version
curl http://localhost:3003/api/v1/config/ganesh?env=production

# Check if service is subscribed to changes
redis-cli PUBSUB CHANNELS | grep config:change

# Force config reload on target service
narad-cli config reload --service ganesh --env production
```

### Deployment Stuck

**Symptoms**: Deployment status PENDING or IN_PROGRESS for > 10 minutes.

**Resolution**:
```bash
# Check deployment status
curl http://localhost:3003/api/v1/deploy/<deploymentId>

# Cancel stuck deployment
narad-cli deploy cancel --id <deploymentId>

# Manually verify health of target instances
curl http://<instance>:3002/api/v1/health
```

### Dashboard Not Updating

**Symptoms**: Dashboard shows stale data, WebSocket not connecting.

**Resolution**:
```bash
# Check WebSocket connectivity
wscat -c wss://narad.algoiq.io:3004

# Restart Narad CP
pm2 restart narad-cp
```

## Support Escalation

| Severity | Channel | Response Time |
|---|---|---|
| Critical (Narad down) | PagerDuty | 5 minutes |
| High (Agent down) | Slack #narad-alerts | 15 minutes |
| Medium (Dashboard issue) | Jira ticket | 4 hours |
| Low (Question) | Slack #narad-support | 24 hours |
