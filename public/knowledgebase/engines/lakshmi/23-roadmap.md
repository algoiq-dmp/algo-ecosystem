# 23. Roadmap

**Version:** 2.1.0 (Current)
**Owner:** Product Management / Platform Engineering
**Last Updated:** 2026-07-24

---

## Overview

This document outlines the Lakshmi product roadmap, including planned features, architectural evolution, and technical debt items. Roadmap items are prioritised by business impact and engineering feasibility. Timelines are indicative and subject to change based on ecosystem priorities.

---

## Release Plan

### v2.1.0 — Current (Q2 2026)
**Released:** 2026-06-15

- Redis Sentinel support for automated Redis failover
- Dynamic configuration sync via Narad
- Suraksha Sentinel threat detection integration
- Improved WebSocket connection management (graceful drain, jitter reconnect)
- Parikshak certification pipeline (automated quality gate)

See [24. Release Notes](24-release-notes.md) for full details.

---

### v2.2.0 — Kafka Migration (Q3 2026, Planned)

**Status:** In Development

| Epic | Description | Owner |
|---|---|---|
| **Kafka Core** | Replace RabbitMQ with Apache Kafka as the primary message broker | Data Engineering |
| **Topic = Kafka Topic** | Map Lakshmi topics 1:1 to Kafka topics with configurable partition count | Data Engineering |
| **Consumer Groups** | Replace fanout queues with Kafka consumer groups for horizontal subscriber scaling | Data Engineering |
| **Offset Management** | Per-consumer offset tracking; replay from any offset for catch-up subscribers | Data Engineering |
| **Exactly-Once Semantics** | Idempotent producer + transactional consumer for guaranteed delivery | Data Engineering |
| **Schema Registry** | Avro schema enforcement; message compatibility checks (backward/forward/full) | Data Engineering |
| **Kafka Streams** | Real-time stream processing for derived data (moving averages, VWAP, spreads) | Data Engineering |
| **Migration Tooling** | Dual-write to RabbitMQ + Kafka during transition; zero-downtime cutover script | Platform Engineering |
| **Backward Compatibility** | RabbitMQ continues as secondary broker for legacy subscribers during migration window | Platform Engineering |

**Migration Timeline:**
1. **Week 1-2:** Kafka cluster deployment (3 brokers) + Lakshmi dual-write
2. **Week 3-4:** Internal subscribers migrated to Kafka consumers
3. **Week 5:** External subscribers notified; migration window opens
4. **Week 6-8:** Legacy RabbitMQ consumers migrated; RabbitMQ decommissioned
5. **Week 9:** RabbitMQ removed; Kafka-only architecture

---

### v2.3.0 — GPU-Accelerated Feed Processing (Q4 2026, Planned)

**Status:** Design Phase

| Epic | Description | Owner |
|---|---|---|
| **GPU Feed Handler** | Offload market data parsing and normalisation to GPU (CUDA/OpenCL) | Data Engineering |
| **Batch Processing** | Process 1,000+ tick packets in parallel on GPU; 10× throughput improvement | Data Engineering |
| **FPGA Option** | Evaluate FPGA (Xilinx Alveo) for ultra-low-latency feed handling (<100μs) | Hardware Engineering |
| **CUDA Worker Pool** | GPU worker pool with dynamic allocation; fallback to CPU if GPU unavailable | Data Engineering |
| **Hardware Requirements** | NVIDIA A10 or A100 GPU; PCIe 4.0 x16; CUDA 12.x toolkit | Infrastructure |
| **Performance Target** | 1 million messages/sec on single GPU node; publish latency p99 <3ms | Data Engineering |

**Key Design Decisions:**
- GPU used only for feed ingestion and parsing; routing and delivery remain CPU-based
- Batch size dynamically adjusted based on GPU utilisation and latency feedback
- Graceful fallback to CPU-only mode (no GPU = same throughput as v2.2)

---

### v2.4.0 — Horizontal WebSocket Scaling (Q1 2027, Planned)

**Status:** Backlog

| Epic | Description | Owner |
|---|---|---|
| **WS Gateway** | Dedicated WebSocket gateway layer separate from Lakshmi core | Platform Engineering |
| **Session Affinity** | Sticky sessions via Narad load balancer; same Lakshmi node for subscription lifetime | Platform Engineering |
| **Connection Migration** | Transparent connection migration when a Lakshmi node drains or fails | Platform Engineering |
| **Client SDK v2** | Auto-reconnect with session resume; multi-topic subscription; built-in pong handler | SDK Team |
| **10K Connections** | Scale to 10,000 concurrent WebSocket connections per gateway node | Platform Engineering |
| **WS over HTTP/2** | Evaluate WebSocket over HTTP/2 for multiplexed streams and header compression | Research |

---

### v3.0.0 — Cloud-Native Lakshmi (Q3 2027, Planned)

**Status:** Research & Exploration

| Epic | Description | Owner |
|---|---|---|
| **Kubernetes Native** | Lakshmi as a Kubernetes operator; CRDs for Topic, Queue, Subscriber | Platform Engineering |
| **Auto-Scaling** | HPA (Horizontal Pod Autoscaler) based on Kafka consumer lag and CPU | Platform Engineering |
| **Multi-Cloud** | Deploy on AWS (MSK), GCP (Confluent), Azure (Event Hubs) with Terraform modules | Infrastructure |
| **Service Mesh** | Istio/Envoy sidecar for mTLS, traffic shifting, and observability without Lakshmi changes | Platform Engineering |
| **Serverless Subscribers** | Lambda/Cloud Run subscribers that auto-scale with topic volume | Platform Engineering |
| **Global Data Mesh** | Cross-region Kafka mirroring; Lakshmi topics replicated Mumbai ↔ Singapore ↔ London | Data Engineering |
| **Market Data Lake** | All Lakshmi messages archived to S3/GCS in Parquet format; Athena/BigQuery queryable | Data Engineering |
| **Chaos Engineering** | Integrated chaos testing (Litmus/Gremlin); automated resilience verification | SRE |

---

## Technical Debt

### Active Items

| ID | Item | Priority | Effort | Target |
|---|---|---|---|---|
| TD-001 | **RabbitMQ → Kafka migration** (entire codebase references AMQP) | High | XL | v2.2 |
| TD-002 | **Callback-based to async/await** refactoring in Topic Manager (legacy Promise chains) | Medium | M | v2.2 |
| TD-003 | **Mocha → Vitest migration** for test suite (Vitest is 3× faster; better ESM support) | Medium | L | v2.2 |
| TD-004 | **Hardcoded topic names** in integration tests (should use config fixture) | Low | S | v2.3 |
| TD-005 | **Config validation** lacks JSON Schema; ad-hoc validation in code | Medium | M | v2.3 |
| TD-006 | **WebSocket message format** inconsistent (snake_case vs camelCase) between v1 and v2 SDKs | Medium | M | v2.4 |
| TD-007 | **InfluxDB 1.x → 2.x migration** (InfluxQL → Flux; 1.x EOL) | Low | M | v3.0 |
| TD-008 | **Static Prometheus targets** → Service discovery via Narad (dynamic target registration) | Low | S | v3.0 |

### Resolved (v2.1)

| ID | Item | Resolution |
|---|---|---|
| TD-000 | **Node.js v18 → v20 migration** | Completed in v2.1.0; all deps updated |
| — | **Redis cluster mode** (standalone → Sentinel) | Completed in v2.1.0 |
| — | **JWT cache unbounded growth** | LRU cache with 5-min TTL added in v2.1.0 |

---

## Architecture Evolution

### Current (v2.1)

```
[Exchange] → [Ganesh/Surya] → [RabbitMQ] → [Lakshmi] → [WebSocket] → [Clients]
                                                ↓
                                            [Redis Cache]
```

- **Broker:** RabbitMQ (AMQP 0-9-1)
- **Cache:** Redis Standalone + Sentinel
- **State:** Per-node; no shared state
- **Scaling:** Topic partitioning (manual)

### Target (v3.0)

```
[Exchange] → [GPU Feed Handler] → [Kafka Cluster] → [Lakshmi K8s Operator]
                                                         ↓
                                              ┌──────────┼──────────┐
                                         [WebSocket GW]  [REST API]  [Cloud Functions]
                                              ↓              ↓              ↓
                                          [Clients]      [Pollers]    [Serverless Subscribers]
                                                         ↓
                                                   [Data Lake (Parquet on S3)]
```

- **Broker:** Apache Kafka (≥3.5)
- **Cache:** Redis Cluster + Redisearch for time-series queries
- **State:** Kafka-backed (offsets, consumer groups) + Redis (hot data)
- **Scaling:** Kubernetes HPA (auto-scale) + topic auto-partitioning
- **Deployment:** Kubernetes operator; Helm chart; Terraform modules for infra
- **Observability:** OpenTelemetry traces; Prometheus + Thanos for long-term metrics

---

## Feature Backlog (Unprioritised)

The following items are logged for future consideration but not yet scheduled to a release:

| Feature | Description | Requested By |
|---|---|---|
| **Binary Protocol (MsgPack)** | MessagePack serialisation for lower bandwidth and faster parsing vs JSON | Performance Team |
| **gRPC Stream** | gRPC bidirectional streaming as alternative to WebSocket for server-to-server | Backend Teams |
| **Multi-Tenant Isolation** | Tenant-level topic namespace isolation (tenant-a/NFO_EQ, tenant-b/NFO_EQ) | Enterprise Clients |
| **Message Replay API** | Time-range based replay (`GET /replay?topic=NFO_EQ&from=2026-01-01&to=2026-01-02`) | Analytics Team |
| **Scheduled Topics** | Pre-announced OHLC bar publishing at known intervals (reduce latency jitter) | Strategy Factory |
| **MQTT Support** | MQTT protocol for IoT and mobile clients (low-bandwidth use cases) | Mobile Team |
| **Pulsar Evaluation** | Compare Apache Pulsar as Kafka alternative (built-in multi-tenancy, geo-replication) | Architecture Board |
| **Order Book Engine** | In-memory order book reconstruction from tick stream; publish consolidated book | Quant Team |
| **Data Quality Checks** | Schema validation; outlier detection; stale data alerting at ingest | Data Quality Team |
| **Plugin System** | Third-party plugins for custom message transformation, enrichment, filtering | Partner Ecosystem |
| **IPv6 Support** | Full IPv6 compatibility for all interfaces (HTTP, MQ, WebSocket, Redis) | Network Team |
| **ARM64 Builds** | Native aarch64 binaries for Graviton/AWS deployment (cost optimisation) | Infrastructure |

---

## Deprecation Schedule

| Feature | Status | Deprecated In | Removal In | Replacement |
|---|---|---|---|---|
| **RabbitMQ Broker** | Deprecated | v2.2 | v2.3 | Apache Kafka |
| **HTTP Polling API** | Deprecated | v2.4 | v3.0 | WebSocket streaming (lower latency; bidirectional) |
| **Mocha Test Suite** | Deprecated | v2.2 | v2.3 | Vitest (faster; native ESM) |
| **InfluxDB 1.x** | Deprecated | v3.0 | v3.1 | InfluxDB 2.x (Flux query language) |
| **Static Prometheus Targets** | Deprecated | v3.0 | v3.1 | Narad service discovery |
| **v1 Client SDK** | Deprecated | v2.4 | v3.0 | v2 Client SDK (session resume; reconnect improvements) |
| **Node.js 20** | Supported | — | Node.js 22 LTS (Oct 2025+) | Node.js 22 LTS |
| **TLS 1.2 Fallback** | Deprecated | v3.0 | v3.1 | TLS 1.3 only |

---

## How to Contribute to the Roadmap

1. **Feature Requests:** Submit via the internal Jira project `LAKSHMI` with the component `roadmap`
2. **Technical Debt:** Tag with label `tech-debt` and priority `P0-P3`
3. **Architecture Proposals:** RFC document with problem statement, proposed solution, alternatives considered, and impact analysis
4. **Quarterly Review:** Roadmap reviewed in the first week of each quarter by the Architecture Board

---

## Contact

| Role | Contact |
|---|---|
| Product Owner | `lakshmi-pm@algo-iq.local` |
| Tech Lead | `lakshmi-tech-lead@algo-iq.local` |
| Architecture Board | `arch-board@algo-iq.local` |
| Jira Project | `https://jira.algo-iq.local/projects/LAKSHMI` |
