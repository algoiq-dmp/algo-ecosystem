# 23 — Roadmap

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Version History and Future Plans

### v5.1.3 (Current — Q2 2026)

- Zstandard compression for message batches (replaces Snappy)
- `io_uring` network backend for Linux 5.14+ (25% throughput improvement)
- Suraksha v2 integration (KMS-backed RocksDB encryption)
- Schema registry compatibility mode enforcement
- Sticky consumer partition assignment (reduces rebalance disruption)
- gRPC Admin API with reflection support

### v5.2.0 (Planned — Q3 2026)

**Theme: Operational Maturity**

- Tiered storage: automatic offload of cold segments to object storage (MinIO/S3)
- Topic-level quotas: per-topic produce/consume rate limits
- Request tracing: W3C trace context propagation through MQ
- Consumer lag monitoring via Narad with ML-based anomaly detection
- Dynamic partition reassignment without topic downtime
- Schema registry: support for JSON Schema in addition to Avro/Protobuf

### v5.3.0 (Planned — Q1 2027)

**Theme: Multi-Region and Compliance**

- Active-active cross-DC replication (currently active-passive)
- Exactly-once semantics (idempotent produce + transactional consume)
- Message-level encryption with consumer-specific keys
- Federated schema registry across DCs
- Enhanced audit: per-message digital signatures for regulatory compliance

### v6.0.0 (Planned — H2 2027)

**Theme: Cloud-Native Architecture**

- Container-native deployment mode with Kubernetes operator
- Raft group rebalancing based on broker load (partition auto-balancing)
- gRPC streaming-based wire protocol (alternative to binary protocol)
- Multi-tenancy with namespace isolation
- Dead letter queues for poison message handling
- Schema evolution with automatic consumer migration

## Backlog

| Feature | Effort | Priority |
|---------|--------|----------|
| Message TTL per message (not just per topic) | M | Medium |
| Compaction topic support (key-based retention) | L | High |
| WebSocket proxy for browser-based consumers | M | Low |
| Custom partitioner plugins | S | Low |
| Broker auto-scaling (add/remove brokers at runtime) | XL | Medium |

## Deprecation Notices

- **Snappy compression:** Deprecated in v5.1.3; will be removed in v5.3.0. Migrate to Zstandard.
- **Binary protocol v1:** Deprecated in v5.0.0; support ends in v6.0.0. Migrate to v2 protocol (adds correlation ID and header compression).
- **RocksDB 8.x:** MQ v5.1.x uses RocksDB 9.4.0. RocksDB 8.x data format is forward-compatible but not backward-compatible after upgrade.
