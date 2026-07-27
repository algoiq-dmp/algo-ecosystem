# 05 — Low-Level Design

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## File Lifecycle State Machine

```
                  ┌──────────┐
                  │ PENDING  │
                  └────┬─────┘
                       │ scheduler triggers fetch
                       ▼
                  ┌──────────┐
                  │FETCHING  │
                  └────┬─────┘
                  ┌────┴─────┐
                  │          │
              success     failure (retryable)
                  │          │
                  ▼          ▼
           ┌──────────┐  ┌──────────┐
           │DOWNLOADED│  │  RETRY   │──(max retries exceeded)──▶ ┌────────┐
           └────┬─────┘  └──────────┘                           │ FAILED │
                │                                                └────────┘
                ▼
           ┌──────────┐
           │VALIDATING│
           └────┬─────┘
           ┌────┴─────┐
           │          │
         pass        fail
           │          │
           ▼          ▼
    ┌──────────┐  ┌────────────────┐
    │NORMALIZING│  │ VALIDATION_   │──(alert + manual review)──▶ ┌────────┐
    └────┬─────┘  │   FAILED       │                              │ FAILED │
         │        └────────────────┘                              └────────┘
         ▼
    ┌──────────┐
    │ STORING  │
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │  READY   │──(downstream notification triggers)
    └──────────┘
```

---

## File Data Model

```json
{
  "fileId": "SURYA-20260724-SEC_TOK-0001",
  "fileTypeCode": "SEC_TOK",
  "fileTypeName": "Security Token",
  "exchange": "NSE",
  "schedule": "BOD",
  "fileDate": "2026-07-24",
  "version": 1,
  "state": "READY",
  "checksumSHA256": "e3b0c44298fc1c149afbf4c8996fb92427e41e4649b934ca495991b7852b855",
  "fileSizeBytes": 2456789,
  "rowCount": 45890,
  "columnCount": 28,
  "storageKey": "surya/nse/SEC_TOK/2026/07/24/v1_SEC_TOK_20260724.csv.gz",
  "storageBucket": "surya-files",
  "normalizedFormat": "CSV",
  "compressed": true,
  "compressionAlgo": "gzip",
  "fetchDurationMs": 12345,
  "validationDurationMs": 2345,
  "normalizationDurationMs": 3456,
  "deadline": "2026-07-24T09:00:00+05:30",
  "downloadedAt": "2026-07-24T06:15:23.456+05:30",
  "readyAt": "2026-07-24T06:15:41.234+05:30",
  "retries": 0,
  "errorMessage": null,
  "createdAt": "2026-07-24T06:15:41.234+05:30"
}
```

---

## File Type Registry Schema

```sql
CREATE TABLE file_types (
    file_type_code      VARCHAR(32) PRIMARY KEY,
    file_type_name      VARCHAR(128) NOT NULL,
    exchange            VARCHAR(8) NOT NULL,
    schedule            VARCHAR(16) NOT NULL,  -- BOD, EOD, INTRADAY, ON_DEMAND
    extranet_endpoint   VARCHAR(256) NOT NULL,
    http_method         VARCHAR(8) DEFAULT 'GET',
    expected_columns    JSONB NOT NULL,         -- [{name, type, required, validation}]
    primary_keys        TEXT[] NOT NULL,
    validation_rules    JSONB,                  -- Layer 2 business rules
    cross_ref_rules     JSONB,                  -- Layer 3 cross-file rules
    deadline            TIME NOT NULL,
    retry_max           INTEGER DEFAULT 5,
    retry_backoff_sec   INTEGER DEFAULT 60,
    retention_days      INTEGER DEFAULT 1825,
    subscribers         TEXT[],                 -- Engine names that consume this file
    enabled             BOOLEAN DEFAULT true,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### Example: SEC_TOK Entry

```json
{
  "fileTypeCode": "SEC_TOK",
  "fileTypeName": "Security Token",
  "exchange": "NSE",
  "schedule": "BOD",
  "extranetEndpoint": "/api/v2/files/securities/tokens",
  "expectedColumns": [
    { "name": "SYMBOL", "type": "string", "required": true },
    { "name": "ISIN", "type": "string", "required": true },
    { "name": "TOKEN", "type": "integer", "required": true },
    { "name": "SERIES", "type": "string", "required": true },
    { "name": "LOT_SIZE", "type": "integer", "required": true }
  ],
  "primaryKeys": ["TOKEN"],
  "validationRules": {
    "rowCountMin": 5000,
    "rowCountMaxDeviationPct": 30,
    "columnRules": {
      "LOT_SIZE": { "min": 1, "max": 100000 }
    }
  },
  "crossRefRules": {
    "validateTokensExist": "SEC_TOK.TOKEN"
  },
  "deadline": "08:30:00",
  "subscribers": ["Ganesh", "Lakshmi", "Vega", "Parikshak"]
}
```

---

## Validation Rule Engine

```javascript
class ValidationEngine {
  constructor(fileTypeRegistry) {
    this.registry = fileTypeRegistry;
  }

  async validate(file, fileType, stagingPath) {
    const rules = this.registry.getValidationRules(fileType);
    const results = [];

    // Layer 1: Structural
    results.push(await this.validateStructure(stagingPath, rules.expectedColumns));
    results.push(await this.validateRowCount(stagingPath, rules));

    // Layer 2: Business
    results.push(await this.validateColumns(stagingPath, rules.columnRules));
    results.push(await this.validatePrimaryKeys(stagingPath, rules.primaryKeys));

    // Layer 3: Cross-File (optional, per file type)
    if (rules.crossRefRules) {
      results.push(await this.validateCrossReferences(stagingPath, rules.crossRefRules, file.fileDate));
    }

    const failed = results.filter(r => !r.passed);
    return {
      passed: failed.length === 0,
      results,
      failedChecks: failed.map(r => r.name),
      summary: results.map(r => ({ name: r.name, passed: r.passed, message: r.message }))
    };
  }

  async validateStructure(path, expectedColumns) {
    const actualHeaders = await readCSVHeader(path);
    const missing = expectedColumns.filter(c => !actualHeaders.includes(c.name));
    const extra = actualHeaders.filter(h => !expectedColumns.find(c => c.name === h));

    return {
      name: 'STRUCTURE',
      passed: missing.length === 0,
      message: missing.length > 0 ? `Missing columns: ${missing.join(', ')}` : 'OK'
    };
  }

  async validateRowCount(path, rules) {
    const count = await countCSVRows(path);
    const baseline = await this.registry.getHistoricalAvgRowCount(rules.fileTypeCode);
    const deviation = baseline > 0 ? Math.abs(count - baseline) / baseline : 0;

    return {
      name: 'ROW_COUNT',
      passed: deviation <= (rules.rowCountMaxDeviationPct / 100),
      message: `Rows: ${count} (baseline: ${baseline}, deviation: ${(deviation * 100).toFixed(1)}%)`
    };
  }
}
```

---

## Normalizer Pipeline

```javascript
class Normalizer {
  constructor() {
    this.transforms = [
      new ColumnRenamer(),       // Exchange names → canonical
      new DateNormalizer(),      // Any format → ISO 8601
      new NumberCleaner(),       // Indian number formats → standard
      new NullStandardizer(),    // Exchange placeholders → null
      new EncodingConverter()    // Any encoding → UTF-8
    ];
  }

  async normalize(stagingPath, fileType) {
    const encoding = await this.detectEncoding(stagingPath);
    let stream = fs.createReadStream(stagingPath)
      .pipe(iconv.decodeStream(encoding))
      .pipe(csv.parse({ columns: true }));

    for (const transform of this.transforms) {
      stream = transform.apply(stream, fileType);
    }

    const outputPath = path.join('/data/surya/normalized/', this.buildOutputPath(fileType));

    await pipeline(
      stream,
      csv.stringify({ header: true }),
      fs.createWriteStream(outputPath + '.csv')
    );

    // Also generate Parquet for analytics
    await this.convertToParquet(outputPath + '.csv', outputPath + '.parquet');

    return { csvPath: outputPath + '.csv', parquetPath: outputPath + '.parquet' };
  }
}
```

---

## Distributed Scheduler

```javascript
class Scheduler {
  constructor() {
    this.schedules = new Map();
  }

  async start() {
    const fileTypes = await fileTypeRegistry.getAllEnabled();

    for (const ft of fileTypes) {
      const [hour, minute] = ft.scheduleTime.split(':');
      const cronExpr = `${minute} ${hour} * * 1-5`; // Weekdays only

      this.schedules.set(ft.fileTypeCode, cron.schedule(cronExpr, async () => {
        // Distributed lock: ensure only ONE instance processes this file type
        const lock = await redis.lock(`surya:scheduler:${ft.fileTypeCode}`, 600000);
        if (!lock.acquired) return; // Another instance is processing

        try {
          await this.processFileType(ft);
        } finally {
          await lock.release();
        }
      }));
    }
  }

  async processFileType(fileType) {
    logger.info('Scheduled file fetch triggered', { fileType: fileType.fileTypeCode });

    try {
      const stagingPath = await fileFetcher.fetch(fileType);
      const validation = await validator.validate(stagingPath, fileType);
      if (!validation.passed) throw new ValidationError(validation);

      const normalized = await normalizer.normalize(stagingPath, fileType);
      const stored = await versionStore.store(normalized, fileType);

      await distributionAPI.notifySubscribers(fileType.subscribers, stored);
      await auditLogger.record('FILE_READY', stored);
    } catch (err) {
      logger.error('File processing failed', { fileType: fileType.fileTypeCode, error: err.message });
      await notificationService.alert('FILE_FAILED', fileType, err);
    }
  }
}
```

---

## MinIO Version Store

```
Bucket: surya-files
├── nse/
│   ├── SEC_TOK/
│   │   └── 2026/07/24/
│   │       ├── v1_SEC_TOK_20260724.csv.gz
│   │       ├── v1_SEC_TOK_20260724.parquet
│   │       └── v1_metadata.json
│   ├── BHAVCOPY/
│   │   └── 2026/07/24/
│   │       ├── v1_BHAVCOPY_20260724.csv.gz
│   │       └── v1_metadata.json
│   └── ...
├── bse/
│   ├── BHAVCOPY/
│   │   └── 2026/07/24/
│   │       ├── v1_BHAVCOPY_20260724.csv.gz
│   │       └── v1_metadata.json
│   └── ...
└── archive/                      # Cold storage (5+ years)
    └── 2021/...
```

### Storage Optimization

- Content deduplication: SHA-256 hash as object key; identical files share one object
- Compression: gzip for CSV (~70% reduction), Snappy for Parquet (~50% reduction)
- Lifecycle policies: After 1 year, move to MinIO warm tier; after 5 years, move to AWS S3 Glacier
