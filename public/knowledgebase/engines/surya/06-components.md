# 06 — Component Descriptions

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Component Inventory

Surya comprises **12 core components** organized into 6 pipeline stages plus supporting services.

---

## Extranet API Client

**Type:** HTTPS Client Library  
**Location:** `src/extranet/`  
**Responsibility:** Authenticate and communicate with exchange extranet APIs

| Aspect | NSE | BSE |
|---|---|---|
| Auth Method | X.509 Client Certificate | API Key + IP Whitelist |
| Certificate Storage | HashiCorp Vault (PKI engine) | N/A |
| API Base URL | `https://extranet.nseindia.com/api/v2` | `https://mftp.bseindia.com/api/v1` |
| Rate Limit | 10 req/min | 20 req/min |
| Connection Pool | 5 keep-alive connections | 5 keep-alive connections |
| Timeout | 120 seconds | 120 seconds |

### Key Methods

| Method | Description |
|---|---|
| `listAvailableFiles(exchange, date)` | List all files available on extranet for a date |
| `downloadFile(exchange, endpoint, destPath)` | Download a specific file to staging |
| `validateCredentials(exchange)` | Verify extranet credentials are valid |
| `refreshSession(exchange)` | Renew authentication token/session |

---

## File Fetcher

**Type:** Scheduled Download Manager  
**Location:** `src/fetcher/`

| Aspect | Detail |
|---|---|
| Scheduling | node-cron with per-file-type cron expressions |
| Concurrency | Max 3 concurrent downloads per exchange |
| Resume | HTTP Range header for interrupted downloads |
| Retry | 5 attempts, exponential backoff (30s–480s) |
| Staging | `/data/surya/staging/{exchange}/{fileType}/{date}/` |
| Checksum | SHA-256 computed on download; verified against exchange if provided |

### File Fetch Status Tracking

| Field | Type | Description |
|---|---|---|
| `fetchId` | UUID | Unique fetch attempt ID |
| `fileTypeCode` | String | File type being fetched |
| `status` | Enum | PENDING, DOWNLOADING, DOWNLOADED, FAILED |
| `attempt` | Integer | Current attempt number |
| `startedAt` | Timestamp | When fetch started |
| `completedAt` | Timestamp | When fetch completed (or failed) |
| `httpStatus` | Integer | HTTP response code |
| `errorMessage` | String | Error details if failed |

---

## File Type Registry

**Type:** Configuration Store  
**Location:** `src/registry/`  
**Storage:** PostgreSQL `file_types` table

| Aspect | Detail |
|---|---|
| Total Registered Types | 18 (NSE: 15, BSE: 8, 5 common) |
| Schema Format | JSONB (column definitions with validation rules) |
| Hot Reload | Registry changes applied without restart (TTL cache: 60s) |
| Versioning | Schema changes versioned; backward compatible by default |

### Registered File Types (Partial)

| Code | Name | Exchange | Schedule | Subscribers |
|---|---|---|---|---|
| SEC_TOK | Security Token | NSE | BOD | Ganesh, Lakshmi, Vega |
| CON_MAST | Contract Master | NSE | BOD | Vega, Parikshak |
| SPN_MRG | SPAN Margin | NSE | BOD + Int | Parikshak, Vega |
| EXP_MRG | Exposure Margin | NSE | BOD | Parikshak |
| BHAVCOPY | Bhavcopy | NSE, BSE | EOD | Lakshmi, Ganesh |
| DLV_RPT | Delivery Report | NSE | EOD | Lakshmi |
| SETTLE | Settlement | NSE | EOD | Vega, Parikshak |
| CORP_ACT | Corporate Actions | NSE, BSE | On Demand | ALL |

---

## Validator Pipeline

**Type:** Multi-Layer Validation Engine  
**Location:** `src/validator/`

| Layer | Name | Responsibility |
|---|---|---|
| 1 | Structural Validator | Column headers, row count, parseability, encoding |
| 2 | Business Validator | Column-specific rules, primary key uniqueness, referential integrity |
| 3 | Cross-File Validator | Token existence, contract validity, date consistency |

### Validation Result Model

```json
{
  "fileId": "SURYA-20260724-SEC_TOK-0001",
  "passed": true,
  "layers": {
    "structural": {
      "passed": true,
      "checks": [
        { "name": "HEADERS_MATCH", "passed": true },
        { "name": "ROW_COUNT_IN_RANGE", "passed": true, "detail": "45900 rows (baseline: 45000)" },
        { "name": "NOT_EMPTY", "passed": true },
        { "name": "PARSEABLE", "passed": true }
      ]
    },
    "business": { "passed": true, "checks": [...] },
    "crossFile": { "passed": true, "checks": [...] }
  },
  "durationMs": 2345
}
```

---

## Normalizer Pipeline

**Type:** Data Transformation Engine  
**Location:** `src/normalizer/`

| Transform | Description | Example Input → Output |
|---|---|---|
| Column Renamer | Exchange names → canonical snake_case | `ISIN_CODE` → `isin` |
| Date Normalizer | Any format → ISO 8601 | `24-Jul-2026` → `2026-07-24` |
| Number Cleaner | Strips formatting, converts | `₹1,234.56` → `1234.56` |
| Null Standardizer | Exchange placeholders → null | `NA`, `-`, `0.00` (if invalid) → `null` |
| Encoding Converter | Auto-detect → UTF-8 | Windows-1252 → UTF-8 |

---

## Version Store

**Type:** Immutable Object Storage  
**Location:** `src/store/`

| Aspect | Detail |
|---|---|
| Object Storage | MinIO (S3-compatible) |
| Bucket | `surya-files` |
| Metadata DB | PostgreSQL `file_versions` table |
| Deduplication | SHA-256 content hash; identical → single object |
| Compression | gzip (CSV), Snappy (Parquet) |
| Retention | Hot: 1 year, Warm: 5 years, Cold: Glacier |

### Version Metadata Table

```sql
CREATE TABLE file_versions (
    id              BIGSERIAL PRIMARY KEY,
    file_id         VARCHAR(64) UNIQUE NOT NULL,
    file_type_code  VARCHAR(32) NOT NULL REFERENCES file_types(file_type_code),
    exchange        VARCHAR(8) NOT NULL,
    file_date       DATE NOT NULL,
    version         INTEGER NOT NULL,
    state           VARCHAR(16) NOT NULL DEFAULT 'PENDING',
    checksum_sha256 VARCHAR(64) NOT NULL,
    file_size_bytes BIGINT,
    row_count       INTEGER,
    column_count    INTEGER,
    storage_key     VARCHAR(512) NOT NULL,
    storage_bucket  VARCHAR(64) NOT NULL,
    compressed      BOOLEAN DEFAULT true,
    compression     VARCHAR(16),
    content_hash    VARCHAR(64) NOT NULL,
    fetch_attempts  INTEGER DEFAULT 0,
    downloaded_at   TIMESTAMPTZ,
    ready_at        TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(file_type_code, exchange, file_date, version)
);
```

---

## Distribution API

**Type:** REST API Server  
**Location:** `src/api/`  
**Port:** 3005

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/files` | GET | List files with filters |
| `/api/v1/files/types` | GET | List supported file types |
| `/api/v1/files/{fileId}` | GET | Get file metadata |
| `/api/v1/files/{fileId}/download` | GET | Download file (stream from MinIO) |
| `/api/v1/files/{fileId}/versions` | GET | List versions of a file |
| `/api/v1/files/{fileId}/diff?from=v1&to=v2` | GET | Diff two versions |
| `/api/v1/health` | GET | Health check |

### Authentication

API key in `X-API-Key` header. Each key has access scopes:

```json
{
  "apiKey": "sk-xxxx",
  "engine": "Ganesh",
  "allowedFileTypes": ["SEC_TOK", "BHAVCOPY", "CORP_ACT"],
  "rateLimit": 100,
  "createdAt": "2026-07-24"
}
```

---

## Scheduler

**Type:** Distributed Cron Scheduler  
**Location:** `src/scheduler/`

| Aspect | Detail |
|---|---|
| Scheduling Engine | node-cron |
| Distributed Lock | Redis Redlock (ensures single execution across instances) |
| Lock TTL | 10 minutes (enough for any single file pipeline) |
| On-Demand Trigger | `POST /api/v1/admin/files/trigger` for manual re-fetch |
| Mid-Day Refresh | Configurable intraday refresh for files like SPN_MRG |

---

## File Watcher (Deadline Monitor)

**Type:** Proactive Monitoring  
**Location:** `src/watcher/`

| Aspect | Detail |
|---|---|
| Check Interval | Every 60 seconds |
| Deadline Source | `file_types.deadline` for each file type |
| Alert Levels | WARNING (at deadline), CRITICAL (deadline + 15 min) |
| Escalation | Warning → Slack; Critical → PagerDuty + Email |

---

## Audit Logger

**Type:** Event Logger  
**Location:** `src/audit/`

| Event Type | Emitted By |
|---|---|
| EXTRANET_SESSION_OPENED | Extranet API Client |
| FILE_DOWNLOAD_STARTED | File Fetcher |
| FILE_DOWNLOADED | File Fetcher |
| FILE_VALIDATED | Validator |
| FILE_VALIDATION_FAILED | Validator |
| FILE_NORMALIZED | Normalizer |
| FILE_STORED | Version Store |
| FILE_READY | Pipeline |
| FILE_DISTRIBUTED | Distribution API |
| FILE_DEADLINE_MISSED | File Watcher |
| CREDENTIAL_ROTATED | Credential Manager |

---

## Notification Service

**Type:** Downstream Alerting  
**Location:** `src/notifications/`

| Channel | Trigger |
|---|---|
| **Webhook** | New file READY → notify subscribed engines |
| **Slack** | Warnings (late files, validation anomalies) |
| **PagerDuty** | Critical (deadline missed, pipeline failure) |
| **Email** | Daily digest: all files processed, summary stats |
