# 20 â€” Testing Strategy

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Testing Philosophy

Ganesh follows a layered testing approach: unit tests for business logic, integration tests for component interactions, end-to-end tests for full data flow, and performance tests for throughput validation.

## Test Pyramid

```
        +-----------+
        |    E2E    |  5%  â€” Full tick-to-API flow
        +-----------+
      +---------------+
      |  Integration  |  20% â€” Redis, PostgreSQL, RabbitMQ interactions
      +---------------+
    +-------------------+
    |     Unit Tests    |  75% â€” Bar aggregation, validation, corporate actions
    +-------------------+
```

## Unit Tests

### Test Runner: Jest

```bash
npm test
```

### Key Unit Test Files

| File | Tests |
|---|---|
| `test/unit/bar-aggregator.test.js` | Bar construction, timeframe alignment, edge cases |
| `test/unit/bar-validator.test.js` | OHLC integrity checks, outlier detection |
| `test/unit/corp-action.test.js` | Adjustment multiplier application, audit logging |
| `test/unit/timeframe-align.test.js` | Timestamp alignment for all 5 timeframes |
| `test/unit/ring-buffer.test.js` | Overflow behavior, concurrency safety |

### Example Unit Test

```javascript
describe('Bar Aggregator', () => {
  describe('1-minute bar construction', () => {
    it('should open bar at first tick and close at MM:00', () => {
      const aggregator = new BarAggregator({ timeframe: '1m' });

      aggregator.processTick({ symbol: 'TEST', price: 100, volume: 50, ts: '10:30:05' });
      aggregator.processTick({ symbol: 'TEST', price: 105, volume: 30, ts: '10:30:30' });
      aggregator.processTick({ symbol: 'TEST', price: 98, volume: 20, ts: '10:30:55' });

      const bar = aggregator.getLatestBar('TEST');
      expect(bar.open).toBe(100);
      expect(bar.high).toBe(105);
      expect(bar.low).toBe(98);
      expect(bar.close).toBe(98);
      expect(bar.volume).toBe(100);
    });
  });
});
```

## Integration Tests

```bash
npm run test:integration
```

Requires local Redis, PostgreSQL, and RabbitMQ instances. Docker Compose provides test dependencies:

```bash
docker-compose -f docker-compose.test.yml up -d
npm run test:integration
```

### Integration Test Scenarios

| Test | Validates |
|---|---|
| Redis read/write | Bar storage and retrieval from cache |
| PostgreSQL read/write | Persistent storage and TimescaleDB chunking |
| RabbitMQ consume | Tick ingestion from mock Lakshmi queue |
| API endpoint | HTTP response format, status codes, rate limiting |
| Health checks | Liveness and readiness probe responses |

## End-to-End Tests

```bash
npm run test:e2e
```

E2E tests simulate a full data flow: synthetic ticks published to RabbitMQ -> consumed by Ganesh -> bars stored -> queried via API -> response validated.

### E2E Test Scenarios

1. Single symbol, all timeframes: Publish ticks for 10 minutes, verify bars at all 5 timeframes.
2. Range query: Store 500 bars, query range, verify count and ordering.
3. Corporate action: Publish Surya event, verify historical bars adjusted.
4. Cache miss fallback: Clear Redis, query bars, verify PostgreSQL fallback.
5. Error handling: Send malformed ticks, verify validation rejects them.

## Performance Tests

```bash
npm run test:perf
```

| Profile | Duration | Tick Rate | Symbols |
|---|---|---|---|
| Smoke | 5 min | 100K/s | 500 |
| Baseline | 1 hour | 350K/s | 5,000 |
| Spike | 15 min | 500K/s | 5,000 |
| Endurance | 8 hours | 350K/s | 5,000 |
| Stress | Until failure | Increasing | 5,000 |

## CI/CD Pipeline

```
Pull Request -> Lint -> Unit Tests -> Integration Tests -> Build -> E2E Tests -> Perf Smoke -> Merge
```

## Test Coverage Requirements

| Layer | Coverage Target |
|---|---|
| bar-aggregator.js | 90% |
| bar-validator.js | 95% |
| corp-action-engine.js | 85% |
| api-routes.js | 80% |
| storage-writer.js | 80% |
| Overall | 80% |
