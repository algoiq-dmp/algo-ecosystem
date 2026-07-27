# 14 — Performance Reports

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Overview

Performance Reports quantify the runtime behavior of strategies, engines, and APIs under test. They measure latency, throughput, resource utilization, and scalability.

## Performance Metrics

### Latency Metrics

| Metric | Description | SLA |
|---|---|---|
| P50 latency | Median response time | < 100ms |
| P95 latency | 95th percentile | < 500ms |
| P99 latency | 99th percentile | < 1000ms |
| P999 latency | 99.9th percentile | < 2000ms |
| Max latency | Worst-case observed | < 5000ms |

### Throughput Metrics

| Metric | Description | SLA |
|---|---|---|
| Requests/second | Sustained throughput | > 1000 |
| Peak RPS | Maximum handled | > 5000 |
| Concurrent connections | Simultaneous clients | > 500 |
| MQ messages/sec | Message throughput | > 5000 |

### Resource Metrics

| Metric | Description | SLA |
|---|---|---|
| CPU utilization | Average across workers | < 70% |
| Memory usage | Per-worker average | < 80% of limit |
| Disk I/O | Read/write operations/sec | < 1000 IOPS |
| Network I/O | Bandwidth used | < 80% of capacity |
| GC pause time | Max stop-the-world pause | < 50ms |

### Strategy-Specific Metrics

| Metric | Description | Threshold |
|---|---|---|
| Compilation time | Strategy → JSON conversion | < 200ms |
| Signal evaluation | Entry condition check | < 10ms |
| Export payload size | Generated JSON | < 5MB |
| Canvas render time | 200-block strategy | < 500ms |

## Report Structure

```json
{
  "reportId": "pr-001",
  "submissionId": "sub-001",
  "generatedAt": "2026-07-24T15:30:00Z",
  "environment": {
    "cpu": "8 cores",
    "memory": "16 GB",
    "region": "ap-south-1"
  },
  "latency": {
    "p50": { "value": 45, "unit": "ms", "sla": 100, "status": "PASS" },
    "p95": { "value": 210, "unit": "ms", "sla": 500, "status": "PASS" },
    "p99": { "value": 890, "unit": "ms", "sla": 1000, "status": "PASS" }
  },
  "throughput": {
    "sustainedRps": { "value": 1250, "sla": 1000, "status": "PASS" },
    "peakRps": { "value": 5800, "sla": 5000, "status": "PASS" }
  },
  "resources": {
    "cpuPercent": { "value": 62, "sla": 70, "status": "PASS" },
    "memoryPercent": { "value": 72, "sla": 80, "status": "PASS" }
  },
  "strategy": {
    "compilationTimeMs": { "value": 156, "threshold": 200, "status": "PASS" },
    "signalEvalMs": { "value": 4.2, "threshold": 10, "status": "PASS" }
  },
  "overallStatus": "PASS",
  "warnings": [
    { "metric": "p99LatencyMs", "message": "Approaching SLA (89% of limit)" }
  ]
}
```

## Benchmarking Methodology

1. **Warm-up**: 2 minutes of sustained load to allow JIT compilation and caching.
2. **Ramp-up**: Incrementally increase load from 10% to 100% of target.
3. **Steady state**: Maintain target load for 10 minutes.
4. **Spike test**: Sudden 2x load increase for 1 minute.
5. **Recovery**: Return to steady state; measure recovery time.
6. **Soak test**: Sustained load for 1 hour to detect memory leaks.

## Trend Analysis

Performance is tracked over time:

```
Metric: P95 Latency (ms)
Version 1.0.0: ████████████ 480
Version 1.1.0: ██████████ 400  (-16.7%)
Version 1.2.0: ██████████████ 560  (+40%)  ⚠ REGRESSION
Version 1.2.1: ██████████ 410  (-26.8%) ✓ FIXED
```

## Performance Budgets

Every component has a performance budget. Exceeding it is treated as a test failure:

| Component | Budget |
|---|---|
| Strategy compilation | 200ms |
| API response (P95) | 500ms |
| MQ message processing | 100ms |
| Canvas render (200 blocks) | 1s |
| Report generation | 30s |
