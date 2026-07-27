# 06 — Components

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Component Inventory

### Core Broker Components

| Component | Binary | Responsibility |
|-----------|--------|----------------|
| `mqd` | `/opt/lakshmi/bin/mqd` | Main broker process |
| `network` | `libmqd_net.so` | TCP server, connection management, framing |
| `router` | `libmqd_router.so` | Topic/partition routing, metadata management |
| `storage` | `libmqd_storage.so` | RocksDB commit log, offset tracking |
| `raft` | `libmqd_raft.so` | Raft consensus for partition replication |
| `coordinator` | `libmqd_coordinator.so` | Consumer group management, rebalancing |

### Management Components

| Component | Binary | Responsibility |
|-----------|--------|----------------|
| `mqctl` | `/opt/lakshmi/bin/mqctl` | CLI administration tool |
| `schema_registry` | `/opt/lakshmi/bin/mq-schema-registry` | Schema storage and enforcement |
| `mirror` | `/opt/lakshmi/bin/mq-mirror` | Cross-DC topic mirroring daemon |
| `mq_metrics` | `libmqd_metrics.so` | Prometheus metrics exporter |

### Client Libraries

| Library | Language | Purpose |
|---------|----------|---------|
| `liblakshmi-mq-cpp` | C++ | Native C++ client (used by Feed Server, Strategy Engines) |
| `lakshmi-mq-python` | Python | Python client (used by research, backtesting) |
| `@lakshmi/mq-js` | Node.js | JavaScript client (used by dashboards) |

## Broker Internal Thread Model

```
Main Thread (I/O event loop, io_uring)
    │
    ├──► Network Thread Pool (4 threads per NUMA node)
    │       ├── accept connections
    │       ├── read/write TCP
    │       └── protocol encode/decode
    │
    ├──► Request Handler Thread Pool (CPU cores / 2)
    │       ├── produce request processing
    │       ├── fetch request processing
    │       └── admin request processing
    │
    ├──► Raft Thread Pool (1 thread per Raft group)
    │       ├── heartbeat timer
    │       ├── log replication
    │       └── snapshot management
    │
    └──► Background Thread Pool (4 threads)
            ├── RocksDB compaction
            ├── log segment cleanup
            ├── metrics aggregation
            └── consumer offset sync
```

## Schema Registry

The Schema Registry enforces message schemas on a per-topic basis:

```
Producer publish → Schema Registry validates → Accept/Reject
```

Schemas are stored as Protobuf `.proto` files or Avro `.avsc` schemas, versioned with compatibility checks (BACKWARD, FORWARD, FULL). The registry ensures no breaking changes are introduced without explicit migration.

### Schema Compatibility Modes

| Mode | Description |
|------|-------------|
| BACKWARD | New schema can read data written by previous schema |
| FORWARD | Previous schema can read data written by new schema |
| FULL | Both backward and forward compatible |
| NONE | No compatibility checks |

## Component Interaction Diagram

```
Producer App ──► liblakshmi-mq-cpp ──► TCP :9092 ──► mqd
                                                          │
mqctl ──► gRPC :9095 ──► mqd (Admin API)                │
                                                          │
mqd ◄──► mqd (Raft replication :9093)                    │
                                                          │
mqd ◄──► mq-schema-registry (gRPC)                       │
                                                          │
mq-mirror ──► mqd (DC1) ──► mqd (DC2)
```
