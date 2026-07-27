# 08 — Topology

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Deployment Topology

```
┌─────────────────────────────────────────────────────────┐
│                    Mumbai DC (Primary)                   │
│                                                         │
│  ┌──────────────────┐   ┌──────────────────┐           │
│  │    odin01-mum    │   │    odin02-mum    │           │
│  │  NSE (NEAT)      │   │  NSE (Diet)      │           │
│  │  BSE (BOLT)      │   │  BSE (Diet)      │           │
│  │  (direct APIs)   │   │  (dealer term)   │           │
│  └────────┬─────────┘   └────────┬─────────┘           │
│           │                      │                      │
│           └──────────┬───────────┘                      │
│                      │                                  │
│           ┌──────────┴──────────┐                       │
│           │     MQ Cluster      │                       │
│           └──────────┬──────────┘                       │
│                      │                                  │
│  ┌──────────────────┐│                                  │
│  │    odin03-mum    ││                                  │
│  │  MCX (Nest)      ││                                  │
│  │  NCDEX (Nest)    ││                                  │
│  └──────────────────┘│                                  │
└──────────────────────┼──────────────────────────────────┘
                       │
┌──────────────────────┼──────────────────────────────────┐
│               Navi Mumbai DC (DR)                       │
│                      │                                  │
│  ┌──────────────────┐│                                  │
│  │    odin01-nm     ││                                  │
│  │  All exchanges   ││                                  │
│  │  (DR standby)    ││                                  │
│  └──────────────────┘│                                  │
└──────────────────────┴──────────────────────────────────┘
```

## Server Inventory

| Hostname | DC | Exchange Paths | Cores | RAM |
|----------|-----|---------------|-------|-----|
| odin01-mum | Mumbai | NSE NEAT (direct), BSE BOLT (direct) | 32 | 64 GB |
| odin02-mum | Mumbai | NSE Diet, BSE Diet (dealer terminal) | 32 | 64 GB |
| odin03-mum | Mumbai | MCX Nest, NCDEX Nest | 16 | 32 GB |
| odin01-nm | Navi Mumbai | All (DR standby) | 32 | 64 GB |

## Path Redundancy Design

Each exchange has two routing paths on different servers:

| Exchange | Primary Path | Secondary Path | Server |
|----------|-------------|----------------|--------|
| NSE CM | NEAT API (direct) | ODIN Diet | odin01-mum / odin02-mum |
| NSE FO | NEAT API (direct) | ODIN Diet | odin01-mum / odin02-mum |
| BSE CM | BOLT API (direct) | ODIN Diet | odin01-mum / odin02-mum |
| MCX | Omnesys Nest | Omnesys Nest (backup instance) | odin03-mum / odin03-mum |
| NCDEX | Omnesys Nest | Omnesys Nest (backup instance) | odin03-mum / odin03-mum |

## Network Topology

```
odin01-mum ──► Exchange VLAN (NSE NEAT, BSE BOLT) : dedicated NIC
odin02-mum ──► Dealer Terminal VLAN (ODIN Diet)   : dedicated NIC
odin03-mum ──► Dealer Terminal VLAN (Omnesys Nest): dedicated NIC
All servers ──► Management VLAN (MQ, gRPC, SSH)   : shared NIC
All servers ──► Exchange SFTP (trade files)        : management NIC
```

## Dealer Terminal Architecture

The ODIN Diet and Omnesys Nest dealer terminals run on separate Windows servers provided by the vendor. ODIN communicates with them over TCP/IP:

```
odin02-mum (ODIN adapter) ──► TCP :9001 ──► Windows Server (ODIN Diet)
                                                     │
                                                     └──► Exchange Gateway
```

Direct API paths bypass the dealer terminal entirely, connecting directly to exchange gateways for lower latency.
