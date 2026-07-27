# 25. Glossary

**Version:** 2.1.0
**Owner:** Documentation Team
**Last Updated:** 2026-07-24

---

## Overview

This glossary defines 30 key technical terms used throughout the Lakshmi documentation and the broader Algo-IQ ecosystem. Each entry includes a concise definition and context of usage specific to Lakshmi.

---

## A-D

### 1. API Key
A pre-shared secret used for service-to-service authentication. Stored hashed in Lakshmi config; scoped to specific topics and operations. Rotated every 90 days via Suraksha Key Vault.

### 2. Broadcast Feeder
The Lakshmi component that distributes incoming market data to all registered WebSocket subscribers. Maintains per-connection write buffers and handles fan-out to thousands of concurrent clients.

### 3. Consumer
Any application or service that subscribes to Lakshmi topics to receive market data. Consumers can connect via WebSocket (real-time streaming) or REST API (polling). Each consumer gets a dedicated RabbitMQ queue.

### 4. Correlation ID
A unique identifier (`correlation_id`) attached to every message and log entry that traces a request across multiple services (Ganesh -> Lakshmi -> Strategy Factory). Enables end-to-end request tracing in the ELK stack.

### 5. Dead Letter Queue (DLQ)
A RabbitMQ queue that receives messages that could not be delivered after all retry attempts. Messages in the DLQ include metadata about the failure (error type, timestamp, retry count). Monitored via `lakshmi_dead_letter_count`.

### 6. Depth Data
Market depth (order book) data showing bid/ask quantities at multiple price levels. Typically 5 levels deep; message size ~4 KB. Published at lower frequency (1/sec) than ticks to conserve bandwidth.

---

## E-H

### 7. Exchange (RabbitMQ)
A RabbitMQ routing entity that receives messages from publishers and routes them to bound queues based on routing keys. Lakshmi uses topic exchanges (`lakshmi_feed`) with wildcard routing patterns.

### 8. Fanout
A messaging pattern where a single message is delivered to all subscribers independently. Lakshmi uses RabbitMQ fanout exchanges bound to per-subscriber queues to implement pub/sub delivery.

### 9. Feed Server
The upstream component that ingests raw exchange data from lease lines (NSE/BSE) and normalises it into Lakshmi-compatible message formats (tick, OHLC, snapshot, depth). Typically Ganesh or Surya.

### 10. GC Pause
The duration for which the Node.js event loop is paused during Garbage Collection. High GC pauses (>50ms p99) introduce latency spikes. Monitored via `lakshmi_gc_pause_ms` and tuned via V8 flags.

### 11. Heartbeat
A periodic signal (every 1 second) sent by the Lakshmi Primary node to indicate it is alive and healthy. The Secondary monitors the heartbeat; 3 consecutive misses trigger automatic failover. Also refers to Narad health checks (10-second interval).

---

## I-L

### 12. JWT (JSON Web Token)
A compact, URL-safe token used for authentication and authorization. Lakshmi validates JWTs (RS256, 2048-bit keys) against Suraksha's JWKS endpoint. Contains claims: `sub`, `aud`, `exp`, `scope`. Tokens expire after 1 hour (API) or 24 hours (WebSocket).

### 13. Latency
The time elapsed from when a message is published to Lakshmi until it is acknowledged by a subscriber. Measured in milliseconds. Targets: p50 <2ms, p99 <5ms. End-to-end latency includes serialisation, MQ routing, and network delivery.

### 14. Lease Line
A dedicated, low-latency network connection from an exchange (NSE/BSE) colocation facility to the Algo-IQ data centre. Carries raw market data feeds (multicast UDP). Terminated at the Feed Server for ingestion into Lakshmi.

### 15. Liveness Probe
A health check endpoint (`/api/v1/health`) that returns the engine's alive/dead status. Used by container orchestrators (Kubernetes, Nomad) to determine if a restart is needed. Returns HTTP 200 when alive; non-200 triggers restart.

---

## M-P

### 16. MQ (Message Queue)
A messaging middleware that decouples publishers from subscribers. Lakshmi currently uses RabbitMQ (AMQP 0-9-1). Messages are published to exchanges, routed to queues, and consumed by subscribers. Provides durability, persistence, and delivery guarantees.

### 17. Narad
The Algo-IQ ecosystem service mesh and discovery layer. Lakshmi registers with Narad to announce its presence and enable dynamic routing. Narad handles health heartbeat aggregation, configuration synchronisation, and remote command delivery.

### 18. OHLC (Open-High-Low-Close)
A bar/aggregate data structure representing price movement over a time interval. Contains four price points: Open (first price), High (highest price), Low (lowest price), Close (last price). Lakshmi supports 1s, 5s, 15s, 1min, and 5min OHLC bars.

### 19. Parikshak
The automated quality gate and certification system in the Algo-IQ ecosystem. Every Lakshmi release must pass Parikshak certification (unit coverage, integration pass, load test, security scan) before deployment to production.

### 20. Prometheus
An open-source monitoring and alerting toolkit used by Lakshmi. Lakshmi exposes a `/metrics` endpoint in OpenMetrics format. Prometheus scrapes this endpoint and feeds time-series data to Grafana for visualisation and Alertmanager for alerting.

### 21. Publisher
Any application or service that sends data to Lakshmi for distribution to subscribers. Publishers authenticate via JWT or API key and publish to specific topics. Examples: Ganesh feed server, Surya backfill engine, manual test scripts.

### 22. Pub/Sub (Publish/Subscribe)
A messaging pattern where publishers send messages to topics (without knowing subscribers) and subscribers receive messages from topics (without knowing publishers). Decouples producers from consumers. Core architectural pattern of Lakshmi.

---

## Q-T

### 23. Queue Depth
The number of messages waiting in a RabbitMQ queue to be consumed. High queue depth indicates consumers cannot keep up with publishers. Monitored via `lakshmi_queue_depth`; alert threshold: >1000 messages.

### 24. RBAC (Role-Based Access Control)
An authorization model where permissions are assigned to roles, and roles are assigned to users/services. Lakshmi defines Admin, Publisher, Subscriber, Monitor, and Auditor roles. Policies are managed by Suraksha Policy Engine.

### 25. Readiness Probe
A health check endpoint (`/api/v1/health/ready`) that reports whether Lakshmi is ready to serve traffic. Returns HTTP 200 only when all dependencies (MQ, Redis, WebSocket server) are connected. Used to control load balancer traffic routing.

### 26. SSOT (Single Source of Truth)
A design principle ensuring that market data originates from exactly one authoritative source. Lakshmi is the SSOT for all market data in the Algo-IQ ecosystem. Downstream services consume from Lakshmi rather than connecting to exchanges directly.

### 27. Suraksha
The centralised security platform for the Algo-IQ ecosystem. Provides authentication (JWT issuance/validation), authorization (RBAC policy engine), certificate management (PKI), encryption key management (Key Vault), and threat detection (Sentinel).

### 28. Tick
The smallest unit of market data: a single trade or quote update from an exchange. Typical tick message size: 128 bytes. Contains: instrument token, last traded price, volume, timestamp. Lakshmi processes 350,000+ ticks per second.

### 29. Throughput
The rate at which Lakshmi processes messages, measured in messages per second (msg/s). Rated for 350,000 msg/s sustained throughput. Throughput is monitored via `lakshmi_publish_rate_per_sec` and `lakshmi_delivery_rate_per_sec`.

### 30. Topic
A named logical channel for market data. Each topic represents a market segment (e.g., `NFO_EQ` for NSE equity derivatives). Publishers send data to a topic; subscribers receive data from a topic. Topics have ACLs, rate limits, and message schemas.

---

## Quick Reference Table

| Term | Acronym | Category |
|---|---|---|
| API Key | — | Security |
| Broadcast Feeder | — | Component |
| Consumer | — | Architecture |
| Correlation ID | — | Observability |
| Dead Letter Queue | DLQ | Messaging |
| Depth Data | — | Data Format |
| Exchange (RabbitMQ) | — | Messaging |
| Fanout | — | Messaging Pattern |
| Feed Server | — | Architecture |
| GC Pause | — | Performance |
| Heartbeat | — | Availability |
| JWT | JSON Web Token | Security |
| Latency | — | Performance |
| Lease Line | — | Infrastructure |
| Liveness Probe | — | Availability |
| MQ | Message Queue | Messaging |
| Narad | — | Platform |
| OHLC | Open-High-Low-Close | Data Format |
| Parikshak | — | Platform |
| Prometheus | — | Observability |
| Publisher | — | Architecture |
| Pub/Sub | Publish/Subscribe | Messaging Pattern |
| Queue Depth | — | Messaging |
| RBAC | Role-Based Access Control | Security |
| Readiness Probe | — | Availability |
| SSOT | Single Source of Truth | Design Principle |
| Suraksha | — | Platform |
| Tick | — | Data Format |
| Throughput | — | Performance |
| Topic | — | Architecture |
