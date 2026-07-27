# 03 — System Requirements

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Functional Requirements

### FR-100: Extranet API Connectivity

| Aspect | Specification |
|---|---|
| NSE Protocol | HTTPS REST API with client certificate authentication |
| BSE Protocol | HTTPS REST API with API key + IP whitelist |
| Credential Storage | HashiCorp Vault (AES-256-GCM encrypted) |
| Session Management | Token-based with automatic refresh |
| Connection Pool | Max 5 concurrent connections per exchange |
| Timeout | 120 seconds for large file downloads |

### FR-101: File Type Management

Each file type MUST have a registered configuration:

| Field | Description |
|---|---|
| `fileTypeCode` | Unique code (e.g., `SEC_TOK`, `BHAVCOPY`) |
| `exchange` | NSE, BSE |
| `schedule` | BOD, EOD, INTRADAY, ON_DEMAND |
| `extranetEndpoint` | API path on exchange extranet |
| `expectedColumns` | Ordered list of column names and types |
| `primaryKeys` | Columns that uniquely identify rows |
| `validationRules` | Layer 2 business validation rules |
| `deadline` | Time by which file must be READY |
| `retentionDays` | How long to keep versions (default: 1825) |
| `downstreamSubscribers` | Engines that consume this file type |

### FR-102: File Validation Engine

| Rule Type | Examples |
|---|---|
| **Structural** | Non-empty, correct columns, CSV/JSON parseable |
| **Completeness** | Row count deviation < 50%, all mandatory rows present |
| **Integrity** | Checksum match, no truncation, encoding valid (UTF-8) |
| **Business** | Price > 0, date in valid range, instrument token exists |
| **Cross-reference** | Token exists in SEC_TOK, contract in CON_MAST |

### FR-103: Normalization Pipeline

All files normalized to canonical schema before storage:

| Normalization | Example |
|---|---|
| Column naming | `ISIN_CODE` → `isin`, `SYMBOL` → `symbol` (snake_case, lowercase) |
| Date format | `24-Jul-2026` → `2026-07-24` (ISO 8601) |
| Numeric format | `1,234.56` → `1234.56`, `₹1,500.00` → `1500.00` |
| Encoding | All files transcoded to UTF-8 |
| Null handling | Exchange-specific placeholders (`NA`, `-`, `0.00`) → SQL NULL |

---

## Non-Functional Requirements

### NFR-100: Performance

| Metric | Target |
|---|---|
| File download time (single file < 10 MB) | < 30 seconds |
| Validation time (single file) | < 10 seconds |
| Normalization time (single file) | < 15 seconds |
| Distribution API response time | < 200 ms (metadata), < 2 seconds (file download) |
| Concurrent file downloads | 500 connections |
| BOD pipeline completion | < 2 hours (06:00–08:00 IST) |

### NFR-101: Availability

| Target | Measurement |
|---|---|
| 99.7% monthly uptime | Uptime monitor + synthetic file fetch |
| File availability at deadline | 99.5% of files READY by deadline |

### NFR-102: Storage

| Metric | Target |
|---|---|
| Daily file ingestion volume | ~500 MB uncompressed |
| Annual storage growth | ~180 GB (before compression) |
| Compression ratio (MinIO) | ~70% (gzip) for CSV files |
| Max single file size | 1 GB |

### NFR-103: Security

| Requirement | Implementation |
|---|---|
| Extranet credentials | Vault-encrypted, never in config files |
| API authentication | API keys with SHA-256 hashing |
| TLS | All endpoints TLS 1.2+ |
| File integrity | SHA-256 checksum on every stored file |
| Access audit | All file downloads logged per API key |

---

## Environment Requirements

### Production

| Resource | Minimum | Recommended |
|---|---|---|
| CPU | 4 vCPU | 8 vCPU |
| RAM | 8 GB | 16 GB |
| Disk | 200 GB SSD (app) | 500 GB NVMe |
| Object Storage | MinIO / S3-compatible | MinIO cluster (3 nodes) |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

### Database

| Component | Technology | Version |
|---|---|---|
| Primary DB | PostgreSQL | 15.x |
| Object Storage | MinIO (S3-compatible) | RELEASE.2024-01 |
| Cache | Redis | 7.x |
| Message Queue | RabbitMQ | 3.12.x |

### External Dependencies

| Service | Purpose | SLA |
|---|---|---|
| NSE Extranet API | BOD/EOD file source | As per exchange |
| BSE MFTP API | BSE file source | As per exchange |
| HashiCorp Vault | Credential management | 99.95% |

---

## File Size Reference

| File Type | Typical Size | Format |
|---|---|---|
| Security Token | 2–5 MB | CSV |
| Contract Master | 0.5–2 MB | CSV |
| SPAN Margin | 10–50 MB | CSV |
| Bhavcopy | 5–20 MB | CSV/ZIP |
| Bhavcopy (BSE) | 10–30 MB | ZIP containing CSV |
| Open Interest | 2–10 MB | CSV |
| Corporate Actions | < 100 KB | CSV/JSON |
| Trade Statistics | 5–15 MB | CSV |
| Bulk Deals | 50–500 KB | CSV |
