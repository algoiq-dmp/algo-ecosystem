# 15 — Logging Standards

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Logging Philosophy

Surya uses **structured JSON logging** for all pipeline events, API requests, and error conditions. Every log entry must be self-contained and queryable.

---

## Log Levels

| Level | Usage | Example |
|---|---|---|
| `fatal` | Unrecoverable, process exit | Database lost, extranet cert expired |
| `error` | Operation failed, needs attention | File validation failed, extranet connection lost |
| `warn` | Potential issue | File approaching deadline, row count anomaly |
| `info` | Normal operational events | File downloaded, validated, stored, ready |
| `debug` | Detailed troubleshooting | Column mapping details, checksum computations |
| `trace` | Extremely verbose | Raw extranet API request/response bodies |

---

## Standard Log Schema

```json
{
  "timestamp": "ISO 8601 with timezone",
  "level": "fatal|error|warn|info|debug|trace",
  "component": "ExtranetClient|FileFetcher|Validator|Normalizer|VersionStore|DistributionAPI|Scheduler|FileWatcher|AuditLogger|NotificationService",
  "message": "Human-readable description",
  "fileTypeCode": "SEC_TOK (if applicable)",
  "fileId": "SURYA-... (if applicable)",
  "exchange": "NSE|BSE (if applicable)"
}
```

---

## Component-Specific Logging

### Extranet API Client

```javascript
// Session opened
logger.info('Extranet session established', {
  exchange: 'NSE',
  sessionId: 'nse-sess-abc123',
  certExpiryDays: 87
});

// Download started
logger.info('File download started', {
  exchange: 'NSE',
  fileTypeCode: 'SEC_TOK',
  endpoint: '/api/v2/files/securities/tokens',
  fileDate: '2026-07-24'
});

// Rate limit hit
logger.warn('Extranet rate limit reached', {
  exchange: 'NSE',
  rateLimit: 10,
  retryAfterMs: 6000
});

// Certificate expiry warning
logger.warn('Extranet certificate expiring soon', {
  exchange: 'NSE',
  daysUntilExpiry: 25,
  certificatePath: '/etc/surya/certs/nse/nse_client.crt'
});
```

### File Fetcher

```javascript
// Download complete
logger.info('File download complete', {
  fileTypeCode: 'SEC_TOK',
  exchange: 'NSE',
  stagingPath: '/data/surya/staging/nse/SEC_TOK/20260724/raw.csv',
  fileSizeBytes: 2456789,
  checksumSHA256: 'e3b0c442...',
  downloadDurationMs: 12345,
  attempt: 1
});

// Checksum mismatch
logger.error('File checksum mismatch', {
  fileTypeCode: 'BHAVCOPY',
  computedChecksum: 'aaa...',
  exchangeChecksum: 'bbb...',
  attempt: 2
});
```

### Validator

```javascript
// Validation passed
logger.info('File validation passed', {
  fileId: 'SURYA-20260724-SEC_TOK-0001',
  fileTypeCode: 'SEC_TOK',
  layers: { structural: 'PASS', business: 'PASS', crossFile: 'SKIP' },
  durationMs: 2345
});

// Validation failed
logger.error('File validation failed', {
  fileId: 'SURYA-20260724-SPN_MRG-0003',
  fileTypeCode: 'SPN_MRG',
  failedLayer: 'structural',
  failedCheck: 'ROW_COUNT_IN_RANGE',
  detail: 'Row count 5000 vs baseline 50000 (90% deviation)'
});
```

### Version Store

```javascript
// File stored
logger.info('File stored in MinIO', {
  fileId: 'SURYA-20260724-SEC_TOK-0001',
  storageKey: 'surya/nse/SEC_TOK/2026/07/24/v1_SEC_TOK_20260724.csv.gz',
  compressedSize: 512000,
  compressionRatio: '79%'
});

// Duplicate content detected
logger.info('Duplicate content — reusing existing object', {
  fileId: 'SURYA-20260724-SEC_TOK-0001',
  contentHash: 'abc123...',
  existingStorageKey: 'surya/nse/SEC_TOK/2026/07/23/v1_SEC_TOK_20260723.csv.gz'
});
```

### File Watcher

```javascript
// Deadline approaching
logger.warn('File approaching deadline', {
  fileTypeCode: 'CIRC_BRK',
  deadline: '08:00 IST',
  timeRemainingSec: 540,
  currentState: 'FETCHING'
});

// Deadline missed
logger.error('File deadline missed', {
  fileTypeCode: 'SPN_MRG',
  deadline: '08:00 IST',
  currentTime: '08:16 IST',
  minutesLate: 16,
  currentState: 'FAILED'
});
```

---

## Audit Event Logging

Every pipeline action that affects file state is written to `audit.file_events`:

```sql
INSERT INTO audit.file_events (event_type, file_id, file_type_code, exchange, component, detail)
VALUES (
  'FILE_READY',
  'SURYA-20260724-SEC_TOK-0001',
  'SEC_TOK',
  'NSE',
  'Pipeline',
  '{"version": 1, "rowCount": 45890, "fileSizeBytes": 2456789}'
);
```

---

## Log Transport

### Production

```json
{
  "logging": {
    "level": "info",
    "format": "json",
    "outputs": ["stdout", "elasticsearch"],
    "elasticsearch": {
      "hosts": ["es1.algoiq.internal:9200"],
      "index": "surya-logs-%{+yyyy.MM.dd}",
      "bufferSize": 100,
      "flushIntervalMs": 5000
    }
  }
}
```

### Development

```json
{
  "logging": {
    "level": "debug",
    "format": "pretty",
    "outputs": ["stdout"]
  }
}
```

---

## Log Retention

| Log Type | Storage | Hot | Archive |
|---|---|---|---|
| Application logs | Elasticsearch | 30 days | 1 year (S3) |
| Extranet API logs | Elasticsearch | 30 days | 1 year (S3) |
| Audit events | TimescaleDB | 365 days | 5 years (S3) |
| Fetched file logs | PostgreSQL `fetch_log` | 90 days | 1 year |

---

## Query Examples (Kibana)

```
# All events for a specific file
fileId: "SURYA-20260724-SEC_TOK-0001"

# Today's failed files
component: "Validator" AND message: "VALIDATION_FAILED" AND @timestamp > now/d

# Extranet connectivity issues
component: "ExtranetClient" AND (level: "error" OR level: "warn")

# BOD pipeline status today
component: "Pipeline" AND message: "FILE_READY" AND @timestamp > now/d
| sort @timestamp asc

# Deadline misses this month
component: "FileWatcher" AND message: "DEADLINE_MISSED" AND @timestamp > now-30d

# Files with row count anomalies
component: "Validator" AND message: "ROW_COUNT_IN_RANGE" AND @timestamp > now-7d
```
