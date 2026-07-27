# 08 — Ecosystem Topology

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Surya in the Algo-IQ Ecosystem

Surya occupies a unique position as the **sole ingress point** for exchange-provided data. It sits between external exchange extranet APIs and all internal Algo-IQ engines, acting as a gateway, validator, and distributor.

---

## Upstream Dependencies

| Source | Data Provided | Protocol | Criticality |
|---|---|---|---|
| **NSE Extranet API** | 15+ file types (SEC_TOK, SPN_MRG, BHAVCOPY, etc.) | HTTPS REST | CRITICAL — All BOD/EOD data |
| **BSE MFTP API** | 8 file types (BHAVCOPY, CORP_ACT, etc.) | HTTPS REST | HIGH — Alternative exchange data |
| **HashiCorp Vault** | Extranet credentials (certs, API keys) | HTTPS API | CRITICAL — Cannot connect without |

## Downstream Consumers

| Consumer Engine | Files Consumed | Purpose |
|---|---|---|
| **Ganesh** | SEC_TOK, BHAVCOPY, CORP_ACT, MKT_HOL | Symbol master, instrument tokens |
| **Lakshmi** | SEC_TOK, BHAVCOPY, CIRC_BRK | Market data enrichment |
| **Vega** | SEC_TOK, CON_MAST, SPN_MRG, EXP_MRG, CIRC_BRK | Order validation, margin checks |
| **Parikshak** | SPN_MRG, EXP_MRG, SETTLE, OPEN_INT | Risk calculations, margin monitoring |
| **Strategy Factory** | BHAVCOPY, CORP_ACT, MKT_HOL | Strategy backtesting, calendar |
| **Audit Store** | ALL (metadata only) | Compliance traceability |

---

## Network Topology

```
                          INTERNET
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
          ┌──────────────┐  ┌──────────────┐
          │ NSE Extranet │  │ BSE MFTP API │
          │ (TLS 1.2+)   │  │ (TLS 1.2+)   │
          └──────┬───────┘  └──────┬───────┘
                 │                 │
         ┌───────┴─────────────────┴───────┐
         │     DMZ FIREWALL                 │
         │  (ALLOW: Surya IP → Extranet)   │
         └───────────────┬─────────────────┘
                         │
         ┌───────────────┴─────────────────┐
         │       SURYA VLAN (10.0.20.0/24)  │
         │  ┌────────────────────────────┐  │
         │  │     SURYA ENGINE            │  │
         │  │  (File Pipeline + API)      │  │
         │  └────────────┬───────────────┘  │
         └───────────────┼──────────────────┘
                         │
         ┌───────────────┴─────────────────┐
         │    ALGO-IQ CORE VLAN            │
         │  ┌────────┐ ┌────────┐ ┌──────┐│
         │  │Ganesh  │ │Lakshmi │ │ Vega ││
         │  └────────┘ └────────┘ └──────┘│
         │  ┌──────────┐ ┌────────────┐   │
         │  │Parikshak │ │Strat Factory│   │
         │  └──────────┘ └────────────┘   │
         └─────────────────────────────────┘
```

---

## Firewall Rules

| Source | Destination | Port | Protocol | Action |
|---|---|---|---|---|
| Surya VLAN (10.0.20.0/24) | NSE Extranet IPs | 443 | HTTPS | ALLOW |
| Surya VLAN (10.0.20.0/24) | BSE MFTP IPs | 443 | HTTPS | ALLOW |
| ANY (except Surya) | NSE Extranet IPs | ANY | ANY | DENY |
| ANY (except Surya) | BSE MFTP IPs | ANY | ANY | DENY |
| ALGO-IQ-CORE VLAN | Surya VLAN | 3005 | HTTPS | ALLOW (Distribution API) |
| Surya VLAN | MinIO Cluster | 9000, 9001 | HTTP | ALLOW |
| Surya VLAN | PostgreSQL | 5432 | TCP | ALLOW |
| Surya VLAN | Redis | 6379 | TCP | ALLOW |

---

## Service Discovery

| Component | Mechanism | Address |
|---|---|---|
| Surya API | Consul DNS | `surya-api.service.consul:3005` |
| MinIO | Consul DNS | `minio.service.consul:9000` |
| PostgreSQL | HAProxy VIP | `pg-ro.algoiq.internal:5432` |
| Redis | Sentinel | `redis-sentinel.service.consul:26379` |
| RabbitMQ | Static config | `mq[1-3].algoiq.internal:5672` |
| Vault | Static config | `vault.algoiq.internal:8200` |

---

## Data Center Distribution

### Primary DC (Mumbai)

| Service | Instances |
|---|---|
| Surya API (incl. scheduler) | 2 |
| Pipeline Workers | 2 |
| MinIO Cluster | 4 nodes (16 TB each) |
| PostgreSQL | 3 (1 primary + 2 replica) |
| Redis | 3 sentinel + 3 replica |
| RabbitMQ | 3 (cluster) |

### DR DC (Hyderabad)

| Service | Instances |
|---|---|
| Surya API | 1 (warm standby) |
| MinIO | Site-to-site replication (async) |
| PostgreSQL | 1 (async replica) |

---

## Port Allocation

| Service | Port | Protocol |
|---|---|---|
| Surya Distribution API | 3005 | HTTPS (TLS 1.3) |
| Surya Metrics | 9090 | HTTP |
| MinIO API | 9000 | HTTP (internal VLAN) |
| MinIO Console | 9001 | HTTPS |
| PostgreSQL | 5432 | TCP/TLS |
| Redis | 6379 | TCP |
| RabbitMQ | 5672 | AMQP/TLS |

---

## Extranet Connectivity

### NSE Extranet

```
Connectivity: Leased Line (2 Mbps dedicated)
IP:      10.255.1.100 (NAT to exchange IP)
Auth:    X.509 Client Certificate (CN: ALGOIQ-SURYA-PROD)
         Certificate stored in Vault; renewed annually
Hours:   06:00–18:00 IST (extended from 09:00–15:30 for BOD/EOD)

Backup:  Secondary leased line (different provider)
         Auto-failover via BGP
```

### BSE MFTP

```
Connectivity: Internet VPN (IPsec tunnel)
Auth:    API Key + IP Whitelist
         API key rotated every 30 days
Hours:   06:00–18:00 IST

Backup:  Secondary VPN endpoint
         Manual failover
```

---

## Dependency Graph

```
                    ┌──────────┐
                    │  SURYA   │
                    └────┬─────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │ Ganesh   │   │ Lakshmi  │   │  Vega    │
   │(Symbols) │   │(Mkt Data)│   │ (Orders) │
   └────┬─────┘   └────┬─────┘   └────┬─────┘
        │              │              │
        │    ┌─────────┼─────────┐    │
        │    │         │         │    │
        ▼    ▼         ▼         ▼    ▼
   ┌──────────────────────────────────────┐
   │         Strategy Factory              │
   └──────────────────────────────────────┘
                     │
                     ▼
              ┌──────────┐
              │Parikshak │
              │  (Risk)  │
              └──────────┘
```

Surya is the foundation: all data quality and timeliness downstream depends on Surya's file pipeline performing correctly.
