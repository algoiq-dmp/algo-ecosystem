# 01 — Architecture

> **Version:** 2.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## High-Level Architecture

Parikshak is built on a distributed, pluggable test-execution architecture that can scale horizontally to handle thousands of concurrent test suites.

```
┌─────────────────────────────────────────────────────────────┐
│                    TEST ORCHESTRATOR                         │
│  ┌───────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Scheduler │  │ Dispatcher│  │ Result   │  │ Report    │  │
│  │           │  │          │  │ Collector │  │ Generator │  │
│  └─────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘  │
└────────┼─────────────┼────────────┼───────────────┼────────┘
         │             │            │               │
    ┌────▼────┐   ┌────▼────┐  ┌────▼────┐     ┌────▼────┐
    │  TEST   │   │  TEST   │  │  TEST   │     │  TEST   │
    │ WORKER  │   │ WORKER  │  │ WORKER  │     │ WORKER  │
    │   1     │   │   2     │  │   3     │ ... │   N     │
    └────┬────┘   └────┬────┘  └────┬────┘     └────┬────┘
         │             │            │               │
         └─────────────┴────────────┴───────────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
        ┌──────────┐ ┌────────┐ ┌──────────┐
        │ MongoDB  │ │ Redis  │ │    MQ    │
        │ (Results)│ │(Cache) │ │ (Events) │
        └──────────┘ └────────┘ └──────────┘
```

## Core Components

### Test Orchestrator
The brain of Parikshak. Manages the entire testing lifecycle:
- **Scheduler** — Queues and prioritizes test requests.
- **Dispatcher** — Assigns test suites to available workers.
- **Result Collector** — Aggregates results from all workers.
- **Report Generator** — Produces all 6 report types.

### Test Workers
Stateless, horizontally-scalable workers that execute test suites:
- Each worker runs in an isolated container.
- Workers pull test definitions from MongoDB.
- Results are streamed back to the Collector via MQ.
- Auto-scaling based on queue depth (Kubernetes HPA).

### Test Suite Registry
A catalog of all available test suites:
- **Strategy Tests**: Logic validation, risk compliance, boundary tests.
- **Engine Tests**: Functional, integration, performance, security.
- **API Tests**: Contract validation, load testing, auth testing.
- **Product Tests**: End-to-end workflow validation.

### Report Engine
Generates standardized reports from collected test results:
- Parses raw results into structured formats.
- Computes pass/fail ratios, trends, and regressions.
- Produces PDF, JSON, and dashboard-ready outputs.

## Test Execution Flow

```
Incoming Test Request
        │
        ▼
  Schema Validation ──▶ Fail? → Reject immediately
        │
        ▼
  Queue by Priority
        │
        ▼
  Assign to Worker Pool
        │
        ▼
  Execute Test Suite
  ├── Unit Tests
  ├── Integration Tests
  ├── Performance Tests
  └── Security Tests
        │
        ▼
  Collect & Aggregate Results
        │
        ▼
  Generate Reports
        │
        ▼
  Publish Results to MQ
```

## Technology Stack

| Layer | Technology |
|---|---|
| Orchestrator | Node.js 20, TypeScript |
| Workers | Node.js 20, Docker |
| Database | MongoDB 7.0 |
| Cache | Redis 7.2 |
| Messaging | RabbitMQ 3.12 |
| Test Framework | Jest, Mocha, custom harness |
| Container | Docker, Kubernetes |
| Monitoring | Prometheus, Grafana |
