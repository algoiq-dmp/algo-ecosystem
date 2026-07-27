# 23 — Best Practices

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## File Consumption (For Downstream Engines)

### DO

- **Poll for new files** at reasonable intervals (every 1–5 minutes), not per-second
- **Check file state** before downloading — only download `READY` files
- **Use presigned URLs** for large files (> 10 MB) to offload bandwidth from Surya API
- **Cache file metadata** locally to avoid repeated API calls
- **Handle file update notifications** via webhook rather than polling
- **Verify checksums** (`X-Checksum-SHA256` header) on downloaded files
- **Request Parquet format** if your engine needs columnar analytics access

### DON'T

- Don't download exchange files directly — use Surya's Distribution API
- Don't hardcode file schemas — column layouts may change; read metadata from Surya
- Don't retry downloads on 404 — file may not exist yet; poll for availability
- Don't assume yesterday's file will have the same schema as today's
- Don't consume files in `VALIDATING`, `PENDING`, or `FAILED` states

---

## Adding New File Types

### DO

- Register the file type in the **File Type Registry** (`file_types` table) before fetching
- Provide complete **`expected_columns`** schema with types and required flags
- Set realistic **validation rules** (row count baseline, column constraints)
- Define **`primary_keys`** for deduplication and cross-file validation
- Document **downstream subscribers** — who needs this file and why
- Test with **historical files** if available (exchange may provide samples)
- Set appropriate **deadlines** based on exchange publication times

### DON'T

- Don't skip defining validation rules — even basic checks prevent bad data propagation
- Don't set deadlines too tight — add 15-minute buffer after expected publication
- Don't forget to update downstream engine API key scopes

---

## Operations

### DO

- **Monitor the daily pipeline status** dashboard starting at 06:00 IST
- **Respond to deadline warnings** within 10 minutes
- **Check extranet certificate expiry** monthly (set calendar reminder)
- **Review the daily Operations email** at 17:00 IST
- **Keep extranet contact numbers** readily available for connectivity issues
- **Document any manual interventions** (force accept, re-trigger) in the incident log
- **Run the monthly archival job** to move files > 5 years to cold storage

### DON'T

- Don't ignore validation failures — every failure means potentially bad data downstream
- Don't force-accept files without understanding why validation failed
- Don't modify file type registry during BOD/EOD windows
- Don't deploy during BOD (06:00–09:00) or EOD (15:30–16:30) windows

---

## Extranet Connectivity

### DO

- **Rotate BSE API keys** every 30 days (automated via vault cron)
- **Renew NSE certificates** at least 30 days before expiry
- **Test extranet connectivity** after any network changes
- **Use the backup lease line** for redundancy; test failover monthly
- **Monitor certificate expiry** via Prometheus alert

### DON'T

- Don't share extranet credentials with any other system or team
- Don't exceed extranet rate limits — Surya's rate limiter protects this
- Don't attempt direct extranet access from any non-Surya host

---

## Security

### DO

- **Hash API keys** before storing (SHA-256); never store plaintext
- **Scope API keys** to minimum required file types
- **Rotate compromised keys** immediately
- **Audit API key usage** monthly — disable unused keys
- **Verify file checksums** on every download and storage operation

### DON'T

- Don't include extranet credentials in code, config files, or logs
- Don't share API keys between different engines
- Don't bypass the extranet-only-through-Surya rule — it exists for data integrity

---

## Development & Testing

### DO

- Use the **mock extranet server** for local development
- Write tests using **test fixtures** that represent real exchange file formats
- Test against **edge cases**: empty files, missing columns, encoding variations
- Run the **full pipeline** locally before submitting changes
- Verify that **new validation rules** don't break existing file types

### DON'T

- Don't test against live extranet APIs from development machines
- Don't modify `file_types` table schema without a migration script
- Don't commit real exchange files to the repository (even as test fixtures — use synthetic data)

---

## File Storage & Retention

### DO

- Enable **MinIO bucket versioning** (prevents accidental overwrites)
- Configure **lifecycle policies** for tiering (hot → warm → cold)
- Monitor **MinIO disk usage** — expansion takes time
- Use **compression** (gzip for CSV, Snappy for Parquet) to reduce storage
- Run **integrity checks** monthly: verify random sample of stored files against their checksums

### DON'T

- Don't delete files from MinIO manually — use lifecycle policies
- Don't modify stored files — they are immutable by design
- Don't archive files without verifying the archive copy's integrity

---

## Monitoring & Alerting

### DO

- Set up the **Grafana Pipeline Overview** dashboard as your primary monitoring tool
- Configure **PagerDuty** for CRITICAL alerts (extranet down, deadline missed)
- Use **Slack** for WARNING alerts (approaching deadline, row count anomalies)
- Review **alert frequency** monthly — tune thresholds to avoid alert fatigue
- Monitor **file size and row count trends** — gradual changes may indicate exchange format changes

### DON'T

- Don't ignore warning alerts — they often precede critical failures
- Don't set alert thresholds based on a single day's data — use 30-day rolling averages
- Don't rely solely on automated monitoring — manual spot-checks catch subtle issues
