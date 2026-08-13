# 📡 WebSocket Integration Guide (React)

## 1. Overview
This WebSocket system provides real-time market data streaming for a trading/options platform (TalkOptions). It delivers live price updates (LTP, change, volume) for financial instruments across two feed levels. The system uses a provider pattern with React Context and Zustand for state management, enabling any component in the tree to send messages and access streaming data.

## 2. Prerequisites
- Basic React knowledge (useEffect, useState, useContext)
- Understanding of JavaScript async patterns
- Zustand library familiarity (optional, but recommended)
- WebSocket basics (connection lifecycle)
- **Dependencies to install**: `zustand`

## 3. Connecting to WebSocket
The connection uses a secure WebSocket URL (`wss://`) with token-based authentication. The token is appended as a query parameter.

**Lifecycle**:
1. Connection initiated on component mount (if user is logged in)
2. `onopen` fires when connection established
3. `onclose` triggers automatic reconnection after 3 seconds
4. `onerror` logs errors and closes socket

**URL Structure**:
```
wss://wssreact.talkoptions.in/?token=<auth_token>
```
*Token is obtained from backend authentication. Replace with your valid token.*

**Minimal Connection Example**:
```javascript
const WS_URL = "wss://your-server.com/?token=YOUR_TOKEN";

const socket = new WebSocket(WS_URL);

socket.onopen = () => {
  console.log("Connected");
};

socket.onclose = () => {
  console.log("Disconnected");
  // Reconnection logic here
};
```

## 4. Subscription Mechanism
Subscriptions are sent as JSON messages with specific fields. Each subscription targets a specific token (instrument) and feed level.

**Message Format (Outgoing)**:
```javascript
{
  lvl: 1,           // Feed level: 1 = Level 1 (LTP, change), 2 = Level 2 (depth)
  feedSegment: "FO",  // Segment: IX_CM, CM, FO, CD
  token: "12345",   // Instrument token
  subscribe: true  // true = subscribe, false = unsubscribe
}
```

**Example Subscription**:
```javascript
const subscribe = (level, segment, token) => {
  const msg = {
    lvl: level,
    feedSegment: segment,
    token: token,
    subscribe: true
  };
  socket.send(JSON.stringify(msg));
};

// Subscribe to FO token 12345 for Level 1
subscribe(1, "FO", "12345");
```

## 5. Unsubscription Mechanism
To unsubscribe, send the same message structure with `subscribe: false`.

**Example**:
```javascript
const unsubscribe = (level, segment, token) => {
  const msg = {
    lvl: level,
    feedSegment: segment,
    token: token,
    subscribe: false
  };
  socket.send(JSON.stringify(msg));
};
```

**Cleanup Logic** (Critical for React):
- Clear all intervals and timers on unmount
- Close the WebSocket connection
- Clear any pending message queues

```javascript
useEffect(() => {
  return () => {
    clearInterval(updateInterval);
    clearTimeout(reconnectTimer);
    if (socketRef.current) {
      socketRef.current.close();
    }
  };
}, []);
```

## 6. Receiving Data
Incoming messages have a wrapper format with a `type` field indicating the feed level.

**Incoming Message Structure**:
```javascript
{
  type: 100,        // 100 = Level 1 data, 101 = Level 2 data
  data: "{\"Token\":\"12345\",\"LTP\":250.50,...}"  // JSON string
}
```

**Level 1 Data Payload** (after parsing `result.data`):
```javascript
{
  Token: "12345",
  LTP: "250.50",
  Change: "2.50",
  ChangePer: "1.01",
  SellPrice: "250.60",
  BuyPrice: "250.40",
  Volume: "10000"
}
```

**Level 2 Data Payload** (Order Book Depth):
```javascript
{
  Token: 12345,
  FeedSegment: "FO",
  Bids: [
    { "Qty": 100, "Price": 123.45, "Orders": 2 },
    { "Qty": 200, "Price": 123.40, "Orders": 3 }
  ],
  Asks: [
    { "Qty": 150, "Price": 123.55, "Orders": 1 },
    { "Qty": 250, "Price": 123.60, "Orders": 4 }
  ]
}
```
*Max 5 entries per side (Bids/Asks)*

**Message Parsing**:
```javascript
socket.onmessage = (event) => {
  const result = JSON.parse(event.data);
  
  if (result.type === 100) {
    const data = JSON.parse(result.data);
    // Process Level 1 data
  } else if (result.type === 101) {
    const data = JSON.parse(result.data);
    // Process Level 2 data
  }
};
```

## 7. Processing & Displaying Data
The system uses buffering to batch updates and reduce React re-renders. Data is merged and sent to the Zustand store at regular intervals.

**Processing Flow**:
1. Messages arrive and are pushed to buffer arrays
2. Every 800ms (Level 1) or 1000ms (Level 2), buffer is merged
3. Merged data updates Zustand store
4. Components subscribe to store and re-render

**React Integration**:
```javascript
import useWebSocketStore2 from "./stores/websocketStore";

const MyComponent = () => {
  // Subscribe to Level 1 data
  const websocketData = useWebSocketStore2(
    (state) => state.websocketData_lvl1
  );
  
  // websocketData is keyed by token: { "12345": {...}, "67890": {...} }
  
  return <div>Price: {websocketData["12345"]?.LTP}</div>;
};
```

**Data Transformation**:
- String values converted to numbers (`parseFloat`)
- Fixed to 2 decimal places (`.toFixed(2)`)
- Merged into state object keyed by token

## 8. Rate Handling / Buffering Strategy
The code implements a **buffer-and-batch** strategy to handle high-frequency updates:

- **Level 1 Buffer**: Messages collected and merged every **800ms**
- **Level 2 Buffer**: Messages collected and merged every **1000ms**

**Why this matters**:
- Prevents excessive React re-renders from every single message
- Reduces UI jank during high-volatility periods
- Batched updates improve performance

**Inferred Best Practices**:
- Adjust batch intervals based on your data frequency (faster for active trading, slower for monitoring)
- Use `Object.assign` to merge multiple token updates into single state update
- Consider `pauseFeed` flag to temporarily halt updates (e.g., when component is hidden)

## 9. Error Handling & Reconnection
**Error Scenarios**:
- Network disconnection
- Invalid messages
- Server closure

**Reconnection Strategy** (from code):
```javascript
socket.onclose = () => {
  console.log("WebSocket closed, retrying in 3s");
  isConnected.current = false;
  reconnectTimer.current = setTimeout(connectWebSocket, 3000);
};
```

**Defensive Patterns**:
- Message queuing: If not connected, queue messages and flush on reconnect
- Error logging: Log errors for debugging
- State tracking: Track `readyState` before sending
- Pause/resume: Built-in `pauseFeed` mechanism for temporary halting

## 10. Performance Considerations
- **Buffer batching**: Prevents per-message re-renders
- **State merging**: Use spread operator to merge only changed data
- **Keyed storage**: Data stored by token for O(1) access
- **Cleanup**: Always clear intervals, timeouts, and sockets
- **Message queue**: Flush queued messages on reconnection
- **Memory**: Clear buffers after merge to prevent memory growth

## 11. Clean Reusable Example

```javascript
// WebSocketProvider.jsx
import React, { createContext, useContext, useEffect, useRef } from "react";
import { create } from "zustand";

// ==================== STORE ====================
const useWebSocketStore = create((set, get) => ({
  data: {},
  pauseFeed: false,
  
  setData: (newData) => {
    if (!get().pauseFeed) {
      set((state) => ({ data: { ...state.data, ...newData } }));
    }
  },
  
  pauseFeeds: () => set({ pauseFeed: true }),
  resumeFeed: () => set({ pauseFeed: false }),
}));

// ==================== PROVIDER ====================
const SocketContext = createContext(null);

const WS_URL = "wss://your-server.com/?token=YOUR_TOKEN";

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const messageQueue = useRef([]);
  const isConnected = useRef(false);
  const buffer = useRef([]);
  
  const setData = useWebSocketStore((state) => state.setData);

  const connect = () => {
    socketRef.current = new WebSocket(WS_URL);

    socketRef.current.onopen = () => {
      console.log("WS Connected");
      isConnected.current = true;
      messageQueue.current.forEach((msg) => 
        socketRef.current.send(msg)
      );
      messageQueue.current = [];
    };

    socketRef.current.onmessage = (event) => {
      const result = JSON.parse(event.data);
      if (result.type === 100) {
        const data = JSON.parse(result.data);
        buffer.current.push({ [data.Token]: data });
      }
    };

    socketRef.current.onclose = () => {
      console.log("WS closed, reconnecting...");
      isConnected.current = false;
      setTimeout(connect, 3000);
    };

    socketRef.current.onerror = (err) => {
      console.error("WS Error", err);
      socketRef.current.close();
    };
  };

  const sendMessage = (level, segment, token, subscribe) => {
    const msg = JSON.stringify({ lvl: level, feedSegment: segment, token, subscribe });
    
    if (isConnected.current && socketRef.current?.readyState === 1) {
      socketRef.current.send(msg);
    } else {
      messageQueue.current.push(msg);
    }
  };

  useEffect(() => {
    connect();

    const interval = setInterval(() => {
      if (buffer.current.length > 0) {
        const merged = Object.assign({}, ...buffer.current);
        setData(merged);
        buffer.current = [];
      }
    }, 800);

    return () => {
      clearInterval(interval);
      socketRef.current?.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

// ==================== CONSUMER COMPONENT ====================
const PriceDisplay = ({ token, segment }) => {
  const sendMessage = useSocket();
  const data = useWebSocketStore((state) => state.data);

  useEffect(() => {
    sendMessage?.(1, segment, token, true);
    return () => sendMessage?.(1, segment, token, false);
  }, [token, segment]);

  const price = data[token];
  
  if (!price) return <div>Loading...</div>;

  return (
    <div>
      <span>LTP: {price.LTP}</span>
      <span>Change: {price.ChangePer}%</span>
    </div>
  );
};

// ==================== USAGE ====================
const App = () => (
  <SocketProvider>
    <PriceDisplay token="12345" segment="FO" />
  </SocketProvider>
);
```

## 12. AI-Ready Integration Notes

**Key Integration Steps**:
1. Wrap app with `SocketProvider` (requires authentication token)
2. Use `useSocket()` hook to get `sendMessage` function
3. Call `sendMessage(lvl, segment, token, true)` in useEffect to subscribe
4. Subscribe to store using `useWebSocketStore(state => state.data_lvl1)` or `data_lvl2`
5. Access data by token key: `data["TOKEN"]`

---

### Complete JSON Input/Output Schemas (AI-Ingestible)

#### Subscribe Request (Send to WebSocket)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "lvl": {
      "type": "integer",
      "enum": [1, 2],
      "description": "Feed level: 1 = Level 1 (price), 2 = Level 2 (depth)"
    },
    "feedSegment": {
      "type": "string",
      "enum": ["IX_CM", "CM", "FO", "CD"],
      "description": "Exchange segment"
    },
    "token": {
      "type": "string",
      "description": "Instrument token"
    },
    "subscribe": {
      "type": "boolean",
      "description": "true = subscribe, false = unsubscribe"
    }
  },
  "required": ["lvl", "feedSegment", "token", "subscribe"]
}
```

#### Level 1 Response (type: 100)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "type": {
      "type": "integer",
      "const": 100,
      "description": "Indicates Level 1 data"
    },
    "data": {
      "type": "string",
      "description": "JSON string containing Level 1 payload"
    }
  },
  "required": ["type", "data"]
}
```

**Parsed Level 1 Payload**:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "Token": { "type": "string" },
    "LTP": { "type": "string" },
    "Change": { "type": "string" },
    "ChangePer": { "type": "string" },
    "SellPrice": { "type": "string" },
    "BuyPrice": { "type": "string" },
    "Volume": { "type": "string" }
  },
  "required": ["Token", "LTP"]
}
```

#### Level 2 Response (type: 101)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "type": {
      "type": "integer",
      "const": 101,
      "description": "Indicates Level 2 data (order book depth)"
    },
    "data": {
      "type": "string",
      "description": "JSON string containing Level 2 payload"
    }
  },
  "required": ["type", "data"]
}
```

**Parsed Level 2 Payload (Order Book Depth)**:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "SaveFeedDepth",
  "type": "object",
  "properties": {
    "Token": {
      "type": "integer"
    },
    "FeedSegment": {
      "type": "string",
      "enum": ["IX_CM", "CM", "FO", "CD"]
    },
    "Bids": {
      "type": ["array", "null"],
      "items": {
        "$ref": "#/$defs/DepthInfo"
      },
      "maxItems": 5
    },
    "Asks": {
      "type": ["array", "null"],
      "items": {
        "$ref": "#/$defs/DepthInfo"
      },
      "maxItems": 5
    }
  },
  "required": ["Token", "FeedSegment"],
  "$defs": {
    "DepthInfo": {
      "type": "object",
      "properties": {
        "Qty": {
          "type": "integer"
        },
        "Price": {
          "type": "number"
        },
        "Orders": {
          "type": "integer",
          "minimum": 0,
          "maximum": 65535
        }
      },
      "required": ["Qty", "Price", "Orders"],
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

---

### Confirmed Configuration

| Parameter | Value | Notes |
|-----------|-------|-------|
| **Supported Feed Segments** | `IX_CM`, `CM`, `FO`, `CD` | Best practice set by provider |
| **Token Expiration** | Until WS license expires | 24-hour renewal cycle (sometimes identification only, not authentication) |
| **Max Concurrent Subscriptions** | ~1,000 | Tested; post that server load must be monitored |
| **Heartbeat/Ping-Pong Required** | No | Not required by server |
| **Reconnection Delay** | 3 seconds | Best practice from provider code |
| **Batch Interval (Level 1)** | 800ms | Best practice from provider code |
| **Batch Interval (Level 2)** | 1000ms | Best practice from provider code |

---

### Quick Integration JSON (Copy-Paste for AI Agents)

```json
{
  "integration": {
    "websocket": {
      "url": "wss://wssreact.talkoptions.in/?token=<TOKEN>",
      "protocol": "wss",
      "authMethod": "query_param_token",
      "reconnectDelayMs": 3000,
      "heartbeatRequired": false
    },
    "subscription": {
      "messageFormat": {
        "lvl": "number (1 or 2)",
        "feedSegment": "string (IX_CM|CM|FO|CD)",
        "token": "string",
        "subscribe": "boolean"
      },
      "maxSubscriptions": 1000,
      "supportedSegments": ["IX_CM", "CM", "FO", "CD"]
    },
    "messages": {
      "level1TypeId": 100,
      "level2TypeId": 101,
      "responseWrapper": {
        "type": "number",
        "data": "string (JSON)"
      }
    },
    "parsing": {
      "level1": {
        "intervalMs": 800,
        "dataKey": "websocketData_lvl1",
        "mergeStrategy": "object.assign"
      },
      "level2": {
        "intervalMs": 1000,
        "dataKey": "websocketData_lvl2",
        "mergeStrategy": "object.assign"
      }
    },
    "stateManagement": {
      "library": "zustand",
      "pauseResume": true
    }
  }
}
```
