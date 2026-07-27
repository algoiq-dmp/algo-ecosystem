# 20 — Testing

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Testing Strategy

The WebSocket server testing strategy covers unit tests (core logic), integration tests (end-to-end), performance tests (load), and client SDK tests (compatibility).

## Unit Tests

**Framework:** Jest
**Coverage target:** > 80%

| Suite | Location | Tests |
|-------|----------|-------|
| Connection Manager | `tests/unit/connection-manager.test.js` | 34 |
| Subscription Aggregator | `tests/unit/subscription-aggregator.test.js` | 28 |
| Authenticator | `tests/unit/authenticator.test.js` | 22 |
| Authorizer | `tests/unit/authorizer.test.js` | 18 |
| Serializer | `tests/unit/serializer.test.js` | 15 |
| Throttler | `tests/unit/throttler.test.js` | 12 |

### Example: Subscription Aggregator Test

```javascript
describe('SubscriptionAggregator', () => {
  it('should create MQ consumer on first subscription', () => {
    const agg = new SubscriptionAggregator(mockMqPool);
    agg.subscribe('feed.NSE.CM.tick', 'conn-1');
    expect(mockMqPool.createConsumer).toHaveBeenCalledWith('feed.NSE.CM.tick');
  });

  it('should reuse MQ consumer for second subscription to same topic', () => {
    agg.subscribe('feed.NSE.CM.tick', 'conn-2');
    expect(mockMqPool.createConsumer).toHaveBeenCalledTimes(1);
  });

  it('should close MQ consumer when last subscriber unsubscribes', () => {
    agg.unsubscribe('feed.NSE.CM.tick', 'conn-1');
    agg.unsubscribe('feed.NSE.CM.tick', 'conn-2');
    expect(mockMqPool.closeConsumer).toHaveBeenCalledWith('feed.NSE.CM.tick');
  });
});
```

## Integration Tests

**Framework:** Custom harness using `ws` client library + mock MQ + mock Suraksha

| Scenario | Description |
|----------|-------------|
| Connection lifecycle | Connect → authenticate → subscribe → receive → unsubscribe → disconnect |
| Auth failure | Connect with invalid JWT → verify 4001 close |
| Auth failure - expired | Connect with expired JWT → verify rejection |
| Authorization denied | Subscribe to unauthorized topic → verify error frame |
| Multiple subscriptions | Subscribe to 10 topics → verify all MQ consumers created |
| Backpressure | Slow consumer → verify message drops at threshold |
| Throttling | Exceed rate limit → verify warning and drops |
| Reconnect simulation | Kill connection → verify client reconnect + re-subscribe |

## Performance Tests

**Framework:** k6 with WebSocket support

```javascript
// k6 load test script
import ws from 'k6/ws';

export const options = {
  stages: [
    { duration: '1m', target: 1000 },  // Ramp to 1000 connections
    { duration: '5m', target: 5000 },  // Ramp to 5000 connections
    { duration: '10m', target: 5000 }, // Sustain for 10 minutes
    { duration: '1m', target: 0 },     // Ramp down
  ],
};

export default function () {
  const url = 'wss://ws-stg.lakshmi.internal:8443/ws';
  const params = { headers: { Authorization: `Bearer ${TOKEN}` } };

  const res = ws.connect(url, params, (socket) => {
    socket.on('open', () => {
      socket.send(JSON.stringify({
        type: 'subscribe',
        topics: ['feed.NSE.CM.tick']
      }));
    });

    socket.on('message', (data) => {
      const msg = JSON.parse(data);
      // Validate message structure
    });
  });
}
```

Run with: `k6 run tests/perf/load-test.js`

## Client SDK Tests

The `@lakshmi/ws-client` package has its own test suite:
- Auto-reconnect: kill server, verify client reconnects
- Re-subscription: reconnect to different server instance, verify subscriptions restored
- Message ordering: verify sequence numbers within a topic
- Error handling: invalid token, network timeout

## Running Tests

```bash
# Unit tests
npm test

# Integration tests (requires local MQ and Suraksha mock)
npm run test:integration

# Performance tests
npm run test:perf -- --connections 5000 --duration 600

# Full CI suite
npm run test:ci
```
