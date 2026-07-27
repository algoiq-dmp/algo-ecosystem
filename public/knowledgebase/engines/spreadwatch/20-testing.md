# SpreadWatch — Testing Strategy

**Version:** 2.8.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## Test Plan

SpreadWatch follows a comprehensive testing strategy validated through **Parikshak** testing engine.

## Test Pyramid

```
     ┌──────┐
     │ E2E  │  5% — Critical user journeys
    ┌┴──────┴┐
    │Integr.│  15% — Cross-service integration
   ┌┴────────┴┐
   │Component │  30% — Isolated service testing
  ┌┴──────────┴┐
  │   Unit     │  50% — Function/module level
 └─────────────┘
```

## Test Categories

### 1. Unit Tests
- **Framework:** Jest / pytest
- **Coverage target:** 85% line coverage, 75% branch coverage
- **Location:** `spreadwatch/tests/unit/`
- **Run:** Every commit via CI pipeline
- **Time:** < 2 minutes for full suite

### 2. Component Tests
- **Scope:** Each module (`spreadwatch-engine, spreadwatch-api`) tested in isolation
- **Mocks:** External services (MQ, DB, Narad, Suraksha) mocked
- **Data:** Fixture-based test data in `tests/fixtures/`
- **CI gate:** Must pass before merge to main

### 3. Integration Tests
- **Framework:** Custom integration harness
- **Dependencies:** Real connections to staging MQ, DB, Ganesh-staging
- **Scenarios:** 
  - Health check after startup
  - MQ message roundtrip
  - Database read/write cycle
  - Suraksha auth flow
  - Narad registration and heartbeat
- **Scheduled:** Nightly on staging environment

### 4. End-to-End Tests
- **Framework:** Parikshak E2E suite
- **Flow:** Data ingestion → Processing → API response verification
- **Data:** Production-like data volume in staging
- **Frequency:** Pre-release and on-demand

### 5. Performance Tests
- **Tool:** Parikshak Load Generator
- **Scenarios:** Steady load, spike, endurance (24h)
- **Thresholds:** P99 < 500ms, error rate < 0.1%
- **Frequency:** Weekly + pre-release

### 6. Security Tests
- **Tool:** Parikshak Security Scanner
- **Checks:** OWASP Top 10, dependency CVEs, secret leaks
- **Frequency:** Every build
- **Blocking:** Critical/High vulnerabilities block release

## Parikshak Certification

Before any release, SpreadWatch must pass Parikshak certification:

```
parikshak certify spreadwatch --version 2.8.0 --env staging

Required gates:
[x] Unit tests pass (> 85% coverage)
[x] Integration tests pass
[x] E2E smoke tests pass
[x] Performance within thresholds
[x] No critical/High security issues
[x] Database migrations validated
[x] Rollback tested successfully
```

## Test Data Management

- Anonymized production data snapshots for staging
- Data refreshed weekly from production (Sanitized)
- PII/credentials stripped automatically
- Test data versioned with test suites

## CI/CD Integration

```yaml
# .gitlab-ci.yml (conceptual)
test:
  stage: test
  script:
    - parikshak run-unit --target spreadwatch
    - parikshak run-component --target spreadwatch
    - parikshak security-scan --target spreadwatch
  only:
    - merge_requests
    - main
```
