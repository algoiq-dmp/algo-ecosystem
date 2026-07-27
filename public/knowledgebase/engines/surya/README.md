# Surya Engine — Exchange File Management Platform

**Version:** 2.4.1  
**Owner:** Operations  
**Last Updated:** 2026-07-24  
**Health SLA:** 99.7%

---

## Overview

Surya is the **Single Source of Truth (SSOT)** for all exchange-provided files in the Algo-IQ ecosystem. It manages the complete lifecycle of **18+ file types** — including Security Token, Contract Master, SPAN Margin, Exposure Margin, Bhavcopy, Settlement, Corporate Actions, and more — through automated BOD (Begin of Day) and EOD (End of Day) workflows driven by extranet API integrations.

Surya enforces a critical architectural rule: **no engine in the ecosystem downloads exchange files directly**. Every component receives validated, normalized, and versioned files exclusively from Surya, ensuring consistency, auditability, and compliance across the platform.

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
[Exchange Extranet] → [Extranet API Client] → [File Fetcher] → [Validator] → [Normalizer] → [Version Store] → [Distribution API]
                                                       │
                                                  [File Type Registry]
                                                       │
                                                  [Downstream Engines]
                                               (Lakshmi, Ganesh, Vega, etc.)
```

Surya follows a **pipeline architecture**: the **Extranet API Client** fetches files from exchange extranet endpoints, the **Validator** checks format, completeness, and integrity, the **Normalizer** standardizes schemas for downstream consumption, the **Version Store** maintains immutable file history, and the **Distribution API** serves files to all downstream engines.

---

## Key Components

| Component | Role |
|---|---|
| **Extranet API Client** | Authenticates and fetches files from NSE/BSE extranet APIs |
| **File Fetcher** | Schedules and executes BOD/EOD file downloads |
| **File Type Registry** | Manages 18+ file type schemas, validation rules, and processing pipelines |
| **Validator** | Checks file format, checksums, mandatory columns, and business rules |
| **Normalizer** | Standardizes column names, date formats, numeric formats across file types |
| **Version Store** | Immutable file storage with versioning via MinIO/S3 |
| **Distribution API** | REST API for downstream engines to query and download files |
| **BOD/EOD Scheduler** | Cron-based scheduler for daily file processing windows |
| **File Watcher** | Monitors extranet for late/missed files and triggers alerts |
| **Audit Logger** | Tracks every file fetch, validation, and distribution event |
| **Notification Service** | Alerts Operations team on file delays, failures, or anomalies |

---

## Supported File Types

| # | File Type | Exchange | Schedule | Description |
|---|---|---|---|---|
| 1 | Security Token (SEC_TOK) | NSE | BOD daily | Maps symbols to instrument tokens |
| 2 | Contract Master (CON_MAST) | NSE | BOD daily | Futures & Options contract specifications |
| 3 | SPAN Margin (SPN_MRG) | NSE | BOD + intraday | Risk margin parameters |
| 4 | Exposure Margin (EXP_MRG) | NSE | BOD daily | Additional margin requirements |
| 5 | Bhavcopy (BHAVCOPY) | NSE/BSE | EOD daily | End-of-day price and volume data |
| 6 | Delivery Report (DLV_RPT) | NSE | EOD daily | Delivery-based settlement quantities |
| 7 | Settlement (SETTLE) | NSE | EOD daily | Settlement prices for derivatives |
| 8 | Corporate Actions (CORP_ACT) | NSE/BSE | On announcement | Dividends, splits, bonuses, mergers |
| 9 | Market Holidays (MKT_HOL) | NSE/BSE | Monthly | Exchange holiday calendar |
| 10 | Index Master (IDX_MAST) | NSE | Weekly | Index composition and weights |
| 11 | Bulk Deals (BLK_DEAL) | NSE/BSE | EOD daily | Bulk/block deal reporting |
| 12 | Circuit Breaker (CIRC_BRK) | NSE | BOD daily | Price band limits per security |
| 13 | Short Selling (SHORT_SELL) | NSE | EOD daily | Short selling ban list |
| 14 | Securities Ban (SEC_BAN) | NSE | BOD daily | F&O ban period securities |
| 15 | Trade Statistics (TRD_STAT) | NSE | EOD daily | Aggregate trade statistics |
| 16 | Open Interest (OPEN_INT) | NSE | EOD daily | F&O open interest data |
| 17 | Participant-wise OI (PRT_OI) | NSE | EOD daily | Client/category-wise open interest |
| 18 | Volatility (VOLATILITY) | NSE | EOD daily | Implied volatility data |

---

## Installation Quick Start

```powershell
# Prerequisites
choco install nodejs-lts

# Clone and install
git clone https://github.com/algo-iq/surya.git
cd surya
npm install --production

# Configure
cp config.example.json config.json
# Edit config.json with exchange extranet credentials, MinIO endpoints

# Initialize database
node scripts/init-db.js

# Start
npm start
```

Verify at `http://localhost:3005/api/v1/health`.

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
