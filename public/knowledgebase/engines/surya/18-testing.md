# 18 — Testing Strategy

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Testing Pyramid

```
        ┌──────┐
        │ E2E  │  5% — Full pipeline with mock extranet
        ├──────┤
        │ Int. │  20% — File pipeline + API + MinIO + DB
        ├──────┤
        │ Unit │  75% — Validators, normalizers, individual transforms
        └──────┘
```

---

## Unit Tests

### Technology

- **Framework:** Jest
- **Mocking:** Jest mocks
- **Coverage Target:** 85% lines, 80% branches

### Test Categories

| Component | Tests | Key Focus |
|---|---|---|
| Column Renamer | 30+ | Exchange → canonical column names for all 18 file types |
| Date Normalizer | 25+ | All date formats: `DD-Mon-YYYY`, `DD/MM/YYYY`, `YYYYMMDD`, etc. |
| Number Cleaner | 20+ | Indian number formats, currency symbols, commas |
| Null Standardizer | 15+ | Exchange-specific null placeholders |
| Encoding Converter | 10+ | UTF-8, Windows-1252, Latin1 detection and conversion |
| Structural Validator | 40+ | Header matching, row counts, empty files, parse errors |
| Business Validator | 35+ | Column rules, primary key uniqueness, range checks |
| Cross-File Validator | 15+ | Token existence, contract references |
| API Auth | 15+ | Key validation, scope checking, rate limiting |

---

## Integration Tests

### Technology

- **Framework:** Jest + Testcontainers
- **Services:** PostgreSQL, MinIO, Redis, RabbitMQ (all ephemeral)
- **Mock Extranet:** nock-based HTTP mock returning real file fixtures

### Test Scenarios

| Scenario | Description | Expected Outcome |
|---|---|---|
| Full BOD pipeline | SEC_TOK through all stages | File in READY state |
| Validation failure | File with missing columns | File in VALIDATION_FAILED |
| Normalizer edge cases | File with mixed encodings | Normalized UTF-8 output |
| MinIO storage error | MinIO unavailable | Emergency storage fallback |
| Deadline monitoring | File not ready by deadline | Alert triggered |
| API list files | Query with filters | Correct results returned |
| API download | Download stored file | File streamed correctly |
| Concurrent fetches | Two file types simultaneously | Both complete without conflict |
| Scheduler lock | Two instances try same file | Only one processes |

### Example: Pipeline Integration Test

```javascript
describe('File Pipeline Integration', () => {
  let postgresContainer, minioContainer, redisContainer;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();
    minioContainer = await new MinioContainer().start();
    redisContainer = await new RedisContainer().start();

    await initializeApp({
      pgUrl: postgresContainer.getConnectionUri(),
      minioConfig: minioContainer.getConnectionInfo(),
      redisUrl: redisContainer.getConnectionUri()
    });
  });

  it('should process SEC_TOK end-to-end', async () => {
    // Mock extranet response
    nock('https://extranet.nseindia.com')
      .get('/api/v2/files/securities/tokens')
      .query({ date: '20260724' })
      .replyWithFile(200, 'test/fixtures/SEC_TOK_valid.csv');

    // Trigger pipeline
    await pipeline.process('SEC_TOK', '2026-07-24');

    // Verify file is READY
    const file = await getFileByTypeAndDate('SEC_TOK', '2026-07-24');
    expect(file.state).toBe('READY');
    expect(file.rowCount).toBeGreaterThan(1000);

    // Verify file in MinIO
    const exists = await minio.fileExists(file.storageBucket, file.storageKey);
    expect(exists).toBe(true);

    // Verify file downloadable via API
    const response = await request(app)
      .get(`/api/v1/files/${file.fileId}/download`)
      .set('X-API-Key', 'ganesh-key');
    expect(response.status).toBe(200);
  });
});
```

---

## End-to-End Tests

### Mock Extranet Server

```javascript
// scripts/mock-extranet.js
const express = require('express');
const app = express();

// Mock NSE extranet
app.get('/api/v2/files/securities/tokens', (req, res) => {
  res.set('Content-Type', 'text/csv');
  res.sendFile('test/fixtures/nse/SEC_TOK_valid.csv');
});

app.get('/api/v2/files/margin/span', (req, res) => {
  res.set('Content-Type', 'text/csv');
  res.sendFile('test/fixtures/nse/SPN_MRG_valid.csv');
});

app.listen(8090, () => console.log('Mock extranet on :8090'));
```

### E2E Scenarios

| Scenario | Duration | Schedule |
|---|---|---|
| Full BOD pipeline (all 15 NSE files) | ~10 min | Nightly |
| Full EOD pipeline (all 8 files) | ~5 min | Nightly |
| Anomalous file (50% row count drop) | Per test | Nightly |
| Corrupted file (checksum mismatch) | Per test | Nightly |
| Large file (> 100 MB Bhavcopy) | Per test | Weekly |
| 30-day continuous processing | ~30 min | Monthly |

---

## Test Fixtures

### Directory Structure

```
test/
├── fixtures/
│   ├── nse/
│   │   ├── SEC_TOK_valid.csv          (1000 rows)
│   │   ├── SEC_TOK_missing_columns.csv
│   │   ├── SPN_MRG_valid.csv          (500 rows)
│   │   ├── SPN_MRG_low_row_count.csv  (10 rows — validation trigger)
│   │   ├── BHAVCOPY_valid.csv         (2000 rows)
│   │   └── BHAVCOPY_corrupted.csv.gz  (truncated gzip)
│   ├── bse/
│   │   ├── BHAVCOPY_valid.csv
│   │   └── CORP_ACT_valid.json
│   └── edge_cases/
│       ├── mixed_encoding.csv
│       ├── indian_number_formats.csv
│       ├── empty_file.csv
│       ├── header_only.csv
│       └── very_large.csv             (100K rows)
├── seeds/
│   └── file_types.json                (all 18 file types)
└── helpers/
    ├── mock-extranet.js
    ├── minio-test-helper.js
    └── db-test-helper.js
```

---

## Running Tests

```bash
# All unit tests
npm test

# Unit tests with coverage
npm test -- --coverage

# Integration tests (requires Docker)
npm run test:integration

# E2E tests (requires mock extranet running)
npm run test:e2e

# Specific component
npm test -- --testPathPattern="validator"

# Watch mode
npm test -- --watch
```

---

## Pre-Commit & CI Gates

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  },
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write"]
  }
}
```

### CI Pipeline

```
1. Lint (ESLint + Prettier)
2. Unit Tests (Jest — coverage >= 85%)
3. Integration Tests (Testcontainers — all pass)
4. Security Scan (npm audit, Snyk — no HIGH/CRITICAL)
5. Build Docker Image
6. E2E Tests (against ephemeral environment with mock extranet)
7. Deploy to Staging
```

---

## Exchange File Simulation

For testing validation logic against realistic exchange data:

```javascript
// test/helpers/generate-fixture.js
function generateSecTokFixture(rowCount = 1000) {
  const symbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', /* ... */];
  const series = ['EQ', 'BE'];

  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    rows.push({
      SYMBOL: symbols[i % symbols.length] + (i > symbols.length ? `-${i}` : ''),
      ISIN: `INE${String(i).padStart(8, '0')}${randomDigit()}`,
      TOKEN: 10000 + i,
      SERIES: series[i % series.length],
      LOT_SIZE: 1,
      TICK_SIZE: 0.05,
      FACE_VALUE: [1, 2, 5, 10][i % 4]
    });
  }

  return rows;
}
```
