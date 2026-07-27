# 01 — Overview

## What is Lakshmi?

Lakshmi is the enterprise real-time data distribution platform that acts as the central nervous system of the Algo-IQ ecosystem. It ingests market data from all upstream sources, normalizes it into a unified message format, and distributes it to every downstream consumer—strategy engines, analytics dashboards, trading terminals, and external web projects—over a high-performance publish/subscribe fabric.

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

## Target Users

| User Type | Interaction |
|---|---|
| **AI/ML Engines** (Vega, Brahma, etc.) | Subscribe to MQ topics for real-time ticks |
| **Web Applications** (Algo-IQ Dashboard) | Connect via WebSocket for streaming data |
| **Strategy Builder** | Receive live prices during strategy construction |
| **Trading Terminals** | Consume directed broadcast feeds |
| **DevOps/SRE** | Monitor health, latency, and throughput via dashboard |

## Benefits

- **Single integration point** for all market data consumers.
- **Guaranteed delivery** with RabbitMQ persistence and dead-letter queues.
- **Sub-millisecond routing** via in-memory topic trie.
- **Real-time monitoring** with Prometheus + Grafana dashboards.
- **Horizontally scalable** to support growing tick volumes.

## Inputs

| Source | Description | Protocol | Avg Throughput |
|---|---|---|---|
| **Exchange** (NSE, BSE) | Raw market ticks via lease line | TCP / Proprietary | 250K msg/s |
| **Ganesh** | Pre-processed normalized ticks | AMQP (RabbitMQ) | 200K msg/s |
| **Surya** | Market snapshots and depth data | AMQP (RabbitMQ) | 100K msg/s |

## Outputs

| Consumer | Delivery Method | Topic Pattern |
|---|---|---|
| All AI Engines (Vega, Brahma, Garuda) | RabbitMQ | `market.live.*` |
| Algo-IQ Dashboard | WebSocket (ws://) | `stream.*` |
| Strategy Builder | WebSocket | `market.ohlc.*` |
| Broker Connectivity (Narad) | RabbitMQ | `trade.confirm.*` |
| Web Projects | WebSocket + REST | `market.*` |
