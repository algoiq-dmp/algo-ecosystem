# 19 — Performance Benchmarks

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Performance Targets

| Metric | Target | P95 | P99 |
|---|---|---|---|
| File download (10 MB file) | < 30 sec | < 45 sec | < 60 sec |
| Structural validation | < 5 sec | < 10 sec | < 15 sec |
| Business validation | < 10 sec | < 20 sec | < 30 sec |
| Normalization | < 15 sec | < 25 sec | < 40 sec |
| MinIO write + metadata | < 5 sec | < 10 sec | < 15 sec |
| Full pipeline (single file) | < 60 sec | < 90 sec | < 120 sec |
| BOD pipeline (all 15 files) | < 2 hours | — | — |
| Distribution API (metadata) | < 200 ms | < 500 ms | < 1 sec |
| Distribution API (file download) | < 5 sec | < 10 sec | < 20 sec |

---

## Benchmark Environment

```
Hardware:
  CPU: Intel Xeon Gold 6248R (3.0 GHz, 16 cores)
  RAM: 32 GB DDR4-2933
  Disk: NVMe SSD (3.5 GB/s read, 3.0 GB/s write)
  Network: 10 Gbps (internal), 100 Mbps (extranet)

Software:
  Node.js: 20.11.0 LTS
  PostgreSQL: 15.6
  MinIO: RELEASE.2024-01
  Redis: 7.2.4
  OS: Ubuntu 22.04 LTS
```

---

## Pipeline Stage Timing (Per File)

Measured across typical file sizes:

```
File Type         | Size    | Download | Validate | Normalize | Store  | TOTAL
─────────────────────────────────────────────────────────────────────────────
SEC_TOK           | 3 MB    | 8s       | 2s       | 5s        | 2s     | 17s
CON_MAST          | 1 MB    | 5s       | 1s       | 3s        | 1s     | 10s
SPN_MRG           | 25 MB   | 22s      | 8s       | 18s       | 6s     | 54s
EXP_MRG           | 5 MB    | 10s      | 3s       | 7s        | 2s     | 22s
BHAVCOPY (NSE)    | 12 MB   | 15s      | 5s       | 10s       | 3s     | 33s
BHAVCOPY (BSE)    | 20 MB   | 25s      | 7s       | 14s       | 5s     | 51s
DLV_RPT           | 8 MB    | 12s      | 3s       | 6s        | 2s     | 23s
SETTLE            | 4 MB    | 8s       | 2s       | 4s        | 1s     | 15s
OPEN_INT          | 8 MB    | 12s      | 4s       | 8s        | 2s     | 26s
CORP_ACT          | 50 KB   | 2s       | 1s       | 1s        | 1s     | 5s
BULK_DEAL         | 200 KB  | 3s       | 1s       | 1s        | 1s     | 6s
CIRC_BRK          | 1 MB    | 5s       | 1s       | 2s        | 1s     | 9s
─────────────────────────────────────────────────────────────────────────────
BOD Total         | ~70 MB  | ~85s     | ~25s     | ~45s      | ~15s   | ~170s
```

---

## Parallel Processing Benefit

```
Serial processing (1 worker):
  BOD: 18 files × avg 17s = ~306 seconds (~5 min)
  + extranet rate limiting overhead = ~7 min total

Parallel processing (3 concurrent downloads, 2 workers):
  BOD: ~170 seconds (~3 min)
  Speedup: ~2x over serial

Bottleneck: Extranet API rate limiting (10 req/min NSE, 20 req/min BSE)
  → Optimal concurrency: 3 simultaneous downloads
  → Adding more workers does not improve beyond ~3x
```

---

## Storage Performance

### MinIO Write Throughput

```
File Size    | Single Write | Parallel (3 files)
─────────────────────────────────────────────
1 MB         | 0.2s         | 0.5s
10 MB        | 1.5s         | 3.2s
50 MB        | 6.0s         | 12.0s
100 MB       | 12.0s        | 24.0s
```

### Compression Benefits

```
File Type     | Raw Size  | gzip Size | Ratio  | Store Time
──────────────────────────────────────────────────────────
SEC_TOK       | 3.0 MB    | 0.8 MB    | 73%    | +1.2s
BHAVCOPY      | 12.0 MB   | 3.2 MB    | 73%    | +3.5s
SPN_MRG       | 25.0 MB   | 6.5 MB    | 74%    | +6.0s
OPEN_INT      | 8.0 MB    | 2.2 MB    | 72%    | +2.5s
```

---

## Distribution API Performance

```
Endpoint                    | P50    | P95    | P99
────────────────────────────────────────────────────────
GET /files (metadata list)  | 45ms   | 120ms  | 250ms
GET /files/{id} (metadata)  | 20ms   | 60ms   | 120ms
GET /files/{id}/download    | 800ms  | 3s     | 8s
  (3 MB file, presignedURL) | 200ms  | 500ms  | 1s
GET /files/types            | 15ms   | 40ms   | 80ms
GET /health                 | 5ms    | 15ms   | 30ms
```

---

## Optimization Techniques

### Download Optimization

- **Keep-alive connections:** Reuse TCP connections for multiple file downloads
- **Range requests:** Resume interrupted downloads from byte offset
- **Connection pooling:** 5 connections per exchange minimizes TLS handshake overhead
- **Parallel downloads:** 3 concurrent downloads (bounded by extranet rate limits)

### Validation Optimization

- **Stream-based parsing:** CSV parsing via Node.js streams (not loading entire file into memory)
- **Early exit:** Structural validation fails fast before business validation
- **Cached baselines:** Row count baselines cached in Redis (TTL: 7 days)

### Normalization Optimization

- **Pipeline transforms:** Each transform is a streaming Transform; backpressure-aware
- **Buffered writes:** Collect 10,000 rows before writing to normalize output
- **Parquet generation:** Parallel to CSV write using worker threads

### Storage Optimization

- **Deduplication:** Skip storage if content hash matches existing object
- **Multipart upload:** MinIO multipart for files > 5 MB (5 MB part size)
- **Compression:** gzip at level 6 (balance speed vs compression ratio)

---

## Memory Usage

```
Operation                  | Memory Peak
─────────────────────────────────────────
Idle                       | 150 MB
Single file download (25 MB)| 180 MB
Validation (streaming)     | 160 MB
Normalization (streaming)  | 200 MB
Concurrent (3 files)       | 350 MB
Large file (100 MB)        | 250 MB
```

Memory is bounded by streaming architecture — files are never fully loaded into memory.

---

## Regression Detection

Performance metrics tracked in InfluxDB per release:

```
surya_benchmark
├── pipeline_total_duration_p95
├── download_duration_p95
├── validation_duration_p95
├── normalization_duration_p95
├── store_duration_p95
└── api_response_time_p95
```

Alert if P95 pipeline duration > 1.5x previous release baseline.
