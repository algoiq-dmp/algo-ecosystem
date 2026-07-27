# 21 — Troubleshooting

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Common Issues

### Canvas Not Loading

**Symptom**: Blank white screen when opening Strategy Factory.

| Check | Action |
|---|---|
| Browser compatibility | Use Chrome 120+, Firefox 121+, or Edge 120+ |
| JavaScript enabled | Ensure JS is not blocked |
| WebSocket connection | Check console for WS errors |
| Cache issues | Clear browser cache and reload |
| Auth token expired | Log out and log back in |

### Cannot Place Blocks on Canvas

**Symptom**: Dragging from palette does nothing, or block snaps back.

| Check | Action |
|---|---|
| Strategy limit | Max 200 blocks per strategy — remove unused blocks |
| Read-only mode | Check if another user is editing (collaboration lock) |
| Browser permissions | Ensure drag-and-drop is not blocked by extensions |

### Validation Errors at Export

| Error | Cause | Fix |
|---|---|---|
| "Missing entry signal" | No Entry block on canvas | Add at least one entry signal block |
| "Circular dependency" | Blocks form a loop | Remove the loop connection |
| "Unconnected block" | Isolated block with no connections | Connect or remove the orphan block |
| "Risk rules violated" | Setting exceeds platform limits | Adjust risk parameters |
| "Compiler timeout" | Graph exceeds 200 nodes or is deeply nested | Simplify strategy or split into multiple strategies |

### Parikshak Submission Fails

| Issue | Resolution |
|---|---|
| "Schema validation failed" | Export JSON is malformed; re-export and re-submit |
| "Parikshak unreachable" | Check Parikshak health; retry after service is restored |
| "Timeout" | Parikshak may be under heavy load; retry with lower priority |

### Simulator Backtest Returns No Results

| Issue | Resolution |
|---|---|
| Insufficient data | Date range has no data — adjust or check Ganesh |
| No trades generated | Entry conditions too restrictive — broaden criteria |
| Data quality issue | Check Ganesh quality score for the instrument |

### DXCC Rejection

| Reason | Action |
|---|---|
| Risk score too high | Reduce leverage, add stop-loss, lower position size |
| Compliance violation | Check instrument permissions and exchange rules |
| Incomplete package | Ensure Parikshak AND Simulator results are attached |

### Kuber Alpha Deployment Stuck

| Status | Resolution |
|---|---|
| `DEPLOYING` for > 5 min | Contact Kuber Alpha team; possible MQ issue |
| Kill Switch triggered | Check margin utilization; adjust risk parameters |
| Vega connection failed | Ensure broker connection is healthy |

## Diagnostic Commands

### Check Engine Health

```bash
curl https://api.algo-iq.com/strategy-factory/v3/health
```

### Check MQ Connectivity

```bash
rabbitmqctl list_queues | grep strategy.factory
```

### View Recent Errors

```bash
kubectl logs -l app=strategy-factory --tail=100 | grep ERROR
```

## Support Escalation

| Severity | Response Time | Channel |
|---|---|---|
| Critical (P0) | 15 minutes | Phone + Slack #alerts-p0 |
| High (P1) | 1 hour | Slack #eng-support |
| Medium (P2) | 4 hours | Jira ticket |
| Low (P3) | 24 hours | Email support@algo-iq.com |
