# 22 — FAQ

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## General

**Q: Why use WebSocket instead of Server-Sent Events (SSE)?**
A: WebSocket provides full-duplex communication. SSE is half-duplex (server → client only) and requires separate HTTP requests for client-to-server communication (like subscriptions). WebSocket also has better browser support for binary frames (MessagePack).

**Q: How many topics can one client subscribe to?**
A: No hard limit, but practical limit is approximately 50 topics per connection. Each topic subscription adds MQ consumer overhead. For high-frequency topics like tick data, keep it under 20 per connection. Use wildcard topics when available.

**Q: Does the WebSocket server support compression?**
A: Yes, per-message deflate is supported via the WebSocket permessage-deflate extension. Enable with header `X-Compression: gzip`. Also MessagePack + gzip is available for further compression at the application level.

## Authentication

**Q: How long are JWT tokens valid?**
A: Default JWT TTL is 1 hour. Clients must refresh tokens before expiry. The WebSocket server closes the connection with code 4001 when the token expires. The client SDK handles automatic token refresh via a callback.

**Q: Can a single JWT be used by multiple clients?**
A: Yes, if the JWT is issued for a machine identity (e.g., "dashboard-prod"). User-scoped JWTs should not be shared.

## Operations

**Q: How do I add a new WebSocket instance?**
A: Provision the server, install the software, configure it with the same MQ broker list, add the new instance to HAProxy backend, and verify via health check. No other configuration changes needed.

**Q: Can I restrict which topics are exposed via WebSocket?**
A: Authorization is controlled by Suraksha IAM policies. The WebSocket server denies subscriptions to topics the client doesn't have `read` permission for. There is no server-wide topic allow/block list — it's per-client.

**Q: What happens when all WebSocket instances restart?**
A: All clients disconnect and their SDKs auto-reconnect. They re-subscribe and resume receiving data. Messages published to MQ during the outage window are NOT delivered retroactively — the WebSocket server is a live stream only.

## Performance

**Q: What is the maximum messages-per-second per client?**
A: Default rate limit is 100 msgs/sec per connection. This can be increased per client via a custom claim in the JWT. Practical browser limit for DOM updates is approximately 200-300 msgs/sec.

**Q: Why is MessagePack recommended for high-throughput clients?**
A: MessagePack is approximately 40% smaller on the wire than JSON and faster to serialize/deserialize in JavaScript. It uses WebSocket binary frames which have lower overhead than text frames.

## Development

**Q: Can I run the WebSocket server locally for development?**
A: Yes. Clone the repo, run `npm install`, configure `config.yaml` to point to a dev MQ instance (or use `mqd --single-node`), and run `node src/server.js`.

```bash
git clone internal/lakshmi-ws-server
cd lakshmi-ws-server
npm install
cp config.example.yaml config.yaml
# Edit config.yaml with dev MQ broker
node src/server.js
```
