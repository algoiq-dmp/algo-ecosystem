# 06 — Components

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Component Inventory

### Core Components

| Component | Binary | Responsibility |
|-----------|--------|----------------|
| `feedd` | `/opt/lakshmi/bin/feedd` | Main daemon process — orchestrates all pipeline stages |
| `nse_parser` | `libfeedd_nse.so` | NSE NFMT 2.0 binary protocol parser |
| `bse_parser` | `libfeedd_bse.so` | BSE BOLT Plus protocol parser |
| `mcx_parser` | `libfeedd_mcx.so` | MCX xStream protocol parser |
| `ncdex_parser` | `libfeedd_ncdex.so` | NCDEX feed protocol parser |
| `normalizer` | `libfeedd_normalizer.so` | Exchange-to-LCFM normalization engine |
| `sequencer` | `libfeedd_seq.so` | Global sequence number generator and gap detector |

### Infrastructure Components

| Component | Binary | Responsibility |
|-----------|--------|----------------|
| `ringbuf` | `libfeedd_ringbuf.so` | Lock-free ring buffer implementation |
| `mq_bridge` | `libfeedd_mq.so` | MQ publish bridge with batching |
| `replay_svc` | `libfeedd_replay.so` | TCP replay server for gap recovery |
| `healthd` | `libfeedd_health.so` | Health check and heartbeat monitoring |

### Management Components

| Component | Binary | Responsibility |
|-----------|--------|----------------|
| `feeddctl` | `/opt/lakshmi/bin/feeddctl` | CLI tool for runtime management |
| `feed_audit` | `libfeedd_audit.so` | Regulatory audit logging |
| `feed_metrics` | `libfeedd_metrics.so` | Prometheus metrics exporter |

## Component Interaction

```
feeddctl (CLI)
    │
    ▼
feedd ──── gRPC management API ──── Narad (monitoring)
    │
    ├── nse_parser ──► normalizer ──► sequencer ──► ringbuf ──► mq_bridge
    ├── bse_parser ──► normalizer ──► sequencer ──► ringbuf ──► mq_bridge
    ├── mcx_parser ──► normalizer ──► sequencer ──► ringbuf ──► mq_bridge
    └── ncdex_parser ─► normalizer ──► sequencer ──► ringbuf ──► mq_bridge

ringbuf ──► replay_svc (TCP replay for gap recovery)
feed_metrics ──► Prometheus scrape endpoint (:9090)
feed_audit ──► Suraksha (audit log encryption and storage)
```

## Component Lifecycle

Each parser component follows a strict lifecycle:
1. **Init** — Load exchange configuration, validate license, allocate memory pools
2. **Connect** — Establish TCP connection to exchange gateway, perform handshake
3. **Auth** — Exchange credentials via exchange-specific auth protocol
4. **Subscribe** — Subscribe to required message types and instruments
5. **Active** — Normal feed processing loop
6. **Pause** — Graceful pause (e.g., during market holidays)
7. **Drain** — Process all in-flight messages before shutdown
8. **Shutdown** — Release resources, close connections, flush audit logs
