# 24 — Release Notes

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Release v2.8.0 — "NFMT 2.0 Ready"

**Release Date:** 2026-06-15
**Build:** `feedd-2.8.0+build.1247`
**Git Tag:** `feedd-v2.8.0`

### Highlights

- Full support for NSE NFMT 2.0 protocol (mandatory NSE migration deadline: September 2026)
- DPDK 23.11 LTS with improved PTP hardware timestamping accuracy
- Suraksha v2 integration with Merkle tree-based audit anchoring

### New Features

- **NFMT 2.0 Parser:** New `nse_parser` supporting the 16-byte header format, new message types (SNAPSHOT_5, INSTRUMENT_INFO), and dynamic segment mapping
- **Gap Recovery Timeout:** Per-exchange configurable `max_replay_range` to bound gap recovery attempts
- **Prometheus Histograms:** `feedd_latency_us` histogram with log-scale buckets replacing the old gauge-based reporting
- **Hot Symbol Reload:** `feeddctl reload symbols` for updating symbol master without restart
- **Merkle Audit Anchoring:** Daily Merkle root published to Suraksha blockchain anchoring for tamper-proof audit trail

### Improvements

- Ring buffer slot alignment improved from 128B to 256B for cache-line isolation (reduces false sharing by 40%)
- MQ publish batching increased from 128 to 256 messages per batch (improves throughput 15%)
- DPDK RX descriptor ring default increased from 2048 to 4096 entries
- Log level can now be changed at runtime via `SIGUSR1`
- `feeddctl status` output now includes gap count and last recovery duration

### Bug Fixes

- **FS-2841:** Sequence number wrap-around at `UINT32_MAX` caused false gap detection on BSE feed (fixed: proper wrap-around handling with epoch tracking)
- **FS-2835:** Memory leak in NCDEX parser when handling malformed VarInt lengths (fixed: bounds checking before allocation)
- **FS-2822:** Race condition in ring buffer consumer registration during restart (fixed: atomic registration with compare-and-swap)
- **FS-2810:** PTP timestamp discontinuity after leap second insertion (fixed: leap second smoothing in timestamp reconciliation)
- **FS-2798:** `feeddctl` crash when output pipe is closed (fixed: SIGPIPE handling)

### Breaking Changes

- **Configuration:** `exchanges[].protocol` field now required (previously defaulted to `nfmt_v1`)
- **MQ Topic:** `feed.{exchange}.{segment}.ob` now carries 5-level snapshots instead of 3-level (compatible with LCFM v3 schema)
- **Metrics:** `feedd_latency_p99_us` gauge removed; use `feedd_latency_us` histogram with `quantile(0.99)` in PromQL

### Migration Guide

1. Update `config.yaml` to add `protocol: "nfmt_v2"` for NSE feeds
2. Update Prometheus alert rules to use histogram quantiles
3. Update any custom dashboards using the old latency gauge
4. Schedule deployment during Saturday maintenance window (allow 4 hours)

### Known Issues

- **FS-2859:** NFMT 2.0 `INSTRUMENT_INFO` messages may be delivered out-of-order during the 08:00-09:00 pre-open window. Workaround: `feeddctl reload symbols` at 09:10.
- **FS-2861:** Suraksha Merkle anchoring may fail if the Suraksha anchoring service restarts during EOD computation. Workaround: manual retrigger with `feeddctl anchor --date YYYY-MM-DD`.

### Dependencies Updated

| Dependency | From | To |
|------------|------|----|
| DPDK | 22.11.3 | 23.11.2 |
| Boost | 1.82.0 | 1.84.0 |
| gRPC | 1.60.0 | 1.64.0 |
| Protobuf | 24.3 | 27.1 |
| SPDLOG | 1.12.0 | 1.13.0 |
