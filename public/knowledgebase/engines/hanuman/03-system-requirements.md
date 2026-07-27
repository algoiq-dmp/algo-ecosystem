# 03 — System Requirements

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | Intel Xeon Gold 6426Y (16 cores) | Intel Xeon Platinum 8468H (48 cores) |
| RAM | 32 GB DDR5-4800 ECC | 64 GB DDR5-4800 ECC |
| Storage | 2x 480 GB SSD (RAID-1) | 2x 960 GB NVMe (RAID-1) |
| Network | 10 GbE | 25 GbE (for low-latency MQ communication) |

## Software Requirements

| Component | Version |
|-----------|---------|
| OS | RHEL 9.x / Rocky Linux 9.x |
| Language | C++20 |
| Compiler | GCC 13.2+ |
| Vega Framework | v4.2+ |
| MQ Client | liblakshmi-mq-cpp v5.x |
| Boost | 1.84.0 |
| gRPC | 1.64.0 |
| RocksDB | 9.4.0 (local state store) |
| Risk Engine | Lakshmi Risk v3.x |

## Performance Thresholds

| Metric | Threshold |
|--------|-----------|
| Signal-to-order latency (p99) | < 100 us |
| Spread calculation frequency | Every tick (up to 1M/sec) |
| Max concurrent strategies | 500 |
| Strategy load time | < 5 seconds |
| Risk check latency | < 50 us |

## Compliance

- SEBI algorithmic trading guidelines (audit trail, risk controls)
- Exchange-specific algo approval requirements (NSE, BSE algo ID registration)
- ISO 27001:2022 information security controls
- Data localization compliance
