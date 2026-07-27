# 07 — Data Flow

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Publish Flow

```
Producer
    │
    │ liblakshmi-mq-cpp (client library)
    │   - Partition key hash → determine target partition
    │   - Metadata cache → determine partition leader broker
    │   - Batch messages (configured batch size + linger time)
    │   - Compress batch (Zstandard)
    │
    ▼
Broker (Leader for partition)
    │
    │ 1. Validate message against schema registry
    │ 2. Validate message size (max.message.bytes)
    │ 3. Acquire partition lock
    │ 4. Append to RocksDB WAL
    │ 5. Assign monotonic offsets
    │ 6. Replicate to followers (Raft AppendEntries)
    │ 7. Wait for quorum ACK (min.insync.replicas)
    │ 8. Update high watermark
    │ 9. Send ProduceResponse with assigned offsets
    │ 10. Release partition lock
    │
    ▼
Producer receives ACK (offsets assigned)
```

## Consume Flow

```
Consumer (part of Consumer Group)
    │
    │ 1. FindCoordinator → locate group coordinator broker
    │ 2. JoinGroup → register with consumer group
    │ 3. SyncGroup → receive partition assignment
    │ 4. OffsetFetch → get last committed offset
    │
    ▼
Broker (Leader for assigned partition)
    │
    │ FetchRequest(partition, offset, max_bytes)
    │   - Read from RocksDB at offset
    │   - Return batch up to max_bytes
    │
    ▼
Consumer
    │ 1. Process messages
    │ 2. OffsetCommit → commit processed offset
    │ 3. Heartbeat → maintain group membership
    │
    ▼
Broker (Group Coordinator)
    │ Manages group membership
    │ Triggers rebalance on member join/leave/timeout
    │
```

## Consumer Group Rebalance Flow

```
1. Consumer joins or heartbeat timeout detected
2. Group Coordinator initiates rebalance
3. All consumers receive RevokePartitions
4. Consumers flush pending offsets, commit, pause consumption
5. Coordinator computes new assignment (sticky: minimize partition movement)
6. Consumers receive new partition assignment
7. Consumers resume consumption from committed offsets
```

## Cross-DC Mirroring Flow

```
Mumbai DC Broker ──► mq-mirror (Mumbai)
                          │
                          │ reads from source topics
                          │ compresses and batches
                          │ sends over dark fiber (mTLS)
                          ▼
                     mq-mirror (Navi Mumbai)
                          │
                          │ publishes to target topics
                          ▼
                    Navi Mumbai DC Broker
```

The mirror daemon tracks the last mirrored offset per partition and resumes from that point on restart. Mirroring is asynchronous with a configurable target latency (default: 100ms).

## Message Retention and Cleanup

```
Background Thread (runs every 60 seconds)
    │
    ├── For each partition:
    │   ├── Check retention.ms (time-based)
    │   │   └── If log segment end time > retention.ms: mark for deletion
    │   ├── Check retention.bytes (size-based)
    │   │   └── If total partition size > retention.bytes: delete oldest segments
    │   └── Trigger RocksDB compaction on modified CFs
    │
    └── Log cleanup metrics to Prometheus
```
