# 20. Testing Strategy & Certification

**Version:** 2.1.0
**Owner:** Quality Engineering / Parikshak
**Last Updated:** 2026-07-24

---

## Overview

Lakshmi follows a rigorous multi-layered testing strategy that spans unit, integration, performance, security, and user-acceptance testing. All releases must pass the Parikshak certification suite before deployment to production. This document defines each test layer, its scope, tooling, and passing criteria.

---

## Testing Pyramid

```
            ┌──────────────┐
            │   UAT / E2E   │  ← Manual + automated scenarios
            │   (50+ tests)  │
            ┌──────────────────┐
            │  Security Tests   │  ← SAST, DAST, penetration
            │   (30+ tests)     │
            ┌──────────────────────┐
            │   Performance Tests   │  ← Load, stress, soak
            │    (25 scenarios)     │
            ┌──────────────────────────┐
            │    Integration Tests      │  ← Topology, data flow
            │     (200+ tests)          │
            ┌──────────────────────────────┐
            │       Unit Tests              │  ← Component-level
            │       (800+ tests)            │
            └──────────────────────────────┘
```

---

## Unit Tests

### Scope
Each Lakshmi component is tested in isolation with mocked dependencies.

| Component | Test Files | Test Count | Coverage Target |
|---|---|---|---|
| Publisher | `tests/unit/publisher.test.js` | 120+ | 95% |
| Consumer | `tests/unit/consumer.test.js` | 100+ | 95% |
| Topic Manager | `tests/unit/topic-manager.test.js` | 90+ | 95% |
| Queue Manager | `tests/unit/queue-manager.test.js` | 80+ | 90% |
| Message Router | `tests/unit/message-router.test.js` | 75+ | 90% |
| Redis Cache | `tests/unit/cache.test.js` | 60+ | 90% |
| WebSocket Server | `tests/unit/ws-server.test.js` | 70+ | 85% |
| Retry Engine | `tests/unit/retry-engine.test.js` | 50+ | 95% |
| Security Middleware | `tests/unit/security.test.js` | 55+ | 95% |
| Configuration Loader | `tests/unit/config.test.js` | 40+ | 90% |
| Health Probes | `tests/unit/health.test.js` | 30+ | 90% |
| Monitoring | `tests/unit/monitoring.test.js` | 30+ | 85% |

### Tooling
- **Framework:** Vitest (primary), Mocha (legacy test migration in progress)
- **Mocking:** Sinon.js (MQ, Redis, HTTP mocks)
- **Assertions:** Chai (BDD style)
- **Coverage:** c8 / Istanbul (via Vitest)

### Run Unit Tests
```bash
npm test
npm run test:coverage
```

### Passing Criteria
- All tests pass (0 failures, 0 skipped)
- Code coverage: ≥90% line, ≥85% branch, ≥80% function
- No test takes longer than 2 seconds individually

---

## Integration Tests

### Scope
Integration tests verify interactions between Lakshmi components and external dependencies (RabbitMQ, Redis, Narad, Suraksha). Tests run against real (containerised) services.

### Test Categories

| Category | Count | Description |
|---|---|---|
| **MQ Integration** | 40+ | Publish/subscribe, queue binding, DLQ routing, failover |
| **Redis Integration** | 30+ | Cache read/write, TTL, pipeline, cluster failover |
| **Narad Integration** | 25+ | Register, heartbeat, discover, config sync, remote commands |
| **Suraksha Integration** | 20+ | JWT validation, RBAC policy fetch, cert renewal, audit log |
| **WebSocket Integration** | 35+ | Connect, subscribe, receive messages, reconnect, auth |
| **End-to-End Data Flow** | 30+ | Exchange feed → Lakshmi → MQ → subscriber (full pipeline) |
| **Failover Integration** | 20+ | Primary/Secondary promotion, data sync, split-brain prevention |

### Tooling
- **Orchestration:** Docker Compose (RabbitMQ, Redis, mock Narad, mock Suraksha)
- **Framework:** Vitest with `testcontainers` for spinning up dependencies
- **CI:** GitLab CI with dedicated integration stage

### Run Integration Tests
```bash
# Start test dependencies
docker compose -f tests/integration/docker-compose.yml up -d

# Run tests
npm run test:integration

# Cleanup
docker compose -f tests/integration/docker-compose.yml down
```

### Passing Criteria
- All integration tests pass
- Total suite runtime ≤ 15 minutes
- No flaky tests (>1% failure rate over 100 runs triggers quarantine)

---

## Load Tests

### Scope
Load tests verify Lakshmi maintains latency and throughput targets under representative production load.

### Load Scenarios

| Scenario | Target Rate | Duration | Pass Criteria |
|---|---|---|---|
| **Baseline** | 10,000 msg/s | 5 min | Latency p99 ≤ 2ms |
| **Normal Load** | 200,000 msg/s | 15 min | Latency p99 ≤ 4ms, 0 errors |
| **Target Load** | 350,000 msg/s | 30 min | Latency p99 ≤ 5ms, <0.01% error rate |
| **Stress Test** | 500,000 msg/s | 10 min | Latency p99 ≤ 8ms, graceful degradation |
| **Sustained Soak** | 200,000 msg/s | 8 hours | No memory leak (RSS growth ≤ 10%), no crash |
| **Burst Test** | 350,000 → 500,000 (spike) | 30s spike, 5 min recovery | Recovery to baseline within 2 min |
| **Connection Ramp** | 500 → 5,000 WS clients | 30 min ramp | All connected; delivery latency stable |

### Tooling
- **Load Generator:** custom `lakshmi-loadgen` (Node.js), k6 (WebSocket load)
- **Metrics:** Prometheus + Grafana (during test)
- **Reporting:** Automated HTML report generated post-run

### Run Load Tests
```bash
# Start load test (against staging environment)
npm run test:load -- --env staging --rate 350000 --duration 30m

# Burst test
npm run test:load:burst

# Soak test
npm run test:load:soak -- --duration 8h
```

### Load Test Metrics Tracked
- Message publish rate (actual vs target)
- Message delivery rate
- Latency percentiles (p50, p95, p99, p99.9)
- Error rate (failed publishes, dropped messages)
- CPU utilisation per core
- Memory (RSS) growth trend
- GC pause duration (p99)
- Queue depth (peak and average)
- WebSocket connection count

---

## Stress Tests

### Scope
Stress tests push Lakshmi beyond its rated capacity to validate graceful degradation and recovery.

### Test Scenarios

| Scenario | Description | Acceptable Behaviour |
|---|---|---|
| **Overload** | 750,000 msg/s (2× target) | Backpressure applied; no crash; messages queued |
| **MQ Failure** | Kill RabbitMQ container mid-test | Messages queued locally; reconnect within 5s; no data loss |
| **Redis Failure** | Kill Redis container mid-test | Fallback to in-memory cache; reconnect within 3s |
| **Memory Exhaustion** | Set heap limit to 256 MB; push 350,000 msg/s | Graceful GC; no OOM crash; alert raised |
| **Network Partition** | Split MQ/Redis network for 30s | Pause publishing; reconnect on heal; no corrupted state |
| **Client Flood** | 10,000 WS connect attempts | Accept up to threshold; reject excess with 503 |

---

## Recovery Tests

### Scope
Recovery tests validate Lakshmi recovers from failures without data loss or corruption.

| Scenario | Recovery Target | Validation |
|---|---|---|
| **Process crash restart** | <5s to healthy | All topics resume; offset continuity verified |
| **Primary to Secondary failover** | <5s to traffic | Message sequence unbroken; subscriber sessions preserved |
| **Message replay from MQ** | <30s to catch up | All messages since crash delivered; no duplicates over 0.1% |
| **Cache rebuild after Redis restart** | <60s to warm | Hot topics repopulated from MQ replay |
| **Config corruption recovery** | <10s from backup | Defaults applied; admin alerted; audit logged |

---

## Security Tests

### Static Analysis (SAST)

| Tool | Scope | Run |
|---|---|---|
| **npm audit** | Dependency vulnerabilities | `npm audit --audit-level=high` |
| **Snyk** | Dependency + code vulnerabilities | `snyk test` |
| **ESLint security plugin** | Code patterns (eval, innerHTML) | `npm run lint:security` |
| **Semgrep** | Custom Lakshmi security rules | `semgrep --config=security/` |

### Dynamic Analysis (DAST)

| Test | Tool | Frequency |
|---|---|---|
| **API fuzzing** | custom fuzzer + OWASP ZAP | Every release |
| **JWT attack vectors** | jwt_tool, custom test suite | Every release |
| **WebSocket security** | custom WS security scanner | Every release |
| **TLS configuration** | testssl.sh, sslyze | Every release |
| **Rate-limit bypass** | custom script | Every release |

### Penetration Testing

- **Frequency:** Quarterly (external firm) + per major release (internal team)
- **Scope:** API, WebSocket, MQ protocol, configuration endpoints
- **Deliverable:** Pen test report with findings, severity, and remediation timeline

### Security Test Passing Criteria
- 0 critical or high vulnerabilities in dependencies
- All DAST tests pass
- Penetration test findings rated "Medium" or below remediated within 30 days
- "High" or "Critical" findings: immediate hotfix before release

---

## Regression Suite

### Purpose
The regression suite runs the full test matrix to detect regressions before any release.

### Composition
| Layer | Tests | Runtime |
|---|---|---|
| Unit | 800+ | 3 min |
| Integration | 200+ | 15 min |
| Load (quick) | 5 scenarios | 15 min |
| Security (SAST) | All | 8 min |
| **Total** | **1,005+** | **~41 min** |

### Run Regression Suite
```bash
npm run test:regression
```

### CI Pipeline
```
[Commit Push] → [Lint] → [Unit Tests] → [Build] → [Integration Tests] → [SAST]
                                                                              ↓
[Deploy to Staging] → [Load Tests] → [Smoke Tests] → [Parikshak Certification] → [Deploy to Production]
```

---

## UAT Checklist

Before each production release, the User Acceptance Testing checklist must be completed:

### Core Functionality
- [ ] Topic creation and deletion (via API and config)
- [ ] Message publish with valid JWT (all payload formats: tick, OHLC, snapshot, depth)
- [ ] Message subscribe via WebSocket (real-time latency verified)
- [ ] Message subscribe via API poll (REST endpoint working)
- [ ] Topic ACL enforcement (subscriber blocked from unauthorised topic)
- [ ] Rate limiting (publisher throttled above configured rate)

### Resilience
- [ ] Graceful shutdown (SIGTERM) — pending messages delivered
- [ ] Process restart — data flow resumes within 5 seconds
- [ ] MQ disconnect — reconnection without data loss
- [ ] Redis disconnect — fallback cache behaviour

### Security
- [ ] JWT with valid signature accepted
- [ ] JWT with invalid signature rejected (HTTP 401)
- [ ] Expired JWT rejected (HTTP 401)
- [ ] API key authentication for service accounts
- [ ] RBAC: subscriber role cannot publish; publisher cannot access admin endpoints

### Observability
- [ ] `/api/v1/health` returns 200
- [ ] `/api/v1/metrics` returns Prometheus metrics in valid format
- [ ] Audit log entries generated for authentication events
- [ ] Grafana dashboards reflect test traffic

### Integration
- [ ] Narad registration visible in Narad dashboard
- [ ] Suraksha JWT validation functioning (or local fallback)
- [ ] RabbitMQ management UI shows active connections and queues

---

## Parikshak Certification

### Overview
Parikshak is the Algo-IQ ecosystem's automated quality gate. Every Lakshmi release must receive Parikshak certification before it can be deployed to production.

### Certification Gates

| Gate | Requirement | Automated? |
|---|---|---|
| **Unit Coverage** | ≥90% line coverage | Yes (c8 report) |
| **Integration Pass** | 100% pass; 0 flaky tests | Yes (test report) |
| **Load Test** | Latency p99 ≤5ms at 350k msg/s; error rate <0.01% | Yes (load report) |
| **Security Scan** | 0 critical/high vulns; SAST clean | Yes (Snyk + npm audit) |
| **Regression Pass** | 100% pass in full regression | Yes (CI pipeline) |
| **UAT Sign-off** | All UAT checklist items ticked | No (manual sign-off) |
| **Performance Regression** | No >5% degradation vs previous release | Yes (benchmark comparison) |
| **Dependency Audit** | All dependencies reviewed for license compliance | Yes (license-checker) |

### Certification Command
```bash
npm run certify
```

**Output:**
```
✓ Unit Tests ............. 812 passed, 0 failed (94.2% coverage)
✓ Integration Tests ...... 208 passed, 0 failed
✓ Load Tests ............. Target: 350k msg/s, p99: 3.8ms (PASS)
✓ Security Scan .......... 0 critical, 0 high, 2 medium (PASS)
✓ Regression Suite ....... 1020 passed, 0 failed
✓ Performance Regression . Latency: +0.2ms, Throughput: -0.5% (PASS)
✓ Dependency Audit ....... 142 packages, 0 license issues
✗ UAT Sign-off ........... Pending (requires manual approval)

Overall: 7/8 gates passed. UAT sign-off required for certification.
```

### Certification Validity
- Certification is valid for the specific commit SHA and build artifact
- Any code change (including config or dependency updates) invalidates certification
- Hotfixes must pass an abbreviated certification: Unit + Integration + Security (bypasses UAT with Tech Lead approval)

---

## Test Environments

| Environment | Purpose | Persistence | Refresh Frequency |
|---|---|---|---|
| **dev** | Developer local testing | Ephemeral | On demand (Docker Compose) |
| **ci** | CI pipeline tests | Per pipeline run | Fresh per pipeline |
| **staging** | Pre-production validation | Persistent | Mirror of production weekly |
| **perf** | Dedicated performance testing | Persistent | Identical hardware to production |
| **production** | Live system | Permanent | N/A (canary + blue-green deploys) |
