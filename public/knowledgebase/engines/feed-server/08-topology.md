# 08 — Topology

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Production Topology

```
                          ┌──────────────────────────────┐
                          │      MUMBAI DC (Primary)      │
                          │                              │
NSE Lease Line A ────────►│ feedd-nse-cm-01 (Active)     │──► MQ Cluster DC1
NSE Lease Line B ────────►│ feedd-nse-cm-01 (Standby)    │
BSE Lease Line A ────────►│ feedd-bse-cm-01 (Active)     │──► MQ Cluster DC1
BSE Lease Line B ────────►│ feedd-bse-cm-01 (Standby)    │
MCX Lease Line A ────────►│ feedd-mcx-01 (Active)        │──► MQ Cluster DC1
MCX Lease Line B ────────►│ feedd-mcx-01 (Standby)       │
                          │                              │
                          │  Ring Buffers (shared mem)    │
                          │  Replay Servers               │
                          │  Prometheus Exporter :9090    │
                          └──────────────────────────────┘

                          ┌──────────────────────────────┐
                          │   NAVI MUMBAI DC (Secondary)  │
                          │                              │
NSE Lease Line C ────────►│ feedd-nse-cm-02 (Active)     │──► MQ Cluster DC2
NSE Lease Line D ────────►│ feedd-nse-cm-02 (Standby)    │
BSE Lease Line C ────────►│ feedd-bse-cm-02 (Active)     │──► MQ Cluster DC2
BSE Lease Line D ────────►│ feedd-bse-cm-02 (Standby)    │
                          │                              │
                          │  Ring Buffers (shared mem)    │
                          │  Replay Servers               │
                          │  Prometheus Exporter :9090    │
                          └──────────────────────────────┘
```

## Server Mapping

| Server | DC | Exchanges | Cores | RAM | Status |
|--------|-----|-----------|-------|-----|--------|
| `feed01-mum` | Mumbai | NSE-CM, NSE-FO | 48 | 128 GB | Active |
| `feed02-mum` | Mumbai | BSE-CM, NSE-CD | 48 | 128 GB | Active |
| `feed03-mum` | Mumbai | MCX, NCDEX | 24 | 64 GB | Active |
| `feed01-nmum` | Navi Mumbai | NSE-CM, NSE-FO | 48 | 128 GB | Active |
| `feed02-nmum` | Navi Mumbai | BSE-CM | 24 | 64 GB | Active |

## Network Topology

```
Exchange Demarc ──► Cross-connect Fiber ──► Patch Panel
                                                 │
                                                 ▼
                                           Feed Server NIC (SR-IOV)
                                           ├── VF0: NSE CM Primary
                                           ├── VF1: NSE FO Primary
                                           ├── VF2: BSE CM Primary
                                           ├── VF3: MCX Primary
                                           ├── VF4: Management (SSH, gRPC)
                                           └── VF5: MQ Bridge

                                           Feed Server NIC 2
                                           ├── VF0: NSE CM Secondary
                                           ├── VF1: NSE FO Secondary
                                           ├── VF2: BSE CM Secondary
                                           └── VF3: MCX Secondary

                                           LACP Bond (2 x 25GbE)
                                           └──► Core Switch ──► MQ Cluster, etc.
```

## High Availability Zones

- **Zone A:** Mumbai DC (servers `feed01-mum`, `feed02-mum`, `feed03-mum`)
- **Zone B:** Navi Mumbai DC (servers `feed01-nmum`, `feed02-nmum`)
- Distance: ~40 km fiber (approximately 0.2 ms RTT)
- Cross-DC feed state replication: near-real-time via dedicated dark fiber
- MQ cluster spans both DCs with topic mirroring for DR
