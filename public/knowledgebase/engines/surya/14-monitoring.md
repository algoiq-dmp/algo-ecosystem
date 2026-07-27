# 14 — Monitoring & Observability

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Observability Stack

| Component | Technology | Purpose |
|---|---|---|
| Metrics | Prometheus + Grafana | Pipeline and system metrics |
| Logs | Elasticsearch + Kibana | Centralized log aggregation |
| Alerts | AlertManager + PagerDuty + Slack | Incident notification |
| Dashboards | Grafana | Operational visibility |
| Synthetic Checks | Custom script (every 5 min) | End-to-end file pipeline health |

---

## Key Metrics

### Business Metrics

| Metric | Type | Labels | Description |
|---|---|---|---|
| `surya_files_processed_total` | Counter | `file_type, exchange, status` | Total files processed |
| `surya_files_ready` | Gauge | `file_type, exchange` | Files in READY state today |
| `surya_files_failed` | Gauge | `file_type, exchange` | Files in FAILED state today |
| `surya_file_pipeline_duration_ms` | Histogram | `file_type, exchange, stage` | Time per pipeline stage |
| `surya_file_size_bytes` | Histogram | `file_type, exchange` | Downloaded file sizes |
| `surya_file_row_count` | Gauge | `file_type, exchange` | Row count per file |
| `surya_deadline_missed` | Counter | `file_type` | Files missing at deadline |
| `surya_validations_total` | Counter | `file_type, layer, result` | Validation checks by result |

### System Metrics

| Metric | Type | Labels | Description |
|---|---|---|---|
| `surya_api_requests_total` | Counter | `endpoint, method, status` | API request count |
| `surya_api_request_duration_ms` | Histogram | `endpoint` | API latency |
| `surya_minio_operations_total` | Counter | `operation, bucket` | MinIO read/write operations |
| `surya_extranet_api_calls_total` | Counter | `exchange, status` | Extranet API call count |
| `surya_scheduler_lock_acquired` | Counter | `file_type` | Distributed lock acquisitions |
| `surya_db_query_duration_ms` | Histogram | `operation, table` | DB query latency |

---

## Grafana Dashboards

### Dashboard: Surya — Pipeline Overview

| Panel | Metric | Visualization |
|---|---|---|
| Today's Files Status | `surya_files_processed_total` | Status Grid (green=READY, red=FAILED) |
| Pipeline Duration by Stage | `surya_file_pipeline_duration_ms by (stage)` | Stacked Bar |
| Validation Failure Rate | `rate(surya_validations_total{result="fail"}[1h])` | Stat + Timeseries |
| BOD File Readiness | `surya_files_ready by (file_type)` | Status Timeline |
| MinIO Storage Usage | MinIO bucket metrics | Gauge |
| Extranet API Latency | `surya_extranet_api_calls_duration_ms` | Heatmap |

### Dashboard: Surya — File Health

| Panel | Metric |
|---|---|
| Deadline Misses (Today) | `surya_deadline_missed` |
| Deadline Misses (Monthly) | `sum(increase(surya_deadline_missed[30d])) by (file_type)` |
| File Size Anomaly | `surya_file_size_bytes` vs 30-day rolling average |
| Row Count Anomaly | `surya_file_row_count` vs baseline |
| Late Files This Week | Table of files missing deadline |

### Dashboard: Surya — Extranet Health

| Panel | Metric |
|---|---|
| NSE Extranet Availability | `up{target="nse_extranet"}` |
| BSE MFTP Availability | `up{target="bse_mftp"}` |
| Extranet Response Time | `surya_extranet_api_calls_duration_ms` by exchange |
| Rate Limit Hits | `surya_extranet_rate_limit_hits_total` by exchange |
| Certificate Expiry | `cert_expiry_days{path=~".*nse.*"}` |

---

## Alert Rules

### Critical Alerts (PagerDuty)

```yaml
- alert: SuryaDown
  expr: up{job="surya"} == 0
  for: 60s
  severity: critical
  summary: "Surya instance is down"

- alert: FileDeadlineMissed
  expr: surya_files_ready{file_type!=""} == 0 and on(file_type) surya_deadline_seconds_left < 0
  for: 0s
  severity: critical
  summary: "{{ $labels.file_type }} has missed its deadline"

- alert: FileProcessingFailed
  expr: surya_files_failed > 0
  for: 5m
  severity: critical
  summary: "{{ $value }} file(s) in FAILED state"

- alert: ExtranetConnectionLost
  expr: surya_extranet_connected{exchange="NSE"} == 0
  for: 2m
  severity: critical
  summary: "NSE extranet connection lost"

- alert: MinioUnavailable
  expr: surya_minio_healthy == 0
  for: 1m
  severity: critical
  summary: "MinIO storage is unavailable"
```

### Warning Alerts (Slack)

```yaml
- alert: FileApproachingDeadline
  expr: surya_files_ready == 0 and surya_deadline_seconds_left < 600
  for: 1m
  severity: warning
  summary: "{{ $labels.file_type }} approaching deadline (10 min remaining)"

- alert: ValidationWarnings
  expr: rate(surya_validations_total{result="warn"}[30m]) > 0
  for: 5m
  severity: warning
  summary: "Validation warnings detected for {{ $labels.file_type }}"

- alert: HighPipelineDuration
  expr: histogram_quantile(0.95, rate(surya_file_pipeline_duration_ms_bucket[30m])) > 300000
  for: 10m
  severity: warning
  summary: "P95 pipeline duration > 5 minutes"

- alert: RowCountAnomaly
  expr: abs(surya_file_row_count - surya_file_row_count_baseline) / surya_file_row_count_baseline > 0.5
  severity: warning
  summary: "{{ $labels.file_type }} row count deviation > 50%"
```

---

## Synthetic Monitoring

Every 5 minutes, Surya performs a health check against the extranet:

```javascript
async function syntheticCheck() {
  // 1. Check extranet connectivity
  const nseHealthy = await checkExtranet('NSE');
  const bseHealthy = await checkExtranet('BSE');

  // 2. Check MinIO accessibility
  const minioHealthy = await checkMinIO();

  // 3. Check DB connectivity
  const dbHealthy = await checkDatabase();

  // 4. Report metrics
  metrics.surya_extranet_connected.set({ exchange: 'NSE' }, nseHealthy ? 1 : 0);
  metrics.surya_extranet_connected.set({ exchange: 'BSE' }, bseHealthy ? 1 : 0);
  metrics.surya_minio_healthy.set(minioHealthy ? 1 : 0);
  metrics.surya_db_healthy.set(dbHealthy ? 1 : 0);
}
```

---

## Log Aggregation

Structured JSON logs shipped to Elasticsearch:

```json
{
  "timestamp": "2026-07-24T06:15:41.234+05:30",
  "level": "info",
  "component": "Pipeline",
  "fileTypeCode": "SEC_TOK",
  "fileId": "SURYA-20260724-SEC_TOK-0001",
  "stage": "STORAGE",
  "message": "File stored in MinIO",
  "storageKey": "surya/nse/SEC_TOK/2026/07/24/v1_SEC_TOK_20260724.csv.gz",
  "fileSizeBytes": 2456789,
  "durationMs": 1234
}
```

### Kibana Saved Searches

| Search | Query |
|---|---|
| Pipeline errors | `level: "error" AND component: "Pipeline"` |
| File deadline misses | `component: "FileWatcher" AND message: "DEADLINE_MISSED"` |
| Extranet API issues | `component: "ExtranetClient" AND level: ("error" OR "warn")` |
| Validation failures | `component: "Validator" AND message: "VALIDATION_FAILED"` |
| Today's file summary | `component: "Pipeline" AND message: "FILE_READY" AND @timestamp > now/d` |

---

## Daily Operations Report (Email)

Generated at 17:00 IST summarizing the day's file processing:

```
Subject: Surya Daily Report — 2026-07-24

BOD Summary (18 file types):
  ✓ READY: 17 files
  ✗ FAILED: 0 files
  ⏱ Late (> deadline): 1 (CIRC_BRK — 4 minutes late)

EOD Summary (8 file types):
  ✓ READY: 8 files
  ✗ FAILED: 0 files

Pipeline Performance:
  Avg download time: 12.3s
  Avg validation time: 2.1s
  Avg normalization time: 3.4s
  Total data ingested: 487 MB

Storage:
  MinIO usage: 2.3 TB / 42 TB (5.5%)
  Files archived today: 0

Alerts:
  Warnings: 1 (CIRC_BRK approaching deadline)
  Critical: 0
```
