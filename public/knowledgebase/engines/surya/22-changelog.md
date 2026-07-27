# 22 — Changelog

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Version History

---

### [2.4.1] — 2026-07-15

#### Added
- Force-accept admin API endpoint for accepting files that fail validation
- Emergency storage fallback when MinIO is unavailable (writes to local `/data/surya/emergency/`)
- File integrity verification on read (SHA-256 checksum comparison)
- Daily Operations report email summarizing file pipeline status

#### Changed
- Scheduler lock TTL increased from 5 minutes to 10 minutes (prevent duplicate processing)
- Validation row count deviation threshold made configurable per file type
- MinIO multipart upload part size reduced from 10 MB to 5 MB for more stable uploads

#### Fixed
- Scheduler lock not releasing on pipeline error (stale lock blocked next day's processing)
- Corporate Actions date parsing failing for merger events with multiple effective dates
- Normalizer not handling BSE files with mixed Windows-1252 encoding in single file
- Presigned URL generation expiring too quickly (1 minute → 1 hour)
- Memory leak in streaming CSV parser when processing files with > 500K rows

---

### [2.4.0] — 2026-06-20

#### Added
- Parquet file format generation alongside CSV (for analytics consumers)
- File diff API: compare any two versions of a file (`GET /files/{id}/diff`)
- Content deduplication in MinIO (SHA-256 hash-based)
- Webhook notifications to downstream engines on file READY
- Circuit breaker pattern for extranet API calls

#### Changed
- Normalizer pipeline refactored to streaming architecture (memory reduced by 60%)
- File type registry hot-reload interval reduced from 5 minutes to 60 seconds
- MinIO storage key convention changed to include version number
- PostgreSQL connection pool tuned: min 5 → 10, max 25 → 50

#### Fixed
- Extranet session not refreshing for NSE leading to 401 after 4 hours
- BSE Bhavcopy ZIP extraction failing for files > 50 MB
- Corporate action adjustment factor calculation for bonus issues

---

### [2.3.0] — 2026-05-01

#### Added
- BSE MFTP API support (8 file types: BHAVCOPY, CORP_ACT, etc.)
- Cross-exchange Bhavcopy correlation (NSE vs BSE price comparison)
- File type versioning: schema changes tracked in `file_types` history table
- Synthetic monitoring: extranet connectivity check every 5 minutes

#### Changed
- API key authentication refactored to SHA-256 hashed storage (was bcrypt)
- Deadline monitoring interval reduced from 5 minutes to 1 minute
- File download timeout per file type (was global 120s)

#### Fixed
- Large file downloads (> 100 MB) timing out on 120s global timeout
- Date normalizer not handling `DD-Mon-YYYY` format correctly for months Nov/Dec
- Validation layer 3 (cross-file) running unnecessarily for files with no cross-references

---

### [2.2.0] — 2026-03-15

#### Added
- Corporate Actions processing pipeline with 7 action types
- Adjustment factor computation for dividends, splits, and bonuses
- Corporate action downstream notification (webhook to all subscribers)
- File integrity verification (checksum comparison on download)

#### Changed
- File type registry migrated from static config to PostgreSQL-backed
- API key scoping: per-engine file type allowlist
- Validation engine: Layer 3 cross-file validation enabled

---

### [2.1.0] — 2026-01-20

#### Added
- MinIO object storage for file blobs (migrated from filesystem)
- File versioning with immutable history
- TimescaleDB audit event hypertables
- Distribution API with presigned URL support

#### Changed
- File retention policy: 5 years online (was 1 year)
- Logging: migrated to structured JSON + Elasticsearch (was file-based)

---

### [2.0.0] — 2025-10-01

#### Added
- Complete rewrite: monolithic file service → pipeline architecture
- Extranet API Client with NSE certificate auth
- Automated BOD/EOD scheduling
- Multi-layer validation engine (Structural, Business, Cross-File)
- Column-level normalization pipeline
- File Type Registry with hot reload
- Redis distributed locking for scheduler

#### Removed
- Legacy cron-based file download scripts
- Direct filesystem file storage (migrated to MinIO)
- Hardcoded file type definitions (migrated to registry)

---

### [1.x] — 2024–2025 (Legacy — Archived)

- Manual file downloads via cron scripts
- Local filesystem storage in `/data/exchange-files/`
- No validation — files distributed as-is
- No versioning or audit trail
- Single-instance deployment

---

## Upcoming Releases

### [2.5.0] — Planned Q3 2026

- MCX commodity exchange support (~6 new file types)
- Intraday file refresh for SPAN Margin (every 2 hours)
- File anomaly detection using ML models

### [2.6.0] — Planned Q4 2026

- File diff engine enhancements (column-level diff)
- WebSocket notifications for real-time file ready events
- API key auto-rotation for downstream engines

### [3.0.0] — Planned Q1 2027

- Real-time streaming files via extranet push (WebHook from NSE)
- PostgreSQL table partitioning for file_versions
- Multi-region active-active pipeline

---

## Migration Notes

### Upgrading from 2.3.x to 2.4.x

1. **Database migration:** Run `node scripts/migrate.js up` — adds `emergency_storage` columns
2. **Configuration changes:**
   - `pipeline.emergencyDir` added (default: `/data/surya/emergency`)
   - `pipeline.schedulerLockTtlMs` increased (1000000 → 600000)
3. **MinIO:** No changes required; backward-compatible

### Upgrading from 1.x to 2.0.0 (Major)

1. Complete architecture change — no in-place upgrade
2. Set up MinIO object storage
3. Set up PostgreSQL with TimescaleDB
4. Register all file types in the new registry
5. Migrate historical files: `node scripts/migrate-files-to-minio.js`
6. Run old and new systems in parallel for 1 week before cutover

---

## Deprecation Schedule

| Feature | Deprecated In | Removal Planned |
|---|---|---|
| Direct filesystem file storage | 2.0.0 | 3.0.0 |
| Static config file types | 2.2.0 | 3.0.0 |
| File-based audit logs | 2.1.0 | 2.5.0 |
| bcrypt API key hashing | 2.3.0 | 2.6.0 |
| Single MinIO node deployment | 2.0.0 | Already removed |
