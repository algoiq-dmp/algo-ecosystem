# 08 — Topology

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Deployment Topology

```
                         ┌─────────────────────────┐
                         │     HAProxy Layer 7      │
                         │   (WebSocket-aware LB)   │
                         │   10.100.100.10:443      │
                         └──────────┬──────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
          ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
          │ ws01-mum    │ │ ws02-mum    │ │ ws03-mum    │
          │ Node.js 22  │ │ Node.js 22  │ │ Node.js 22  │
          │ 4 vCPU/8GB  │ │ 4 vCPU/8GB  │ │ 4 vCPU/8GB  │
          │ Port 8080   │ │ Port 8080   │ │ Port 8080   │
          └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
                 │               │               │
                 └───────────────┼───────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
          ┌──────────────┐          ┌──────────────┐
          │ MQ Cluster   │          │ Suraksha IAM │
          │ mq0{1..3}-mum│          │ (JWT verify) │
          └──────────────┘          └──────────────┘
```

## Server Inventory

| Hostname | DC | vCPUs | RAM | Role |
|----------|-----|-------|-----|------|
| ws01-mum | Mumbai | 4 | 8 GB | WebSocket server |
| ws02-mum | Mumbai | 4 | 8 GB | WebSocket server |
| ws03-mum | Mumbai | 4 | 8 GB | WebSocket server |
| ws01-nm | Navi Mumbai | 4 | 8 GB | WebSocket server (DR) |
| ws02-nm | Navi Mumbai | 4 | 8 GB | WebSocket server (DR) |

## Load Balancer Configuration

HAProxy is configured with sticky sessions based on client IP to ensure a WebSocket connection stays on the same backend:

```
frontend wss_frontend
    bind 10.100.100.10:443 ssl crt /etc/ssl/lakshmi.pem
    mode http
    option forwardfor
    timeout client 1h
    default_backend ws_backend

backend ws_backend
    mode http
    balance leastconn
    stick-table type ip size 200k expire 1h
    stick on src
    timeout server 1h
    timeout tunnel 1h
    server ws01 ws01-mum:8080 check inter 5s
    server ws02 ws02-mum:8080 check inter 5s
    server ws03 ws03-mum:8080 check inter 5s
```

## Client Connection Flow

```
1. Client resolves wss://ws.lakshmi.internal → HAProxy VIP (10.100.100.10)
2. HAProxy terminates TLS (or passes through if using TCP mode)
3. HAProxy forwards WebSocket upgrade to least-loaded backend
4. Backend processes upgrade, authenticates JWT
5. WebSocket connection established
6. All subsequent frames go directly through HAProxy to same backend (stick-table)
```

## Cross-DC Topology

In Navi Mumbai DC (disaster recovery), a separate set of WebSocket servers connects to the Navi Mumbai MQ cluster. Clients are directed to the appropriate DC based on DNS (active/standby):

```
wss.ws.lakshmi.internal → HAProxy VIP (Mumbai)   [primary]
wss.dr.ws.lakshmi.internal → HAProxy VIP (Navi Mumbai) [DR, manual failover]
```

## Scaling Strategy

| Load Indicator | Scaling Action |
|----------------|----------------|
| Connections > 8000 per instance | Add new WebSocket instance |
| CPU > 70% sustained | Add new instance; redistribute connections |
| Message throughput > 400K msgs/sec per instance | Add instance; consider per-topic sharding |
| Memory > 80% | Investigate memory leak; add RAM or instance |
