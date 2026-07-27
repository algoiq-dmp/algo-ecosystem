# 02 — Business Requirements

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## BR-1: Real-Time Market Data to Web Clients

The system MUST deliver real-time market data (ticks, quotes, order book snapshots) to web-based clients with less than 100ms end-to-end latency measured from MQ publish to WebSocket frame delivery.

## BR-2: 10,000 Concurrent Connections

Each WebSocket server instance MUST support at least 10,000 concurrent client connections with sustained message delivery.

## BR-3: Topic-Based Subscription Filtering

Clients MUST be able to subscribe and unsubscribe to specific MQ topics dynamically over the WebSocket connection without reconnecting. Subscription changes must take effect within 100ms.

## BR-4: Authentication and Authorization

Every WebSocket connection MUST be authenticated using a JWT token. Topic subscriptions MUST be authorized against the client's access policy from Suraksha IAM. Unauthorized subscriptions must be rejected.

## BR-5: Multiple Serialization Formats

The server MUST support JSON (human-readable, for debugging and dashboards) and MessagePack (compact binary, for mobile and high-throughput clients) serialization formats, selectable per connection.

## BR-6: Graceful Backpressure Handling

When a client cannot consume messages fast enough, the server MUST implement a configurable backpressure strategy: drop oldest messages, throttle, or disconnect the client.

## BR-7: Horizontal Scalability

The WebSocket tier MUST scale horizontally. Multiple WebSocket instances must be able to run behind a load balancer with sticky sessions or client-side routing.

## BR-8: Cross-Origin Support

The server MUST support CORS (Cross-Origin Resource Sharing) for WebSocket upgrade requests from allowed origins, enabling dashboards hosted on different domains to connect.

## BR-9: Health and Metrics

The server MUST expose health check endpoints and Prometheus metrics for monitoring, including connection count, message throughput, and per-topic subscription counts.

## BR-10: No Message Persistence

The WebSocket server is a stateless streaming gateway. It MUST NOT persist any messages. If a client disconnects, missed messages are not recoverable from the WebSocket server.
