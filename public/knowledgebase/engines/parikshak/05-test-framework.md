# 05 — Test Framework

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Overview

The Parikshak Test Framework is a modular, extensible system for defining, executing, and evaluating test suites. It supports multiple test types, languages, and execution environments.

## Framework Architecture

```
┌──────────────────────────────────────────────┐
│              TEST FRAMEWORK                    │
│                                                │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │  Suite   │  │  Runner  │  │  Assertion  │  │
│  │  Loader  │  │  Engine  │  │  Engine     │  │
│  └────┬─────┘  └────┬─────┘  └──────┬──────┘  │
│       │             │               │          │
│  ┌────▼─────┐  ┌────▼─────┐  ┌──────▼──────┐  │
│  │  Hook    │  │  Fixture │  │  Reporter   │  │
│  │  Manager │  │  Manager │  │  Interface  │  │
│  └──────────┘  └──────────┘  └─────────────┘  │
└──────────────────────────────────────────────┘
```

## Suite Loader

Loads test suite definitions from MongoDB and YAML files:

```yaml
suiteId: strategy-full
name: "Strategy Full Test Suite"
type: strategy
priority: high
timeout: 600s
tests:
  - testId: schema-validation
    runner: jest
    file: tests/schema.test.js
  - testId: logic-integrity
    runner: custom
    file: tests/logic.test.js
  - testId: risk-compliance
    runner: jest
    file: tests/risk.test.js
hooks:
  beforeAll: setup/sandbox.js
  afterAll: teardown/sandbox.js
```

## Runner Engine

Supports multiple test runners:

| Runner | Use Case |
|---|---|
| **Jest** | JavaScript/TypeScript unit and integration tests |
| **Mocha** | API contract and end-to-end tests |
| **Custom Harness** | Strategy logic, risk rule, and boundary tests |
| **k6** | Performance and load tests |
| **OWASP ZAP** | Security vulnerability scanning |
| **Shell** | Infrastructure and connectivity tests |

## Assertion Engine

Built-in assertion library for strategy-specific validations:

```javascript
import { assert, StrategyAssertions } from '@parikshak/assertions';

describe('Risk Rules', () => {
  it('must have a stop-loss', () => {
    const strategy = loadStrategy('sf-abc123');
    assert.hasStopLoss(strategy);
    assert.stopLossWithinRange(strategy, 0.5, 5.0);
  });

  it('must not exceed max position size', () => {
    const strategy = loadStrategy('sf-abc123');
    assert.positionSize(strategy).isAtMost(10);
  });
});
```

## Hook Manager

Lifecycle hooks for test setup and teardown:

| Hook | When |
|---|---|
| `beforeAll` | Once before suite starts |
| `afterAll` | Once after suite completes |
| `beforeEach` | Before each test case |
| `afterEach` | After each test case |
| `onError` | When a test throws an unhandled error |
| `onTimeout` | When suite exceeds timeout |

## Fixture Manager

Provides isolated test environments:
- **Sandbox** — Isolated container with mock dependencies.
- **Data Fixtures** — Pre-seeded market data for deterministic tests.
- **Mock Services** — Mocked Parikshak, Simulator, Vega, MQ instances.
- **Network Isolation** — No external network access during tests.

## Reporter Interface

Standardizes output from all runners:

```json
{
  "suiteId": "strategy-full",
  "testId": "logic-integrity",
  "status": "PASSED",
  "durationMs": 234,
  "assertions": { "total": 15, "passed": 15 },
  "logs": [],
  "screenshots": []
}
```
