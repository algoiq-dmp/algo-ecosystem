# 21 — Troubleshooting Guide

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Diagnostic Tools

| Tool | Purpose | Command |
|---|---|---|
| Health endpoint | Overall system status | `curl https://surya-api.algoiq.com/api/v1/health` |
| Pipeline status | Today's file processing status | `GET /api/v1/admin/pipeline/status?date=today` |
| Prometheus metrics | Component-level metrics | `curl http://localhost:9090/metrics` |
| MinIO Console | Object browser, bucket status | `https://minio.algoiq.com:9001` |
| PostgreSQL | Query file states | `psql -h pg.algoiq.internal -d surya` |
| Kibana | Log search | `https://kibana.algoiq.com` |
| Redis CLI | Lock inspection | `redis-cli -h redis.algoiq.internal` |

---

## Common Issues & Resolutions

### Issue 1: File Not Available at Deadline

**Symptoms:**
- File state stuck in `PENDING` or `FETCHING` past deadline
- Downstream engines report stale data

**Diagnosis:**

```sql
-- Check file status for today
SELECT file_type_code, state, retries, error_message, deadline
FROM file_versions
WHERE file_date = CURRENT_DATE
  AND state != 'READY';
```

```bash
# Check if scheduler lock is stuck
redis-cli GET "surya:scheduler:SEC_TOK"
# If key exists and TTL is high (> 10 min) → lock may be stale

# Check extranet availability
curl -s https://surya-api.algoiq.com/api/v1/health | grep extranet
```

**Common Causes:**

| Cause | Check | Fix |
|---|---|---|
| Scheduler lock stuck | Redis key with high TTL | `redis-cli DEL "surya:scheduler:{fileType}"` |
| Extranet API down | Health check shows `disconnected` | Contact exchange; wait for restoration |
| Stale certificate | `openssl x509 -in cert.crt -dates` | Rotate certificate manually |
| File not yet published | Check exchange extranet portal | Wait; file may be delayed |
| Pipeline worker crashed | `systemctl status surya-worker` | Restart worker service |

---

### Issue 2: File Validation Failing Repeatedly

**Symptoms:**
- File in `VALIDATION_FAILED` state after multiple retries
- Row count or column validation errors

**Diagnosis:**

```sql
-- Get validation failure details
SELECT file_type_code, error_message, fetch_attempts
FROM file_versions
WHERE file_date = CURRENT_DATE
  AND state = 'VALIDATION_FAILED';
```

```bash
# Manually download the file for inspection
# The raw file is in /data/surya/staging/{exchange}/{fileType}/{date}/raw.csv
head -5 /data/surya/staging/nse/SPN_MRG/20260724/raw.csv
wc -l /data/surya/staging/nse/SPN_MRG/20260724/raw.csv
```

**Common Causes:**

| Cause | Check | Fix |
|---|---|---|
| Exchange changed file format | Compare columns with registry | Update `file_types.expected_columns` |
| Partial file published | Row count far below baseline | Wait 30 min, re-trigger fetch |
| New columns added by exchange | Extra columns detected | Update registry (backward-compatible) |
| Encoding changed | `file -bi raw.csv` shows unexpected encoding | Update expected encoding; normalizer should handle |
| Validation threshold too strict | Row count deviation > 50% is normal today | Temporarily increase threshold |

**Force Accept (Operations override):**

```bash
curl -X POST \
  -H "X-API-Key: admin-key" \
  -H "Content-Type: application/json" \
  -d '{"fileTypeCode":"SPN_MRG","fileDate":"2026-07-24","forceAccept":true,"reason":"Exchange published partial file; accepted with flag"}' \
  https://surya-api.algoiq.com/api/v1/admin/files/force-accept
```

---

### Issue 3: MinIO Storage Errors

**Symptoms:**
- Files stuck in `STORING` state
- Logs show MinIO connection errors
- Emergency storage directory growing

**Diagnosis:**

```bash
# Check MinIO health
mc admin info surya-minio

# Check disk usage per node
mc admin info surya-minio | grep -A5 Drives

# Check emergency directory size
du -sh /data/surya/emergency/
```

**Common Causes:**

| Cause | Check | Fix |
|---|---|---|
| MinIO disk full | `df -h /data/minio` | Add nodes or clean up old files |
| MinIO service down | `systemctl status minio` | Restart: `systemctl restart minio` |
| Network partition | `ping minio1.algoiq.internal` | Network team; check VLAN |
| MinIO license expired (Enterprise) | MinIO console warning | Renew license |
| Emergency files not migrated | Files in `/data/surya/emergency/` | Run migration script once MinIO restored |

**Migrate Emergency Files:**

```bash
# Once MinIO is healthy, migrate emergency files
node scripts/migrate-emergency-files.js
# This script:
# 1. Lists files in /data/surya/emergency/
# 2. Uploads each to MinIO
# 3. Updates file_versions metadata
# 4. Deletes from emergency directory
```

---

### Issue 4: Extranet Connection Lost

**Symptoms:**
- Health check shows `nse_extranet: disconnected`
- All NSE file fetches failing

**Diagnosis:**

```bash
# Test extranet connectivity from Surya VM
curl -v --cert /etc/surya/certs/nse/tls.crt \
     --key /etc/surya/certs/nse/tls.key \
     https://extranet.nseindia.com/api/v2/health

# Check certificate validity
openssl x509 -in /etc/surya/certs/nse/tls.crt -text -noout | grep -A2 Validity

# Check firewall rules
# Verify: Surya IP is allowed to reach extranet IPs on port 443
```

**Resolution:**

| Cause | Action |
|---|---|
| Certificate expired | Renew with NSE; update Vault + Kubernetes Secret |
| NSE extranet maintenance | Wait; check NSE communication |
| Firewall rule changed | Verify with network team; re-add rule |
| Lease line issue | Contact ISP/NSE; switch to backup line |
| BGP failover failed | Manual route change to backup lease line |

---

### Issue 5: Duplicate File Processing

**Symptoms:**
- Two versions of same file for same date
- Extra rows in downstream engines (merged duplicates)

**Diagnosis:**

```sql
-- Find duplicate files
SELECT file_type_code, file_date, COUNT(*) as versions
FROM file_versions
GROUP BY file_type_code, file_date
HAVING COUNT(*) > 1
ORDER BY file_date DESC;
```

**Root Cause:**
- Scheduler lock expired before processing completed
- Second instance acquired lock and re-processed same file

**Resolution:**

```bash
# 1. Identify which version is correct (compare row counts, checksums)
# 2. Mark incorrect version as SUPERSEDED
psql -d surya -c "
  UPDATE file_versions
  SET state = 'SUPERSEDED'
  WHERE file_id = 'SURYA-20260724-SEC_TOK-0002';
"

# 3. Increase scheduler lock TTL
# config.json: pipeline.schedulerLockTtlMs = 1200000 (20 min, up from 10 min)
```

---

### Issue 6: Slow File Downloads

**Symptoms:**
- Download durations > 60 seconds for typical files
- Pipeline finishing near/after deadlines

**Diagnosis:**

```sql
-- Check recent download times
SELECT file_type_code, fetch_duration_ms, downloaded_at
FROM file_versions
WHERE file_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY fetch_duration_ms DESC
LIMIT 10;
```

**Common Causes:**

| Cause | Check | Fix |
|---|---|---|
| Extranet throttling | Compare with historical baselines | Contact exchange if persistent |
| Bandwidth congestion | Check usage during fetch window | QoS rules for Surya traffic |
| Large file anomaly | File 10x normal size | Normal — let it process |
| TLS overhead | Compare HTTP vs HTTPS times | Can't change — exchange requires TLS |

---

## Emergency Quick Reference

```
File not ready and deadline approaching:
  → Check extranet: health endpoint
  → Check scheduler lock: redis-cli
  → Manual trigger: POST /admin/files/trigger

All files failing:
  → Check extranet cert: openssl verify
  → Check firewalls: network team
  → Check circuit breaker: extranet metrics

MinIO issues:
  → Check disk: df -h
  → Check service: systemctl status minio
  → Emergency files: /data/surya/emergency/

Database issues:
  → Check connections: pg_stat_activity
  → Kill long queries: pg_terminate_backend()
  → Failover to replica: pg_ctl promote
```
