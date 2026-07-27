# 02 — Architecture

> **Version:** 2.0.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

## System Architecture

Manthan follows a **pipeline-streaming architecture** where each analysis module is an independent stage in a directed acyclic graph (DAG) of computations.

## Architecture Diagram

```
┌────────────────────────────────────────────────────────┐
│                    MANTHAN ENGINE                       │
│                                                         │
│  ┌──────────────┐    ┌──────────────────────────────┐  │
│  │ Data Ingest   │───>│ Analysis Pipeline (DAG)      │  │
│  │ - Ganesh      │    │                              │  │
│  │ - Suchak      │    │  Stage 1: Regime Classifier  │  │
│  │ - Lakshmi     │    │     │                        │  │
│  └──────────────┘    │     v                        │  │
│                       │  Stage 2: Trend Detector     │  │
│                       │     │                        │  │
│                       │     ├──────────────┐         │  │
│                       │     v              v         │  │
│                       │  Stage 3:      Stage 4:     │  │
│                       │  Breakout      Volatility   │  │
│                       │  Scorer        Classifier   │  │
│                       │     │              │         │  │
│                       │     └──────┬───────┘         │  │
│                       │            v                 │  │
│                       │  Stage 5: Volume + OI       │  │
│                       │     │                        │  │
│                       │     v                        │  │
│                       │  Stage 6: Liquidity          │  │
│                       │     │                        │  │
│                       │     v                        │  │
│                       │  Stage 7: Confidence         │  │
│                       └──────────────┬───────────────┘  │
│                                      v                  │
│  ┌──────────────┐    ┌──────────────────────────────┐  │
│  │ Egress Layer │<───│ Intelligence Output            │  │
│  └──────────────┘    └──────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Data Ingest Layer
- **Ganesh Connector** — Fetches OHLC bars; subscribes to real-time updates
- **Suchak Connector** — Subscribes to indicator streams via Redis Pub/Sub
- **Lakshmi Connector** — Kafka consumer for tick-level data

### 2. Analysis Pipeline

Each stage is a **stateful actor** maintaining its own rolling analysis window:

| Stage | Window Size | Update Freq |
|-------|------------|-------------|
| Regime | 100 bars | Every bar |
| Trend | 50 bars | Every bar |
| Breakout | 20 bars | Every bar |
| Volatility | 30 bars | Every bar |
| Volume | 50 bars | Every bar |
| OI | 20 bars | Every bar |
| Liquidity | Real-time | Every tick |
| Confidence | All stages | Every bar |

### 3. Confidence Aggregator

The final stage weighs and combines all analysis outputs:

```rust
pub struct ConfidenceScore {
    pub overall: f64,          // 0-100
    pub regime_confidence: f64,
    pub trend_confidence: f64,
    pub breakout_confidence: f64,
    pub dimension_alignment: f64,  // How many dimensions agree
}
```

### 4. Egress Layer

- **DXCC gRPC** — Streaming intelligence feed
- **KuberAlpha Kafka** — Batched analysis updates
- **Kavach WebSocket** — Real-time regime changes
- **Delta XI Redis** — Feature store integration

## Technology Stack

| Layer | Technology |
|-------|------------|
| Runtime | Go (goroutines for parallelism) |
| Pipeline Orchestration | Temporal.io |
| State Store | Redis + PostgreSQL |
| ML Models | ONNX Runtime (lightweight inference) |
| Messaging | Kafka + gRPC |
| Monitoring | Prometheus + Grafana |
| Deployment | Kubernetes (2-replica deployment) |

## Concurrency Model

Manthan uses **Go goroutines** with fan-out/fan-in patterns:

- **Per-symbol goroutine** — One goroutine per active symbol
- **Pipeline stages** — Each stage runs as its own goroutine within the per-symbol pipeline
- **Backpressure** — Buffered channels between stages; slow consumers propagate backpressure upstream

## Fault Tolerance

| Failure Mode | Strategy |
|--------------|----------|
| Pipeline stage crash | Isolate; continue with default values; alert |
| Data source drop | Exponential backoff; use cached last-known values |
| State corruption | Rolling snapshot restore from Redis |
| ML model failure | Fallback to rule-based heuristics |
