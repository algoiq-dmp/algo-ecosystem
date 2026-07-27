# AALAP Calls - Release Notes

**Version:** 2.5.0 | **Owner:** Strategy | **Last Updated:** 2026-07-25


## Version 2.5.0 (Current)

**Release Date:** 2026-07-24

### New Features
- Initial production release of AALAP Calls on ALGO IQ 4
- Full Suraksha IAM/Vault/Audit integration
- Narad monitoring dashboard integration
- Automated database migration framework

### Improvements
- Connection pooling optimization for TimescaleDB (35% throughput increase)
- Signal serialization format updated to include strategy confidence score
- Health check endpoint enhanced with dependency status reporting
- Log format standardized to structured JSON across all components

### Bug Fixes
- Fixed race condition in signal dispatch when MQ reconnects
- Resolved memory leak in long-running strategy processes
- Corrected timezone handling in TimescaleDB hypertable partitioning
- Fixed Suraksha token refresh deadlock during high-load periods

### Breaking Changes
- None (initial release)

### Migration Notes
- Fresh installation required; no upgrade path from previous versions
- Database schema is new; run 
pm run db:migrate during deployment

---

## Previous Versions

### Version v0.1.0-alpha (Internal)

**Release Date:** 2026-06-15

- Internal alpha release for QA testing
- Core signal generation pipeline functional
- Basic MQ integration without Suraksha
- PostgreSQL storage only (no TimescaleDB)
- Limited to 5 strategies

### Version v0.2.0-beta (Internal)

**Release Date:** 2026-07-01

- Beta release for staging environment
- Full 15-strategy deployment
- Suraksha IAM integration (no Vault/Audit)
- TimescaleDB migration applied
- Narad basic integration (events only)

---

## Known Issues (Current Release)

| Issue ID | Description | Severity | Workaround | Target Fix |
|----------|-------------|----------|------------|------------|
| ENG-1042 | Signal dispatch delay > 2s under extreme load | Low | Restart affected strategy | v2.5.1 |
| ENG-1051 | Config hot-reload fails for nested TOML keys | Low | Full restart | v2.5.1 |
| ENG-1067 | TimescaleDB chunk fragmentation after 30 days | Medium | Manual re-chunk script | v2.6.0 |

