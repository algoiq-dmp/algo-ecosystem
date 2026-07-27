# 02 — Business Requirements

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## BR-1: 99.999% Availability

MQ MUST provide five-nines availability (no more than 5.26 minutes downtime per year) during trading hours and extended trading windows (08:00-17:00 IST). The cluster must continue operating with zero message loss during single-node failures.

## BR-2: Sub-5ms End-to-End Latency

The p99 end-to-end message latency (from producer `publish()` call to consumer `consume()` delivery) MUST be under 5 milliseconds under sustained load of 5M msgs/sec.

## BR-3: Ordered Delivery Per Partition

Messages within a single partition MUST be delivered to consumers in the exact order they were published. Ordering across partitions within a topic is not guaranteed and not required.

## BR-4: At-Least-Once Delivery

Every published message MUST be delivered to all subscribed consumer groups at least once, even in the event of broker failures, network partitions, or consumer restarts. Exactly-once delivery is not a current requirement but is planned for v6.0.

## BR-5: Message Durability

All acknowledged messages MUST be persisted to disk (RocksDB commit log) and replicated to at least N followers (where N = `replication.factor - 1`) before acknowledging to the producer.

## BR-6: Multi-DC Mirroring

Topics marked as `cross-dc` MUST be mirrored in near-real-time between Mumbai DC and Navi Mumbai DC. Mirroring lag MUST be under 100ms p99 for steady-state operation.

## BR-7: Schema Enforcement

All topics MUST have a registered schema (Avro or Protobuf). The broker MUST reject messages that do not conform to the registered schema. This prevents malformed messages from entering the ecosystem.

## BR-8: Message Retention

Messages MUST be retained for a configurable duration (default: 7 days for market data topics, 30 days for order/execution topics). Retention is enforced per partition.

## BR-9: Consumer Offset Management

Consumer offsets MUST be durable and survive broker restarts. Consumer groups MUST be able to rebalance automatically when consumers join or leave.

## BR-10: Admin API

All cluster operations (topic creation, partition expansion, replica reassignment, consumer group management) MUST be available via a gRPC Admin API and the `mqctl` CLI tool.
