# 03 — System Requirements

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2x Intel Xeon Gold 6426Y (16 cores) | 2x Intel Xeon Platinum 8468H (48 cores) |
| RAM | 128 GB DDR5-4800 ECC | 256 GB DDR5-4800 ECC |
| Storage | 4x 3.84 TB NVMe (RAID-10) | 8x 3.84 TB NVMe (RAID-10) |
| Network | 2x Mellanox ConnectX-6 25GbE | 2x Mellanox ConnectX-7 100GbE |
| Page cache | 64 GB recommended | 128 GB |

## Software Requirements

| Component | Version |
|-----------|---------|
| OS | RHEL 9.4 / Rocky Linux 9.4 |
| Kernel | 5.14.0-427 (with XFS optimizations) |
| Language | C++20 |
| Compiler | GCC 13.2+ |
| RocksDB | 9.4.0 |
| gRPC | 1.64.0 |
| Protobuf | 27.1 |
| Boost | 1.84.0 |
| Zstandard | 1.5.6 |
| Snappy | 1.2.1 |
| Prometheus C++ Client | 1.2.1 |

## Storage Requirements

| Resource | Allocation |
|----------|-----------|
| Commit log partition | 2 TB NVMe (dedicated) per broker |
| Consumer offset storage | 500 GB NVMe per broker |
| Schema registry | 100 GB NVMe per DC |
| OS + binaries | 200 GB SSD |

## Network Requirements

- 25 Gbps minimum inter-broker connectivity (dedicated VLAN)
- Jumbo frames (MTU 9000) on inter-broker network
- 10 Gbps to client networks (Feed Servers, Strategy Engines)
- Low-latency switch configuration (cut-through switching)
- Bidirectional connectivity on ports: 9092 (client), 9093 (inter-broker), 9095 (gRPC admin)
- Redundant network paths (LACP bonding, 2x25GbE)

## Performance Thresholds

| Metric | Threshold |
|--------|-----------|
| Publish latency (p99) | < 1 ms |
| End-to-end latency (p99) | < 5 ms |
| Throughput per broker | > 10M msgs/sec |
| Throughput per cluster (5 brokers) | > 50M msgs/sec |
| Partition failover time | < 2 sec |
| Consumer rebalance time | < 5 sec |
| Disk I/O per broker | > 2 GB/s sequential write |

## Compliance

- SEBI data retention requirements (5 years for trading data)
- ISO 27001:2022 security controls
- Exchange colocation network access policies
- Data localization: all message data stays within Indian data centers
