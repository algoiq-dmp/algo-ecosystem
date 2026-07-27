# 17 — CI/CD Integration

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Overview

Parikshak integrates seamlessly with CI/CD pipelines to automate testing at every stage of the software delivery lifecycle. Every commit, PR, and release triggers automated test suites with results fed back to the pipeline.

## Integration Points

### Git Hooks (Pre-Commit)

```
pre-commit → Lint + Unit tests (fast, < 2 min)
pre-push   → Unit + Smoke integration tests (< 5 min)
```

### Pull Request Checks

```
PR opened → Full test suite for affected components
           ├── Unit tests
           ├── Integration tests (affected paths)
           ├── Contract tests (if API changed)
           └── Security scan (dependency diff only)

Result → PR status: ✅ All checks passed / ❌ Tests failed
```

### Merge to Main

```
Merge → Full test suite
        ├── All component tests
        ├── Performance benchmarks
        ├── Full security scan
        ├── Regression analysis
        └── Readiness report

Result → Blocks release if any gate fails
```

### Release Pipeline

```
Release tag → Extended test suite
              ├── Full integration tests
              ├── Load test at 2x capacity
              ├── Soak test (1 hour)
              ├── Chaos engineering tests
              └── Certificate generation
```

## CI Providers

### GitHub Actions

```yaml
- name: Parikshak Strategy Tests
  uses: algo-iq/parikshak-action@v2
  with:
    type: strategy
    api-key: ${{ secrets.PARIKSHAK_API_KEY }}
    wait-for-results: true
    fail-on: critical,high
```

### Jenkins Pipeline

```groovy
stage('Parikshak Tests') {
    steps {
        parikshakSubmit(
            type: 'strategy',
            apiKey: env.PARIKSHAK_API_KEY,
            strategyId: 'sf-abc123',
            timeout: 600
        )
    }
}
```

### GitLab CI

```yaml
parikshak_tests:
  stage: test
  script:
    - parikshak-cli submit --type strategy --id sf-abc123 --wait
  artifacts:
    reports:
      parikshak: results/
```

## CLI Tool

```bash
npm install -g @algo-iq/parikshak-cli

parikshak-cli submit --type strategy --file ./strategy.json
parikshak-cli status --submission-id sub-001
parikshak-cli report --submission-id sub-001 --type readiness
parikshak-cli wait --submission-id sub-001 --timeout 600
```

## Pipeline Status Mapping

| Parikshak Status | CI Status | Pipeline Effect |
|---|---|---|
| GO (all passed) | ✅ Success | Pipeline proceeds |
| CONDITIONAL GO | ⚠️ Warning | Pipeline proceeds with alert |
| NO-GO | ❌ Failure | Pipeline blocked |
| TIMEOUT | ❌ Failure | Pipeline blocked |
| ERROR | ❌ Failure | Pipeline blocked |

## Notifications

| Channel | Event |
|---|---|
| GitHub/GitLab | PR status update |
| Slack | Test summary posted to #ci-cd |
| Email | Failure notification to author |
| Webhook | Custom integration endpoint |

## Configuration

```yaml
# .parikshak.yml
version: 2
components:
  - type: strategy
    path: ./strategies/*.json
    suites: [full]
    failOn: [critical, high]

  - type: engine
    path: ./engines/kuber-alpha
    suites: [regression, performance, security]

  - type: api
    spec: ./openapi.yaml
    suites: [contract, load]
```

## Best Practices

1. Run fast tests (unit, smoke) on every commit.
2. Run full suite on PR to main branch.
3. Run extended suite on release tags.
4. Cache test results to avoid redundant runs.
5. Use test impact analysis to run only affected suites.
6. Fail fast — stop the pipeline on first critical failure.
