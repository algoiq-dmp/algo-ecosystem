# 12 — Consumer: KuberAlpha
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
**KuberAlpha** is the primary consumer of Rakshak's protection signals. All hedge requirements, risk alerts, and emergency triggers flow through KuberAlpha for execution.
## Data Consumed
| Rakshak Output | KuberAlpha Application |
|---------------|----------------------|
| Hedge Requirements | Pre-trade validation; position entry gate |
| Tail Risk Score | Position sizing limits |
| Gap/Overnight Risk | EOD position reduction mandates |
| Event Risk Alerts | Pre-event position adjustment |
| Dynamic Hedge Ratios | Continuous hedge quantity updates |
| Portfolio Protection | Strategy allocation limits |
| Emergency Exit Signals | Immediate order execution |
## Pre-Trade Gate
Before accepting any new position, KuberAlpha queries Rakshak:
Rakshak.CheckHedgeRequirement(strategy, proposed_position) -> APPROVED / APPROVED_WITH_HEDGE / REJECTED
## Emergency Exit Integration
KuberAlpha maintains a dedicated, high-priority order channel for Rakshak emergency signals. Normal order flow is paused during emergency exits.
## Circuit Breaker
When Rakshak emergency flag is set:
- All new position entry is suspended
- Only exit orders are processed
- Manual override required to resume
