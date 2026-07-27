# 04 â€” High-Level Architecture

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Architectural Overview

Narad follows a hub-and-spoke architecture with a centralized Control Plane and distributed Agents running on every managed server. The Control Plane aggregates all infrastructure data and exposes management APIs, while Agents execute local operations and report telemetry.

```
+------------------------------------------------------------------+
|                    NARAD CONTROL PLANE                            |
|                                                                   |
|  +-------------+  +-------------+  +-------------+  +----------+ |
|  | Service     |  | Health      |  | Config      |  | Deploy   | |
|  | Registry    |  | Monitor     |  | Manager     |  | Manager  | |
|  +-------------+  +-------------+  +-------------+  +----------+ |
|                                                                   |
|  +-------------+  +-------------+  +-------------+  +----------+ |
|  | Tunnel      |  | Log         |  | Remote      |  | Version  | |
|  | Manager     |  | Collector   |  | Command     |  | Manager  | |
|  +-------------+  +-------------+  +-------------+  +----------+ |
|                                                                   |
|  +-------------+  +-------------+  +-------------+               |
|  | Product     |  | Server      |  | Port        |               |
|  | Registry    |  | Registry    |  | Registry    |               |
|  +-------------+  +-------------+  +-------------+               |
|                                                                   |
|  [REST API :3003]  [gRPC :50051]  [WSS :3004]  [Prom :9091]     |
+---------------------------+--------------------------------------+
                            |
          +-----------------+-----------------+
          |                 |                 |
   +------v------+   +------v------+   +------v------+
   | NARAD AGENT |   | NARAD AGENT |   | NARAD AGENT |
   | Server A    |   | Server B    |   | Server N    |
   | (Lakshmi)   |   | (Ganesh)    |   | (Vega)      |
   +-------------+   +-------------+   +-------------+
```

## Tier Descriptions

### Control Plane

The Control Plane is the brain of Narad. It hosts all management services (registry, health, config, deploy, etc.) and exposes REST, gRPC, and WebSocket APIs. The Control Plane is deployed as a highly-available cluster across multiple availability zones.

### Narad Agent

The Agent is a lightweight daemon installed on every managed server. It:
- Reports server health metrics (CPU, memory, disk, network) every 10 seconds via gRPC.
- Executes remote commands received from the Control Plane.
- Manages local service health checks and reports status.
- Maintains SSH tunnels as directed by the Tunnel Manager.
- Ships application logs to the Control Plane via gRPC stream.

### Communication Protocols

| Channel | Protocol | Purpose |
|---|---|---|
| Agent -> Control Plane | gRPC (bidirectional stream) | Health telemetry, heartbeats, command results |
| Control Plane -> Agent | gRPC | Remote commands, config pushes, tunnel management |
| Clients -> Control Plane | REST API (HTTPS) | Service discovery, config queries, deployment triggers |
| Dashboard -> Control Plane | WebSocket (WSS) | Real-time health status updates |

## Design Decisions

| Decision | Rationale |
|---|---|
| gRPC for agent communication | Efficient binary protocol, bidirectional streaming, built-in health checking |
| Hub-and-spoke topology | Centralized management with distributed execution |
| Self-registration pattern | Services register themselves; no manual registry updates |
| PostgreSQL + Redis hybrid | PostgreSQL for durable state, Redis for real-time health cache |
| WebSocket for dashboard | Real-time infrastructure view without polling |
| Suraksha for all auth | Unified security model across ecosystem |
