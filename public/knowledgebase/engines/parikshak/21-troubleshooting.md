# 21 — Troubleshooting

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Common Issues

### Submission Rejected Immediately

| Symptom | Cause | Resolution |
|---|---|---|
| "Invalid schema" | JSON does not match expected format | Validate payload against schema before submission |
| "Unauthorized" | Missing or expired auth token | Refresh token or generate new API key |
| "Component not found" | Invalid strategy/engine ID | Verify the ID exists in the source system |

### Tests Stuck in QUEUED Status

| Cause | Resolution |
|---|---|
| Worker shortage | Check worker count; scale up if queue depth > 10 |
| Previous suite consuming all workers | Cancel low-priority suites or increase worker pool |
| MQ connectivity issue | Check RabbitMQ health; verify queue bindings |

### Test Suite Hanging or Timing Out

| Cause | Resolution |
|---|---|
| Strategy too complex (>200 nodes) | Simplify strategy or increase timeout |
| External dependency unreachable | Check that mock services are available |
| Infinite loop in strategy logic | Fix circular dependency in strategy |

### Intermittent Test Failures (Flaky Tests)

| Pattern | Action |
|---|---|
| Fails ~10% of runs | Mark as flaky; create ticket for investigation |
| Timing-dependent | Add explicit waits, not sleep-based delays |
| Data-dependent | Ensure test data is deterministic and isolated |
| Order-dependent | Remove shared state between tests |

### Performance Benchmarks Failing

| Metric | Common Cause | Fix |
|---|---|---|
| High latency | Resource contention on worker | Increase worker replicas; check CPU/memory |
| Memory spike | Memory leak in engine code | Profile with heap dump; fix leak |
| Low throughput | MQ bottleneck | Check MQ consumer count; increase prefetch |

### Security Scan Findings

| Finding | Action |
|---|---|
| CVE in dependency | Upgrade to patched version |
| Hardcoded secret | Remove; use secret manager |
| OWASP finding | Follow remediation in report |

### Certificate Verification Failure

| Error | Resolution |
|---|---|
| "Certificate expired" | Resubmit for recertification |
| "Certificate revoked" | Contact QA Lead for investigation |
| "Component version mismatch" | Certify the current version |

## Diagnostic Tools

### Health Endpoint

```bash
curl https://api.algo-iq.com/parikshak/v2/health
# {"status":"healthy","version":"2.0.0","workers":{"total":8,"busy":3,"idle":5},"queueDepth":2}
```

### Worker Status

```bash
curl https://api.algo-iq.com/parikshak/v2/admin/workers
```

### Submission Debug

```bash
curl https://api.algo-iq.com/parikshak/v2/submissions/sub-001/debug
# Returns detailed execution trace including worker assignment, timing, and errors
```

### Queue Inspection

```bash
rabbitmqctl list_queues name messages consumers | grep parikshak
```

## Logs

| Log Level | Content | Location |
|---|---|---|
| ERROR | Test failures, system errors | `parikshak-error.log` |
| WARN | Threshold warnings, retries | `parikshak-warn.log` |
| INFO | Submission lifecycle, worker events | `parikshak-info.log` |
| DEBUG | Detailed execution traces | `parikshak-debug.log` |

## Support Escalation

| Severity | Channel | Response Time |
|---|---|---|
| P0 — Testing pipeline down | Phone + Slack #alerts-p0 | 15 minutes |
| P1 — Tests failing incorrectly | Slack #eng-support | 1 hour |
| P2 — Performance degradation | Jira ticket | 4 hours |
| P3 — Documentation/general | Email | 24 hours |
