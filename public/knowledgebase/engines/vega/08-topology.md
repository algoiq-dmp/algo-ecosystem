# 08 — Ecosystem Topology

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Vega in the Algo-IQ Ecosystem

Vega sits at the **execution layer** of the Algo-IQ ecosystem, bridging strategy engines with external broker gateways. It depends on upstream engines for market data, symbol masters, and risk parameters, while serving as the sole conduit for order flow to exchange destinations.

---

## Upstream Dependencies

| Engine | Data Provided | Protocol | Criticality |
|---|---|---|---|
| **Lakshmi** | Real-time market data, LTP feed | RabbitMQ, WebSocket | HIGH — Price validation |
| **Ganesh** | Symbol master, instrument tokens, lot sizes | REST API | HIGH — Symbol resolution |
| **Parikshak** | Risk parameters, running P&L, margin utilization | Redis Pub/Sub, REST | CRITICAL — Kill switch |
| **Strategy Factory** | Trade signals, strategy configurations | REST, gRPC | CRITICAL — Order source |

## Downstream Consumers

| System | Data Received | Protocol | Purpose |
|---|---|---|---|
| **XTS Broker** | FIX order messages | FIX 4.4/TCP | Exchange routing |
| **Greeksoft Broker** | FIX/REST order messages | FIX 5.0/REST | Exchange routing |
| **Audit Store** | Immutable order events | TimescaleDB direct | Compliance |
| **Monitoring Stack** | Prometheus metrics | HTTP scrape | Observability |
| **Strategy Factory** | Order state notifications | MQ | Strategy updates |

---

## Network Topology

```
                    ┌─────────────────────────────┐
                    │      Algo-IQ Core VLAN       │
                    │  ┌────────┐  ┌────────────┐  │
                    │  │Lakshmi │  │Strategy Fac│  │
                    │  └───┬────┘  └─────┬──────┘  │
                    │      │              │         │
                    │  ┌───┴────┐  ┌─────┴──────┐  │
                    │  │Ganesh  │  │ Parikshak  │  │
                    │  └───┬────┘  └─────┬──────┘  │
                    └──────┼─────────────┼─────────┘
                           │             │
                    ┌──────┼─────────────┼─────────┐
                    │      ▼             ▼          │
                    │  ┌───────────────────────┐    │
                    │  │     VEGA ENGINE        │    │
                    │  │  (Execution VLAN)      │    │
                    │  └───────────┬───────────┘    │
                    └──────────────┼────────────────┘
                                   │
                    ┌──────────────┼────────────────┐
                    │     Broker Connectivity VLAN   │
                    │              │                 │
                    │  ┌───────────┴───────────┐    │
                    │  │   FIX Gateway Servers  │    │
                    │  └─────┬───────────┬─────┘    │
                    │        │           │           │
                    └────────┼───────────┼───────────┘
                             │           │
                    ┌────────▼───┐ ┌─────▼──────────┐
                    │ XTS Lease  │ │Greeksoft VPN   │
                    │ Line Router│ │Tunnel Endpoint │
                    └────────┬───┘ └─────┬──────────┘
                             │           │
                             ▼           ▼
                      [NSE/BSE Exchange]
```

---

## Service Discovery

| Component | Mechanism | Details |
|---|---|---|
| Vega API | Consul DNS | `vega-api.service.consul:3003` |
| RabbitMQ | Static cluster config | `mq[1-3].algoiq.internal:5672` |
| Redis | Sentinel discovery | `redis-sentinel.service.consul:26379` |
| PostgreSQL | HAProxy VIP | `pg-ro.algoiq.internal:5432` |
| FIX Endpoints | Static IP config | Broker-provided IPs |

---

## Data Center Distribution

### Primary DC (Mumbai)

| Service | Instances |
|---|---|
| TalkStrategy API | 4 |
| TalkStrategy App | 4 |
| Order Processor | 2 |
| XTS Adapter | 2 |
| Greeksoft Adapter | 1 |
| RabbitMQ | 3 (cluster) |
| Redis | 6 (3 master + 3 replica) |
| PostgreSQL | 3 (1 primary + 2 replica) |

### DR DC (Hyderabad)

| Service | Instances |
|---|---|
| TalkStrategy API | 2 (warm standby) |
| TalkStrategy App | 2 (warm standby) |
| Order Processor | 1 (warm standby) |
| PostgreSQL | 1 (async replica) |
| Redis | 3 (replica only, read-only) |

### Failover Strategy

| Scenario | Action | RTO |
|---|---|---|
| Single node failure | Auto-scaling group replaces | < 60 seconds |
| AZ failure | Traffic shifts to remaining nodes | < 5 seconds |
| Full DC failure (Mumbai) | Manual promotion of DR DC | < 5 minutes |
| Broker line failure | Auto-failover to alternate broker | < 2 seconds |

---

## Port Allocation

| Service | Port | Protocol |
|---|---|---|
| Vega REST API | 3003 | HTTPS (TLS 1.3) |
| Vega gRPC | 3004 | TLS |
| Metrics | 9090 | HTTP |
| FIX — XTS | 9200 | TCP/TLS |
| FIX — Greeksoft | 9201 | TCP/TLS |
| RabbitMQ | 5672 | AMQP |
| RabbitMQ Management | 15672 | HTTPS |
| Redis | 6379 | TCP |
| PostgreSQL | 5432 | TCP |
