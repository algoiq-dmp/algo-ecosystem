# 09 — API Reference

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Base URL

```
Production:  https://surya-api.algoiq.com/api/v1
Staging:     https://surya-api.staging.algoiq.com/api/v1
Local:       http://localhost:3005/api/v1
```

---

## Authentication

All API requests require:

| Header | Description |
|---|---|
| `X-API-Key` | API key issued per consuming engine |

API keys are scoped to specific file types. A key for Ganesh cannot access Vega-only files.

---

## Endpoints

### List Files

```
GET /api/v1/files
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `fileType` | string | No | Filter by file type code (e.g., `SEC_TOK`) |
| `exchange` | string | No | Filter by exchange (`NSE`, `BSE`) |
| `date` | date | No | Filter by file date (ISO 8601) |
| `dateFrom` | date | No | Start of date range |
| `dateTo` | date | No | End of date range |
| `state` | string | No | Filter by state (`READY`, `FAILED`, `PENDING`) |
| `limit` | integer | No | Max records (default 50, max 200) |
| `offset` | integer | No | Pagination offset |

**Response (200 OK):**

```json
{
  "data": [
    {
      "fileId": "SURYA-20260724-SEC_TOK-0001",
      "fileTypeCode": "SEC_TOK",
      "fileTypeName": "Security Token",
      "exchange": "NSE",
      "fileDate": "2026-07-24",
      "version": 1,
      "state": "READY",
      "checksumSHA256": "e3b0c442...",
      "fileSizeBytes": 2456789,
      "rowCount": 45890,
      "readyAt": "2026-07-24T06:15:41.234+05:30"
    }
  ],
  "pagination": {
    "total": 18,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

---

### Get File Metadata

```
GET /api/v1/files/{fileId}
```

**Response (200 OK):**

```json
{
  "fileId": "SURYA-20260724-SEC_TOK-0001",
  "fileTypeCode": "SEC_TOK",
  "fileTypeName": "Security Token",
  "exchange": "NSE",
  "fileDate": "2026-07-24",
  "version": 1,
  "state": "READY",
  "checksumSHA256": "e3b0c44298fc1c149afbf4c8996fb92427e41e4649b934ca495991b7852b855",
  "fileSizeBytes": 2456789,
  "rowCount": 45890,
  "columnCount": 28,
  "columns": ["symbol", "isin", "token", "series", "lot_size", "tick_size", ...],
  "compressed": true,
  "compression": "gzip",
  "storageKey": "surya/nse/SEC_TOK/2026/07/24/v1_SEC_TOK_20260724.csv.gz",
  "readyAt": "2026-07-24T06:15:41.234+05:30",
  "pipelineDuration": {
    "fetchMs": 12345,
    "validationMs": 2345,
    "normalizationMs": 3456,
    "storageMs": 1234
  }
}
```

---

### Download File

```
GET /api/v1/files/{fileId}/download
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `format` | string | `csv` | `csv` or `parquet` |
| `presigned` | boolean | `false` | Return presigned MinIO URL instead of streaming |

**Response — Direct Download (200 OK):**

```
Content-Type: text/csv
Content-Disposition: attachment; filename="SEC_TOK_20260724.csv"
Content-Encoding: gzip
Content-Length: 512000
X-Checksum-SHA256: e3b0c442...

[Binary file stream]
```

**Response — Presigned URL (200 OK):**

```json
{
  "presignedUrl": "https://minio.internal/surya-files/nse/SEC_TOK/2026/07/24/v1_SEC_TOK_20260724.csv.gz?X-Amz-...",
  "expiresAt": "2026-07-24T06:25:00+05:30"
}
```

---

### List File Versions

```
GET /api/v1/files/{fileId}/versions
```

**Response (200 OK):**

```json
{
  "fileId": "SURYA-20260724-BHAVCOPY-0005",
  "fileTypeCode": "BHAVCOPY",
  "versions": [
    { "version": 1, "state": "READY", "checksumSHA256": "aaa...", "readyAt": "2026-07-24T15:45:30+05:30" },
    { "version": 2, "state": "READY", "checksumSHA256": "bbb...", "readyAt": "2026-07-24T16:00:15+05:30" }
  ]
}
```

---

### Diff File Versions

```
GET /api/v1/files/{fileId}/diff?fromVersion=1&toVersion=2
```

**Response (200 OK):**

```json
{
  "fileId": "SURYA-20260724-BHAVCOPY-0005",
  "fromVersion": 1,
  "toVersion": 2,
  "summary": {
    "rowsAdded": 5,
    "rowsRemoved": 2,
    "rowsModified": 34,
    "rowsUnchanged": 45234
  }
}
```

---

### List Supported File Types

```
GET /api/v1/files/types
```

**Response (200 OK):**

```json
{
  "fileTypes": [
    {
      "code": "SEC_TOK",
      "name": "Security Token",
      "exchange": "NSE",
      "schedule": "BOD",
      "deadline": "08:30 IST",
      "columns": ["symbol", "isin", "token", "series", "lot_size", "tick_size", ...],
      "description": "Maps trading symbols to instrument tokens"
    }
  ]
}
```

---

### Health Check

```
GET /api/v1/health
```

**Response (200 OK):**

```json
{
  "status": "healthy",
  "version": "2.4.1",
  "uptime": 2567890,
  "checks": {
    "database": "ok",
    "redis": "ok",
    "minio": "ok",
    "nse_extranet": "connected",
    "bse_mftp": "connected",
    "rabbitmq": "ok"
  },
  "todayStats": {
    "filesProcessed": 16,
    "filesReady": 15,
    "filesFailed": 0,
    "filesPending": 2
  }
}
```

---

### Admin: Trigger File Fetch

```
POST /api/v1/admin/files/trigger
X-API-Key: admin-key
```

**Request Body:**

```json
{
  "fileTypeCode": "SPN_MRG",
  "fileDate": "2026-07-24"
}
```

**Response (202 Accepted):**

```json
{
  "message": "File fetch triggered",
  "fileTypeCode": "SPN_MRG",
  "fileDate": "2026-07-24",
  "fetchId": "fetch-uuid-here"
}
```

---

### Admin: File Pipeline Status

```
GET /api/v1/admin/pipeline/status?date=2026-07-24
```

**Response (200 OK):**

```json
{
  "date": "2026-07-24",
  "totalFileTypes": 18,
  "status": {
    "READY": 15,
    "PENDING": 1,
    "FETCHING": 1,
    "FAILED": 0,
    "VALIDATING": 1
  },
  "files": [
    { "fileTypeCode": "SEC_TOK", "state": "READY", "readyAt": "06:15:41" },
    { "fileTypeCode": "SPN_MRG", "state": "FETCHING", "attempt": 2 }
  ]
}
```

---

## Error Responses

| Code | Description |
|---|---|
| 400 | Invalid request parameters |
| 401 | Missing or invalid API key |
| 403 | API key not authorized for this file type |
| 404 | File or file type not found |
| 409 | File already exists (on trigger) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
| 503 | Service unavailable |

### Error Response Format

```json
{
  "error": {
    "code": "FILE_NOT_FOUND",
    "message": "File SURYA-20260724-SEC_TOK-9999 not found",
    "requestId": "req-uuid"
  }
}
```

---

## Rate Limits

| API Key Tier | Rate | Description |
|---|---|---|
| Standard Engine | 100 req/min | Default for most engines |
| High-Volume Engine | 500 req/min | Lakshmi, Ganesh |
| Admin | 1000 req/min | Operations team |

Headers in every response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1765432200
```
