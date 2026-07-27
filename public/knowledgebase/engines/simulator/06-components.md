# Simulator - Components

**Version:** 3.0.0 | **Owner:** QA | **Last Updated:** 2026-07-25


## Core Components

### Primary Engine
The core runtime process that manages the lifecycle of all sub-components. Handles startup sequencing, dependency resolution, and graceful shutdown. Runs as a PM2-managed daemon on the designated server.

### Message Queue Consumer
Subscribes to internal MQ (RabbitMQ) topics for real-time market data broadcasts. Implements connection pooling with automatic reconnection and dead-letter handling for malformed messages.

### REST API Layer
Exposes management endpoints over HTTP for health checks, configuration updates, metrics retrieval, and operational commands. Built with Express.js and protected by Suraksha authentication.

### Database Interface
Abstracts PostgreSQL/TimescaleDB operations through a repository pattern. Handles connection pooling, query timeouts, and migration management via Knex.js or Sequelize ORM.

## Supporting Components

| Component | Responsibility | Dependency |
|-----------|---------------|------------|
| Config Manager | Hot-reloads settings from TOML/YAML files | Suraksha (encrypted configs) |
| Logger | Structured JSON logging to files and stdout | Winston/Pino |
| Metrics Exporter | Prometheus-compatible metrics endpoint | Prometheus client |
| Health Checker | Liveness/readiness probes for orchestration | N/A |
| Cache Layer | In-memory LRU cache for frequently accessed data | Redis (optional fallback) |

## Component Diagram

`
[API Layer] <--> [Engine Core] <--> [MQ Consumer]
                    |
               [DB Interface]
                    |
               [Config Manager]
`

