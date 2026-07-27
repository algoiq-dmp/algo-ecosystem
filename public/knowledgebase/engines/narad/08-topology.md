# 08 â€” Ecosystem Topology

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Narad in the Ecosystem

Narad is the connective tissue that binds the entire Algo-IQ ecosystem together. It is the **only component connected to ALL servers, engines, products, and APIs** â€” making it the backbone of infrastructure operations.

```
                                +---------------------------+
                                |       NARAD               |
                                |   (Infrastructure Mgmt)   |
                                +---------+---+---+---------+
                                          |   |   |
            +-----------------------------+   |   +-----------------------------+
            |                +----------------+----------------+                |
            |                |                |                |                |
    +-------v-------+ +-----v------+ +------v------+ +------v------+ +------v-------+
    |    Lakshmi    | |   Ganesh   | |    Vega     | |   Brahma    | |   Garuda     |
    |  (Data Dist)  | |   (OHLC)   | | (AI Engine) | | (AI Engine) | | (AI Engine)  |
    +-------+-------+ +-----+------+ +------+------+ +------+------+ +------+-------+
            |               |               |               |               |
            +---------+-----+----+----+-----+----+----+-----+----+----------+
                      |          |          |         |          |
              +-------v---+ +---v----+ +---v---+ +---v---+ +---v-----------+
              | Simulator | |TalkOpt | |TalkDel| |Suchak | |  Web Projects |
              +-----------+ +--------+ +-------+ +-------+ +---------------+
```

## Narad's Connections

| Connected To | Relationship |
|---|---|
| **All Engines** (Lakshmi, Ganesh, Vega, Brahma, Garuda, etc.) | Health monitoring, config management, service registry, log collection |
| **All Servers** | Agent telemetry, remote commands, tunnel management |
| **All Products** (Simulator, TalkOptions, TalkDelta, Suchak) | Product registry, health, configs |
| **All APIs** | Service discovery, endpoint registry |
| **Suraksha** | Authentication, RBAC, certificate management |
| **ELK Stack** | Log aggregation destination |
| **Prometheus** | Metrics storage |

## Deployment Topology

```
                    [Load Balancer]
                           |
          +----------------+----------------+
          |                |                |
   [Narad CP-1]     [Narad CP-2]     [Narad CP-3]
   (us-east-1a)     (us-east-1b)     (us-east-1c)
          |                |                |
          +----------------+----------------+
                           |
          +----------------+----------------+
          |                                 |
   [Redis Sentinel]              [PostgreSQL Primary]
   [Redis Primary]               [PostgreSQL Replica]
   [Redis Replica]

   NARAD AGENTS (one per managed server):
   +--------------------------------------------------+
   | Agent-srv-1 | Agent-srv-2 | ... | Agent-srv-N   |
   | (Lakshmi)   | (Ganesh)    |     | (Web Servers)  |
   +--------------------------------------------------+
```

## Network Segmentation

| Zone | Services | Access Control |
|---|---|---|
| **Public** | REST API (3003), Dashboard, WebSocket (3004) | Suraksha JWT |
| **Agent Network** | gRPC (50051) | mTLS, Suraksha certificates |
| **Internal** | PostgreSQL, Redis | Firewall-restricted, TLS |
| **Management** | Prometheus metrics (9091), SSH | VPN only |

## Failover Strategy

- **Control Plane**: Active-active across 3 AZs. No single point of failure.
- **Redis**: Sentinel-managed with auto-failover.
- **PostgreSQL**: Streaming replication with automated or manual promotion.
- **Agents**: Auto-reconnect to any Control Plane node on failure.
- **Narad self-monitoring**: Each Control Plane node monitors the others; if one fails, the remaining nodes take over its agent connections.

## Scalability

| Component | Scaling Strategy |
|---|---|
| Control Plane | Horizontal (active-active behind LB) |
| Redis | Vertical or cluster mode |
| PostgreSQL | Vertical + read replicas |
| Agents | One per server (horizontal by nature) |
| Dashboard | CDN + horizontal (stateless) |
