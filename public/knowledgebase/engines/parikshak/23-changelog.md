# 23 — Changelog

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Version 2.0.0 (2026-05-01)

### Major Changes
- Complete architecture rewrite: Orchestrator + Worker pool model.
- Horizontal auto-scaling based on queue depth and CPU.
- New report types: Regression Reports, Readiness Reports.
- Certification system with cryptographic signatures.
- CI/CD native integration (GitHub Actions, Jenkins, GitLab CI).
- CLI tool for pipeline integration.
- Security scanning upgraded to include SAST, DAST, dependency, and container scanning.

### Breaking Changes
- API versioned to `/v2` (v1 endpoints deprecated).
- Report schema restructured; v1 reports not compatible.
- Test suite definitions migrated from JSON to YAML.
- MQ routing keys renamed to `parikshak.*` namespace.

### Improvements
- Test execution 3x faster via parallel workers.
- Report generation now streaming (results available as tests complete).
- Real-time progress tracking via WebSocket.
- Threshold configuration per test suite.
- Audit logging for all certification actions.

---

## Version 1.5.0 (2025-11-15)

### Features
- Strategy testing suite (schema, logic, risk, boundary).
- Engine testing suite (functional, integration, performance).
- API testing suite (contract, functional, load).
- Test Reports in JSON/PDF/HTML formats.
- Performance Reports with SLA comparison.
- Security Reports with CVE scanning.
- Integration with Strategy Factory MQ events.

### Bug Fixes
- Fixed: Large JSON payloads (>5MB) causing out-of-memory errors.
- Fixed: Test timeouts not properly propagated to workers.
- Fixed: Concurrent submissions interfering with each other's data.

---

## Version 1.0.0 (2025-06-01)

### Initial Release
- Basic test execution engine.
- Support for strategy tests only.
- Manual test submission via REST API.
- Pass/fail test reports (JSON only).
- Single-worker execution model.
- MongoDB for result storage.

## Upgrade Notes

| From | To | Notes |
|---|---|---|
| 1.x | 2.0.0 | API breaking; migrate to v2 endpoints. Re-define test suites in YAML. |
| 1.0.0 | 1.5.0 | Non-breaking; new features enabled by default. |
