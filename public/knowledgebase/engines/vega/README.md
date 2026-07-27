# Vega Engine — Enterprise Order Execution Platform

**Version:** 6.3.0  
**Owner:** Execution  
**Last Updated:** 2026-07-24  
**Health SLA:** 99.99%

---

## Overview

Vega is the mission-critical order execution engine within the Algo-IQ ecosystem. It provides a robust, low-latency pipeline for transforming trade signals into exchange-routed orders through a 4-component architecture: **TalkStrategy API**, **TalkStrategy App**, **Order Processor**, and **Broker Integration**. Vega supports multiple broker adapters (XTS, Greeksoft) with centralized credential management and enforces risk controls via a Layer 3 Kill Switch at 1.50% margin threshold.

The engine communicates over **FIX protocol**, **REST APIs**, and **Message Queues (MQ)** to ensure deterministic order routing with full auditability and sub-millisecond internal latency.

---

## Quick Links

| Document | Title |
|---|---|
| [01-overview](01-overview.md) | Introduction & Business Objectives |
| [02-business-requirements](02-business-requirements.md) | Business Requirements |
| [03-system-requirements](03-system-requirements.md) | System Requirements |
| [04-high-level-architecture](04-high-level-architecture.md) | High-Level Architecture |
| [05-low-level-design](05-low-level-design.md) | Low-Level Design |
| [06-components](06-components.md) | Component Descriptions |
| [07-data-flow](07-data-flow.md) | Data Flow |
| [08-topology](08-topology.md) | Ecosystem Topology |
| [09-api-reference](09-api-reference.md) | API Reference |
| [10-database](10-database.md) | Database Schema & Storage |
| [11-configuration](11-configuration.md) | Configuration Guide |
| [12-installation](12-installation.md) | Installation Guide |
| [13-deployment](13-deployment.md) | Deployment Guide |
| [14-monitoring](14-monitoring.md) | Monitoring & Observability |
| [15-logging](15-logging.md) | Logging Standards |
| [16-security](16-security.md) | Security Design |
| [17-error-handling](17-error-handling.md) | Error Handling |
| [18-testing](18-testing.md) | Testing Strategy |
| [19-performance](19-performance.md) | Performance Benchmarks |
| [20-scalability](20-scalability.md) | Scalability Design |
| [21-troubleshooting](21-troubleshooting.md) | Troubleshooting Guide |
| [22-changelog](22-changelog.md) | Changelog |
| [23-best-practices](23-best-practices.md) | Best Practices |
| [24-contributing](24-contributing.md) | Contributing Guide |
| [25-glossary](25-glossary.md) | Glossary |

---

## Architecture Summary

```
[Strategy Engine] → [TalkStrategy API] → [TalkStrategy App] → [Order Processor] → [Broker Integration] → [Exchange]
                                 |                                  |
                            [MQ Layer]                        [Kill Switch Layer 3]
                                                                    |
                                                              [Risk Engine]
```

Vega follows a four-component pipeline: the **TalkStrategy API** receives validated trade signals, the **TalkStrategy App** enriches orders with account and risk parameters, the **Order Processor** performs pre-trade validation and state management, and the **Broker Integration** layer translates orders into broker-specific FIX/REST messages destined for XTS or Greeksoft.

---

## Key Components

| Component | Role |
|---|---|
| **TalkStrategy API** | REST/gRPC endpoint receiving trade signals from Lakshmi/Strategy Factory |
| **TalkStrategy App** | Business logic layer for order enrichment, user mapping, and rate limiting |
| **Order Processor** | Core order state machine; manages order lifecycle from NEW to FILLED/REJECTED |
| **Broker Integration — XTS** | FIX engine adapter for XTS broker connectivity |
| **Broker Integration — Greeksoft** | FIX/REST adapter for Greeksoft broker connectivity |
| **Credential Manager** | Encrypted vault for broker API keys, session tokens, and user credentials |
| **Kill Switch Layer 3** | Real-time margin monitor; hard-stops trading at 1.50% margin drawdown |
| **MQ Bridge** | RabbitMQ producer/consumer for async order communication |
| **Audit Logger** | Immutable order event log for compliance and reconciliation |
| **Order Cache** | Redis-backed cache for active order state and fast lookups |

---

## Installation Quick Start

```powershell
# Prerequisites
choco install nodejs-lts rabbitmq redis

# Clone and install
git clone https://github.com/algo-iq/vega.git
cd vega
npm install --production

# Configure
cp config.example.json config.json
# Edit config.json with broker credentials and exchange endpoints

# Initialize database
node scripts/init-db.js

# Start
npm start
```

Verify at `http://localhost:3003/api/v1/health`.

---

## Broker Support Matrix

| Broker | Protocol | Connectivity | Credential Model |
|---|---|---|---|
| **XTS** | FIX 4.4, REST | Lease line / VPN | User-level API key + session token |
| **Greeksoft** | FIX 5.0 SP2, REST | Internet (TLS 1.3) | Firm-level certificate + user OAuth |

---

## Risk Controls

| Layer | Mechanism | Threshold |
|---|---|---|
| Layer 1 | Pre-trade validation (Order Processor) | Symbol, quantity, price band |
| Layer 2 | Rate limiting (TalkStrategy App) | Max 500 orders/sec per user |
| Layer 3 | Kill Switch (Margin Monitor) | 1.50% running P&L drawdown |

---

## Documentation Index

1. [01-overview](01-overview.md)
2. [02-business-requirements](02-business-requirements.md)
3. [03-system-requirements](03-system-requirements.md)
4. [04-high-level-architecture](04-high-level-architecture.md)
5. [05-low-level-design](05-low-level-design.md)
6. [06-components](06-components.md)
7. [07-data-flow](07-data-flow.md)
8. [08-topology](08-topology.md)
9. [09-api-reference](09-api-reference.md)
10. [10-database](10-database.md)
11. [11-configuration](11-configuration.md)
12. [12-installation](12-installation.md)
13. [13-deployment](13-deployment.md)
14. [14-monitoring](14-monitoring.md)
15. [15-logging](15-logging.md)
16. [16-security](16-security.md)
17. [17-error-handling](17-error-handling.md)
18. [18-testing](18-testing.md)
19. [19-performance](19-performance.md)
20. [20-scalability](20-scalability.md)
21. [21-troubleshooting](21-troubleshooting.md)
22. [22-changelog](22-changelog.md)
23. [23-best-practices](23-best-practices.md)
24. [24-contributing](24-contributing.md)
25. [25-glossary](25-glossary.md)
