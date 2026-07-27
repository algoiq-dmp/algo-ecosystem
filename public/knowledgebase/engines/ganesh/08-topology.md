# 08 â€” Ecosystem Topology

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Ganesh in the Ecosystem

Ganesh occupies a foundational position in the Algo-IQ ecosystem as the central OHLC data provider. It sits downstream of data ingestion (Lakshmi) and upstream of all compute engines and consumer applications.

```
                        +-----------+
                        |  Exchange  |
                        +-----+-----+
                              |
                    +---------v---------+
                    |    Feed Server    |
                    +---------+---------+
                              |
                    +---------v---------+
                    |     Lakshmi       |
                    |   (Data Dist.)    |
                    +----+--------+----+
                         |        |
              +----------v-+    +-v----------+
              |   Surya    |    |  GANESH    | <--- This Engine
              | (Corp Act) |    |  (OHLC)    |
              +----------+-+    +-+----+---+-+
                         |        |    |   |
                         |  +-----+    |   +--------+
                         |  |   +------+            |
                         v  v   v                   v
              +----------+--+---+---+----------+----+-----+
              |              Consumers                   |
              |  Vega   Brahma  Garuda  Simulator       |
              |  TalkOptions  TalkDelta  Suchak         |
              +----------+---+---+----------+----+------+
                         |   |   |          |    |
                         v   v   v          v    v
              +----------+---+---+----------+----+------+
              |              Narad (Monitoring)          |
              +------------------------------------------+
              |           Suraksha (Security)            |
              +------------------------------------------+
```

## Upstream Dependencies

| Service | Relationship | Protocol |
|---|---|---|
| **Feed Server** | Ultimate data source (via Lakshmi) | TCP / AMQP |
| **Lakshmi** | Tick delivery broker | AMQP (RabbitMQ) |
| **Surya** | Corporate action data source | AMQP (RabbitMQ) |

## Downstream Consumers

| Consumer | Data Consumed | Query Pattern |
|---|---|---|
| **Vega** | Multi-TF OHLC | Real-time + historical range queries |
| **Brahma** | 1m, 5m OHLC | Streaming bars for strategy execution |
| **Garuda** | 1H, 1D OHLC | Daily bars for position sizing |
| **Simulator** | All TFs, full history | Bulk batch queries for backtests |
| **TalkOptions** | Options-specific OHLC | Symbol + expiry queries |
| **TalkDelta** | Delta-adjusted OHLC | Real-time streaming |
| **Suchak** | All TFs | Event-driven queries for alerts |

## Infrastructure Dependencies

| Component | Role |
|---|---|
| **Narad** | Service registry, health monitoring, log collection, restart management |
| **Suraksha** | API authentication (JWT), secret management (Vault), TLS certificates |
| **Redis Cluster** | Hot cache for recent OHLC bars |
| **PostgreSQL** | Durable storage for all historical bars |
| **RabbitMQ Cluster** | Message broker for tick ingestion |

## Deployment Topology

```
                    [Load Balancer]
                           |
          +----------------+----------------+
          |                |                |
   [Ganesh API-1]   [Ganesh API-2]   [Ganesh API-N]
          |                |                |
          +----------------+----------------+
                           |
          +----------------+----------------+
          |                                 |
   [Redis Sentinel]              [PostgreSQL Primary]
   [Redis Primary]               [PostgreSQL Replica]
   [Redis Replica]

   [Ganesh Bar Aggregator-1] [Ganesh Bar Aggregator-2]
          |                           |
          +-------------+-------------+
                        |
                  [RabbitMQ Cluster]
```

## Network Segmentation

| Zone | Services | Access Control |
|---|---|---|
| **Public** | REST API (port 3002) | Suraksha JWT required |
| **Internal** | Redis, PostgreSQL, RabbitMQ | Firewall-restricted, TLS |
| **Management** | Prometheus metrics, health probes | VPN only |

## Failover Strategy

- **API Servers**: Active-active behind load balancer. No single point of failure.
- **Redis**: Sentinel-managed with automatic failover to replica.
- **PostgreSQL**: Streaming replication with manual or automated promotion.
- **Bar Aggregator**: Active-standby. Standby takes over via Narad restart command.
