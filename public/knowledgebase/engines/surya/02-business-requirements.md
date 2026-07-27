# 02 — Business Requirements

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## BRQ-001: Exclusive Exchange File Ingestion

Surya MUST be the ONLY component in the Algo-IQ ecosystem authorized to download files from exchange extranet APIs.

### Acceptance Criteria

- All exchange extranet credentials stored exclusively in Surya's credential vault
- No other engine has extranet API credentials or access
- Network firewall rules block exchange extranet access from all IPs except Surya's
- Audit logging records every file download, including timestamp, file type, exchange, file size, and checksum

---

## BRQ-002: Automated BOD/EOD Scheduling

Surya MUST automatically fetch, validate, and distribute exchange files according to the daily BOD/EOD schedule without manual intervention.

### Acceptance Criteria

- BOD files fetched starting at 06:00 IST; all available by 09:00 IST
- EOD files fetched starting at 15:30 IST; all available by 16:30 IST
- Cron-based scheduling with configurable retry intervals per file type
- Operations dashboard shows real-time status of each file: PENDING, FETCHING, VALIDATING, READY, FAILED
- Automatic retry on fetch failure (up to 5 attempts with 2-minute backoff)

---

## BRQ-003: Multi-Layer File Validation

Every exchange file MUST pass through mandatory validation gates before distribution to downstream consumers.

### Acceptance Criteria

**Layer 1 — Structural Validation:**
- File is non-empty and readable
- Expected column headers present and in correct order
- Row count within expected range (±50% of historical average)
- File checksum matches exchange-provided checksum (if available)

**Layer 2 — Business Validation:**
- No duplicate records (by primary key columns)
- Numeric fields within reasonable ranges
- Date fields are valid and within expected window
- Mandatory fields are non-null

**Layer 3 — Cross-File Validation:**
- Security tokens in Bhavcopy exist in Security Token master
- Contract symbols in Open Interest exist in Contract Master
- Corporate action effective dates don't conflict

---

## BRQ-004: File Versioning & Immutable Storage

Surya MUST maintain an immutable version history of every exchange file with full auditability.

### Acceptance Criteria

- Every file stored in MinIO/S3 with version ID; no file overwritten
- File metadata stored in PostgreSQL: file type, exchange, date, version, checksum, size, fetch timestamp
- Historical versions retrievable up to 5 years
- Version comparison API: diff any two versions of same file type
- Storage optimized via deduplication (identical content = single storage object)

---

## BRQ-005: Distribution API for Downstream Engines

Surya MUST provide a consistent REST API for downstream engines to discover, query, and download exchange files.

### Acceptance Criteria

- `GET /api/v1/files` — list available files with filters (type, exchange, date range)
- `GET /api/v1/files/{fileId}/download` — download latest or specific version
- `GET /api/v1/files/{fileId}/versions` — list all versions of a file
- `GET /api/v1/files/types` — list all supported file types with metadata
- API supports range requests for large files (> 100 MB)
- Authentication via API key with per-engine access scoping

---

## BRQ-006: Late/Missing File Detection & Alerting

Surya MUST proactively monitor file availability and alert Operations when files are late or missing.

### Acceptance Criteria

- Deadline-based monitoring: alert if file not READY by configured deadline
- Escalation: Warning at deadline, Critical at deadline + 15 minutes
- Alert channels: Dashboard highlight, Email, Slack, PagerDuty
- Historical tracking: late file statistics per file type per month
- Manual trigger: Operations can force re-fetch from extranet API

---

## BRQ-007: Corporate Actions Processing

Surya MUST process Corporate Action files with special handling due to their impact on positions and prices.

### Acceptance Criteria

- Corporate action files processed within 15 minutes of exchange publication
- Action types supported: DIVIDEND, BONUS, SPLIT, RIGHTS, MERGER, DEMERGER, FACE_VALUE_CHANGE
- Downstream notification: all subscribed engines notified via webhook
- Historical corporate actions queryable by symbol, date range, action type
- Adjustment factors computed and included in normalized output

---

## BRQ-008: Multi-Exchange Support

Surya MUST support concurrent connectivity to NSE and BSE extranet APIs with isolated processing pipelines.

### Acceptance Criteria

- Separate extranet API clients for NSE and BSE (different auth mechanisms)
- File type registry scoped by exchange (some types are NSE-only)
- Independent BOD/EOD schedules per exchange
- Cross-exchange file correlation: NSE and BSE Bhavcopy cross-referenced
- Exchange-specific validation rules configurable per file type
