# 22 — FAQ

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## General

**Q: Why build a custom MQ instead of using Kafka or Pulsar?**
A: We evaluated Apache Kafka extensively. While Kafka is excellent, we needed sub-5ms p99 latency with 3x replication in single-DC deployments, which required deeper control over the I/O path, Raft implementation, and zero-copy Unix socket mode. Our custom MQ also integrates natively with Lakshmi's SPIFFE identity model and Suraksha encryption.

**Q: How does MQ ensure ordering?**
A: Ordering is guaranteed **within a partition**. Messages with the same partition key always go to the same partition and are delivered in produce order. Cross-partition ordering is not guaranteed, which is standard for log-based brokers.

**Q: What happens to messages during a partition leader election?**
A: In-flight uncommitted messages are lost (the producer must retry). Committed messages (acknowledged to producer) are retained. Consumers see no gap — they resume from the last committed offset after the new leader is elected.

## Operations

**Q: Can I increase partition count for an existing topic?**
A: Yes, you can increase but not decrease partition count. Be aware that increasing partitions changes the key → partition mapping, which may affect ordering for existing keys. Use `mqctl topic alter --name X --partitions N`.

**Q: What is the maximum message size?**
A: Default is 1 MB (`max.message.bytes`). Messages larger than 1 MB should be split by the producer or stored externally with a reference in MQ. The maximum configurable size is 10 MB.

**Q: How do I purge a topic completely?**
A: Set retention to 1ms, wait for cleanup, then restore original retention:
```bash
mqctl topic alter --name "test.topic" --retention-ms 1
sleep 60
mqctl topic alter --name "test.topic" --retention-ms 604800000
```

## Performance

**Q: Why is my produce latency higher than expected?**
A: Check your `acks` setting. `acks=all` with 3 replicas has ~1.2ms p99 latency due to replication. If you don't need durability, use `acks=1`. Also verify you're connecting to the partition leader (not a follower).

**Q: How much historical data can consumers catch up on?**
A: As much as retained. Default retention is 7 days for market data. A consumer can start from the earliest retained offset and process all historical data within retention limits.

## Reliability

**Q: Can messages be lost?**
A: Messages can be lost if `acks=0` or `acks=1` and leader fails before replication. With `acks=all` and `min.insync.replicas=2`, committed messages are durable against single-broker failure. Uncommitted messages (in-flight during leader failure) may be lost.

**Q: What happens during a DC failover?**
A: The DR cluster takes over. Messages that were in the mirroring pipeline (not yet replicated to DR) may be unavailable until the primary DC recovers. Mirroring lag is typically < 100ms, so the data loss window is small.

## Development

**Q: Can I run a single-node MQ for local development?**
A: Yes. Set `replication_factor: 1` and `min_insync_replicas: 1` when creating topics. Single-node mode disables Raft replication entirely.

```bash
mqd --single-node --port 9092 --admin-port 9095
mqctl topic create --name "dev.topic" --partitions 1 --replication 1
```
