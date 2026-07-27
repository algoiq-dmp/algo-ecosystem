# 03 — System Requirements

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2x Intel Xeon Gold 6426Y (16 cores) | 2x Intel Xeon Platinum 8468H (48 cores) |
| RAM | 64 GB DDR5-4800 ECC | 128 GB DDR5-4800 ECC |
| Storage | 2x 960 GB SSD (RAID-1) | 4x 1.92 TB NVMe (RAID-10) |
| Network | 2x 25 GbE (to exchange network) | 2x 100 GbE |
| Network (management) | 1x 10 GbE | 1x 10 GbE |

## Software Requirements

| Component | Version |
|-----------|---------|
| OS | RHEL 9.x / Rocky Linux 9.x |
| Language | C++20 |
| Compiler | GCC 13.2+ |
| gRPC | 1.64.0 |
| PostgreSQL Client | libpq 16.x |
| Boost | 1.84.0 |
| MQ Client | liblakshmi-mq-cpp v5.x |

## External API Requirements

| API | Provider | Certification |
|-----|----------|---------------|
| ODIN Diet API | Financial Technologies | FT-DIET-2026-CERT |
| Omnesys Nest API | Omnesys (Refinitiv) | OM-NEST-2025-CERT |
| NSE NEAT API | NSE | NSE-NEAT-2026-VENDOR |
| BSE BOLT API | BSE | BSE-BOLT-2026-API |

## Performance Thresholds

| Metric | Threshold |
|--------|-----------|
| Order routing latency (p99) | < 5 ms |
| Execution report processing latency | < 1 ms |
| Order throughput | 10,000/sec |
| Concurrent orders in-flight | 50,000 |
| Modification/cancel latency | < 5 ms |

## Compliance

- SEBI Algorithmic Trading Framework (order tagging, audit trail, RMS)
- Exchange-specific order entry compliance (NSE, BSE, MCX, NCDEX)
- ISO 27001:2022 for information security
- Data localization: all order and trade data stays within India
