# TalkStrategy API - Testing

**Version:** 2.8.0 | **Owner:** Execution | **Last Updated:** 2026-07-25


## Testing Strategy

The engine uses a multi-layered testing approach covering unit, integration, end-to-end, and performance testing.

## Test Categories

### Unit Tests
- **Framework:** Jest (Node.js)
- **Coverage Target:** 80% line, 75% branch
- **Scope:** Individual functions, utility modules, data transformers
- **Run:** Automatically on every commit via pre-commit hooks

### Integration Tests
- **Framework:** Jest + Supertest
- **Scope:** API endpoints, database interactions, MQ communication
- **Dependencies:** Real PostgreSQL/TimescaleDB in Docker, mock MQ broker
- **Run:** On every PR and push to main branch

### End-to-End Tests
- **Framework:** Custom test harness
- **Scope:** Full signal generation pipeline (data ingest to signal output)
- **Data:** Pre-recorded market data replays
- **Run:** Nightly and before production releases

### Performance Tests
- **Framework:** k6 / Artillery
- **Scope:** Throughput, latency, and resource utilization under load
- **Run:** Weekly and before major version releases

### Security Tests
- **Framework:** npm audit, Snyk, OWASP ZAP
- **Scope:** Dependency vulnerabilities, API security, injection attacks
- **Run:** Weekly and on dependency changes

## Test Environment Setup

`ash
# Start test infrastructure
docker-compose -f docker-compose.test.yml up -d

# Run all tests
npm test

# Run specific test suite
npm test -- --testPathPattern=unit/services

# Run with coverage
npm test -- --coverage
```

## Test Data Management

Test data is seeded from fixtures in the test/fixtures directory:
- Market data snapshots in JSON format
- Expected signal output files
- Database seed SQL files
- Mock MQ message fixtures

## CI Pipeline Integration

| Stage | Trigger | Timeout | On Failure |
|-------|---------|---------|------------|
| Lint | Every commit | 2 min | Block commit |
| Unit Tests | Every commit | 5 min | Block PR |
| Integration Tests | Every PR | 10 min | Block merge |
| E2E Tests | Main branch, nightly | 30 min | Alert team |
| Perf Tests | Weekly, pre-release | 1 hour | Review required |

## Regression Testing

A curated set of regression scenarios runs against every release candidate. Scenarios include known edge cases and historical bug reproductions.

