# 20 — Troubleshooting

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Common Issues

### Strategy Not Activating on Signals

| Check | Resolution |
|---|---|
| Strategy status | Verify strategy is `ACTIVE` (not PAUSED/RETIRED) |
| Signal match | Check that signal's instrument/direction matches strategy |
| Trading hours | Confirm current time is within configured trading window |
| Cooldown active | Check if cooldown period has elapsed since last entry |
| Max positions reached | Verify position count is below max limit |
| Kill Switch ARMED | If armed, all signals are blocked |

### Orders Not Reaching Vega

| Check | Resolution |
|---|---|
| Vega health | `GET /v1/health` — check Vega connection status |
| MQ connectivity | Verify `kuber.outgoing.order` queue is not backed up |
| Order validation | Check if order was rejected due to invalid parameters |
| Network | Validate connectivity between Kuber Alpha and Vega |

### Capital Not Allocated

| Check | Resolution |
|---|---|
| Budget exhausted | Free capital may be 0; retire unused strategies |
| Strategy limit | Check per-strategy max allocation |
| Margin locked | Positions holding margin that hasn't been released |
| Daily loss limit | If breached, new allocations are blocked |

### Kill Switch Triggered Unexpectedly

| Check | Resolution |
|---|---|
| Margin spike | Review recent orders for large position that consumed margin |
| Daily loss | Review P&L — loss may have accumulated faster than expected |
| False trigger | Check margin calculation accuracy; may be a data feed issue |
| Circuit breaker | Exchange-level circuit may have triggered |

### Signal Processing Latency High

| Check | Resolution |
|---|---|
| Queue depth | Check MQ queue depth; may need more consumers |
| Strategy complexity | Complex strategies take longer to evaluate |
| Database slowness | Check MongoDB query performance |
| Resource exhaustion | CPU/memory may be maxed out; scale pods |

### Position Mismatch with Vega

| Check | Resolution |
|---|---|
| Reconciliation lag | Wait for next reconciliation cycle (every 5s) |
| Partial fills | Acknowledged but not fully filled orders |
| Vega-side cancellation | Check if Vega cancelled order without notifying KA |
| Data inconsistency | Manual position sync may be required (admin) |

## Diagnostic Commands

### Check Engine Health

```bash
curl https://api.algo-iq.com/kuber-alpha/v1/health
# Check: status, version, all connection statuses
```

### Check Strategy State

```bash
curl https://api.algo-iq.com/kuber-alpha/v1/strategies/sf-abc123/status
# Check: status, mode, positions, pnl, signals processed
```

### Check Kill Switch

```bash
curl https://api.algo-iq.com/kuber-alpha/v1/kill-switch
# Check: status, marginPct, threshold, last trigger
```

### Check MQ Queues

```bash
rabbitmqctl list_queues name messages consumers | grep kuber
```

### Check Logs

```bash
kubectl logs -l app=kuber-alpha --tail=200 | grep ERROR
kubectl logs -l app=kuber-alpha --tail=200 | grep "Kill Switch"
```

### Check Capital

```bash
curl https://api.algo-iq.com/kuber-alpha/v1/capital
# Check: free, allocated, deployed, locked
```

## Common Recovery Procedures

| Issue | Recovery |
|---|---|
| Strategy stuck in PAUSED | `POST /strategies/{id}/resume` |
| Kill Switch TRIGGERED | Review → Fix root cause → `POST /kill-switch/disarm` |
| Vega disconnected | Wait for auto-reconnect; if > 1 min, contact Vega team |
| Order stuck in PENDING > 60s | `DELETE /orders/{id}` to cancel; investigate |
| Position mismatch | Run manual reconciliation (admin endpoint) |
| Memory leak suspected | Rolling restart of pods (one at a time) |

## Support Escalation

| Severity | Channel | Response Time |
|---|---|---|
| P0 — Kill Switch / Vega down | Phone + PagerDuty | 15 minutes |
| P1 — Strategies not trading | Slack #eng-support | 1 hour |
| P2 — Latency/performance | Jira ticket | 4 hours |
| P3 — General questions | Email | 24 hours |
