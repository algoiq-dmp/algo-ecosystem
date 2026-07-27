# DXCC — Ecosystem Topology

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## DXCC Position in the Ecosystem

DXCC sits at Layer 5 (Governance & Operations) of the 5-layer architecture. It is the topmost control plane, consuming data from all lower layers and providing the unified operational interface.

```
                          +======================+
                          |   DXCC (Layer 5)     |
                          |  Command Center      |
                          +==========+===========+
                                     ^
                                     | WebSocket + REST
                                     |
  +-------+  +-------+  +-------+  +---+----+  +-------+  +-------+
  | L4    |  | L4    |  | L4    |  | L4     |  | L4    |  | L5    |
  | Risk  |  |Exec   |  |Circuit|  |Portfolio|  |Alert  |  |Audit  |
  | Center|  |Monitor|  |Breaker|  |Command |  |Manager|  |Center |
  +-------+  +-------+  +-------+  +--------+  +-------+  +-------+
       ^          ^          ^           ^           ^          ^
       |          |          |           |           |          |
  +-------+  +-------+  +-------+  +--------+  +-------+  +-------+
  | L3    |  | L3    |  | L3    |  | L3     |  | L2    |  | L2    |
  |Strat  |  |Analyt |  |AI Ops |  |Intel   |  |Engine |  |Market |
  |Command|  |Center |  |Center |  |Center  |  |Reg    |  |Ops    |
  +-------+  +-------+  +-------+  +--------+  +-------+  +-------+
       ^          ^          ^           ^           ^          ^
       |          |          |           |           |          |
  +-------+  +-------+  +-------+  +--------+  +-------+  +-------+
  | L1    |  | L1    |  | L1    |  | L1     |  | L2    |  | L2    |
  |Infra  |  |Notif  |  |Time   |  |Exec    |  |Narad  |  |API GW |
  |Monitor|  |Center |  |line   |  |Dash    |  |Monitor|  |Monitor|
  +-------+  +-------+  +-------+  +--------+  +-------+  +-------+
       ^          ^          ^           ^           ^          ^
       |          |          |           |           |          |
       +----------+----------+-----------+-----------+----------+
                                    |
                          +=========+=========+
                          |  NARAD EVENT BUS  |
                          |  (Rust · Tokio)   |
                          |  100K msg/sec     |
                          +===+====+====+=====+
                              |    |    |
         +--------------------+    |    +-------------------+
         |                         |                        |
    +----v----+              +-----v-----+           +-----v-----+
    | Market  |              |  Delta XI  |           | Execution |
    | Data    |              | Analytical |           | & Risk    |
    | Domain  |              |  Domain    |           | Domain    |
    +---------+              +-----------+           +-----------+
         |                         |                        |
    +----v----+    +----v----+ +--v--+ +--v--+    +---v--+ +--v--+
    | Feed    |    | Kohli   | |Rohit| |Bumrah|   |Kuber  | |Kavach|
    | Engine  |    | (18)    | |(45) | |(93)  |   |Alpha  | |      |
    +---------+    +---------+ +-----+ +------+   +-------+ +------+
    | Ganesh  |    | Jadeja  | |Dhoni| |Sachin|   | Vega  | |Rakshak|
    |         |    | (8)     | |(7)  | |(10)  |   |       | |       |
    +---------+    +---------+ +-----+ +------+   +-------+ +-------+
    | Surya   |    |Manthan  |                    |Chitragupta|
    |         |    |         |                    |           |
    +---------+    +---------+                    +-----------+
    | Suchak  |                                   |TalkOffice|
    |         |                                   |           |
    +---------+                                   +-----------+
                                                   | Narad  |
                                                   | Engine |
                                                   +--------+
```

---

## All 18 Engines Connecting via Narad to DXCC

| # | Engine | Domain | Connects to DXCC via |
|---|--------|--------|---------------------|
| 1 | Feed Engine | Market Data | Narad topic: `market.ticks` |
| 2 | Ganesh | Market Data | Narad topic: `market.ohlc`, `engine.health.ganesh` |
| 3 | Surya | Market Data | Narad topic: `contract.master`, REST API |
| 4 | Suchak | Market Data | Narad topic: `engine.indicators`, `engine.health.suchak` |
| 5 | Kohli (18) | Delta XI | Narad topic: `delta-xi.probability`, `engine.health.kohli` |
| 6 | Rohit (45) | Delta XI | Narad topic: `delta-xi.expiry`, `engine.health.rohit` |
| 7 | Bumrah (93) | Delta XI | Narad topic: `delta-xi.surface`, `engine.health.bumrah` |
| 8 | Jadeja (8) | Delta XI | Narad topic: `delta-xi.volatility`, `engine.health.jadeja` |
| 9 | Dhoni (7) | Delta XI | Narad topic: `delta-xi.alpha`, `engine.health.dhoni` |
| 10 | Sachin (10) | Delta XI | Narad topic: `delta-xi.insight`, `engine.health.sachin` |
| 11 | Manthan | Execution | Narad topic: `execution.churn`, REST API |
| 12 | Kuber Alpha | Execution | Narad topic: `strategy.*`, `engine.health.kuber` |
| 13 | Kavach | Execution | Narad topic: `risk.*`, `engine.health.kavach` |
| 14 | Vega | Execution | Narad topic: `order.*`, `engine.health.vega` |
| 15 | Rakshak | Risk | Narad topic: `risk.hedge`, `engine.health.rakshak` |
| 16 | Chitragupta | Platform | Narad topic: `audit.*`, REST API for search |
| 17 | Narad | Platform | Narad topic: `narad.metrics`, `engine.health.narad` |
| 18 | TalkOffice | Platform | Narad topic: `voice.*`, REST API |

---

## Inter-Layer Communication Rules

1. **No direct database access between engines.** All inter-engine communication flows exclusively via Narad events.
2. **Layers communicate downward via command channels** and **upward via event topics**.
3. **DXCC subscribes to all layers equally.** It does not have privileged database access to any engine.
4. **REST API is used for CRUD and historical queries only.** Real-time data is Narad-only.
5. **WebSocket connection is persistent.** It carries all real-time subscriptions with per-message authentication.

---

## Network Topology (Logical)

```
                          [Internet / Corporate Network]
                                    |
                          +---------+---------+
                          |   Nginx Reverse    |
                          |   Proxy (TLS)      |
                          +----+---------+----+
                               |         |
                    +----------+         +----------+
                    |                               |
           +--------v-------+              +--------v-------+
           | DXCC Frontend  |              | DXCC API       |
           | (Static SPA)   |              | Server (Go)    |
           | Port 443       |              | Port 8080      |
           +--------+-------+              +--------+-------+
                    |                               |
                    | WSS:443             +---------+---------+
                    |                    |                   |
           +--------v-------+   +--------v-------+  +--------v-------+
           | Narad WS       |   | PostgreSQL     |  | Redis          |
           | Gateway        |   | :5432          |  | :6379          |
           | (Internal)     |   | (Users/Prefs)  |  | (Cache/Session)|
           +--------+-------+   +----------------+  +----------------+
                    |
                    | NATS Protocol
                    |
           +--------v-------+
           | Narad Cluster   |
           | (Rust · Tokio)  |
           | 3-node HA       |
           +-----------------+
```

---

> **Next:** See [09-api-reference.md](09-api-reference.md) for the Plugin SDK and REST API documentation.
