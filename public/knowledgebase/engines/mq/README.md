# MQ — Primary Pub/Sub Message Broker

> **Sub-component of:** Lakshmi  
> **Version:** v5.1.3  
> **Owner:** Infrastructure  
> **Last Updated:** 2026-07-25

## Overview

MQ is the central publish/subscribe message broker for the Lakshmi ecosystem. It provides high-throughput, low-latency message distribution between all components — Feed Server to Strategy Engines, Strategy Engines to ODIN, Narad events to dashboards, and everything in between. MQ operates as a clustered, partitioned, replicated log-based messaging system.

## Key Capabilities

- Clustered multi-node deployment with automatic leader election (Raft consensus)
- Topic-based pub/sub with partition-level ordering guarantees
- At-least-once delivery with consumer offset tracking
- Zero-copy message delivery via Unix domain sockets and shared memory
- Schema registry with Avro/Protobuf schema enforcement per topic
- Consumer group load balancing with sticky partition assignment
- Message retention policies: time-based (TTL) and size-based
- Mirrored topics for cross-DC replication
- Built-in metrics and health checks exposed via Prometheus

## Directory Structure

```
mq/
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
| [04-high-level-architecture](04-high-level-architecture.md) | Cluster and broker design |
| [09-api-reference](09-api-reference.md) | Producer/Consumer/Admin APIs |
| [11-configuration](11-configuration.md) | Broker and topic configuration |
| [18-failover](18-failover.md) | Raft election and partition failover |

## Dependencies

- **OS:** RHEL 9.x / Rocky Linux 9.x
- **Runtime:** C++20, Boost 1.84+, gRPC 1.64, RocksDB 9.x
- **Consensus:** Raft (custom C++ implementation)
- **Internal Services:** Narad v3.x for monitoring, Suraksha v2.x for auth and audit

## SLOs

| Metric | Target |
|--------|--------|
| Publish latency (p99) | < 1 ms |
| End-to-end latency (produce → consume, p99) | < 5 ms |
| Availability | 99.999% |
| Throughput per broker node | 10M msgs/sec |
| Partition failover time | < 2 seconds |
