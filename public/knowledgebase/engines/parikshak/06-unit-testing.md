# 06 — Unit Testing

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## Overview

Unit testing in Parikshak validates individual components in isolation. For strategies, this means testing each block type independently. For engines, it means testing each module, function, and class.

## Strategy Unit Tests

### Entry Signal Tests

| Test Case | Validation |
|---|---|
| MA Crossover — valid params | Config accepted, signal trigger logic correct |
| MA Crossover — invalid period (0) | Rejected with validation error |
| RSI — threshold range | Min 0, max 100, oversold < overbought |
| Volume Spike — multiplier | Must be > 1.0 |
| All signals — missing required param | Rejected |

### Exit Logic Tests

| Test Case | Validation |
|---|---|
| Fixed Stop — valid % | Config accepted |
| Fixed Stop — negative % | Rejected |
| Trailing Stop — activation < trail % | Warning raised |
| Take-Profit — partial close > 100% | Rejected |
| Time-Based — invalid time format | Rejected |

### Risk Rule Tests

| Test Case | Validation |
|---|---|
| Max position ≤ platform limit | Pass |
| Max position > platform limit | Fail (override required) |
| Missing stop-loss with hardStopRequired | Fail |
| Daily loss limit > max drawdown | Warning |

### Position Sizing Tests

| Test Case | Validation |
|---|---|
| Fixed % within bounds | Pass |
| Kelly with winRate > 1.0 | Rejected |
| Vol-adjusted with zero volatility | Fallback to fixed % |

## Engine Unit Tests

### Kuber Alpha Module Tests

```javascript
describe('Capital Allocator', () => {
  it('allocates capital proportionally', () => { });
  it('respects max allocation per strategy', () => { });
  it('rejects allocation exceeding total budget', () => { });
  it('handles zero budget gracefully', () => { });
});

describe('Kill Switch', () => {
  it('triggers at exactly margin threshold', () => { });
  it('does not trigger below threshold', () => { });
  it('sends notification on trigger', () => { });
  it('auto-recovers after margin restored', () => { });
});
```

## Test Data Patterns

| Pattern | Use |
|---|---|
| **Happy Path** | Valid input, expected output |
| **Edge Cases** | Boundary values (0, max, empty) |
| **Error Path** | Invalid, malformed, missing inputs |
| **Null Safety** | null, undefined, NaN inputs |
| **Concurrency** | Multiple simultaneous calls |

## Coverage Requirements

| Component Type | Line Coverage | Branch Coverage |
|---|---|---|
| Critical path (trading logic) | 95% | 90% |
| Risk engine | 100% | 100% |
| API handlers | 90% | 85% |
| Utility functions | 80% | 75% |

## CI Integration

Unit tests run on every commit. The build fails if:
- Any unit test fails.
- Coverage drops below threshold.
- New code adds uncovered lines.

## Running Unit Tests

```bash
npm test -- --suite=unit
npm test -- --suite=unit --coverage
npm test -- --suite=unit --component=strategy
```
