# TalkStrategy App - Topology

**Version:** 2.5.0 | **Owner:** Frontend | **Last Updated:** 2026-07-25


## Deployment Topology

The engine runs on a dedicated Linux server as a group of PM2-managed processes. All components are co-located on a single logical host to minimize inter-component latency.

## Network Layout

`
                    +---------------------------+
                    |     ALGO IQ Server        |
                    |                           |
  External APIs ----+--+ Engine Processes       |
  (Surya, Ganesh)   |  | (PM2-managed)         |
                    |  |                        |
  Internal MQ ------+--+ MQ Consumer Threads    +-----> Kuber Alpha (MQ)
                    |  |                        |
  TalkOptions ------+--+ REST Clients           +-----> Narad (WebSocket)
                    |  |                        |
                    |  +--+ PostgreSQL/TimescaleDB
                    |                           |
                    +---------------------------+
`

## Process Map

The engine may deploy as multiple process instances for horizontal scaling where applicable. Each instance is stateless and shares state via the database layer.

| Instance | Port Range | Scaling | Purpose |
|----------|-----------|---------|---------|
| Core Engine | 3000-3099 | Vertical | Main business logic |
| API Gateway | 4000-4010 | Horizontal (N) | External REST endpoints |
| Worker Threads | N/A | Horizontal | Background task processing |

## High Availability

- **Process Level:** PM2 auto-restarts crashed processes with 5-second cooldown.
- **Database Level:** Streaming replication to standby PostgreSQL instance.
- **MQ Level:** RabbitMQ mirrored queues across cluster nodes.
- **Node Level:** Active-passive failover via Keepalived VIP (planned v3.2).

## Inter-Component Communication

| From | To | Protocol | Encryption |
|------|----|----------|------------|
| Engine | Kuber Alpha | AMQP (RabbitMQ) | TLS 1.2 |
| Engine | Database | TCP (pg) | TLS 1.2 |
| Engine | Narad | WebSocket WSS | TLS 1.2 |
| Suraksha | Engine | gRPC | mTLS |

