# 16 — Narad Integration

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Overview

Hanuman integrates with **Narad** for strategy-level monitoring, event streaming, and alerting. Every strategy lifecycle event, trade signal, and anomaly is published to Narad for real-time visibility.

## Events Published

| Event Type | Trigger | Priority |
|------------|---------|----------|
| `StrategyLoaded` | Strategy definition loaded | LOW |
| `StrategyStarted` | Strategy transitions to RUNNING | LOW |
| `StrategyPaused` | Strategy paused (manual or risk) | MEDIUM |
| `StrategyStopped` | Strategy stopped | MEDIUM |
| `SignalGenerated` | Entry or exit signal generated | LOW |
| `OrderDispatched` | Paired orders sent to ODIN | LOW |
| `OrderFilled` | Fill received for a leg | LOW |
| `RiskVeto` | Order blocked by risk check | HIGH |
| `LegFailure` | One leg failed, auto-hedging triggered | HIGH |
| `CircuitBreakerTrip` | Strategy auto-stopped after N losses | HIGH |
| `DailyLossLimitHit` | Strategy daily loss limit reached | HIGH |
| `PartialFillAdjustment` | Leg quantity adjusted for partial fill | MEDIUM |
| `StrategyError` | Unexpected error in strategy logic | HIGH |

## Strategy Health Dashboard (Narad)

Narad provides a Strategy Health dashboard showing:
- All active strategies with color-coded health (green/yellow/red)
- P&L per strategy (1-hour, 1-day trends)
- Signal and order rates
- Fill ratios
- Risk vetoes per strategy
- Recent alerts timeline

## Anomaly Detection

| Rule | Description | Alert |
|------|-------------|-------|
| Zero Signal Rate | Strategy RUNNING but no signals for 5 minutes during trading | P2 |
| High Veto Rate | > 10% of signals vetoed in 5 minutes | P2 |
| Abnormal Fill Ratio | Fill ratio < 50% for 10 consecutive orders | P2 |
| P&L Spike | P&L change > 3 sigma from 30-day rolling mean | P2 |
| Consecutive Losses | > 5 consecutive losing trades | P2 |

## Integration Configuration

```yaml
narad:
  agent_address: "localhost:50060"
  registration_interval_sec: 30
  health_report_interval_sec: 5
  event_queue_size: 2048
  tags:
    component: "hanuman"
    team: "execution"
    criticality: "tier-1"
```
