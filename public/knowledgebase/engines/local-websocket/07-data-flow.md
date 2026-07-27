# 07 — Data Flow

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Primary Data Flow: MQ → WebSocket

```
MQ Broker
    │
    │ lakshmi-mq-js consumer receives message batch
    ▼
MQ Consumer Pool (one consumer per unique subscribed topic)
    │
    │ Protobuf (LCFM v3) deserialization
    ▼
Serializer (Protobuf → JSON or MessagePack)
    │
    │
    ▼
uWebSockets.js Internal Pub/Sub
    │
    │ topic-based fan-out to all subscribed WebSocket connections
    ▼
Per-Connection Throttler
    │
    │ check rate limit for this client
    │ drop oldest if backpressure threshold exceeded
    ▼
WebSocket Frame Sent (Text for JSON, Binary for MessagePack)
    │
    ▼
Browser Client
```

## Subscription Flow

```
1. Browser opens WebSocket to wss://ws.lakshmi.internal:8443
2. Browser sends subscribe message: {"type":"subscribe","topics":["feed.NSE.CM.tick"]}
3. Server validates JWT
4. Server checks authorization: can this client access "feed.NSE.CM.tick"?
5. Server checks SubscriptionAggregator:
   - Is there already an MQ consumer for "feed.NSE.CM.tick"?
   - If YES: add this connection to the subscriber set
   - If NO: create MQ consumer, add connection to subscriber set
6. Server sends: {"type":"subscribed","topics":["feed.NSE.CM.tick"]}
7. MQ consumer begins receiving messages
8. Each message fanned out to all subscribed WebSocket connections
```

## Unsubscription Flow

```
1. Browser sends: {"type":"unsubscribe","topics":["feed.NSE.CM.tick"]}
2. Server removes connection from subscriber set for "feed.NSE.CM.tick"
3. If subscriber set is now empty:
   - Close MQ consumer for that topic
   - Remove topic from SubscriptionAggregator
4. Server sends: {"type":"unsubscribed","topics":["feed.NSE.CM.tick"]}
```

## Message Serialization Decision

| Client Header | Serialization | Content Type | Frame Type |
|---------------|--------------|-------------|------------|
| `X-Format: json` (default) | JSON.stringify() | text/plain | Text frame |
| `X-Format: msgpack` | MessagePack.encode() | application/msgpack | Binary frame |
| `X-Format: msgpack+gzip` | MessagePack then gzip | application/msgpack+gzip | Binary frame |

## Error Flow

If a client subscribes to a topic they are not authorized for:
1. Server does NOT add the subscription
2. Server sends: `{"type":"error","code":"UNAUTHORIZED","topic":"feed.NSE.FO.tick","message":"Access denied"}`
3. Authorized topics in the same subscribe request are still processed normally
4. Connection remains open

## Throttling Flow

```
Every incoming message for a connection:
  1. Increment per-second message counter
  2. If counter > rate_limit:
     - Log throttle event
     - Drop message (do not send to WebSocket)
     - If 10 consecutive throttle events: send warning frame to client
  3. Reset counter every second (token bucket algorithm)
```
