# 04 — High-Level Architecture

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Architecture Overview

Vega employs a **layered, event-driven architecture** that separates concerns between signal ingestion, order processing, broker routing, and risk management. Each layer communicates via well-defined interfaces (REST, gRPC, MQ), enabling independent scaling and development.

---

## System Context Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Lakshmi    │     │   Strategy   │     │  Parikshak   │
│ (Market Data)│     │   Factory    │     │(Risk Engine) │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                     │
       ▼                    ▼                     ▼
┌──────────────────────────────────────────────────────────┐
│                       VEGA ENGINE                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │TalkStrat │  │TalkStrat │  │  Order   │  │  Broker  │ │
│  │  API     │─▶│  App     │─▶│Processor │─▶│Integration│ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│       │              │              │              │       │
│  ┌────┴────┐   ┌────┴────┐   ┌────┴────┐   ┌────┴────┐  │
│  │   MQ    │   │  Redis  │   │  Kill   │   │  Audit  │  │
│  │ Bridge  │   │  Cache  │   │ Switch  │   │  Logger │  │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘  │
└──────────────────────────────────────────────────────────┘
       │                    │
       ▼                    ▼
┌──────────┐        ┌──────────┐
│   XTS    │        │Greeksoft │
│  Broker  │        │  Broker  │
└──────────┘        └──────────┘
```

---

## Four-Component Architecture

### Layer 1: TalkStrategy API

- Entry point for all external order requests
- REST API (JSON) + gRPC endpoints
- HMAC signature validation on every request
- Schema validation against order JSON schema
- Immediate acknowledgment (202 Accepted) with correlation ID
- Rate limiting per API key
- Publishes validated signals to internal MQ topic `vega.orders.incoming`

### Layer 2: TalkStrategy App

- Business logic container — stateless, horizontally scalable
- Consumes from `vega.orders.incoming`
- Enriches order with account mapping (user → broker account)
- Applies strategy-level parameters (max position size, allowed symbols)
- Resolves instrument details from Ganesh symbol master cache
- Publishes enriched order to `vega.orders.validated`

### Layer 3: Order Processor

- Core order state machine — stateful processing per order
- Pre-trade validation: price bands, quantity limits, margin check
- Generates unique order ID with embedded routing information
- Manages order lifecycle from NEW through terminal states (FILLED, REJECTED, CANCELLED)
- Idempotency check via signal ID deduplication in Redis
- Publishes processed order to `vega.orders.routed`

### Layer 4: Broker Integration

- Protocol adapter layer for broker-specific communication
- XTS Adapter: FIX 4.4 engine managing session logon, heartbeats, sequence numbers
- Greeksoft Adapter: FIX 5.0 SP2 + REST fallback
- Credential Manager injects session credentials at connect time
- Handles FIX message serialization/deserialization
- Publishes broker responses to `vega.orders.responses`

---

## Cross-Cutting Concerns

| Concern | Implementation |
|---|---|
| **Kill Switch** | Subscribes to running P&L from Redis; independent process that cuts MQ flow |
| **Audit Logging** | Interceptor on Order Processor; writes to append-only TimescaleDB table |
| **Monitoring** | Prometheus metrics exposed on `:9090/metrics`; Grafana dashboards |
| **Tracing** | OpenTelemetry distributed tracing with Jaeger backend |
| **Configuration** | Centralized config via Consul KV or local `config.json` |

---

## Communication Patterns

| Path | Protocol | Pattern |
|---|---|---|
| Strategy → Vega | HTTP REST / gRPC | Synchronous request-response |
| Vega internal (API→App→Processor) | RabbitMQ (AMQP) | Asynchronous pub/sub |
| Vega → Broker (XTS) | FIX 4.4 over TCP | Persistent session |
| Vega → Broker (Greeksoft) | FIX 5.0 SP2 / REST | Persistent session / request-response |
| Kill Switch → Order Processor | Redis Pub/Sub | Event-driven |

---

## Deployment Topology

```
[Load Balancer (HAProxy)]
        │
   ┌────┴────┬────────────┐
   ▼         ▼            ▼
[TS-API-1] [TS-API-2]  [TS-API-N]   ← Stateless (auto-scale)
   │         │            │
   └────┬────┴─────┬──────┘
        ▼          ▼
   [RabbitMQ Cluster (3 nodes)]
        │
   ┌────┴────────────┐
   ▼                 ▼
[TS-App-1..N]   [Processor-1..2]   ← Stateful (partitioned by user)
   │                 │
   └────┬─────┬──────┘
        ▼     ▼
   [Broker-Adapter-1..N]            ← One per broker session
```
