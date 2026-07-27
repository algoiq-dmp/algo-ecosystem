# 02 — Business Requirements

## Business Goals

| ID | Goal | KPI |
|---|---|---|
| BR-01 | Centralize real-time market data distribution | Single integration point for all consumers |
| BR-02 | Achieve sub-5ms end-to-end distribution latency | 95th percentile latency < 5ms |
| BR-03 | Support 500,000 peak messages/second | Sustained throughput without message loss |
| BR-04 | Ensure 99.95% system availability | Uptime SLA measured monthly |
| BR-05 | Reduce duplicate exchange connections | From N connections to 1 per exchange |
| BR-06 | Enable real-time analytics and monitoring | Live dashboard with < 1s refresh |

## Functional Requirements

### Real-Time Price Distribution

- FR-01: Ingest market ticks from upstream providers (Ganesh, Surya) and direct exchange feeds.
- FR-02: Normalize all incoming data into a standard JSON message envelope.
- FR-03: Route messages to subscribers within 2ms of internal processing.

### Topic-Based Publish/Subscribe

- FR-04: Support hierarchical topic patterns with wildcard matching (e.g., `market.NSE.FUT.*`).
- FR-05: Allow dynamic subscriber registration and deregistration at runtime.
- FR-06: Support durable subscriptions that survive consumer restarts.

### WebSocket Streaming

- FR-07: Expose a WebSocket endpoint on port 3001 for browser-based clients.
- FR-08: Support per-connection topic filtering to minimize bandwidth.
- FR-09: Provide heartbeat/ping frames every 15 seconds to detect stale connections.

### Monitoring & Administration

- FR-10: Expose REST endpoints for listing active topics and subscribers.
- FR-11: Publish system metrics (throughput, latency, error rate) to Prometheus.
- FR-12: Log all publish and delivery events to an audit trail.

## Non-Functional Requirements

| Category | Requirement | Target |
|---|---|---|
| **Performance** | Internal routing latency | < 2ms (p99) |
| **Performance** | Message throughput | 350,000 msg/s sustained |
| **Availability** | System uptime | 99.95% (monthly) |
| **Reliability** | Message durability | At-least-once delivery guarantee |
| **Scalability** | Horizontal scaling | Support 3-node RabbitMQ cluster |
| **Security** | Transport encryption | TLS 1.3 for all external endpoints |
| **Security** | Authentication | API key validation via Suraksha |
| **Observability** | Monitoring | All metrics exported to Prometheus |
| **Observability** | Audit trail | 30-day retention in PostgreSQL |

## Stakeholders

| Role | Stakeholder | Interest |
|---|---|---|
| Product Owner | Head of Trading Platform | Business KPIs and feature roadmap |
| Engineering Lead | Data Engineering Manager | Architecture and technical quality |
| DevOps | SRE Team | Deployment, monitoring, incident response |
| Consumers | Strategy Engine Teams | Data accuracy, latency, availability |
| Security | InfoSec Team | Compliance, encryption, access audit |

## Success Criteria

1. **Latency:** 99th percentile internal routing latency < 2ms under 350K msg/s load.
2. **Throughput:** Sustained 350,000 messages/second with zero dropped messages.
3. **Uptime:** Measured 99.95% availability over a rolling 30-day window.
4. **Adoption:** All 8 downstream engines migrated from direct connections within Q1.
5. **Monitoring:** Real-time Grafana dashboard showing live throughput and latency.
6. **Incident Response:** Mean time to detect (MTTD) < 30 seconds; mean time to resolve (MTTR) < 15 minutes.
