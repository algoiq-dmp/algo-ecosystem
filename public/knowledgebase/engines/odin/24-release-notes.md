# 24 — Release Notes

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Release v3.0.0 — "Direct Connect"

**Release Date:** 2026-06-10
**Build:** `odind-3.0.0+build.567`
**Git Tag:** `odin-v3.0.0`

### Highlights

- NSE NEAT FIX 4.4 direct API integration, bypassing dealer terminal for 50% lower routing latency
- Multi-path automatic failover: direct API → dealer terminal fallback in < 500ms
- Near-real-time reconciliation every 30 minutes (in addition to EOD)
- Per-client per-exchange order rate limiting

### New Features

- **NSE NEAT Direct API:** New `nse_neat` adapter supporting FIX 4.4 NewOrderSingle, OrderCancelRequest, OrderCancelReplaceRequest. Reduces routing latency from ~8ms (via ODIN Diet) to ~2ms.
- **Multi-Path Failover:** Automatic failover between primary (direct API) and secondary (dealer terminal) paths. Configurable per exchange with independent health checks.
- **Intra-Day Reconciliation:** Trade matching runs every 30 minutes during trading hours. Catches discrepancies early instead of waiting for EOD.
- **Order Rate Limiter:** Token-bucket-based rate limiter per client. Prevents accidental order floods. Configurable rate and burst per client.
- **FIX Engine:** Shared FIX 4.4 protocol engine used by NSE NEAT and BSE BOLT adapters. Supports session management, message sequencing, heartbeat, and message recovery.

### Improvements

- Order state store migration from `std::unordered_map + mutex` to `folly::ConcurrentHashMap` — 3x throughput improvement under contention
- Adapter connection startup time reduced 60% (parallelized credential fetch + TCP connect + FIX logon)
- Order audit log compression: 4x reduction using Zstandard level 6
- RMS check latency reduced 40% via local response caching (same client+symbol+side, 100ms TTL)

### Bug Fixes

- **OD-892:** Duplicate execution reports when adapter reconnects mid-trade (fixed: execution ID deduplication in execution processor)
- **OD-885:** Order stuck in PENDING after adapter timeout without failover (fixed: timeout now triggers immediate failover + order state query on primary)
- **OD-877:** EOD reconciliation crash on trade files with BOM character (fixed: UTF-8 BOM handling in trade file parser)
- **OD-869:** Memory leak in ODIN Diet adapter XML parser (fixed: XML document pool with proper cleanup)
- **OD-861:** FIX sequence number reset causing logon rejection after server restart (fixed: persisted sequence numbers in RocksDB)

### Breaking Changes

- **Config:** Adapter configuration restructured. Each adapter now has explicit `priority` field. Old flat config deprecated.
- **MQ Topics:** Order topics renamed from `order.{exchange}` to `orders.{exchange}.{segment}`. Old topics deprecated, will be removed in v3.2.0.
- **Database:** Schema version 5 required. `odinctl db migrate` must be run before upgrade.

### Migration Guide

1. Run `odinctl db migrate` on all environments
2. Update config.yaml to new adapter structure with `priority` fields
3. Update strategy engines to publish to new MQ topics: `orders.{exchange}.{segment}`
4. Deploy during Saturday maintenance window
5. Run reconciliation verification after deployment

### Known Issues

- **OD-901:** NSE NEAT adapter may fail to reconnect after exchange-side FIX session reset during market hours. Workaround: manual `odinctl adapter restart`. Permanent fix in v3.0.1.
- **OD-904:** Intra-day reconciliation may show false discrepancies during extremely high-volume periods (> 20K trades/min). Workaround: rely on EOD reconciliation as source of truth.
