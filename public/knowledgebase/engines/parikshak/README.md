# Parikshak — Enterprise Testing Engine

> **Version:** 2.0.0 | **Owner:** QA | **Health:** 99.0% | **Last Updated:** 2026-07-24

## Overview

Parikshak is the enterprise-grade testing engine for the Algo-IQ ecosystem. It is the mandatory certification gateway that validates every product, engine, API, and strategy before production deployment. **No strategy goes live without Parikshak certification.**

## Mission

Parikshak's mission is to ensure that every component in the Algo-IQ ecosystem meets stringent quality, performance, and security standards before it can impact live trading.

## What Parikshak Tests

| Category | Scope |
|---|---|
| **Strategies** | Entry/exit logic, risk rules, position sizing from Strategy Factory |
| **Engines** | Kuber Alpha, Simulator, DXCC, Ganesh, MQ |
| **APIs** | REST endpoints, MQ topics, WebSocket feeds |
| **Products** | Full product suites before release |
| **Data Flows** | End-to-end signal-to-execution pipelines |

## Outputs

| Report | Purpose |
|---|---|
| **Test Reports** | Detailed pass/fail per test case |
| **Checklists** | Mandatory checks before proceeding |
| **Regression Reports** | Comparison against previous versions |
| **Readiness Reports** | Go/No-Go deployment recommendation |
| **Performance Reports** | Latency, throughput, resource utilization |
| **Security Reports** | Vulnerability scans, penetration test results |

## Connected To

Parikshak connects to **every engine and product** in the Algo-IQ ecosystem:

- **Strategy Factory** — Receives strategies for certification
- **Kuber Alpha** — Tests strategy deployment and signal processing
- **Simulator** — Validates backtest engine accuracy
- **DXCC** — Provides certification reports for approval
- **Ganesh** — Validates data quality and freshness
- **MQ** — Tests messaging reliability and throughput
- **All Products & APIs** — Comprehensive integration testing

## Certification Principle

```
NO PARIKSHAK CERTIFICATION = NO PRODUCTION DEPLOYMENT
```

Every strategy, engine update, product release, and API change must pass Parikshak testing before reaching production. This is a non-negotiable gate enforced by DXCC.

## Quick Links

- [Architecture](01-architecture.md)
- [Quick Start](02-quick-start.md)
- [Test Framework](05-test-framework.md)
- [Certification](16-certification.md)
- [Glossary](25-glossary.md)
