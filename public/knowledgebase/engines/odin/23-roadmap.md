# 23 — Roadmap

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Version History and Future Plans

### v3.0.0 (Current — Q2 2026)

- NSE NEAT FIX 4.4 direct API integration (bypasses dealer terminal)
- Multi-path routing with automatic failover between direct API and dealer terminal
- Enhanced reconciliation: near-real-time trade matching (every 30 minutes in addition to EOD)
- Order rate limiter per client per exchange
- FIX protocol engine shared across NSE and BSE adapters
- Prometheus metrics with adapter-level granularity

### v3.1.0 (Planned — Q3 2026)

**Theme: Smart Order Routing**

- Order slicing: automatically break large orders into child orders for reduced market impact
- TWAP/VWAP execution algorithms within ODIN (currently in strategy engines)
- Latency-based path selection: choose path based on real-time latency measurements
- Dark pool integration for block trades
- Order co-location: route orders to server nearest to exchange

### v3.2.0 (Planned — Q4 2026)

**Theme: Advanced Risk and Compliance**

- Real-time order-to-trade ratio monitoring with predictive throttling
- Automated exchange penalty monitoring and avoidance
- Pre-trade transaction cost analysis (TCA)
- SEBI algo audit report auto-generation
- Exchange fee optimization (route to lowest-cost exchange for inter-exchange arbitrage)

### v4.0.0 (Planned — H1 2027)

**Theme: Next-Gen Order Gateway**

- FIX 5.0 SP2 protocol support
- Binary order protocol for ultra-low latency (custom wire protocol, < 1ms routing)
- Hardware-based order validation (FPGA-assisted price band and RMS checks)
- Cross-exchange smart order routing (route to best price across NSE + BSE)
- Order gateway federation: multiple ODIN instances across multiple DCs with unified order view

## Backlog

| Feature | Effort | Priority |
|---------|--------|----------|
| Basket order support (multi-instrument single order) | L | High |
| Iceberg order support | M | Medium |
| Exchange-sponsored access (co-location direct) | XL | High |
| Mobile app for order monitoring | M | Low |
| Order simulation mode (paper trading via ODIN) | L | Medium |

## Deprecation Notices

- **ODIN Diet XML API v1:** Support ends with v3.2.0 (Q4 2026). Migrate to ODIN Diet JSON API.
- **Omnesys Nest TCP v2:** Support ends with v4.0.0. Migrate to Omnesys Nest WebSocket API.
