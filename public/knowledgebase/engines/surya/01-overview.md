# 01 — Overview & Business Objectives

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Purpose

Surya solves the critical problem of **centralized exchange file management** in the Algo-IQ ecosystem. Exchanges (NSE, BSE) publish dozens of files daily containing reference data, margin parameters, settlement prices, and corporate actions. Without a central authority, each downstream engine would independently download, parse, and interpret these files — leading to inconsistency, duplication, and potential trading errors.

Surya serves as the **Single Source of Truth (SSOT)** — the ONE and ONLY component authorized to fetch exchange files. Every other engine consumes validated, normalized data from Surya's distribution API.

---

## Business Objectives

| Objective | Measurement | Target |
|---|---|---|
| File availability (BOD) | Files ready before market open | 100% by 09:00 IST |
| File availability (EOD) | Files ready for overnight processing | 100% by 16:30 IST |
| File validation accuracy | Correct files identified as valid | 99.9% |
| Downstream distribution latency | Time from file ready to API availability | < 5 seconds |
| File version retention | Historical file versions available | 5 years |
| System availability | Monthly uptime | 99.7% |

---

## Stakeholders

| Role | Interaction |
|---|---|
| **Operations Team** | Manage file schedules, monitor extranet connectivity, resolve file anomalies |
| **Data Consumers (Lakshmi, Ganesh, Vega, etc.)** | Query download API for latest/historical files |
| **Risk & Compliance** | Access historical margin files and corporate actions for audits |
| **Development Teams** | Add new file types, enhance validation rules, extend distribution API |
| **Exchange Relationship Management** | Coordinate extranet API access and resolve connectivity issues |

---

## Core Principle: No Direct Downloads

The fundamental architectural rule Surya enforces:

> **No engine in the Algo-IQ ecosystem downloads exchange files directly. All exchange data flows through Surya.**

### Why This Matters

| Risk without Surya | How Surya mitigates |
|---|---|
| Inconsistent file versions across engines | Single version store; all engines see the same data |
| Duplicate downloads (bandwidth waste) | One download, distributed to N consumers |
| Missed or late files undetected | Centralized monitoring with automated alerts |
| Unvalidated files entering the system | Mandatory validation pipeline before distribution |
| No audit trail of file changes | Immutable version history with full audit logging |
| Multiple extranet credentials to manage | Single set of credentials managed centrally |

---

## Daily File Schedule

```
BOD Window (06:00–09:00 IST):
  ├── 06:00 — Extranet API session opens
  ├── 06:15 — Security Token (SEC_TOK)
  ├── 06:30 — Contract Master (CON_MAST)
  ├── 06:45 — SPAN Margin (SPN_MRG)
  ├── 07:00 — Exposure Margin (EXP_MRG)
  ├── 07:15 — Circuit Breaker (CIRC_BRK)
  ├── 07:30 — Securities Ban (SEC_BAN)
  ├── 08:00 — Validation complete; files available
  └── 09:00 — BOD deadline (alerts if any file missing)

EOD Window (15:30–16:30 IST):
  ├── 15:35 — Bhavcopy (BHAVCOPY) available
  ├── 15:45 — Open Interest (OPEN_INT)
  ├── 15:50 — Trade Statistics (TRD_STAT)
  ├── 16:00 — Delivery Report (DLV_RPT)
  ├── 16:10 — Settlement (SETTLE)
  ├── 16:15 — Bulk Deals (BLK_DEAL)
  └── 16:30 — EOD deadline (files ready for downstream)
```

---

## Supported Exchanges

| Exchange | Extranet API | Authentication | Files |
|---|---|---|---|
| **NSE (National Stock Exchange)** | NSE Extranet API v2.1 | Client ID + Digital Certificate | 15 types |
| **BSE (Bombay Stock Exchange)** | BSE MFTP API v1.8 | Username + API Key + IP whitelist | 8 types |

---

## Product Roadmap

| Release | Features | Target |
|---|---|---|
| **2.5.0** | MCX commodity exchange support, Intraday file refresh | Q3 2026 |
| **2.6.0** | File diff engine (highlight changes between versions), WebSocket notification | Q4 2026 |
| **3.0.0** | Real-time streaming files via extranet push, File anomaly ML detection | Q1 2027 |

---

## Key Design Principles

1. **Single Source of Truth** — Surya is the exclusive gateway for exchange file ingress
2. **Validate Before Distribute** — No unvalidated file reaches downstream consumers
3. **Immutable History** — Every file version is stored permanently; nothing is overwritten
4. **Late/Missing Detection** — Proactive monitoring alerts Operations before deadlines
5. **Zero Trust with Exchanges** — Files are validated even from trusted exchange sources
6. **Consumer Agnostic** — Distribution API is uniform regardless of which engine is consuming
