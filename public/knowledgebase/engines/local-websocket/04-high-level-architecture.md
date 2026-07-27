# 04 — High-Level Architecture

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Architecture Overview

The Local WebSocket server follows an event-driven, non-blocking I/O architecture built on uWebSockets.js, a C++ WebSocket library with Node.js bindings. Each instance maintains a pool of MQ consumers that subscribe to topics on behalf of connected WebSocket clients.

## Process Model

```
┌────────────────────────────────────────────────────┐
│                 WebSocket Server Instance           │
│                                                    │
│  ┌──────────┐   ┌──────────────┐   ┌────────────┐ │
│  │ HTTP(S)  │──►│ WS Upgrade   │──►│ Auth Layer │ │
│  │ Listener │   │ Handler      │   │ (JWT)      │ │
│  └──────────┘   └──────────────┘   └─────┬──────┘ │
│                                          │         │
│  ┌──────────────────────────────────────┐│         │
│  │         Connection Manager           ││         │
│  │  ┌─────────┐  ┌─────────┐           ││         │
│  │  │Conn-1   │  │Conn-N    │ ...       │◄┘         │
│  │  │ Sub:    │  │ Sub:     │           │          │
│  │  │ T1,T2   │  │ T3       │           │          │
│  │  └────┬────┘  └────┬────┘           │          │
│  └───────┼────────────┼────────────────┘          │
│          │            │                            │
│  ┌───────┴────────────┴────────────────┐          │
│  │       Subscription Aggregator       │          │
│  │  Topic T1 → [Conn-1]               │          │
│  │  Topic T2 → [Conn-1]               │          │
│  │  Topic T3 → [Conn-N]               │          │
│  └───────┬─────────────────────────────┘          │
│          │                                        │
│  ┌───────┴─────────────────────────────┐          │
│  │         MQ Consumer Pool            │          │
│  │  Consumer T1 ──► MQ Broker          │          │
│  │  Consumer T2 ──► MQ Broker          │          │
│  │  Consumer T3 ──► MQ Broker          │          │
│  └─────────────────────────────────────┘          │
│                                                    │
└────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Subscription Aggregation

Instead of creating one MQ consumer per WebSocket client per topic (which would overwhelm MQ), the server aggregates subscriptions. For a given MQ topic, only one MQ consumer exists regardless of how many WebSocket clients are subscribed. Received messages are fanned out to all subscribed WebSocket clients.

### 2. uWebSockets.js

Chose uWebSockets.js over `ws` (pure JS) for its C++ performance. uWebSockets.js handles 10x more connections per CPU core and has lower per-message overhead. It also provides built-in pub/sub within the server process for efficient fan-out.

### 3. No Message Buffering

The server does NOT buffer messages per client. Messages are pushed to the WebSocket socket immediately. If the socket's send buffer is full (backpressure), the oldest queued message for that client is dropped (configurable: drop-oldest or disconnect).

### 4. Stateless Design

WebSocket servers are stateless. Any instance can serve any client. Client state (subscriptions) is ephemeral — if a client reconnects to a different instance, it must re-subscribe. This enables simple horizontal scaling behind a load balancer.
