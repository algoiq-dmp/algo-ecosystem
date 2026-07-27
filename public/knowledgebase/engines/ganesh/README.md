# Ganesh Engine â€” Central OHLC Provider

**Version:** 3.2.1
**Owner:** Data Engineering
**Last Updated:** 2026-07-24

---

## Overview

Ganesh is the central OHLC (Open, High, Low, Close) data provider for the Algo-IQ ecosystem. It serves as the **single source of truth for all historical price data**, storing and distributing multi-timeframe OHLC bars to every downstream consumer â€” strategy engines, simulators, analytics platforms, and trading terminals.

Ganesh maintains OHLC data across five timeframes: **1 minute, 5 minute, 15 minute, 1 hour, and 1 day**, supporting both real-time bar aggregation and historical data retrieval. The engine guarantees **99.9% data availability** and serves as the foundational pricing layer for every trading decision made across the ecosystem.

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
| [14-monitoring](14-monitoring.md) | Health & Monitoring |
| [15-security](15-security.md) | Security Design |
| [16-performance](16-performance.md) | Performance Benchmarks |
| [17-troubleshooting](17-troubleshooting.md) | Troubleshooting Guide |
| [18-operations](18-operations.md) | Operations Runbook |
| [19-integration](19-integration.md) | Integration Guide |
| [20-testing](20-testing.md) | Testing Strategy |
| [21-maintenance](21-maintenance.md) | Maintenance Procedures |
| [22-faq](22-faq.md) | Frequently Asked Questions |
| [23-changelog](23-changelog.md) | Changelog & Release Notes |
| [24-contributing](24-contributing.md) | Contributing Guidelines |

---

## Architecture Summary

```
[Feed Server] -> [Lakshmi (MQ)] -> [Ganesh Bar Aggregator] -> [OHLC Store (Redis + PostgreSQL)] -> [API Layer] -> [Consumers]
```

Ganesh receives raw ticks from the feed server via Lakshmi's RabbitMQ fabric, aggregates them into OHLC bars at five discrete timeframes, persists the bars in Redis (hot cache) and PostgreSQL (cold storage), and exposes a REST API for consumer queries. Corporate actions (splits, bonuses, dividends) are ingested from Surya to ensure historically adjusted prices.

---

## Key Components

| Component | Role |
|---|---|
| **Bar Aggregator** | Converts raw ticks into OHLC bars at 1m, 5m, 15m, 1H, 1D timeframes |
| **Redis Cache Layer** | In-memory storage for recent bars (last 90 days), sub-ms reads |
| **PostgreSQL Store** | Durable long-term storage for all historical bars |
| **REST API Server** | Serves OHLC data to all ecosystem consumers |
| **Corporate Action Engine** | Adjusts historical bars for splits, bonuses, and dividends |
| **Data Validator** | Ensures bar integrity, gap detection, and outlier flagging |
| **Health Probe** | Exposes Prometheus metrics and health-check endpoints |

---

## Installation Quick Start

```powershell
# Prerequisites
choco install nodejs-lts redis postgresql

# Clone and install
git clone https://github.com/algo-iq/ganesh.git
cd ganesh
npm install --production

# Configure
cp config.example.json config.json

# Initialize schema
node scripts/init-db.js

# Start
npm start
```

Verify at `http://localhost:3002/api/v1/health`.

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
15. [15-security](15-security.md)
16. [16-performance](16-performance.md)
17. [17-troubleshooting](17-troubleshooting.md)
18. [18-operations](18-operations.md)
19. [19-integration](19-integration.md)
20. [20-testing](20-testing.md)
21. [21-maintenance](21-maintenance.md)
22. [22-faq](22-faq.md)
23. [23-changelog](23-changelog.md)
24. [24-contributing](24-contributing.md)
