# 01 — Overview

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## What is the Local WebSocket Server?

The Local WebSocket server is a real-time streaming gateway that converts the Lakshmi MQ pub/sub message bus into WebSocket streams consumable by web browsers, mobile apps, and lightweight monitoring tools. It subscribes to MQ topics on behalf of WebSocket clients, serializes messages into JSON or MessagePack, and delivers them over persistent WebSocket connections.

## Why WebSocket?

Algorithmic trading platforms typically use binary protocols over TCP for low-latency internal communication. However, dashboards, monitoring UIs, risk management consoles, and trader workstations are web-based and require browser-compatible protocols. WebSocket provides full-duplex, low-overhead streaming compatible with all modern browsers.

## Position in Lakshmi

```
MQ Cluster ──► Local WebSocket ──► Browser Clients (Dashboards, Monitoring)
                                     │
                                     ├── Risk Management Dashboard
                                     ├── Trader Blotter UI
                                     ├── Market Watch Dashboard
                                     ├── Operations Console
                                     └── Admin UI
```

## Core Responsibilities

1. **MQ to WebSocket Bridge** — Consume MQ topics and forward to subscribed WebSocket clients
2. **Subscription Management** — Allow clients to dynamically subscribe/unsubscribe to MQ topics
3. **Serialization** — Convert LCFM protobuf messages to JSON or MessagePack
4. **Connection Management** — Handle WebSocket lifecycle (connect, authenticate, heartbeat, disconnect)
5. **Throttling** — Per-client message rate limiting to prevent single-client overload
6. **Authentication** — Validate JWT tokens and enforce topic-level access control

## Supported Clients

| Client Type | Serialization | Use Case |
|-------------|--------------|----------|
| React Dashboard | JSON | Market watch, P&L view |
| Mobile App (React Native) | MessagePack | On-the-go monitoring |
| Python Monitoring Scripts | JSON | Custom alerting |
| Prometheus AlertManager Webhook | JSON | Alert dashboards |
| Grafana WebSocket Data Source | JSON | Live metric panels |
