# 03 — System Requirements

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2x Intel Xeon Gold 5418Y (24 cores) | 2x Intel Xeon Platinum 8468H (48 cores) |
| RAM | 64 GB DDR5-4800 ECC | 128 GB DDR5-4800 ECC |
| Network | 2x Intel X710 10GbE (SR-IOV) | 4x Intel E810 25GbE (SR-IOV) |
| Storage | 2x 480 GB NVMe (RAID-1) | 4x 1.92 TB NVMe (RAID-10) |
| HugePages | 32 GB (1G pages) | 64 GB (1G pages) |

## Software Requirements

| Component | Version |
|-----------|---------|
| OS | RHEL 9.4 / Rocky Linux 9.4 |
| Kernel | 5.14.0-427 (RT kernel for latency-sensitive deployments) |
| Compiler | GCC 13.2+ / Clang 18+ |
| Language | C++20 |
| DPDK | 23.11 LTS |
| Boost | 1.84.0 |
| gRPC | 1.64.0 |
| Prometheus C++ Client | 1.2.1 |
| SPDLOG | 1.13.0 |

## Network Requirements

- Dedicated cross-connect fiber from exchange demarcation point to server NIC
- Minimum 1 Gbps dedicated bandwidth per exchange feed
- Jumbo frames (MTU 9000) enabled on all feed-facing interfaces
- Bidirectional multicast enabled on exchange-facing VLANs
- Static ARP entries for exchange gateway IPs (no dynamic ARP)
- Low-latency switch configuration (cut-through, no STP on feed ports)

## Performance Thresholds

| Metric | Threshold |
|--------|-----------|
| Ingest-to-publish latency (p99) | < 50 us |
| Ingest-to-publish latency (p999) | < 100 us |
| Throughput per feed | > 1M msgs/sec |
| Sequence gap detection | < 10 ms |
| Gap recovery (100K msgs) | < 30 sec |
| CPU utilization (steady state) | < 60% |
| Memory (ring buffer) | < 16 GB |

## Compliance

- SEBI Technical Advisory Committee guidelines for algo trading infrastructure
- Exchange colocation facility access policies (NSE, BSE, MCX)
- ISO 27001:2022 for information security controls
- Data localization: all feed data stays within India
