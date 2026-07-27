# Lakshmi Engine — Enterprise Real-Time Data Distribution Platform

**Version:** 2.1.0  
**Owner:** Data Engineering  
**Last Updated:** 2026-07-24

---

## Overview

Lakshmi is the central real-time data distribution engine within the Algo-IQ ecosystem. It ingests high-frequency market data from upstream providers (Ganesh, Surya) and exchange feeds, then routes it to all downstream subscribers—strategy engines, analytics platforms, trading terminals, and web projects—via a high-performance publish/subscribe architecture built on RabbitMQ and WebSockets.

Lakshmi is designed to handle **350,000 messages per second** with sub-**2ms internal latency**, ensuring that every consuming application receives market data with minimal delay. The engine supports topic-based routing, persistent caching via Redis, and a comprehensive monitoring stack powered by Prometheus and InfluxDB.

---

## Quick Links

| Document | Title |
|---|---|
| [01-overview](01-overview.md) | Introduction & Business Objectives |
| [02-business-requirements](02-business-requirements.md) | Business Requirements |
| [03-system-requirements](03-system-requirements.md) | System Requirements |
| [04-high-level-architecture](04-high-level-architecture.md) | High-Level Architecture |
| [05-low-level-design](05-low-level-design.md) | Low-Level Design |
| [06-components](06-components.md) | Component Descriptions |
| [07-data-flow](07-data-flow.md) | Data Flow |
| [08-topology](08-topology.md) | Ecosystem Topology |
| [09-api-reference](09-api-reference.md) | API Reference |
| [10-database](10-database.md) | Database Schema & Storage |
| [11-configuration](11-configuration.md) | Configuration Guide |
| [12-installation](12-installation.md) | Installation Guide |
| [13-deployment](13-deployment.md) | Deployment Guide |

---

## Architecture Summary

```
[Exchange Lease Line] → [Feed Server] → [RabbitMQ Cluster] → [Local WebSocket Server] → [Broadcast Feeder] → [Subscribers]
```

Lakshmi follows a four-component pipeline: the **Feed Server** ingests raw exchange data, **RabbitMQ** provides durable pub/sub messaging, the **Local WebSocket Server** streams live data to browser clients, and the **Broadcast Feeder** directs traffic to specific downstream engines.

---

## Key Components

| Component | Role |
|---|---|
| **Publisher** | Accepts incoming messages and publishes to MQ topics |
| **Consumer** | Subscribes to topics and delivers messages to downstream handlers |
| **Topic Manager** | Manages topic creation, partitioning, and access control |
| **Queue Manager** | Handles RabbitMQ exchange/queue binding and dead-letter queues |
| **Message Router** | Routes messages based on topic patterns and subscriber rules |
| **Cache** | Redis-backed caching layer for hot data and deduplication |
| **Monitoring** | Prometheus metrics, InfluxDB time-series, and health probes |
| **Analytics** | Aggregates throughput, latency, and error-rate statistics |
| **Retry Engine** | Retries failed deliveries with exponential backoff |
| **Security** | TLS termination, API key validation, and access control |

---

## Installation Quick Start

```powershell
# Prerequisites
choco install nodejs-lts rabbitmq redis

# Clone and install
git clone https://github.com/algo-iq/lakshmi.git
cd lakshmi
npm install --production

# Configure
cp config.example.json config.json
# Edit config.json with your environment settings

# Initialize database
node scripts/init-db.js

# Start
npm start
```

Verify at `http://localhost:3001/api/v1/health`.

---

## Documentation Index

1. [01-overview](01-overview.md)
2. [02-business-requirements](02-business-requirements.md)
3. [03-system-requirements](03-system-requirements.md)
4. [04-high-level-architecture](04-high-level-architecture.md)
5. [05-low-level-design](05-low-level-design.md)
6. [06-components](06-components.md)
7. [07-data-flow](07-data-flow.md)
8. [08-topology](08-topology.md)
9. [09-api-reference](09-api-reference.md)
10. [10-database](10-database.md)
11. [11-configuration](11-configuration.md)
12. [12-installation](12-installation.md)
13. [13-deployment](13-deployment.md)
