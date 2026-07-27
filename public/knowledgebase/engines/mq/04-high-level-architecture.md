# 04 — High-Level Architecture

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Cluster Architecture

MQ operates as a multi-node cluster where each node (broker) manages a subset of topic partitions. The cluster uses the Raft consensus algorithm for leader election, log replication, and cluster membership changes.

## Broker Internal Architecture

Each broker node consists of the following layers:

### Network Layer
- TCP server accepting producer and consumer connections on port 9092
- Inter-broker replication connections on port 9093
- gRPC admin server on port 9095
- Zero-copy socket I/O using `io_uring` for Linux kernel 5.14+

### Protocol Layer
- Binary protocol with message framing: 4-byte length prefix + payload
- Protobuf-encoded metadata headers
- Compression: Zstandard (default) or Snappy per message batch
- Authentication handshake using Suraksha mTLS certificates

### Routing Layer
- Partition assignment via consistent hashing
- Producer routing: partition key hash or round-robin
- Consumer group coordinator with sticky partition assignment
- Request/response correlation using 64-bit correlation IDs

### Storage Layer (RocksDB)
- Commit log: sequential write-ahead log with periodic compaction
- Index: offset-to-position mapping for fast consumer seeks
- Consumer offsets: per-consumer-group, per-partition offset tracking
- Schema registry cache: in-memory cache of topic schemas

### Replication Layer (Raft)
- Leader election per partition (not per broker)
- Log replication from leader to followers
- Quorum-based commit: message committed when majority acknowledges
- Follower catch-up via snapshot transfer for lagging replicas

## Data Path

```
Producer ──► TCP (9092) ──► Network Layer
                                │
                          Routing Layer
                                │
                          Storage Layer (RocksDB WAL)
                            │         │
                  Local Commit    Replication (Raft)
                            │         │
                  Consumer Fetch   Followers

Consumer ◄── TCP (9092) ◄── Network Layer
```

## Cluster Metadata Management

MQ uses a dedicated Raft group for cluster metadata:
- Topic configuration (partition count, replication factor, retention)
- Broker membership and liveness
- Partition leader assignments
- Consumer group membership

This metadata Raft group runs on the first 3 brokers (odd number for quorum). Regular message partitions use their own Raft groups spanning all brokers.

## Inter-Broker Communication

Brokers communicate via a dedicated, high-speed network path:
- Heartbeats: every 100ms
- Replication data: continuous streaming
- Metadata updates: on change
- Consumer offset sync: every 5 seconds
