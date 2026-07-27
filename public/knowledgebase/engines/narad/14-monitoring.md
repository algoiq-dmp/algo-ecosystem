# 14 â€” Health & Monitoring

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Self-Monitoring

Narad monitors itself. The Control Plane runs internal health checks and reports them to its own health monitor. If a CP node becomes unhealthy, other nodes detect it via peer health checks.

## Health Endpoints

### GET /api/v1/health

```json
{
  "status": "healthy",
  "version": "3.0.0",
  "uptime": 8765432,
  "connectedAgents": 42,
  "servicesInRegistry": 25,
  "nodeId": "narad-cp-1"
}
```

### GET /api/v1/health/ecosystem

Returns health status of every registered service aggregated from all Agents.

## Prometheus Metrics

| Metric | Type | Description |
|---|---|---|
| `narad_registry_services_total` | Gauge | Total registered services |
| `narad_registry_services_unhealthy` | Gauge | Currently unhealthy services |
| `narad_agents_connected` | Gauge | Connected agents count |
| `narad_agents_disconnected` | Gauge | Disconnected agents count |
| `narad_heartbeat_latency_ms` | Histogram | Agent heartbeat round-trip |
| `narad_config_fetch_latency_ms` | Histogram | Config API response |
| `narad_deployment_duration_ms` | Histogram | Deployment completion time |
| `narad_command_execution_latency_ms` | Histogram | Remote command RTT |
| `narad_log_collector_throughput` | Counter | Logs/sec shipped to ELK |
| `narad_api_requests_total` | Counter | Total API requests |
| `narad_api_latency_ms` | Histogram | API request latency |
| `narad_grpc_streams_active` | Gauge | Active gRPC agent streams |

## Alerting Rules

| Alert | Condition | Severity |
|---|---|---|
| NaradCPDown | Any CP node unhealthy > 2 min | Critical |
| AgentDisconnected | Any agent disconnected > 5 min | Critical |
| ServiceUnhealthy | Any service unhealthy > 2 min | Warning |
| HighCPULoad | CP CPU > 90% for 10 min | Warning |
| HighMemoryUsage | CP memory > 85% for 5 min | Critical |
| AgentVersionDrift | Agents on different versions | Warning |
| ServiceVersionDrift | Service instances on different versions | Warning |
| PortConflict | Two services claim same port | Critical |
| DeploymentFailed | Deployment status = FAILED | Critical |
| ElkBufferFull | Log disk buffer > 90% | Warning |

## Dashboard

The Narad Dashboard provides:
- **Infrastructure Map**: Visual topology of all servers and services.
- **Health Grid**: Color-coded health status for all services.
- **Deployment Timeline**: History and status of all deployments.
- **Config Diff**: Side-by-side comparison of configuration versions.
- **Command Audit**: Searchable history of all remote commands.
- **Agent Status**: Live view of all connected agents.
