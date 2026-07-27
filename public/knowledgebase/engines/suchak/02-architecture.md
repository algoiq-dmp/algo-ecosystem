# 02 — Architecture

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## System Architecture

Suchak follows a **microkernel + plugin** architecture. The core engine manages the event loop, data ingestion, and dispatch, while individual indicators are implemented as isolated plugins loaded at runtime.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   SUCHAK ENGINE                       │
│                                                       │
│  ┌──────────┐   ┌────────────┐   ┌───────────────┐  │
│  │  Ingress │──>│  Pipeline  │──>│  Egress       │  │
│  │  Layer   │   │  Manager   │   │  Layer        │  │
│  └──────────┘   └────────────┘   └───────────────┘  │
│       │              │                   │            │
│       v              v                   v            │
│  ┌──────────┐   ┌────────────┐   ┌───────────────┐  │
│  │ Ganesh   │   │ Indicator  │   │ DXCC Bus      │  │
│  │ Adapter  │   │ Plugins    │   │ Kuber Queue   │  │
│  └──────────┘   │ (15+)      │   │ Delta XI WS   │  │
│                 └────────────┘   │ TalkDelta RPC │  │
│                                  └───────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Core Components

### 1. Ingress Layer
- **Ganesh Adapter** — Connects to Ganesh OHLC data service; fetches historical bars and subscribes to real-time candle updates.
- **Lakshmi Adapter** — Streams tick-level price data from Lakshmi live feed.
- **Data Normalizer** — Transforms all inbound data into a unified `Tick` struct.

### 2. Pipeline Manager
- **Scheduler** — Manages per-symbol, per-timeframe computation schedules.
- **Indicator Registry** — Maintains the list of active indicator plugins.
- **Compute Engine** — Dispatches computations in parallel where independent.
- **Window Manager** — Maintains rolling lookback windows per indicator configuration.

### 3. Indicator Plugins
Each indicator implements the `Indicator` trait:

```rust
pub trait Indicator {
    fn name(&self) -> &str;
    fn version(&self) -> &str;
    fn required_bars(&self) -> usize;
    fn compute(&self, bars: &[OHLCBar]) -> IndicatorResult;
    fn timeframe_supported(&self, tf: &Timeframe) -> bool;
}
```

### 4. Egress Layer
- **DXCC Bus** — Pushes signals to the option chain engine via message bus.
- **KuberAlpha Queue** — Enqueues indicator data for strategy execution.
- **Delta XI WebSocket** — Streams live indicator values to ML models.
- **TalkDelta RPC** — gRPC endpoint for the conversational AI layer.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Runtime | Rust (tokio async runtime) |
| IPC | ZeroMQ / Protocol Buffers |
| Caching | Redis (indicator snapshots) |
| Config | YAML-based hot-reload |
| Monitoring | Prometheus + Grafana |
| Logging | ELK Stack (Elasticsearch, Logstash, Kibana) |
| Deployment | Kubernetes (3-replica deployment) |

## Concurrency Model

Suchak uses the **tokio async runtime** with a work-stealing scheduler:

- **Per-symbol actor** — One lightweight task per active trading symbol.
- **Parallel indicator compute** — Within each symbol's tick, independent indicators run on the tokio thread pool.
- **Backpressure** — Bounded channels prevent memory exhaustion under load spikes.

## Fault Tolerance

| Failure Mode | Strategy |
|--------------|----------|
| Data source disconnect | Exponential backoff reconnect; stale data flag |
| Indicator panic | Catch per-plugin; isolate failure |
| Memory pressure | Shed oldest timeframe windows first |
| Redis unavailable | Fallback to in-memory only; warn |

## Deployment Topology

```
Kubernetes Namespace: algo-iq-prod
├── suchak-deployment (3 replicas)
│   ├── suchak-0  (primary)
│   ├── suchak-1  (secondary)
│   └── suchak-2  (secondary)
├── suchak-redis (statefulset, 3 nodes)
└── suchak-config (configmap)
```

## Scaling

Horizontal scaling is symbol-partitioned. A hash ring distributes symbols across replicas. New replicas rebalance the ring without downtime.
