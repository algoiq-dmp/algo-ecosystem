# 17 — Error Handling

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Error Handling Philosophy

Surya employs **graceful degradation with alerting**. Errors at any pipeline stage are logged, retried where appropriate, and escalated to Operations when they impact file availability.

---

## Error Classification

| Category | Examples | Action |
|---|---|---|
| **EXT_NETWORK** | Timeout, DNS failure, TLS error | Retry with backoff (5 attempts) |
| **EXT_AUTH** | Certificate expired, API key invalid | Alert + manual intervention |
| **EXT_NOT_FOUND** | File not yet published by exchange | Retry (file may appear later) |
| **VALIDATION** | Row count anomaly, missing columns | Alert + manual review (force accept?) |
| **STORAGE** | MinIO write error, disk full | Retry + emergency storage fallback |
| **DATA_CORRUPTION** | Checksum mismatch after storage | Fatal — mark file CORRUPT, re-fetch |
| **SYSTEM** | DB connection lost, Redis timeout | Retry + circuit breaker |
| **FATAL** | Unrecoverable corruption | Crash + PagerDuty |

---

## Error Response Structure

```json
{
  "error": {
    "code": "FILE_VALIDATION_FAILED",
    "message": "SPAN Margin file row count deviates by 90% from baseline (5000 vs 50000)",
    "fileTypeCode": "SPN_MRG",
    "fileDate": "2026-07-24",
    "details": {
      "failedLayer": "structural",
      "failedCheck": "ROW_COUNT_IN_RANGE",
      "actualRowCount": 5000,
      "baselineRowCount": 50000,
      "deviationPct": 90
    }
  }
}
```

---

## Error Codes Reference

### Extranet Errors

| Code | Description |
|---|---|
| `EXTRANET_CONNECTION_FAILED` | Cannot establish connection to extranet API |
| `EXTRANET_TIMEOUT` | Extranet response exceeded 120s timeout |
| `EXTRANET_AUTH_FAILED` | Credential rejected by exchange |
| `EXTRANET_RATE_LIMITED` | Rate limit hit; retry after backoff |
| `EXTRANET_FILE_NOT_FOUND` | Requested file not available on extranet |
| `EXTRANET_CERT_EXPIRED` | NSE client certificate has expired |

### File Pipeline Errors

| Code | Description |
|---|---|
| `FILE_DOWNLOAD_FAILED` | Download completed but validation failed |
| `FILE_CHECKSUM_MISMATCH` | Computed SHA-256 != exchange checksum |
| `FILE_STRUCTURE_INVALID` | Layer 1 validation failed (columns, parseability) |
| `FILE_BUSINESS_INVALID` | Layer 2 validation failed (column rules) |
| `FILE_CROSSREF_INVALID` | Layer 3 validation failed (cross-file references) |
| `FILE_NORMALIZATION_FAILED` | Normalizer encountered unhandled format |
| `FILE_STORAGE_FAILED` | Cannot write to MinIO |
| `FILE_INTEGRITY_FAILED` | Post-storage checksum mismatch |

### API Errors

| Code | HTTP | Description |
|---|---|---|
| `INVALID_REQUEST` | 400 | Bad request parameters |
| `AUTH_FAILED` | 401 | Invalid or missing API key |
| `ACCESS_DENIED` | 403 | API key lacks scope for this file type |
| `FILE_NOT_FOUND` | 404 | File ID does not exist |
| `RATE_LIMITED` | 429 | API rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Unexpected internal error |

---

## Retry Strategy

| Operation | Max Retries | Backoff | Notes |
|---|---|---|---|
| Extranet file download | 5 | 30s, 60s, 120s, 240s, 480s | Exponential, with jitter |
| MinIO object write | 3 | 5s, 10s, 20s | Linear |
| DB connection | 3 | 1s, 2s, 4s | Exponential, fast |
| Redis operation | 2 | 100ms, 200ms | Fast — short TTL data is expendable |
| Notification dispatch | 3 | 1s, 5s, 25s | Alert on final failure |

---

## Emergency Fallback

### MinIO Storage Failure

```javascript
async function storeWithFallback(normalizedPath, fileId) {
  try {
    return await minioStore.store(normalizedPath, fileId);
  } catch (err) {
    logger.error('MinIO storage failed — using emergency storage', {
      fileId,
      error: err.message
    });

    // Emergency: Store to local emergency directory
    const emergencyPath = path.join(
      config.pipeline.emergencyDir,
      `${fileId}_${Date.now()}.csv.gz`
    );
    await fs.copyFile(normalizedPath, emergencyPath);

    // Mark file state with emergency flag
    await db.updateFileState(fileId, 'STORED_EMERGENCY', {
      emergencyPath,
      originalError: err.message
    });

    // Alert Operations
    await notificationService.alert('MINIO_FAILURE_EMERGENCY_STORAGE', {
      fileId,
      emergencyPath
    });

    return { storageKey: emergencyPath, bucket: 'emergency' };
  }
}
```

---

## Pipeline Error Recovery

### Scenario: File Validation Fails (Unrecoverable)

```
1. Validator returns FAIL
2. File state → VALIDATION_FAILED
3. Audit event: FILE_VALIDATION_FAILED
4. Alert → Slack (#operations)
5. Alert → Email to operations@algoiq.com

Operations Decision:
  Option A: "File is incomplete from exchange"
    → Wait 30 minutes, re-fetch from extranet
    → POST /api/v1/admin/files/trigger

  Option B: "Validation rule too strict"
    → Adjust validation threshold temporarily
    → Force file to READY with override flag

  Option C: "File format changed by exchange"
    → Update File Type Registry schema
    → Re-process with new rules
```

### Scenario: Multiple Files Failing

```
If > 2 file types in FAILED state:
  1. Escalate to CRITICAL (PagerDuty)
  2. Suspect extranet or exchange issue
  3. Operations Lead contacts exchange support
  4. All downstream engines notified of delay
  5. Fallback: Use previous day's file for non-critical data types
```

---

## Circuit Breaker (Extranet API)

```javascript
class ExtranetCircuitBreaker {
  constructor(exchange, options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeoutMs = options.resetTimeoutMs || 60000;
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  async call(fn) {
    if (this.state === 'OPEN') {
      throw new Error(`Extranet circuit OPEN for ${this.exchange}`);
    }

    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failureCount = 0;
      }
      return result;
    } catch (err) {
      this.failureCount++;
      if (this.failureCount >= this.failureThreshold) {
        this.state = 'OPEN';
        logger.error(`Extranet circuit OPEN for ${this.exchange}`, {
          failureCount: this.failureCount,
          lastError: err.message
        });
        setTimeout(() => { this.state = 'HALF_OPEN'; }, this.resetTimeoutMs);
      }
      throw err;
    }
  }
}
```
