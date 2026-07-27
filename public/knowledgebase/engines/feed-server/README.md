# Feed Server — Exchange Lease Line Ingestion

> **Sub-component of:** Lakshmi  
> **Version:** v2.8.0  
> **Owner:** Market Data  
> **Last Updated:** 2026-07-25

## Overview

The Feed Server is the primary exchange lease line ingestion engine within the Lakshmi ecosystem. It establishes and maintains dedicated leased-line connections to multiple exchange gateways (NSE, BSE, MCX, NCDEX) for receiving real-time market data feeds including ticks, snapshots, order books, and trade confirmations.

## Key Capabilities

- Multi-exchange lease line connectivity over dedicated cross-connects
- TCP/UDP multicast feed ingestion with automatic failover between primary and secondary lines
- Protocol parsers for NSE (CM/FO/CD), BSE (CM/FO), MCX, and NCDEX feed formats
- Feed normalization — converts exchange-native formats into the Lakshmi canonical message schema
- In-memory ring buffer for sub-millisecond latency access to recent ticks
- Feed health monitoring with heartbeat detection and gap tracking
- Sequence number gap recovery via TCP replay channels
- Bandwidth throttling and backpressure management for downstream consumers

## Directory Structure

```
feed-server/
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
| [01-overview](01-overview.md) | System overview and context |
| [04-high-level-architecture](04-high-level-architecture.md) | Architectural design |
| [09-api-reference](09-api-reference.md) | Internal and external APIs |
| [11-configuration](11-configuration.md) | Configuration reference |
| [18-failover](18-failover.md) | Failover and HA strategy |
| [21-troubleshooting](21-troubleshooting.md) | Common issues and resolutions |

## Dependencies

- **Hardware:** Dedicated NICs for exchange lease lines (Intel X710 10GbE)
- **OS:** RHEL 9.x / Rocky Linux 9.x
- **Runtime:** C++20, Boost 1.84+, DPDK 23.11
- **Internal Services:** Lakshmi Core v4.x, Narad v3.x, Suraksha v2.x
- **External:** Exchange lease line circuits (NSE, BSE, MCX, NCDEX)

## SLOs

| Metric | Target |
|--------|--------|
| Feed latency (ingest → publish) | < 50 µs p99 |
| Feed availability | 99.995% |
| Gap recovery time | < 30 seconds |
| Throughput capacity | 1M msgs/sec per feed |
