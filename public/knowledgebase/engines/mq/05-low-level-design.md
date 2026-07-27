# 05 — Low-Level Design

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Wire Protocol

MQ uses a custom binary protocol for client-broker communication to minimize overhead compared to HTTP-based protocols.

### Message Frame

```
[4 bytes: Total Length (uint32 BE)]
[2 bytes: API Key (uint16 BE)]
[2 bytes: API Version (uint16 BE)]
[8 bytes: Correlation ID (uint64 BE)]
[4 bytes: Client ID Length (uint32 BE)]
[N bytes: Client ID (UTF-8)]
[4 bytes: Header Length (uint32 BE)]
[N bytes: Headers (Protobuf)]
[M bytes: Payload]
```

Total overhead per message: 22 + Client ID Length + Header Length bytes.

### API Keys

| Key | Name | Description |
|-----|------|-------------|
| 0 | Produce | Publish messages to a topic |
| 1 | Fetch | Consume messages from a partition |
| 2 | ListOffsets | Query partition offsets |
| 3 | Metadata | Topic and broker metadata |
| 4 | OffsetCommit | Commit consumer offsets |
| 5 | OffsetFetch | Fetch committed offsets |
| 6 | FindCoordinator | Locate consumer group coordinator |
| 7 | JoinGroup | Join a consumer group |
| 8 | Heartbeat | Consumer group heartbeat |
| 9 | SyncGroup | Synchronize group partition assignment |

## Storage Design

### RocksDB Column Families

| Column Family | Key | Value | Purpose |
|---------------|-----|-------|---------|
| `messages` | `{topic}_{partition}_{offset}` | Protobuf message batch | Primary message storage |
| `offsets` | `{topic}_{partition}` | Latest offset (uint64) | High watermark tracking |
| `consumer_offsets` | `{group}_{topic}_{partition}` | Committed offset (uint64) | Consumer position tracking |
| `metadata` | Variable (Protobuf key) | Protobuf value | Topic config, broker state |

### Write Path

1. Producer sends `ProduceRequest` with batch of messages
2. Broker acquires partition write lock (per-partition mutex)
3. Broker appends batch to RocksDB `messages` CF under increasing offsets
4. Broker writes to Raft log (replication to followers)
5. On quorum acknowledgement, broker updates high watermark in `offsets` CF
6. Broker sends `ProduceResponse` with assigned offsets
7. Partition write lock released

### Read Path (Consumer Fetch)

1. Consumer sends `FetchRequest` with partition, start offset, max bytes
2. Broker reads from RocksDB `messages` CF starting at requested offset
3. Broker reads up to `fetch.max.bytes` or partition end
4. Broker sends `FetchResponse` with message batch

### Compaction

RocksDB compaction runs periodically to reclaim space from Tombstones and merge sorted runs:
- Level 0: 256 MB (4 files)
- Level 1: 2.56 GB (10 files)
- Level 2+: 25.6 GB per level
- Compaction style: Level, with periodic full compaction on weekends

## Raft Consensus Implementation

Each partition has a Raft group with:
- **Leader:** The broker that handles all produce/fetch requests for that partition
- **Followers:** Brokers that replicate the leader's log

Raft configuration per partition:
- Election timeout: 150-300ms (randomized)
- Heartbeat interval: 50ms
- Max batch size: 1MB or 1000 messages
- Snapshot threshold: 100M entries or 10GB log size

Leader election uses pre-vote to prevent disruptive elections when a partitioned node rejoins.
