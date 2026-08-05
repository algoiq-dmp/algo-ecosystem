# Parikshak -- Phase 2: Strategy Testing & Validation Engine

> **Version:** 2.0.0 | **Owner:** QA | **Health:** 99.0% | **Last Updated:** 2026-08-05

## Overview

**Parikshak** is the Phase 2 strategy validation engine of the Algo IQ ecosystem. Every strategy developed in the Strategy Factory is automatically transferred to Parikshak for comprehensive testing before production deployment.

**No strategy goes live without Parikshak certification.**

> **See Also:** [Algo IQ Strategy Ecosystem Overview](/knowledgebase/ecosystem-overview.md) -- End-to-end flow from Strategy Factory to Vega Execution.

---

## Position in the Development Lifecycle

```
Phase 1                Phase 2                Phase 3
Strategy Factory  -->  PARIKSHAK         -->  Kuber Alpha
(Creation)             (Testing)              (Deployment)
                            |
                     Pass? ---> Proceed to Phase 3
                     Fail? ---> Return to Phase 1 for modification
```

---

## 12-Stage Validation Process

Parikshak performs comprehensive testing across 12 validation stages:

| Stage | Description | Failure Action |
|---|---|---|
| **1. Historical Backtesting** | Validate strategy against multi-year historical market data | Return to Factory with performance report |
| **2. Replay Engine Testing** | Tick-by-tick market replay simulation | Return to Factory with replay analysis |
| **3. Paper Trading** | Live market simulation without real capital | Return to Factory with paper trade log |
| **4. Market Scenario Simulation** | Test against bull, bear, volatile, range-bound conditions | Return to Factory with scenario results |
| **5. Performance Benchmarking** | Measure returns, Sharpe ratio, Sortino, win rate, max drawdown | Return to Factory with benchmark report |
| **6. Risk Analysis** | Evaluate VaR, CVaR, beta, correlation metrics | Return to Factory with risk profile |
| **7. Drawdown Analysis** | Peak-to-trough drawdown profiling with recovery analysis | Return to Factory with drawdown report |
| **8. Stress Testing** | Simulate extreme market events and flash crashes | Return to Factory with stress test results |
| **9. Margin Validation** | Verify margin requirements and capital adequacy | Return to Factory with margin report |
| **10. Compliance Verification** | Validate against SEBI/exchange regulatory rules | Return to Factory with compliance report |
| **11. Order Execution Validation** | Verify order placement, fill logic, and broker communication | Return to Factory with execution report |
| **12. API Integration Testing** | Validate strategy-to-API communication end-to-end | Return to Factory with integration report |

---

## Phase 2 Gate Logic

```
Strategy received from Strategy Factory
              |
              v
     [Stage 1: Backtesting]
              |
        Pass? --- No ---> [Return to Factory with failure report]
         Yes              (Modify, optimize, re-submit)
              |
              v
     [Stage 2: Replay Engine]
              |
        Pass? --- No ---> [Return to Factory]
         Yes
              |
              v
        ... (Stages 3-12) ...
              |
              v
     [ALL 12 STAGES PASSED]
              |
              v
     [Certification Report Generated]
              |
              v
     [Send to DXCC for Go-Live Approval]
              |
              v
     [Approved for Phase 3: Kuber Alpha Deployment]
```

---

## Certification Outputs

| Report | Purpose |
|---|---|
| **Backtesting Results** | Historical performance validation |
| **Replay Engine Reports** | Tick-level execution simulation |
| **Paper Trading Logs** | Live market simulation log |
| **Scenario Simulation Outcomes** | Multi-market condition results |
| **Performance Benchmarks** | Returns, ratios, and metrics |
| **Risk Analysis Documents** | Risk metrics and profiles |
| **Drawdown Reports** | Drawdown depth and recovery analysis |
| **Stress Test Results** | Extreme condition behavior |
| **Margin Validation Certificates** | Margin compliance confirmation |
| **Compliance Verification Reports** | Regulatory rule adherence |
| **API Integration Test Logs** | End-to-end communication validation |
| **Final Certification Report** | Pass/Fail with detailed reasons |

---

## Connected Systems

| System | Role |
|---|---|
| **Strategy Factory** | Receives strategies for certification (Phase 1 → 2) |
| **Simulator** | Backtesting and replay engine data source |
| **Ganesh** | OHLC historical data for backtesting |
| **Surya** | BOD/EOD data for validation |
| **DXCC** | Certification reports for go-live approval |
| **Kuber Alpha** | Validates deployment readiness (Phase 2 → 3) |

---

## Certification Principle

```
NO PARIKSHAK CERTIFICATION = NO PRODUCTION DEPLOYMENT

Every strategy must pass ALL 12 validation stages.
Any stage failure returns the strategy to Phase 1 for modification.
Only DXCC-approved certified strategies reach Phase 3 (Kuber Alpha).
```

---

## Quick Links

- [Architecture](01-architecture.md)
- [Quick Start](02-quick-start.md)
- [Test Framework](05-test-framework.md)
- [Unit Testing](06-unit-testing.md)
- [Integration Testing](07-integration-testing.md)
- [Strategy Testing](09-strategy-testing.md)
- [Certification](16-certification.md)
- [Glossary](25-glossary.md)
