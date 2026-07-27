# 18 — Failover

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Failover Architecture

The WebSocket tier is designed for stateless horizontal scaling. There is no primary/standby. Failover is handled at the load balancer layer and by client-side reconnection logic.

## Instance Failover

When a WebSocket server instance fails:

```
1. HAProxy health check detects instance DOWN
2. HAProxy removes instance from rotation (< 5 seconds)
3. Existing connections to failed instance are dropped
4. Client-side auto-reconnect triggers:
   - Client SDK detects connection close (code 1006 or no close frame)
   - Waits reconnectInterval (default: 5s)
   - Reconnects to wss://ws.lakshmi.internal (HAProxy VIP)
   - HAProxy routes to a healthy instance
   - Client re-subscribes to topics
   - Client resumes receiving messages
```

**Total recovery time:** approximately 5-10 seconds.

## Client-Side Resilience

The Lakshmi WebSocket client SDK implements:

```javascript
// Auto-reconnect with exponential backoff
const client = new LakshmiWSClient({
  url: 'wss://ws.lakshmi.internal:8443/ws',
  autoReconnect: true,
  reconnectInterval: 5000,    // Initial: 5s
  maxReconnectInterval: 60000, // Max: 60s
  reconnectDecay: 1.5,        // Exponential factor
  maxReconnectAttempts: 20,
});

// Subscription persistence
// On reconnect, client automatically re-subscribes to previously active topics
```

## Load Balancer Failover

For HAProxy redundancy, two HAProxy instances run in active-standby with keepalived VRRP:

```
HAProxy-01 (Active, VIP: 10.100.100.10)
HAProxy-02 (Standby, takes VIP on failure)
```

## Cross-DC Failover

If the entire Mumbai DC fails:

1. DNS updated (or manual client reconfiguration) to point to Navi Mumbai VIP
2. Clients reconnect to Navi Mumbai WebSocket instances
3. Navi Mumbai instances are connected to Navi Mumbai MQ cluster (mirrored data)
4. Subscription state is re-established from client-side

**Note:** WebSocket cross-DC failover is manual. Unlike MQ (which can auto-failover), the WebSocket tier requires explicit DNS or configuration changes.

## Graceful Shutdown

On controlled shutdown (e.g., deployment):
1. Instance signals HAProxy: `set server ws_backend/ws03 state drain`
2. HAProxy stops sending new connections
3. Instance sends close frames (code 1001) to all connected clients
4. Clients reconnect to other instances per SDK logic
5. After all connections drained (max 60s), process exits

## Failure Scenarios

| Scenario | Impact | Recovery |
|----------|--------|----------|
| Single instance crash | ~3000 connections dropped | Clients reconnect within 10s |
| All instances crash | All connections dropped | Clients reconnect when instances recover |
| MQ broker failure | No messages to WebSocket tier | MQ failover handles; WS reconnects to MQ |
| Suraksha IAM failure | New connections fail auth | Existing connections unaffected; IAM recovers |
| HAProxy failure | No new connections; existing stay | Secondary HAProxy takes VIP |
| DC failure | All connections in DC lost | Manual DNS failover to DR DC |
