# 07 — Data Flow

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## File Ingestion Flow

### Flow 1: BOD File Processing (Happy Path)

```
Step 1: Schedule Trigger (06:00 IST)
  Scheduler wakes → acquires Redis lock → triggers SEC_TOK fetch

Step 2: Extranet Download
  Extranet API Client → NSE Extranet API
  GET /api/v2/files/securities/tokens?date=20260724
  ← Response: CSV file (2.5 MB)
  → Staged to /data/surya/staging/nse/SEC_TOK/20260724/raw.csv

Step 3: Validation
  Layer 1: Headers match expected columns? YES (28/28)
           Row count: 45,890 (baseline 45,000, deviation 2%) → PASS
  Layer 2: All TOKEN values unique? YES
           All LOT_SIZE > 0? YES
  Layer 3: Skip (no cross-reference for SEC_TOK)
  → Result: PASSED

Step 4: Normalization
  Column Renamer: SYMBOL→symbol, ISIN→isin, TOKEN→token, ...
  Date Normalizer: N/A (no dates in SEC_TOK)
  Number Cleaner: Remove commas from numeric fields
  → Output: normalized.csv (2.8 MB), normalized.parquet (1.2 MB)

Step 5: Storage
  Version Store:
    Compute SHA-256 → e3b0c442...
    Write to MinIO: surya-files/nse/SEC_TOK/2026/07/24/v1_SEC_TOK_20260724.csv.gz
    Write metadata to PostgreSQL: file_versions table
  → State: READY

Step 6: Distribution
  Distribution API:
    Notify subscribers (Ganesh, Lakshmi, Vega, Parikshak)
    POST webhook to each engine
    File available at GET /api/v1/files/SURYA-20260724-SEC_TOK-0001/download
```

---

### Flow 2: File Validation Failure

```
File: SPAN Margin (SPN_MRG)
  Downloaded at 06:45 IST
  → Layer 1: Row count 5,000 (baseline 50,000, deviation 90%) → FAIL
  → State: VALIDATION_FAILED
  → Alert: Slack + Email to Operations team
  → Operations review:
      Option A: File is genuinely incomplete → Manual override? No → Re-fetch
      Option B: Exchange published partial file → Accept with flag → Force to READY
  → Re-fetch triggered: Retries 5 times, each attempt fails validation
  → Final state: FAILED
  → PagerDuty alert triggered (CRITICAL)
```

---

### Flow 3: Late File Detection

```
File: Corporate Actions (CORP_ACT)
  Expected: Published by exchange at irregular times
  Deadline: None (on-demand file type, deadline = 1 hour after publication)
  File Watcher:
    11:00 — Check extranet → No new CORP_ACT file
    12:00 — Check extranet → No new CORP_ACT file
    13:00 — Check extranet → New file detected!
    → Auto-triggers fetch pipeline
    → File processed within 10 minutes
    → Notify ALL subscribers (corporate actions affect everything)
```

---

### Flow 4: Downstream Engine Consumption

```
Engine: Ganesh (needs latest SEC_TOK for symbol master update)

1. Ganesh → GET /api/v1/files?fileType=SEC_TOK&date=2026-07-24&state=READY
   ← Response: { files: [{ fileId: "SURYA-20260724-SEC_TOK-0001", ... }] }

2. Ganesh → GET /api/v1/files/SURYA-20260724-SEC_TOK-0001/download
   ← Response: 200 OK, Content-Type: text/csv
   ← Stream body: CSV file from MinIO (decompressed on-the-fly)

3. Audit log:
   { eventType: "FILE_DISTRIBUTED", fileId: "...", consumerEngine: "Ganesh", timestamp: "..." }

Alternative: Presigned URL
  GET /api/v1/files/SURYA-20260724-SEC_TOK-0001/download?presigned=true
  ← Response: { presignedUrl: "https://minio.internal/surya-files/...?token=..." }
  → Ganesh downloads directly from MinIO (faster, bypasses API bandwidth)
```

---

## MQ Event Schemas

### File Ready Event

```json
{
  "header": {
    "eventId": "uuid",
    "eventType": "FILE_READY",
    "timestamp": "ISO8601",
    "version": "1.0"
  },
  "payload": {
    "fileId": "SURYA-20260724-SEC_TOK-0001",
    "fileTypeCode": "SEC_TOK",
    "fileTypeName": "Security Token",
    "exchange": "NSE",
    "fileDate": "2026-07-24",
    "version": 1,
    "checksumSHA256": "e3b0c442...",
    "fileSizeBytes": 2456789,
    "rowCount": 45890,
    "readyAt": "2026-07-24T06:15:41.234+05:30",
    "downloadUrl": "/api/v1/files/SURYA-20260724-SEC_TOK-0001/download"
  }
}
```

---

## Redis Key Schema

| Key Pattern | Type | TTL | Purpose |
|---|---|---|---|
| `surya:scheduler:{fileTypeCode}` | String (lock) | 600s | Distributed scheduler lock |
| `surya:file:{fileId}:state` | Hash | 24h | File processing state cache |
| `surya:file:{fileId}:progress` | Hash | 24h | Download/processing progress |
| `surya:registry:fileTypes` | Hash | 60s | Hot-reload cache for file type registry |
| `surya:stats:{fileTypeCode}:rowsAvg` | String | 7d | Rolling average row count for validation |
| `surya:extranet:{exchange}:rateLimit` | String | 60s | Rate limit token bucket |
| `surya:api:{apiKey}:scope` | Hash | 5m | API key access scopes cache |
| `surya:presigned:{fileId}` | String | 1h | Cached presigned URL |

---

## Data Retention Policy

| Data Type | Storage | Hot Retention | Cold Retention |
|---|---|---|---|
| Exchange files (CSV) | MinIO | 1 year | 5 years (S3 Glacier) |
| Exchange files (Parquet) | MinIO | 1 year | 5 years |
| File metadata | PostgreSQL | Indefinite | Indefinite |
| Audit events | TimescaleDB | 365 days | 5 years (S3) |
| Validation results | PostgreSQL | 90 days | None |
| Extranet API logs | Elasticsearch | 30 days | 1 year (S3) |
| Notification events | RabbitMQ | 7 days (DLQ) | None |

---

## Error Recovery Flows

### Extranet API Unavailable

```
1. File Fetcher attempts download → Connection timeout (120s)
2. Retry with exponential backoff: 30s, 60s, 120s, 240s, 480s
3. After 5 failures → State: FAILED
4. File Watcher detects FAILED → Alert Operations
5. Operations: Check extranet status, contact exchange support
6. Once extranet restored → Trigger manual re-fetch:
   POST /api/v1/admin/files/trigger { fileTypeCode: "SPN_MRG", date: "2026-07-24" }
7. Pipeline restarts from FETCHING state
```

### Corrupted Download

```
1. File download completes but SHA-256 mismatch
2. File Fetcher detects checksum mismatch → State: FETCH_FAILED
3. Retry download (exchange may serve cached/partial)
4. After 2 attempts → Alert Operations with checksum details
5. Operations: Verify with exchange; may accept with flag or skip
```

### Storage Failure

```
1. Normalizer completes → attempts to write to MinIO
2. MinIO write fails (disk full, network)
3. Normalizer retries 3 times with 5-second delay
4. If still failing → State: STORING_FAILED
5. File preserved in /data/surya/normalized/ emergency directory
6. Alert Operations → Manually upload to MinIO once resolved
```
