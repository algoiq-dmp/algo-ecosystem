# 20 — Scalability Design

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Scalability Model

Surya's primary scaling concern is **data volume**, not request throughput. File sizes grow with market activity, and historical data accumulates indefinitely. The architecture scales horizontally for processing, vertically for storage.

---

## Component Scalability Matrix

| Component | Scaling Model | Constraint | Limit |
|---|---|---|---|
| Distribution API | Horizontal | None (stateless) | Auto-scaled to 8 pods |
| Pipeline Workers | Horizontal | Extranet rate limits | 2 workers (diminishing returns beyond 3) |
| File Fetcher | Horizontal (distributed lock) | Extranet rate limits | 1 active per file type |
| PostgreSQL | Vertical + read replicas | Single primary for writes | 1 primary, 4 replicas |
| MinIO | Horizontal (cluster) | Erasure coding overhead | 16 nodes max |
| Redis | Horizontal (cluster) | Key hash distribution | 15 shards |

---

## Horizontal Scaling: Distribution API

```
         [Load Balancer (Nginx)]
            │    │    │    │
            ▼    ▼    ▼    ▼
        [API-1][API-2][API-3][API-4]
            │    │    │    │
            └────┴────┴────┘
                 │
        [Read Replicas (PG)]   [MinIO Cluster]
```

- **Stateless:** No session affinity needed
- **Scale trigger:** Requests/min > 200 per pod OR CPU > 70%
- **File downloads:** Streamed directly from MinIO (presigned URLs) reducing API pod bandwidth

---

## Data Volume Scaling

### Current Volume

| Metric | Daily | Monthly | Yearly |
|---|---|---|---|
| Raw files downloaded | ~500 MB | ~15 GB | ~180 GB |
| After compression (gzip) | ~130 MB | ~4 GB | ~48 GB |
| Plus Parquet copies | ~80 MB | ~2.5 GB | ~30 GB |
| **Total storage growth** | **~210 MB** | **~6.5 GB** | **~78 GB** |

### 5-Year Projection

```
Year 1: 78 GB
Year 2: 156 GB (cumulative)
Year 3: 234 GB
Year 4: 312 GB
Year 5: 390 GB

Total (5 years online): ~1.2 TB
+ Metadata (PostgreSQL): ~50 GB
+ Audit events (TimescaleDB): ~200 GB
─────────────────────────────────
Total: ~1.5 TB

Current MinIO capacity: 42 TB usable → 3.5% utilized after 5 years
```

---

## Storage Tiering

```
HOT (MinIO NVMe — 0–1 year):
  ├── Current year's files
  ├── Instant access (< 5ms first byte)
  └── Capacity: 10 TB (NVMe SSD)

WARM (MinIO HDD — 1–5 years):
  ├── Years 2–5 files
  ├── Sub-second access
  └── Capacity: 32 TB (HDD)

COLD (S3 Glacier — 5+ years):
  ├── Regulatory archive
  ├── Hours retrieval
  └── Unlimited capacity

Auto-tiering via MinIO ILM (Information Lifecycle Management):
  - After 365 days → transition to WARM tier
  - After 1825 days → transition to COLD tier (S3 Glacier)
```

---

## PostgreSQL Scaling

### Current: Single Primary + Read Replicas

```
[Primary (R/W)] → [Replica 1 (Read)] → [Replica 2 (Read)]
    │                    │                    │
    ▼                    ▼                    ▼
  Writes              API queries          Analytics queries
  (file_versions,     (GET /files,         (daily reports,
   file_types)         GET /files/{id})     audit queries)
```

### Future (v3.0+): Table Partitioning

```sql
-- Partition file_versions by file_date
CREATE TABLE file_versions (
    ...
) PARTITION BY RANGE (file_date);

-- Monthly partitions
CREATE TABLE file_versions_2026_01 PARTITION OF file_versions
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- Retention: DROP partitions older than 5 years (data archived to S3)
```

---

## MinIO Cluster Scaling

### Current: 4-Node Cluster

```
[Node 1] [Node 2] [Node 3] [Node 4]
  16TB     16TB     16TB     16TB
    │        │        │        │
    └────────┴───┬────┴────────┘
                 │
      Erasure Coding: EC 8+4
      Parity overhead: 50%
      Usable: ~42 TB
```

### Scale-Up Path

```
Phase 1 (current):  4 nodes × 16 TB = 42 TB usable
Phase 2 (trigger):  70% utilization → Add 4 nodes
Phase 3 (future):   Up to 16 nodes (MinIO limit for EC 8+4)
```

### Scaling Trigger

| Metric | Threshold | Action |
|---|---|---|
| MinIO disk usage | > 70% | Add 4 nodes |
| MinIO disk usage | > 85% | Emergency expansion |
| API response P95 | > 1 second | Add API pods |
| API requests/min | > 500/pod | Add API pods |
| DB connections utilized | > 80% | Add read replica |

---

## Multi-Region Strategy

```
Mumbai (Primary)
  ├── Full pipeline: Fetch + Validate + Normalize + Store
  ├── Full MinIO cluster: 4 nodes
  └── PostgreSQL Primary (R/W)

Hyderabad (DR)
  ├── Pipeline: Stopped (warm standby)
  ├── MinIO: Site-to-site replication (async, hourly)
  └── PostgreSQL: Async replica (read-only)
```

### DR Failover

```
1. Detect Mumbai failure (< 30s via health checks)
2. Activate Hyderabad pipeline workers
3. Promote Hyderabad PostgreSQL replica to primary
4. Verify MinIO replication is current
5. Update DNS: surya-api.algoiq.com → Hyderabad LB
6. Total RTO: < 15 minutes (files are not real-time critical)
```

---

## Cost Optimization

| Strategy | Savings |
|---|---|
| MinIO HDD tier for files > 1 year | ~60% storage cost vs all-NVMe |
| Parquet instead of CSV for > 1 year files | ~40% storage reduction |
| MinIO compression (server-side) | Additional ~30% reduction |
| Reserved instances for baseline compute | ~40% compute cost |
| Scale API pods to 1 instance overnight (18:00–06:00) | ~50% compute cost for API |

---

## Future Scalability: Additional Exchanges

Adding MCX (commodity exchange) in v2.5.0:

```
Impact:
  ├── New extranet client (separate connection pool)
  ├── New file types: ~6 (commodity-specific)
  ├── Additional daily volume: ~100 MB raw
  ├── Additional storage: ~15 GB/year
  └── No architectural changes needed
       └── File Type Registry is extensible by design
```
