# TalkOptions Platform — Internal Components

**Version:** 4.7.2 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## Component Architecture

TalkOptions Platform is composed of the following internal modules, each with a distinct responsibility within the Layer 1 - Core Data ecosystem.

## Core Modules

| Module | Role | Responsibility |
|--------|------|---------------|
| `talkoptions-core` | Primary engine | Core business logic and computation pipeline |
| `talkoptions-api` | API gateway | REST endpoint exposure, rate limiting, request validation |
| `talkoptions-analytics` | Analytics/Processing | Data processing, transformation, and enrichment |

## Module Lifecycle

### 1. Core Engine
- Initializes configuration from Narad registry at startup (port 3100)
- Subscribes to MQ topics for real-time market data ingestion
- Manages internal state machine (INIT → READY → PROCESSING → ERROR → RECOVERY)
- Coordinates inter-module communication via internal message bus

### 2. API Gateway
- Exposes REST endpoints on ports `8081, 8444`
- Implements rate limiting (1000 req/min per client by default)
- Handles JWT authentication via Suraksha security layer
- Provides Swagger/OpenAPI 3.0 documentation at `/docs`

### 3. Analytics/Processing Module
- Processes incoming data streams in configurable batch sizes (default 1000 records)
- Maintains in-memory LRU cache with Redis backing for hot data
- Publishes computed results to MQ for downstream consumers: Delta XI, VYUH, SpreadWatch, TalkDelta, AALAP Calls, Simulator, TalkDelta AI

## Inter-Module Communication
- Internal modules communicate via gRPC on localhost (port range 50051-50055)
- Shared configuration sourced from Narad config store with 30s TTL cache
- Health checks exposed on `/health` endpoint returning JSON status

## Deployment Units
- Each module deploys as an independent Docker container
- Orchestrated via Narad deployment manager with rolling update support
- Horizontal scaling supported for API and Analytics modules (up to 8 replicas)
- Resource limits: 2 CPU cores, 4 GB RAM per container default
