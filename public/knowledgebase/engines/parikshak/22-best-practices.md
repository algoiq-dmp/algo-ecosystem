# 22 — Best Practices

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Testing Best Practices

### 1. Never Skip Parikshak

The certification gate exists for a reason. Bypassing it — even for "small changes" — has led to every production incident in our history. Run the full suite.

### 2. Test Early, Test Often

Submit strategies to Parikshak as soon as they compile, not after days of tweaking. Early failures are cheap; late failures are expensive.

### 3. Maintain Golden Test Datasets

Curate a set of strategies, engine states, and API payloads that represent common and edge-case scenarios. Run these as regression tests on every change.

### 4. Treat Flaky Tests as Bugs

A test that passes 90% of the time is a bug, not a feature. Flaky tests erode trust in the pipeline. Fix or quarantine them immediately.

### 5. Use the Right Suite for the Job

| Change Type | Recommended Suite |
|---|---|
| Minor parameter tweak | `smoke` + `strategy` |
| New block added | `strategy-full` |
| Engine version bump | `regression` + `performance` + `security` |
| API change | `contract` + `functional` + `load` |
| Product release | Everything |

### 6. Review All Reports, Not Just the Readiness Report

A green readiness report does not guarantee a perfect strategy. Review:
- Test Report for specific failures (even non-blocking ones).
- Regression Report for performance degradation.
- Security Report for medium/low findings that could combine.

### 7. Monitor Test Trends

Use the trend data in regression reports:
- Pass rate declining? Code quality may be slipping.
- Duration increasing? Performance regression.
- New tests failing consistently? Recent change is problematic.

### 8. Document Test Thresholds

Every threshold should have a rationale. Document why:
- Min pass rate is 100% for critical gates.
- P99 latency SLA is 1000ms.
- Security allows 0 HIGH/CRITICAL findings.

### 9. Isolate Test Data

- Each test run gets its own data set.
- No test depends on data from another test.
- Clean up data after each run.

### 10. Integrate with CI/CD

Parikshak should be a non-negotiable gate in your pipeline:
```
Code → Build → Parikshak → Deploy (only if certified)
```

## Strategy Testing Best Practices

| Practice | Why |
|---|---|
| Test with boundary data | Catches edge-case bugs |
| Include empty/null inputs | Prevents runtime crashes |
| Test multi-strategy portfolios | Catches correlation issues |
| Simulate market gaps | Realistic trading conditions |
| Test kill switch triggers | Safety net validation |

## Engine Testing Best Practices

| Practice | Why |
|---|---|
| Mock external dependencies | Isolates component behavior |
| Use chaos engineering | Validates resilience |
| Test rollback scenarios | Deployment safety |
| Monitor resource leaks | Long-term stability |

## Report Review Checklist

| Check | Status |
|---|---|
| Readiness Report is GO | ☐ |
| No critical/high security findings | ☐ |
| No performance SLA violations | ☐ |
| Regression pass rate ≥ baseline | ☐ |
| Checklist complete (all blocking) | ☐ |
| Certificate is ACTIVE | ☐ |

## Anti-Patterns

| Anti-Pattern | Why It's Bad |
|---|---|
| Commenting out failing tests | Hides real issues |
| Increasing timeout to "fix" hang | Masks infinite loops |
| Reducing thresholds to pass | Defeats the purpose of gates |
| Skipping security scan for "urgent" deploy | Security incidents are more urgent |
| Deploying without certificate | Direct path to production incident |
