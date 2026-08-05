# 01 — Overview

## What is Lakshmi?

Lakshmi is the **Single Source of Truth (SSOT) Broadcast Distribution Platform** for the entire Algo IQ Ecosystem. Every market data packet entering the ecosystem passes through Lakshmi before reaching any engine. No engine directly connects to NSE/BSE/MCX.

Lakshmi is the central nervous system — the market data distribution layer that ensures every engine receives synchronized, validated, and resilient real-time market data while remaining insulated from changes in exchange connectivity or feed providers.

## Why Lakshmi Was Developed

Before Lakshmi, each downstream application independently connected to market data sources, leading to:

- **Duplicated connections** to exchange feeds, exceeding broker connection limits.
- **Inconsistent data** across applications due to varied ingestion paths.
- **Higher latency** from multiple serialization/deserialization hops.
- **No centralized monitoring** of data quality, throughput, or gaps.

Lakshmi solves these by serving as the **single source of truth** for real-time market data.

## Business Objective

Provide reliable, low-latency, unified market data distribution to all Algo-IQ applications and external clients, enabling consistent trading decisions across the entire platform.

## Technical Objective

- Ingest market data at up to 350,000 messages/second.
- Deliver to subscribers within 2ms of internal processing overhead.
- Maintain 99.95% uptime (less than 4.38 hours of downtime per year).
- Support horizontal scaling via RabbitMQ clustering and Redis Sentinel.

## Scope

| In Scope | Out of Scope |
|---|---|
| Real-time price/tick distribution | Historical data storage beyond 1 year |
| Topic-based pub/sub routing | Order execution logic |
| WebSocket streaming to clients | Strategy computation |
| Centralized monitoring & alerting | User authentication (delegated to Suraksha) |
| Integration with Ganesh, Surya, Narad | Market data generation or cleansing |
| Feed validation, normalization, symbol mapping | Exchange protocol implementation |
| Automatic failover between primary/alternate sources | Broker API integration |
| Replay and recovery of missing packets | Backtesting logic |

## Target Users

| User Type | Interaction |
|---|---|
| **Vega Engine** | Subscribe to MQ for real-time ticks for order execution |
| **Suchak Engine** | Receive market data for indicator computation |
| **Ganesh Engine** | Consume OHLC data for candle generation |
| **Delta XI** | Subscribe for exchange integration data |
| **VYUH Engine** | Receive market data for analytics |
| **SpreadWatch** | Consume spread and arbitrage data |
| **Manthan Engine** | Receive market data for processing |
| **Trinetra Engine** | Subscribe for monitoring data |
| **Strategy Factory** | Receive live prices during strategy construction |
| **Parikshak** | Consume data for strategy validation |
| **Kuber Alpha** | Receive data for strategy management |
| **TalkDelta** | Consume market data for analytics |
| **TalkOptions** | Receive options data for analysis |
| **TalkOffice** | Subscribe for trading terminal data |
| **DXCC** | Consume data for operations dashboard |
| **Chitragupta** | Receive data for audit trail |
| **Web Applications** | Connect via WebSocket for streaming data |
| **Mobile Apps** | Connect via REST for snapshot data |
| **AI Agents** | Subscribe to MQ for real-time ticks |

## Benefits

- **Single integration point** for all market data consumers.
- **Guaranteed delivery** with RabbitMQ persistence and dead-letter queues.
- **Sub-millisecond routing** via in-memory topic trie.
- **Real-time monitoring** with Prometheus + Grafana dashboards.
- **Horizontally scalable** to support growing tick volumes.
- **Protocol abstraction** — downstream engines independent of exchange packet formats.
- **Automatic failover** between primary and alternate data sources.

## Inputs

| Source | Description | Protocol | Avg Throughput |
|---|---|---|---|
| **Exchange** (NSE, BSE, MCX) | Raw market ticks via lease line | TCP / Proprietary | 250K msg/s |
| **Feed Server** | Exchange lease line ingestion (sub-component) | MQ | 250K msg/s |
| **Ganesh** | Pre-processed normalized ticks | AMQP (RabbitMQ) | 200K msg/s |
| **Surya** | BOD initialization, expiry calendar, symbol master, token mapping | REST | 100K msg/s |

## Outputs

| Consumer | Delivery Method | Topic Pattern |
|---|---|---|
| Vega Engine | RabbitMQ | `market.live.*` |
| Suchak Engine | RabbitMQ | `market.live.*` |
| Ganesh Engine | RabbitMQ | `market.live.*` |
| Delta XI | RabbitMQ | `market.live.*` |
| VYUH Engine | RabbitMQ | `market.live.*` |
| SpreadWatch | RabbitMQ | `market.live.*` |
| Manthan Engine | RabbitMQ | `market.live.*` |
| Trinetra Engine | RabbitMQ | `market.live.*` |
| Strategy Factory | RabbitMQ | `market.live.*` |
| Parikshak | RabbitMQ | `market.live.*` |
| Kuber Alpha | RabbitMQ | `market.live.*` |
| TalkDelta | RabbitMQ | `market.live.*` |
| TalkOptions | RabbitMQ | `market.live.*` |
| TalkOffice | RabbitMQ | `market.live.*` |
| DXCC | RabbitMQ | `market.live.*` |
| Chitragupta | RabbitMQ | `market.live.*` |
| Web Projects | WebSocket | `stream.*` |
| Mobile Apps | REST | `market/snapshot` |
| AI Agents | RabbitMQ | `market.live.*` |

## Design Principles

1. **Single Source of Truth (SSOT)** for all market broadcasts.
2. **No engine connects directly to the exchange** except through the approved feed layer.
3. **Protocol abstraction**, so downstream engines are independent of exchange packet formats.
4. **Automatic failover** between primary and alternate data sources without impacting subscribers.
5. **Scalable publish/subscribe architecture** supporting MQ, WebSocket, REST, and future Kafka/gRPC integrations.
6. **Observability-first**, with health monitoring, latency metrics, packet validation, replay, and audit logging.
