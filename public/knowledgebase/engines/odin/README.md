# ODIN — Order Management and Dealer Terminal Integration

> **Sub-component of:** Lakshmi  
> **Version:** v3.0.0  
> **Owner:** Execution  
> **Last Updated:** 2026-07-25

## Overview

ODIN is the Order Delivery and Integration Network — the Lakshmi ecosystem's gateway to exchange trading systems. It manages the complete order lifecycle from reception through routing, execution, confirmation, and reconciliation. ODIN integrates with exchange-approved dealer terminals (ODIN Diet, Omnesys Nest, uTrade, etc.) and direct exchange APIs for order routing.

## Key Capabilities

- Multi-exchange order routing: NSE, BSE, MCX, NCDEX
- Dealer terminal integration via vendor APIs (ODIN Diet, Omnesys Nest)
- Direct exchange API integration (NSE NEAT API, BSE BOLT API)
- Order lifecycle management: NEW → PENDING → OPEN → PARTIAL → COMPLETE → REJECTED → CANCELLED
- Order validation: price bands, quantity limits, lot size, RMS checks
- Execution report processing and normalization
- Trade confirmation and reconciliation with exchange trade files
- Graceful degradation: auto-switch between direct API and dealer terminal path on failure

## Directory Structure

```
odin/
├── README.md
├── 01-overview.md
├── 02-business-requirements.md
├── 03-system-requirements.md
├── 04-high-level-architecture.md
├── 05-low-level-design.md
├── 06-components.md
├── 07-data-flow.md
├── 08-topology.md
├── 09-api-reference.md
├── 10-database.md
├── 11-configuration.md
├── 12-installation.md
├── 13-deployment.md
├── 14-monitoring.md
├── 15-security.md
├── 16-narad-integration.md
├── 17-suraksha-integration.md
├── 18-failover.md
├── 19-performance.md
├── 20-testing.md
├── 21-troubleshooting.md
├── 22-faq.md
├── 23-roadmap.md
├── 24-release-notes.md
├── 25-glossary.md
├── diagrams/
├── images/
└── api/
```

## Quick Links

| Document | Description |
|----------|-------------|
| [04-high-level-architecture](04-high-level-architecture.md) | Order routing architecture |
| [05-low-level-design](05-low-level-design.md) | Order state machine and protocol adapters |
| [09-api-reference](09-api-reference.md) | Order API and execution reports |
| [18-failover](18-failover.md) | Multi-path failover strategy |

## Dependencies

- **OS:** RHEL 9.x / Rocky Linux 9.x
- **Runtime:** C++20, Boost 1.84+, gRPC 1.64
- **Internal Services:** MQ v5.x, Suraksha v2.x, Narad v3.x
- **External:** ODIN Diet API, Omnesys Nest API, NSE NEAT API, BSE BOLT API

## SLOs

| Metric | Target |
|--------|--------|
| Order routing latency (p99) | < 5 ms |
| Execution report processing latency | < 1 ms |
| Order throughput | 10,000 orders/sec |
| Trade reconciliation accuracy | 100% |
| Availability | 99.99% |
