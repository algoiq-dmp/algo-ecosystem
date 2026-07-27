# Narad Engine â€” Universal Connectivity & Infrastructure Management Platform

**Version:** 3.0.0
**Owner:** Infrastructure
**Last Updated:** 2026-07-24

---

## Overview

Narad is the **backbone of the entire Algo-IQ ecosystem** â€” a universal connectivity, infrastructure management, and observability platform that touches every server, engine, product, and API in production. Narad provides centralized infrastructure capabilities including service registry, deployment management, health monitoring, log collection, configuration management, and remote command execution across the entire distributed system.

With **99.99% uptime**, Narad ensures that every component of the ecosystem remains discoverable, healthy, configurable, and operational at all times.

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
                    +----------------------------------+
                    |        NARAD CONTROL PLANE       |
                    |  +-----------+  +-------------+  |
                    |  | Service   |  | Health      |  |
                    |  | Registry  |  | Monitor     |  |
                    |  +-----------+  +-------------+  |
                    |  +-----------+  +-------------+  |
                    |  | Config    |  | Deployment  |  |
                    |  | Manager   |  | Manager     |  |
                    |  +-----------+  +-------------+  |
                    |  +-----------+  +-------------+  |
                    |  | Tunnel    |  | Log         |  |
                    |  | Manager   |  | Collector   |  |
                    |  +-----------+  +-------------+  |
                    +-----------------+----------------+
                                      |
              +-----------------------+-----------------------+
              |                       |                       |
     +--------v--------+    +--------v--------+    +--------v--------+
     |  Lakshmi        |    |  Ganesh         |    |  Vega           |
     |  (Data Dist.)   |    |  (OHLC Data)    |    |  (AI Engine)    |
     +-----------------+    +-----------------+    +-----------------+
```

Narad acts as the central nervous system, connecting to and managing every server, engine, product, and API. It provides the infrastructure layer that all other components depend on for discovery, configuration, health monitoring, and operational control.

---

## Key Components

| Component | Role |
|---|---|
| **Service Registry** | Dynamic service discovery; tracks all running services, their endpoints, and metadata |
| **Product Registry** | Catalogs all ecosystem products with versions, owners, and dependencies |
| **Server Registry** | Inventory of all physical and virtual servers across the infrastructure |
| **Tunnel Manager** | Manages SSH tunnels and secure connections between distributed components |
| **Port Registry** | Allocates and tracks port assignments across all services |
| **Deployment Manager** | Orchestrates rolling deploys, canary releases, and rollbacks |
| **Restart Manager** | Controls service restarts with health-gate checks |
| **Configuration Manager** | Centralized configuration store with versioning and audit |
| **Remote Command Executor** | Secure remote command execution across any managed server |
| **Health Monitor** | Aggregates health probes from all services into unified dashboard |
| **Log Collector** | Centralized log aggregation pipeline to ELK stack |
| **Version Manager** | Tracks deployed versions across all services for compliance |

---

## Installation Quick Start

```powershell
# Prerequisites
choco install nodejs-lts postgresql redis

# Clone and install
git clone https://github.com/algo-iq/narad.git
cd narad
npm install --production

# Configure
cp config.example.json config.json

# Initialize database
node scripts/init-db.js

# Start
npm start
```

Verify at `http://localhost:3003/api/v1/health`.

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
