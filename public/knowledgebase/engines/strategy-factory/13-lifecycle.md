# 13 — Strategy Lifecycle

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## The 5-Stage Lifecycle

Every strategy created in Strategy Factory follows a mandatory 5-stage lifecycle before it can trade live. Each stage is a gate — if any stage fails, the strategy loops back for revision.

```
┌─────────┐     ┌───────────┐     ┌───────────┐     ┌──────┐     ┌─────────────┐
│  BUILD   │────▶│ PARIKSHAK  │────▶│ SIMULATOR  │────▶│ DXCC │────▶│ KUBER ALPHA │
│  (SF)    │     │  (Certify) │     │ (Backtest) │     │(Appr)│     │  (Deploy)   │
└─────────┘     └─────┬─────┘     └─────┬─────┘     └──┬───┘     └──────┬──────┘
     ▲                │                 │               │               │
     │                │   FAIL          │   FAIL        │   REJECT      │
     └────────────────┴─────────────────┴───────────────┴───────────────┘
                         Revise & Retry
```

## Stage 1: Build (Strategy Factory)

**Objective**: Design the strategy visually.

- Compose entry/exit logic, risk rules, position sizing.
- Validate locally using the compiler.
- Export JSON when ready.
- **Gate**: Compiler validation passes with zero errors.
- **Duration**: Minutes to hours.

## Stage 2: Parikshak (Test)

**Objective**: Enterprise-grade testing and certification.

- Unit tests for each strategy component.
- Integration tests covering connected engines.
- Regression tests against known scenarios.
- Performance benchmarking.
- Security vulnerability scan.
- **Gate**: All test suites pass. Readiness report is green.
- **Duration**: Automated (minutes) + Manual review (hours to days).

## Stage 3: Simulator (Backtest)

**Objective**: Validate strategy performance against historical data.

- Run strategy on 1+ years of historical tick/second data.
- Generate detailed performance report (Sharpe, drawdown, win rate, P&L).
- Monte Carlo simulation for robustness.
- Walk-forward optimization.
- **Gate**: Meets minimum performance thresholds (configurable).
- **Duration**: Minutes to hours depending on data scope.

## Stage 4: DXCC (Approve)

**Objective**: Compliance, risk, and deployment approval.

- Review Parikshak certification report.
- Review Simulator backtest results.
- Assess regulatory compliance.
- Approve or reject deployment.
- **Gate**: Explicit approval by authorized DXCC reviewer.
- **Duration**: Typically 1–3 business days.

## Stage 5: Kuber Alpha (Deploy)

**Objective**: Activate the strategy in production.

- Strategy is ingested by Kuber Alpha as a managed strategy.
- Capital is allocated per portfolio configuration.
- Strategy begins receiving live market signals.
- Kill Switch monitoring is active.
- **Gate**: Signal from DXCC approval. Strategy goes live.
- **Duration**: Near-instant after DXCC approval.

## Lifecycle States

| State | Description |
|---|---|
| `DRAFT` | Under construction in Strategy Factory |
| `IN_TEST` | Submitted to Parikshak |
| `IN_BACKTEST` | Running in Simulator |
| `PENDING_APPROVAL` | Awaiting DXCC review |
| `APPROVED` | Cleared for production |
| `DEPLOYED` | Active in Kuber Alpha |
| `PAUSED` | Temporarily halted (manual or kill switch) |
| `REJECTED` | Failed at any gate |
| `ARCHIVED` | Retired from production |
