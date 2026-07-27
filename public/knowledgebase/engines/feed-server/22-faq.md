# 22 — FAQ

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## General

**Q: Why does the Feed Server require bare metal instead of VMs or containers?**
A: The sub-50-microsecond latency target cannot be met in virtualized environments due to hypervisor overhead, NIC virtualization latency, and unpredictable scheduling. DPDK kernel bypass requires direct hardware access (SR-IOV VFs). Additionally, colocation facility policies for exchange lease lines mandate dedicated hardware.

**Q: How does the Feed Server handle exchange holidays?**
A: The Feed Server checks the exchange market status feed and enters a PAUSED state during holidays and non-trading hours. No data is ingested. The process remains running and automatically reconnects when the exchange sends the PRE_OPEN status.

**Q: Can I run multiple exchanges on a single server?**
A: Yes. A single server can handle up to 4 exchange feeds, provided it has sufficient CPU cores (minimum 2 per feed pipeline) and NIC ports. See the [Topology](08-topology.md) document for current assignments.

**Q: What happens to the ring buffer during a restart?**
A: The ring buffer is in shared memory (hugetlbfs). On restart, the process re-attaches to the existing buffer. If a clean restart, the buffer content is preserved. If the buffer was corrupted, use `feeddctl ringbuf-clear` before starting.

## Data

**Q: How are corporate actions (splits, bonuses) handled?**
A: The Normalizer maintains a corporate action adjustment table loaded from the exchange instrument master. When a corporate action is effective, the symbol mapping is updated and a `SymbolChangeEvent` is published to MQ. Historical ticks are NOT retroactively adjusted — that is the responsibility of the backtesting framework.

**Q: Are tick data timestamps in exchange time or local time?**
A: Both. `exchange_ts_ns` carries the exchange-assigned timestamp. `ptp_ts_ns` carries the local PTP-synchronized NIC hardware timestamp (accuracy within 1 microsecond of UTC). Consumers should use `ptp_ts_ns` for cross-exchange temporal ordering.

**Q: What is the maximum lookback for historical replay?**
A: 90 days for all segments. Beyond 90 days, data is archived to cold storage (object storage) and requires a manual restore request to the Market Data team.

## Operations

**Q: Can I change the MQ broker address without restarting?**
A: Yes. Use `feeddctl reload mq`. The Feed Server will drain the current MQ socket, reconnect to the new address, and resume publishing.

**Q: How do I add a new exchange segment (e.g., NSE-SLV)?**
A: Add the segment configuration to `config.yaml`, update the symbol master cache with `feeddctl reload symbols`, and restart the affected parser component via `feeddctl restart-parser --exchange NSE --segment SLV`.

**Q: What is the procedure for adding a new instrument (IPO listing)?**
A: No manual action is needed. The instrument master sync at 08:00 IST daily will pick up new symbols automatically. The new symbol will be available for trading from market open.

## Troubleshooting

**Q: Why do I see duplicate sequence numbers after a failover?**
A: During failover, both primary and standby may publish the same messages for a brief overlap window (typically < 1ms). Downstream consumers must deduplicate by `global_seq`. This is by design and ensures zero data loss.

**Q: The latency is spiking every few seconds — what causes this?**
A: Likely causes are (a) CPU frequency scaling (ensure `performance` governor via `cpupower frequency-set -g performance`), (b) kernel threads on isolated cores (verify `isolcpus` kernel parameter), or (c) SMI (System Management Interrupt) from BIOS — check with `turbostat`.
