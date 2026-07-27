# 25 — Glossary

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## A

**ACK (Acknowledgment):** A response from the broker confirming that a produced message has been received and (depending on ACK level) replicated.

**ACL (Access Control List):** Rules defining which principals can perform which operations on which resources.

**AppendEntries:** The Raft RPC used by leaders to replicate log entries to followers.

## B

**Broker:** A single MQ server process. Multiple brokers form a cluster.

## C

**Cluster:** A group of MQ brokers working together to provide a distributed pub/sub messaging system.

**Commit Log:** An append-only log of all messages published to a partition, stored on disk.

**Compaction:** A process that merges sorted files in RocksDB to reclaim space and improve read performance.

**Consumer:** An application that reads messages from MQ topics.

**Consumer Group:** A logical grouping of consumers that collectively consume messages from a topic, with each partition delivered to exactly one consumer in the group.

**Controller:** The broker responsible for managing partition leader assignments and ISR membership.

**Correlation ID:** A 64-bit identifier used to match requests with responses in the MQ binary protocol.

## D

**DEK (Data Encryption Key):** A symmetric key used to encrypt message data at rest.

## F

**Follower:** A broker that maintains a replica of a partition's commit log but does not serve client requests for that partition.

## G

**Group Coordinator:** The broker responsible for managing a specific consumer group (membership, offset commits, rebalances).

## H

**High Watermark:** The offset up to which all messages have been fully committed (replicated to quorum). Consumers can only read up to the high watermark.

## I

**ISR (In-Sync Replica):** The set of replicas (leader + followers) that are fully caught up with the leader's log. Only ISR members can become leader.

**io_uring:** A Linux kernel interface for asynchronous I/O that reduces syscall overhead compared to epoll/read/write.

## K

**KEK (Key Encryption Key):** A key stored in HSM used to encrypt/decrypt DEKs.

## L

**Leader:** The broker that handles all produce and fetch requests for a given partition.

**Leader Election:** The process by which Raft selects a new leader when the current leader fails.

**Log Segment:** A single file within a partition's commit log, typically 1 GB in size.

## M

**Mirroring:** The process of replicating topic data from one MQ cluster to another (typically cross-DC).

**mTLS:** Mutual TLS — both client and server authenticate each other using certificates.

## O

**Offset:** A monotonically increasing integer that uniquely identifies a message within a partition.

**Offset Commit:** The action of a consumer recording its current position in a partition so it can resume from that point.

## P

**Partition:** An ordered, immutable sequence of messages within a topic. Partitions enable parallel processing.

**Principal:** An authenticated entity (user or service) identified by a SPIFFE ID.

**Producer:** An application that publishes messages to MQ topics.

## Q

**Quorum:** A majority of the Raft group members. Required to commit log entries and elect a leader.

## R

**Raft:** A consensus algorithm used by MQ for leader election and log replication.

**Rebalance:** The process of reassigning partitions to consumers within a consumer group.

**Retention:** The policy governing how long messages are kept in a partition (time-based or size-based).

**RocksDB:** An embedded key-value storage engine used by MQ for commit logs and offset tracking.

## S

**Schema Registry:** A service that stores and enforces message schemas (Protobuf/Avro) for MQ topics.

**SPIFFE:** Secure Production Identity Framework for Everyone — a standard for service identity in distributed systems.

**Sticky Assignment:** A partition assignment strategy that minimizes partition movement during consumer group rebalances.

## T

**Topic:** A named category to which messages are published and from which messages are consumed.

## Z

**Zstandard (Zstd):** A fast compression algorithm providing high compression ratios, used for MQ message batches.
