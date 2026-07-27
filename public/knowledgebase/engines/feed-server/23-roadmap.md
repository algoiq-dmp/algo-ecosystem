# 23 — Roadmap

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Version History and Future Plans

### v2.8.0 (Current — Q2 2026)

- NSE NFMT 2.0 protocol support (migration from NFMT 1.5)
- DPDK 23.11 LTS upgrade with improved PTP timestamping
- Suraksha v2 integration (Merkle tree anchoring + encrypted audit)
- Configurable gap recovery timeout per exchange
- Prometheus histogram metrics for latency distribution
- Hot-reload for symbol master cache

### v2.9.0 (Planned — Q3 2026)

**Theme: Multi-Asset Expansion**

- NSE Commodity Derivatives (NCDEX merger) segment support
- BSE Star MF (Mutual Fund) platform feed integration
- GIFT City (IFSC) exchange feed support (INX, NSE IFSC)
- Multi-cast source-specific multicast (SSM) for NSE new feed architecture
- Enhanced DPDK pipeline: RSS + flow director for per-symbol CPU affinity
- gRPC reflection and server-side streaming for feed status

### v2.10.0 (Planned — Q4 2026)

**Theme: Observability and Resilience**

- OpenTelemetry tracing integration (W3C trace context propagation through MQ)
- Feed quality score: per-feed health metric combining latency, gaps, and throughput
- Predictive gap recovery: ML-based gap pattern detection and pre-emptive replay
- Cross-DC active-active feed ingestion (currently active-standby)
- Automated regression test suite expansion (target: 1000+ test cases)

### v3.0.0 (Planned — H1 2027)

**Theme: Next-Generation Feed Architecture**

- Partial tick consolidation: configurable tick aggregation windows (1ms, 5ms, 10ms)
- Adaptive bandwidth: dynamic throttling based on downstream consumer capacity
- Feed Server as a gRPC streaming service (alternative to MQ for direct consumers)
- Real-time feed quality dashboard in Narad with ML-driven anomaly highlights
- Multi-exchange normalized order book (combined view across NSE + BSE)

## Backlog (Unprioritized)

| Feature | Effort | Value |
|---------|--------|-------|
| NSE Colo 2.0 (new BKC data center) migration support | L | High |
| FIX protocol feed parsing (for international market data) | M | Medium |
| Inline LCFM compression (zstd) for MQ bandwidth savings | S | Medium |
| Symbol master from multiple sources with conflict resolution | M | Medium |
| Feed delay measurement (receive time vs. exchange generation time) | S | Low |
| WebSocket streaming direct from Feed Server (bypass Local WebSocket) | L | Low |
| Kubernetes operator for dev/staging environments | M | Low |

## Deprecation Notices

- **NFMT 1.5 protocol:** Support will be removed in v3.0.0 (Q1 2027). NSE has announced NFMT 1.5 EOL for December 2026.
- **BSE BOLT (legacy):** BSE BOLT Plus replaced BOLT in 2024. Legacy BOLT parser will be removed in v2.10.0.
- **DPDK 22.11:** Upgrade to 23.11 completed in v2.8.0. 22.11 is no longer supported.
