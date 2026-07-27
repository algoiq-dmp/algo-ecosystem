# 05 — Low-Level Design

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## WebSocket Connection Lifecycle

```
Client                          Server
  │                               │
  │── HTTP GET /ws ──────────────►│
  │   Headers:                    │
  │   Authorization: Bearer <JWT> │
  │   X-Format: msgpack           │
  │                               │── Validate JWT with Suraksha IAM
  │                               │── Extract client_id, permissions
  │◄── 101 Switching Protocols ───│
  │                               │
  │── {'type':'subscribe',       │
  │    'topics':['feed.NSE.CM']}─►│── Validate topic access
  │                               │── Aggregate subscription
  │                               │── Create MQ consumer if first sub
  │◄── {'type':'subscribed',     │
  │    'topics':['feed.NSE.CM']}──│
  │                               │
  │◄── {'type':'message',        │
  │    'topic':'feed.NSE.CM',    │  (MQ message arrives)
  │    'payload':{...}}──────────│
  │                               │
  │── ping ─────────────────────►│
  │◄── pong ─────────────────────│  (every 30s)
  │                               │
  │── {'type':'unsubscribe',     │
  │    'topics':['feed.NSE.CM']}─►│── Remove from subscription
  │                               │── Close MQ consumer if last sub
```

## Wire Protocol

### Client-to-Server Messages (JSON over WebSocket Text Frames)

**Subscribe:**
```json
{
  "type": "subscribe",
  "id": "req-001",
  "topics": ["feed.NSE.CM.tick", "feed.NSE.FO.quote"],
  "format": "json"
}
```

**Unsubscribe:**
```json
{
  "type": "unsubscribe",
  "id": "req-002",
  "topics": ["feed.NSE.CM.tick"]
}
```

**Ping:**
```json
{"type": "ping"}
```

### Server-to-Client Messages

**Subscription Confirmed:**
```json
{
  "type": "subscribed",
  "id": "req-001",
  "topics": ["feed.NSE.CM.tick", "feed.NSE.FO.quote"],
  "timestamp": "2026-07-25T09:15:00.000Z"
}
```

**Market Data (JSON):**
```json
{
  "type": "message",
  "topic": "feed.NSE.CM.tick",
  "payload": {
    "symbol": "RELIANCE",
    "ltp": 2547.35,
    "volume": 152340,
    "timestamp": 1721888100000000000
  },
  "seq": 123456789
}
```

**Market Data (MessagePack):**
Binary frame with the same structure compressed using MessagePack (approximately 40% smaller than JSON).

## MQ Consumer Management

```javascript
class MqConsumerPool {
  constructor(mqConfig) {
    this.consumers = new Map(); // topic → Consumer
    this.subscriptionCounts = new Map(); // topic → refCount
  }

  subscribe(topic, wsClientId) {
    if (!this.consumers.has(topic)) {
      const consumer = new MqConsumer({
        topic,
        onMessage: (msg) => this.fanout(topic, msg),
      });
      this.consumers.set(topic, consumer);
      this.subscriptionCounts.set(topic, 0);
    }
    this.subscriptionCounts.set(topic, this.subscriptionCounts.get(topic) + 1);
  }

  unsubscribe(topic, wsClientId) {
    const count = this.subscriptionCounts.get(topic) - 1;
    if (count <= 0) {
      this.consumers.get(topic).close();
      this.consumers.delete(topic);
      this.subscriptionCounts.delete(topic);
    } else {
      this.subscriptionCounts.set(topic, count);
    }
  }

  fanout(topic, message) {
    // uWebSockets.js publish to internal topic
    app.publish(topic, serializeMessage(message));
  }
}
```

## Backpressure Handling

When a WebSocket client's send buffer exceeds `maxBackpressure` (default: 16KB):

```javascript
ws.getBufferedAmount(); // Check current buffer size

if (bufferedAmount > maxBackpressure) {
  switch (backpressureStrategy) {
    case 'drop-oldest':
      ws.dropOldestMessage(); // uWebSockets.js built-in
      break;
    case 'disconnect':
      ws.end(1013, 'Backpressure limit exceeded');
      break;
    case 'none':
      // Let OS buffer fill; may cause memory issues
      break;
  }
}
```
