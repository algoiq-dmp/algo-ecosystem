# 24 — Release Notes

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Release v5.1.3 — "io_uring Fast Path"

**Release Date:** 2026-06-01
**Build:** `mqd-5.1.3+build.892`
**Git Tag:** `mq-v5.1.3`

### Highlights

- `io_uring` network backend delivering 25% throughput improvement
- Zstandard compression replacing Snappy (40% better compression ratio)
- Suraksha v2 KMS integration for RocksDB encryption-at-rest
- Sticky consumer assignment eliminating unnecessary partition movement

### New Features

- **io_uring Network Backend:** New I/O path using Linux io_uring for both TCP and disk I/O. Reduces syscall count by 60% compared to epoll + read/write. Enabled by default on kernel 5.14+.
- **Zstandard Compression:** Message batches now compressed with Zstandard level 3. 40% smaller on wire compared to Snappy, with comparable CPU overhead.
- **KMS-backed Encryption:** RocksDB data encrypted with Suraksha-managed AES-256 keys. Keys rotated every 24 hours.
- **Sticky Assignment:** Consumer group partitions now assigned using sticky strategy — partitions stay with the same consumer across rebalances unless consumers join/leave.
- **Schema Compatibility Checks:** Schema registry now enforces compatibility modes (BACKWARD, FORWARD, FULL) on registration.

### Improvements

- Consumer rebalance time reduced by 40% (from ~8s to ~5s for 100 partitions)
- Raft snapshot transfer speed improved 3x using incremental transfer
- Produce throughput improved 25% under high-load scenarios
- Admin API now supports gRPC server reflection (for tools like grpcurl)

### Bug Fixes

- **MQ-4120:** Raft leader step-down during log compaction causing unnecessary elections (fixed: heartbeat transmitted during compaction)
- **MQ-4102:** Consumer offset commit race condition causing offset regression after rebalance (fixed: atomic CAS for offset writes)
- **MQ-4089:** Memory leak in long-lived producer connections (> 30 days) (fixed: connection metadata cleanup on close)
- **MQ-4077:** Schema registry returning stale schema on concurrent registration (fixed: read-after-write consistency in registry cache)
- **MQ-4061:** Cross-DC mirroring dropping messages on topic with > 100 partitions (fixed: partition dispatcher ring buffer overflow handling)

### Breaking Changes

- **Compression:** Snappy-compressed topics must be migrated to Zstandard. The broker will continue to read Snappy for one more minor version (v5.2.x).
- **Protocol:** Minimum client protocol version is now v2 (v1 clients rejected with descriptive error).
- **ACL format:** ACL YAML format updated; old format still supported but deprecated.

### Migration Guide

1. Stop all producers (during maintenance window)
2. Wait for consumer lag to reach 0
3. Upgrade brokers (rolling upgrade)
4. Reconfigure producers to use Zstandard compression
5. Restart producers
6. Validate end-to-end flow

### Known Issues

- **MQ-4131:** io_uring may fail on kernels with `IORING_SETUP_SQPOLL` disabled (certain hardened kernel configs). Workaround: set `mqd.network.backend: epoll` in broker.yaml.
- **MQ-4135:** Cross-DC mirror lag may spike to 500ms during mass topic creation (> 50 topics simultaneously). Workaround: batch topic creation into groups of 10.
