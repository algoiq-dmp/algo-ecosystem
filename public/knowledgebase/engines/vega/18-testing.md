# 18 — Testing Strategy

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Testing Pyramid

```
        ┌──────┐
        │ E2E  │  5% — Full order flow, broker simulators
        ├──────┤
        │ Int. │  15% — API + MQ + DB integration
        ├──────┤
        │ Unit │  80% — Individual components, validation logic
        └──────┘
```

---

## Unit Tests

### Technology

- **Framework:** Jest
- **Assertions:** Jest built-in
- **Mocking:** Jest mocks + Sinon for complex scenarios
- **Coverage Target:** 85% lines, 80% branches

### Test Categories

| Component | Tests | Key Focus |
|---|---|---|
| Schema Validation | 50+ | All order types, edge cases, invalid payloads |
| HMAC Auth | 20+ | Valid/invalid signature, timestamp drift, replay |
| Rate Limiter | 15+ | Token bucket behavior, tier enforcement |
| Order State Machine | 80+ | All valid transitions, all invalid transitions |
| Idempotency | 10+ | Duplicate detection, TTL expiry |
| Kill Switch Logic | 25+ | Threshold boundary, activation, reset |
| FIX Message Serialization | 40+ | All message types, tag ordering, values |
| Credential Manager | 15+ | Encryption, rotation, access audit |

### Example: Order State Machine Unit Test

```javascript
describe('Order State Machine', () => {
  describe('Valid Transitions', () => {
    it('should transition from NEW to PENDING_VALIDATION', () => {
      const order = createOrder({ state: 'NEW' });
      const result = orderStateMachine.transition(order, 'PENDING_VALIDATION');
      expect(result.state).toBe('PENDING_VALIDATION');
      expect(result.events).toContainEqual({ type: 'VALIDATION_STARTED' });
    });

    it('should transition from ACKNOWLEDGED to PARTIALLY_FILLED', () => {
      const order = createOrder({ state: 'ACKNOWLEDGED', quantity: 100 });
      const result = orderStateMachine.transition(order, 'PARTIALLY_FILLED', {
        filledQuantity: 30,
        averagePrice: 2450.50
      });
      expect(result.state).toBe('PARTIALLY_FILLED');
      expect(result.filledQuantity).toBe(30);
    });

    it('should not transition from FILLED to any state', () => {
      const order = createOrder({ state: 'FILLED' });
      expect(() => {
        orderStateMachine.transition(order, 'CANCELLED');
      }).toThrow('INVALID_STATE_TRANSITION');
    });
  });
});
```

### Running Unit Tests

```bash
# All unit tests
npm test

# Specific component
npm test -- --testPathPattern="order-processor"

# With coverage
npm test -- --coverage

# Watch mode (development)
npm test -- --watch
```

---

## Integration Tests

### Technology

- **Framework:** Jest + Supertest (API), amqplib (MQ)
- **Database:** Testcontainers (PostgreSQL, Redis, RabbitMQ)
- **Coverage Target:** Key flows tested

### Integration Test Scenarios

| Scenario | Components | Verification |
|---|---|---|
| Happy path order flow | All 4 components | Order reaches ACKNOWLEDGED state |
| Signal → rejection | API → App | Order rejected at validation |
| Idempotency | API → Processor | Duplicate signal ignored |
| Kill switch during flow | API → Processor → Kill Switch | Order rejected post-activation |
| DB connection loss | Processor → DB | Retry + eventual consistency |
| MQ broker restart | All → MQ | Messages persisted, no loss |
| Rate limit enforcement | API | 429 after threshold |
| Credential rotation | Credential Mgr → Broker | Session survives rotation |

### Example: Integration Test

```javascript
describe('Order Flow Integration', () => {
  let postgresContainer, redisContainer, rabbitContainer;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();
    redisContainer = await new RedisContainer().start();
    rabbitContainer = await new RabbitMQContainer().start();

    await initializeApp({
      pgUrl: postgresContainer.getConnectionUri(),
      redisUrl: redisContainer.getConnectionUri(),
      mqUrl: rabbitContainer.getConnectionUri()
    });
  });

  it('should process a valid order end-to-end', async () => {
    const response = await request(app)
      .post('/api/v1/orders')
      .set('X-API-Key', testApiKey)
      .set('X-Timestamp', Date.now().toString())
      .set('X-Signature', generateTestSignature(orderPayload))
      .send(orderPayload);

    expect(response.status).toBe(202);
    expect(response.body.status).toBe('ACCEPTED');
    expect(response.body.correlationId).toBeDefined();

    // Wait for async processing
    await waitForOrderState(response.body.correlationId, 'ACKNOWLEDGED');
  });
});
```

---

## End-to-End Tests

### FIX Simulator

Vega includes a FIX simulator that emulates XTS and Greeksoft broker FIX engines:

```javascript
// scripts/fix-simulator.js
const FixSimulator = require('./test-utils/fix-simulator');

const simulator = new FixSimulator({
  port: 19200,
  senderCompId: 'XTS-BROKER',
  targetCompId: 'VEGA-TEST',
  fixVersion: 'FIX.4.4',
  behavior: {
    // Accept all orders, fill after 100ms
    onNewOrderSingle: (order) => ({
      action: 'ACCEPT_AND_FILL',
      delayMs: 100,
      fillPrice: order.price
    })
  }
});

simulator.start();
```

### E2E Test Scenarios

| Scenario | Duration | Schedule |
|---|---|---|
| Market open order burst | 1000 orders in 1 second | Nightly |
| 24-hour soak test | Continuous order flow | Weekly |
| Kill switch cascade | Trigger and verify full halt | Nightly |
| Broker failover scenario | XTS down → Greeksoft routes | Nightly |
| Network partition test | MQ partition recovery | Weekly |

---

## Performance Tests

### Tool: k6 / Artillery

```javascript
// load-test.js (k6)
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 100 },   // Ramp up
    { duration: '3m', target: 1000 },  // Sustained load
    { duration: '1m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],        // P95 < 500ms
    http_req_failed: ['rate<0.01'],          // < 1% failure rate
  },
};

export default function () {
  const payload = JSON.stringify({
    signalId: `PERF-${__VU}-${__ITER}`,
    symbol: 'RELIANCE',
    orderType: 'LIMIT',
    transactionType: 'BUY',
    quantity: 10,
    price: 2450.75,
    userId: `USR-PERF-${__VU % 100}`,
    strategyId: 'STRAT-PERF-01'
  });

  const res = http.post('http://localhost:3003/api/v1/orders', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, { 'status 202': (r) => r.status === 202 });
}
```

---

## Pre-Commit & CI Gates

### Pre-Commit (Husky + lint-staged)

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write"],
    "*.json": ["prettier --write"]
  }
}
```

### CI Pipeline Gates

```
1. Lint (ESLint + Prettier)
2. Unit Tests (Jest — must pass, coverage >= 85%)
3. Integration Tests (Testcontainers — must pass)
4. Security Scan (npm audit, Snyk)
5. Build Docker Image
6. E2E Tests (against ephemeral environment)
7. Performance Smoke Test (k6 — latency < threshold)
8. Deploy to Staging
```

---

## Test Data Management

| Data Set | Purpose | Storage |
|---|---|---|
| Fixtures | Unit test inputs (JSON, FIX messages) | `test/fixtures/` |
| Seed Data | Integration test DB state | `test/seeds/` |
| Anonymized Prod Data | Performance test volumes | S3 (encrypted, access-controlled) |
| Mock Broker Responses | FIX simulator scenarios | `test/fix-scenarios/` |
