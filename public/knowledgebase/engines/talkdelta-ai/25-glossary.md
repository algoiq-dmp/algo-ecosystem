# TalkDelta AI — Glossary

**Version:** 1.4.0 | **Owner:** AI/ML | **Last Updated:** 2026-07-25

## Terminology Reference

Key terms used throughout TalkDelta AI documentation and operations.

### A

**API Gateway:** The public-facing REST interface component (`talkdelta-ai-ml`) that handles authentication, rate limiting, and request routing.

**AMQP:** Advanced Message Queuing Protocol used by RabbitMQ for reliable message delivery between services.

**Audit Trail:** Immutable log of all operations recorded by Suraksha and Chitragupta for compliance and debugging.

### B

**Backpressure:** Flow control mechanism that prevents overwhelming downstream consumers by limiting data production rate.

**Blue-Green Deployment:** Zero-downtime deployment strategy where two identical environments (blue/active, green/standby) are maintained and traffic is switched.

**BOD (Beginning of Day):** Daily reference files distributed by Surya containing security master, contract details, and margin requirements.

### C

**Cache Hit Rate:** Percentage of data requests served from cache versus requiring database queries. Target: > 90%.

**Circuit Breaker:** Pattern that prevents cascading failures by stopping requests to a failing dependency after a threshold of errors.

**Connection Pool:** Pre-established database connections reused across requests to reduce connection overhead. Configured at 50-200 connections.

### D

**Dead Letter Queue (DLQ):** MQ queue holding messages that could not be processed after maximum retry attempts.

**Docker Compose:** Tool used for defining and running multi-container TalkDelta AI deployments with a single configuration file.

### E

**EOD (End of Day):** Daily end-of-day files from Surya containing settlement prices, closing data, and reconciliation reports.

**Exponential Backoff:** Retry strategy where wait time increases exponentially between attempts (1s, 2s, 4s, 8s...).

### G

**Ganesh:** Central OHLC data provider that serves as the single source of truth for all historical price data in the ecosystem.

**gRPC:** High-performance RPC framework used for internal inter-module communication within TalkDelta AI.

### H

**Health Check:** Endpoint (`/api/v1/health`) that returns service status. Used by Narad for heartbeat monitoring every 5 seconds.

**Hot Standby:** Backup instance running in parallel, ready to take over immediately on primary failure.

### J

**JWT (JSON Web Token):** Compact token format used by Suraksha for authentication. Contains user identity, roles, and expiry claims.

### L

**Lakshmi:** Central real-time data distribution platform providing live price feeds via WebSocket streaming.

**LRU Cache (Least Recently Used):** In-memory cache eviction strategy that removes least recently accessed items first.

### M

**MQ (Message Queue):** RabbitMQ instance providing pub/sub messaging infrastructure for inter-service communication.

**MTLS (Mutual TLS):** Two-way TLS authentication where both client and server present certificates validated by Suraksha CA.

### N

**Narad:** Connector hub providing service registry, health monitoring, deployment management, and configuration synchronization.

### P

**Parikshak:** Enterprise testing engine that validates all releases through unit, integration, performance, and security testing.

**P99 Latency:** 99th percentile response time — 99% of requests complete faster than this value. Target: < 500ms.

**Pub/Sub:** Publish-subscribe messaging pattern where publishers send messages to topics and subscribers receive messages of interest.

### R

**RBAC (Role-Based Access Control):** Authorization model where permissions are assigned to roles (admin, operator, analyst, strategy, viewer).

**RPO (Recovery Point Objective):** Maximum acceptable data loss measured in time. Target: < 1 minute.

**RTO (Recovery Time Objective):** Maximum acceptable time to restore service. Target: < 15 minutes.

### S

**Suraksha:** Security layer providing authentication, authorization, encryption, secrets management, and audit logging.

**Surya:** Exchange file acquisition and distribution platform — single source of truth for BOD/EOD reference files.

### T

**TLS 1.3:** Latest Transport Layer Security protocol used for encrypting all external communications with AES-256-GCM.

### V

**Vega:** Order execution engine handling the complete order lifecycle from API request to exchange execution.

### W

**Webhook:** HTTP callback mechanism where TalkDelta AI sends POST requests to registered subscriber URLs on data change events.

**WAL (Write-Ahead Log):** Database logging mechanism that records changes before they are applied, enabling point-in-time recovery.
