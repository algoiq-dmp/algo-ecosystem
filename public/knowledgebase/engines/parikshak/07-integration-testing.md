# 07 — Integration Testing

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Overview

Integration testing validates that multiple components work together correctly. Parikshak tests all inter-engine communication paths, data flows, and handoff points in the Algo-IQ ecosystem.

## Integration Test Categories

### Strategy Factory → Parikshak

| Test | Description |
|---|---|
| SF submits strategy → Parikshak receives | MQ message delivery verified |
| Parikshak returns results → SF updates | Callback acknowledged |
| Malformed JSON → rejected gracefully | Error handling validated |
| Large strategy (200 blocks) → timeout handling | Performance boundary tested |

### Strategy Factory → Simulator

| Test | Description |
|---|---|
| Certified strategy → Simulator backtest | Full pipeline |
| Backtest results → SF stored correctly | Data integrity |
| Simulator unavailable → SF handles gracefully | Circuit breaker |

### Strategy Factory → DXCC

| Test | Description |
|---|---|
| Complete package → DXCC review created | All reports attached |
| Incomplete package → DXCC rejects | Validation |
| DXCC approval → Kuber Alpha notified | MQ propagation |

### Strategy Factory → Kuber Alpha

| Test | Description |
|---|---|
| DXCC-approved strategy → deployed | Full deployment flow |
| Deployment status → SF UI updated | Real-time feedback |
| Kill switch → strategy pause → SF notified | Emergency flow |

### Kuber Alpha ↔ Vega

| Test | Description |
|---|---|
| Signal → order placed | End-to-end latency measured |
| Vega disconnected → KA handles gracefully | Resilience |
| Order rejected by exchange → KA retries | Error handling |

### Ganesh → All Engines

| Test | Description |
|---|---|
| Data quality drop → all engines notified | Broadcast validation |
| Quality restored → engines resume | Recovery path |
| Ganesh unavailable → each engine handles | Circuit breaker per engine |

## MQ Integration Tests

| Test | Description |
|---|---|
| Message published → consumed by correct queue | Routing validation |
| Message loss during broker restart | Persistent message test |
| DLQ overflow → alert triggered | Monitoring |
| Malformed message → routed to DLQ | Poison message handling |

## API Integration Tests

| Test | Description |
|---|---|
| Auth token propagation across engines | SSO verification |
| Rate limiting across services | Gateway behavior |
| Version mismatch between engines | Compatibility |
| CORS and security headers | Security posture |

## End-to-End Scenarios

### Scenario 1: Full Strategy Lifecycle

```
1. Create strategy in SF
2. Submit to Parikshak → all tests pass
3. Forward to Simulator → backtest metrics meet thresholds
4. Submit to DXCC → approved
5. Deploy to Kuber Alpha → strategy goes PAPER → STAGED → LIVE
6. Live trade executed via Vega
7. Kill switch monitoring active
```

### Scenario 2: Emergency Pause

```
1. Strategy LIVE in Kuber Alpha
2. Margin exceeds Kill Switch threshold
3. Strategy auto-paused
4. SF notified via MQ
5. SF UI shows "PAUSED" status
6. Strategy owner reviews and adjusts risk
7. Resubmits through lifecycle
```

## Test Environment

Integration tests run in a dedicated staging environment:
- All engines deployed at known versions.
- Mock market data from Ganesh test datasets.
- Paper trading mode in Vega (no real orders).
- Isolated MQ vhost to prevent cross-contamination.

## Execution Frequency

| Frequency | Tests |
|---|---|
| Every commit | Smoke integration tests (5 min) |
| Nightly | Full integration suite (2 hours) |
| Pre-release | Extended suite with chaos testing (8 hours) |
