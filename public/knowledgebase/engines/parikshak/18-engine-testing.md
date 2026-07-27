# 18 — Engine Testing

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Overview

Engine Testing validates the core Algo-IQ engines — Kuber Alpha, Simulator, DXCC, Ganesh, MQ, and Strategy Factory — as standalone components and as an integrated system.

## Test Scope Per Engine

### Kuber Alpha

| Test Area | Key Validations |
|---|---|
| Signal reception | Aalap Calls, Delta XI, VYUH, TalkDelta AI signal ingestion |
| Strategy activation | Onboarding, capital allocation, monitoring start |
| Kill Switch | Trigger at 1.01%, notification, auto-pause |
| Vega integration | Order placement, cancellation, status tracking |
| Capital management | Multi-strategy allocation, drawdown enforcement |

### Strategy Factory

| Test Area | Key Validations |
|---|---|
| Canvas operations | Block placement, connection, deletion |
| Compiler | JSON generation, validation, error handling |
| Export pipeline | Parikshak, Simulator, DXCC, Kuber Alpha submission |
| Collaboration | Real-time editing, conflict resolution |

### Simulator

| Test Area | Key Validations |
|---|---|
| Data ingestion | Historical data loading from Ganesh |
| Backtest execution | Tick replay, trade recording, metric computation |
| Monte Carlo | Simulation accuracy, convergence |
| Walk-forward | Optimization stability, out-of-sample validation |

### DXCC

| Test Area | Key Validations |
|---|---|
| Submission intake | Package validation, completeness check |
| Review workflow | Triage, technical, risk, compliance stages |
| Approval/rejection | Status propagation, notification delivery |

### Ganesh

| Test Area | Key Validations |
|---|---|
| Data quality scoring | Accuracy of quality assessments |
| Freshness monitoring | Staleness detection, alert triggers |
| Data lineage | Source tracking, transformation audit |
| Circuit breaker | Graceful degradation when sources fail |

### MQ

| Test Area | Key Validations |
|---|---|
| Message delivery | Routing, persistence, ordering |
| Reliability | Broker failover, DLQ handling, retry logic |
| Performance | Throughput under load, latency distribution |
| Security | TLS encryption, authentication, authorization |

## Engine Test Suites

| Suite | Content | Duration |
|---|---|---|
| `smoke` | Critical path only; quick validation | 2 min |
| `functional` | Complete feature set | 15 min |
| `regression` | Full suite against previous version | 30 min |
| `performance` | Load, stress, soak tests | 1 hour |
| `security` | SAST, DAST, dependency scan | 30 min |
| `chaos` | Random failure injection | 2 hours |

## Cross-Engine Testing

### End-to-End Signal Flow

```
Signal Source → Kuber Alpha → Vega → Exchange
     │               │
     └─── Ganesh ────┘ (data quality check)
```

### Strategy Lifecycle Flow

```
Strategy Factory → MQ → Parikshak → MQ → Simulator → MQ → DXCC → MQ → Kuber Alpha
```

Each handoff point is tested for:
- Correct MQ routing
- Payload integrity
- Timeout handling
- Failure recovery

## Environment Isolation

| Environment | Purpose | Data |
|---|---|---|
| **Dev** | Developer testing | Synthetic data |
| **Staging** | Integration testing | Anonymized production data |
| **Production** | Live system | Real data |
| **Sandbox** | Isolated per-test-run | Transient test data |

## Test Data Management

- Test data is seeded before each run and torn down after.
- No production data is used in staging without anonymization.
- Golden datasets are maintained for regression testing.
- Data is versioned alongside test suites.
