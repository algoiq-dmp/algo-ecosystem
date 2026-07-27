# 25 — Glossary

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## A

| Term | Definition |
|---|---|
| **API Key** | Unique identifier for authenticating downstream engine access to Surya's Distribution API |
| **Audit Event** | Immutable record of every pipeline action stored in TimescaleDB for compliance |

---

## B

| Term | Definition |
|---|---|
| **BHAVCOPY** | End-of-day price and volume data file published by NSE and BSE |
| **BOD (Begin of Day)** | Morning processing window (06:00–09:00 IST) for files needed before market open |
| **BSE** | Bombay Stock Exchange — one of two exchanges supported by Surya |
| **BSE MFTP API** | BSE's Mutual Fund Trading Platform API used for file downloads (v1.8) |
| **Bucket (MinIO)** | S3-compatible container for storing file objects (`surya-files`, `surya-staging`) |
| **Bulk Deals (BLK_DEAL)** | Exchange file reporting large block trade transactions |

---

## C

| Term | Definition |
|---|---|
| **Canonical Schema** | Surya's standardized column naming, date format, and data format for all files post-normalization |
| **Checksum (SHA-256)** | Cryptographic hash computed on file content; used for integrity verification and deduplication |
| **Circuit Breaker (CIRC_BRK)** | Exchange file containing price band limits per security |
| **Column Renamer** | Normalizer transform that maps exchange-specific column names to canonical snake_case names |
| **Content Deduplication** | MinIO optimization where identical file content (by SHA-256 hash) is stored once |
| **Contract Master (CON_MAST)** | Exchange file with Futures & Options contract specifications |
| **Corporate Actions (CORP_ACT)** | Exchange file announcing dividends, splits, bonuses, mergers, etc. |
| **Cross-File Validation** | Layer 3 validation checking data consistency against previously stored files |
| **CSV** | Comma-Separated Values — primary file format for exchange data |

---

## D

| Term | Definition |
|---|---|
| **Date Normalizer** | Transform that converts any date format (DD-Mon-YYYY, DD/MM/YYYY, etc.) to ISO 8601 |
| **Deadline** | Time by which a file type must reach READY state; triggers alerts if missed |
| **Delivery Report (DLV_RPT)** | Exchange file with delivery-based settlement quantities |
| **Distribution API** | REST API exposing files to downstream engines for download |
| **Downstream Engines** | Algo-IQ engines that consume files from Surya (Ganesh, Lakshmi, Vega, etc.) |

---

## E

| Term | Definition |
|---|---|
| **Emergency Storage** | Local filesystem fallback (`/data/surya/emergency/`) when MinIO is unavailable |
| **EOD (End of Day)** | Evening processing window (15:30–16:30 IST) for post-market files |
| **Erasure Coding** | MinIO data protection mechanism distributing data + parity across nodes (EC 8+4) |
| **Exposure Margin (EXP_MRG)** | Exchange file with additional margin requirements |
| **Extranet API** | Exchange-provided API for programmatic file access (NSE Extranet API v2.1, BSE MFTP API v1.8) |

---

## F

| Term | Definition |
|---|---|
| **Fetch Log** | Database table tracking every file download attempt with status and timing |
| **File Fetcher** | Pipeline component responsible for downloading files from exchange extranet APIs |
| **File ID** | Unique identifier for a file version (e.g., `SURYA-20260724-SEC_TOK-0001`) |
| **File Type Registry** | PostgreSQL-backed configuration store defining all 18+ supported file types |
| **Force Accept** | Admin action to mark a failed file as READY with override flag |

---

## G

| Term | Definition |
|---|---|
| **Ganesh** | Algo-IQ engine consuming SEC_TOK, BHAVCOPY, CORP_ACT from Surya for symbol master management |
| **gzip** | Compression algorithm used for CSV file storage (~70% reduction) |

---

## H

| Term | Definition |
|---|---|
| **HashiCorp Vault** | Secrets management platform storing extranet credentials and API keys |
| **Hot Reload** | File Type Registry changes applied within 60 seconds without restart |

---

## I

| Term | Definition |
|---|---|
| **ILM (Information Lifecycle Management)** | MinIO policy for automatic data tiering (HOT → WARM → COLD) |
| **Index Master (IDX_MAST)** | Weekly exchange file with index composition and weights |
| **Instrument Token** | Numeric identifier for a trading symbol; sourced from SEC_TOK file |

---

## L

| Term | Definition |
|---|---|
| **Lakshmi** | Algo-IQ engine consuming SEC_TOK, BHAVCOPY, CIRC_BRK for market data enrichment |
| **Lifecycle Policy** | MinIO rule for automatic object tiering and deletion |
| **Layer 1 (Structural Validation)** | Checks file format: columns, row count, parseability, encoding |
| **Layer 2 (Business Validation)** | Checks data quality: column rules, primary key uniqueness, value ranges |
| **Layer 3 (Cross-File Validation)** | Checks consistency: tokens exist in SEC_TOK, contracts in CON_MAST |

---

## M

| Term | Definition |
|---|---|
| **Market Holidays (MKT_HOL)** | Monthly exchange file listing trading holidays |
| **MinIO** | S3-compatible object storage used for file blob storage |
| **Mock Extranet** | Development HTTP server simulating NSE/BSE extranet APIs for testing |

---

## N

| Term | Definition |
|---|---|
| **Node.js Streams** | Memory-efficient I/O pattern used by pipeline for large file processing |
| **Normalizer** | Pipeline component that standardizes file formats, encodings, and column schemas |
| **NSE** | National Stock Exchange of India — primary exchange supported by Surya |
| **NSE Extranet API** | NSE's authenticated API (v2.1) for programmatic file downloads |
| **Null Standardizer** | Transform that converts exchange-specific null placeholders to SQL-compatible nulls |
| **Number Cleaner** | Transform that strips currency symbols, commas, and Indian number formatting |

---

## O

| Term | Definition |
|---|---|
| **Open Interest (OPEN_INT)** | Exchange file with F&O open interest data |
| **Operations Team** | Primary stakeholders responsible for monitoring file pipeline and extranet connectivity |

---

## P

| Term | Definition |
|---|---|
| **Parquet** | Columnar storage format generated alongside CSV for analytics consumers |
| **Parikshak** | Algo-IQ engine consuming SPN_MRG, EXP_MRG, SETTLE for risk calculations |
| **Participant-wise OI (PRT_OI)** | Exchange file with client/category-wise open interest |
| **Pipeline** | Sequential file processing stages: Fetch → Validate → Normalize → Store → Distribute |
| **Presigned URL** | Time-limited MinIO URL allowing direct file download without API proxy |

---

## R

| Term | Definition |
|---|---|
| **Redlock** | Distributed locking algorithm using Redis to prevent duplicate scheduler execution |
| **Retry (File Fetch)** | Exponential backoff retry mechanism (5 attempts: 30s–480s) |

---

## S

| Term | Definition |
|---|---|
| **Scheduler** | Cron-based component triggering file fetches at configured times |
| **Securities Ban (SEC_BAN)** | Exchange file listing F&O ban period securities |
| **Security Token (SEC_TOK)** | Exchange file mapping symbols to instrument tokens |
| **Settlement (SETTLE)** | Exchange file with daily settlement prices for derivatives |
| **SHA-256** | Cryptographic hash algorithm used for file integrity verification and deduplication |
| **Single Source of Truth (SSOT)** | Core principle: Surya is the ONLY engine authorized to download exchange files |
| **Snappy** | Fast compression codec used for Parquet file storage |
| **SPAN Margin (SPN_MRG)** | Exchange file with risk margin parameters (Standard Portfolio Analysis of Risk) |
| **SSE-S3** | MinIO Server-Side Encryption using AES-256 for data at rest |
| **Staging** | Temporary directory (`/data/surya/staging/`) for raw downloaded files before processing |
| **Surya** | Algo-IQ exchange file management engine; Single Source of Truth for all exchange files |

---

## T

| Term | Definition |
|---|---|
| **TimescaleDB** | Time-series PostgreSQL extension used for audit event storage |
| **Trade Statistics (TRD_STAT)** | Exchange file with aggregate daily trade statistics |

---

## V

| Term | Definition |
|---|---|
| **Validation Engine** | Multi-layer system checking file correctness (structural, business, cross-file) |
| **Vega** | Algo-IQ engine consuming SEC_TOK, CON_MAST, SPN_MRG, EXP_MRG for order validation |
| **Version** | Incrementing integer tracking file revisions (identical content = same version; re-fetches = new version) |
| **Version Store** | MinIO-based immutable file storage with full version history |
| **Volatility (VOLATILITY)** | Exchange file with implied volatility data |

---

## X

| Term | Definition |
|---|---|
| **X.509 Certificate** | Digital certificate used for NSE extranet API authentication |

---

## Z

| Term | Definition |
|---|---|
| **ZIP** | Container format used by BSE for Bhavcopy file delivery; extracted by Surya before processing |
