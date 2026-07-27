# DXCC — Narad Integration

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## Overview

DXCC maintains a persistent, authenticated WebSocket connection to the Narad WebSocket Gateway. This connection is the primary data pipeline for all real-time information displayed in the DXCC interface.

---

## Connection Architecture

```
+--------+     +--------+     +------------+     +------------+
| Engine | --> | Narad  | --> | Narad WS   | <-> | DXCC       |
|        |     | Bus    |     | Gateway    | WSS | WebSocket  |
+--------+     +--------+     +------------+     +------------+
                                                     |
                                                     v
                                              [Message Router]
                                                     |
                                                     v
                                              [Zustand Store]
                                                     |
                                                     v
                                              [React Widget]
```

### Connection URL

```
wss://narad-gateway.internal:443/ws?token=<JWT_TOKEN>
```

---

## Authentication Flow

### Step 1: Connection Initiation

The DXCC frontend opens a WebSocket connection with the JWT as a URL query parameter. The Narad WS Gateway validates the token before upgrading the connection.

### Step 2: Authentication Frame

Immediately after connection, DXCC sends an authentication frame:

```json
{
  "type": "auth",
  "token": "eyJhbGciOiJSUzI1NiIs...",
  "client": "dxcc",
  "version": "2.0.0"
}
```

### Step 3: Authentication Response

The gateway validates the token and responds:

```json
{
  "type": "auth_ack",
  "status": "ok",
  "session_id": "ws-session-uuid-v4",
  "server_time": "2026-07-24T09:30:00Z"
}
```

### Step 4: Topic Subscription

After authentication, DXCC sends its topic subscriptions:

```json
{
  "type": "subscribe",
  "topics": [
    "engine.health.*",
    "market.ticks",
    "market.ohlc.*",
    "strategy.*",
    "order.*",
    "risk.violations",
    "risk.suraksha",
    "audit.*",
    "alert.*",
    "narad.metrics"
  ]
}
```

### Per-Message Authentication

Every message received from the gateway includes an authentication context. The gateway validates the JWT on every message, not just at connection time. Expired tokens result in the connection being terminated with a `401` close code.

---

## Heartbeat Mechanism

DXCC and the Narad WS Gateway exchange heartbeat frames to detect connection issues:

### Client Ping (every 10 seconds)

```json
{
  "type": "ping",
  "timestamp": "2026-07-24T09:30:10Z"
}
```

### Server Pong

```json
{
  "type": "pong",
  "timestamp": "2026-07-24T09:30:10Z",
  "server_time": "2026-07-24T09:30:10.015Z"
}
```

### Timeout Rules

| Condition | Action |
|-----------|--------|
| No pong within 5 seconds | Mark connection as degraded |
| No pong within 15 seconds | Close connection; initiate reconnect |
| Server receives no ping for 30 seconds | Close connection from server side |

---

##Topic Subscriptions Based on Role and View

DXCC dynamically manages topic subscriptions based on the user's role and the currently active module.

### Subscription Lifecycle

```
[User navigates to Strategy Command]
        |
        v
[Component mounts]
        |
        v
[Widget calls useNaradSubscription("strategy.signals")]
        |
        v
[NaradProvider adds "strategy.signals" to subscription set]
        |
        v
[If topic not already subscribed: send subscribe frame]
        |
        v
[Data flows to widget]
        |
        v
[User navigates away]
        |
        v
[Component unmounts]
        |
        v
[useNaradSubscription unregisters]
        |
        v
[If no other widget needs topic: send unsubscribe frame]
```

### Role-Based Topic Filtering

Some topics are restricted by role at the gateway level:

| Topic | Required Role |
|-------|--------------|
| `engine.health.*` | All (read-only) |
| `market.*` | All |
| `strategy.*` | Trader, Admin, Quant (read) |
| `order.*` | Trader, Admin |
| `risk.violations` | Admin, Trader |
| `risk.suraksha` | Admin, Trader, Quant |
| `audit.*` | Auditor, Admin |
| `admin.*` | Admin only |

If a user attempts to subscribe to a restricted topic, the gateway sends an error frame and does not forward messages:

```json
{
  "type": "subscribe_error",
  "topic": "admin.user_events",
  "reason": "Insufficient permissions"
}
```

---

## Auto-Reconnection

DXCC implements automatic reconnection with exponential backoff:

```typescript
class NaradReconnectionManager {
  private baseDelayMs = 1000;
  private maxDelayMs = 3000;
  private maxAttempts = 10;
  private attempts = 0;

  async reconnect(): Promise<WebSocket> {
    for (this.attempts = 1; this.attempts <= this.maxAttempts; this.attempts++) {
      const delay = Math.min(
        this.baseDelayMs * Math.pow(2, this.attempts - 1),
        this.maxDelayMs
      );

      await sleep(delay);

      try {
        const ws = await this.connect();
        this.attempts = 0;
        return ws;
      } catch (err) {
        console.warn(`Reconnect attempt ${this.attempts} failed:`, err);
      }
    }

    throw new Error('Max reconnect attempts reached; falling back to REST polling');
  }

  get currentDelay(): number {
    return Math.min(
      this.baseDelayMs * Math.pow(2, this.attempts - 1),
      this.maxDelayMs
    );
  }
}
```

### Reconnection States

| Attempt | Delay | UI Indicator |
|---------|-------|-------------|
| 1 | 1s | "Reconnecting..." (green pulse) |
| 2 | 2s | "Reconnecting..." (green pulse) |
| 3 | 3s | "Reconnecting..." (yellow) |
| 4-6 | 3s | "Reconnecting... (attempt 4)" (orange) |
| 7-9 | 3s | "Connection issues detected" (red) |
| 10 | 3s | "Falling back to REST polling" (red, banner) |

After 10 failed attempts (approximately 30 seconds total), DXCC switches to REST API polling mode. The UI shows a persistent banner indicating degraded mode.

---

## Data Flow: End to End

```
 [Engine]                    [Narad]                [Narad WS GW]           [DXCC WS]              [State]            [Widget]
    |                          |                        |                       |                     |                   |
    |-- Publish event -------->|                        |                       |                     |                   |
    |  (engine.health.suchak)  |                        |                       |                     |                   |
    |                          |-- Route to subscriber->|                       |                     |                   |
    |                          |                        |-- Forward via WSS --->|                     |                   |
    |                          |                        |                       |-- Validate JWT ---->|                   |
    |                          |                        |                       |-- Deduplicate ----->|                   |
    |                          |                        |                       |-- Route to store -->|                   |
    |                          |                        |                       |                     |-- Immutable update|
    |                          |                        |                       |                     |-- Notify subscribers|
    |                          |                        |                       |                     |                   |-- React re-render|
    |                          |                        |                       |                     |                   |<-- DOM updated   |
    |                          |                        |                       |                     |                   |
    |<--- Total latency: <100ms from Engine publish to Widget DOM update ----->|                     |                   |
```

---

## Error Handling

### Common WebSocket Errors

| Close Code | Reason | Action |
|-----------|--------|--------|
| 1000 | Normal closure | Clean reconnect |
| 1001 | Going away (page unload) | No reconnect needed |
| 1006 | Abnormal closure | Immediate reconnect |
| 4001 | Invalid JWT | Redirect to login |
| 4003 | Unauthorized subscription | Log warning; remove topic |
| 4008 | Rate limited | Back off; reduce subscription rate |
| 4010 | Server restart | Reconnect after delay |

---

## Performance Characteristics

| Metric | Target | Typical |
|--------|--------|---------|
| Connection setup time | <500ms | 150-300ms |
| Message latency (Narad -> Widget DOM) | <100ms | 30-60ms |
| Heartbeat round trip | <50ms | 10-20ms |
| Reconnect time (within 3 attempts) | <3s | 1-2s |
| Max messages/sec (single connection) | 50,000 | — |
| Subscription change latency | <100ms | <50ms |

---

> **Next:** See [17-suraksha-integration.md](17-suraksha-integration.md) for Suraksha security integration details.
