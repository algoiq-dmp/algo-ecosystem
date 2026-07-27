# DXCC — High-Level Architecture

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## 5-Layer Internal Architecture

DXCC mirrors the platform's 5-layer architecture, organizing 20 modules into logical tiers. Each layer consumes data from the layer below and exposes capabilities to the layer above through the Narad Event Bus.

```
+===================================================================+
|                 LAYER 5: GOVERNANCE & OPERATIONS                   |
|  +-------------+  +-------------+  +----------+  +-------------+  |
|  | Audit       |  | Incident    |  | Admin    |  | Knowledge   |  |
|  | Center      |  | Management  |  | Panel    |  | Center      |  |
|  +-------------+  +-------------+  +----------+  +-------------+  |
+===================================================================+
|                 LAYER 4: RISK & EXECUTION                          |
|  +-------------+  +-------------+  +----------+  +-------------+  |
|  | Risk        |  | Execution   |  | Circuit  |  | Portfolio   |  |
|  | Center      |  | Monitor     |  | Breakers |  | Command     |  |
|  +-------------+  +-------------+  +----------+  +-------------+  |
+===================================================================+
|                 LAYER 3: STRATEGY & ANALYSIS                       |
|  +-------------+  +-------------+  +----------+  +-------------+  |
|  | Strategy    |  | Analytics   |  | AI Ops   |  | Intelligence|  |
|  | Command     |  | Center      |  | Center   |  | Center      |  |
|  +-------------+  +-------------+  +----------+  +-------------+  |
+===================================================================+
|                 LAYER 2: PLATFORM SERVICES & INTELLIGENCE          |
|  +-------------+  +-------------+  +----------+  +-------------+  |
|  | Engine      |  | Market      |  | Narad    |  | API Gateway |  |
|  | Registry    |  | Operations  |  | Monitor  |  | Monitor     |  |
|  +-------------+  +-------------+  +----------+  +-------------+  |
+===================================================================+
|                 LAYER 1: DATA & CONNECTIVITY                       |
|  +-------------+  +-------------+  +----------+  +-------------+  |
|  | Infra       |  | Notification|  | Timeline |  | Executive   |  |
|  | Monitor     |  | Center      |  | View     |  | Dashboard   |  |
|  +-------------+  +-------------+  +----------+  +-------------+  |
+===================================================================+
                              |
                    +---------+---------+
                    |  NARAD EVENT BUS  |
                    | (Real-Time Data)  |
                    +-------------------+
```

### Layer 1: Data & Connectivity

The foundation layer. Collects raw metrics and status from all layers, all engines, and all infrastructure. Provides the Executive Dashboard as the primary landing view. Modules: Infrastructure Monitor, Notification Center, Ecosystem Timeline, Executive Dashboard.

**Data Sources:** Prometheus metrics, K8s events, database health checks, Narad engine heartbeats, AlertManager firing alerts, all Narad events streamed via timeline.

### Layer 2: Platform Services & Intelligence

The engine awareness layer. Discovers engines through the plugin framework, monitors their health, provides market data visualization, and monitors the Narad Event Bus itself. Modules: Engine Registry & Health, Market Operations, Narad Monitor, API Gateway Monitor.

**Data Sources:** Engine manifest YAML files, Prometheus engine metrics, Narad topic throughput and consumer lag, Kraken API Gateway traffic analytics.

### Layer 3: Strategy & Analysis

The intelligence layer. Manages the complete strategy lifecycle from deployment to live trading. Provides AI-powered insights through the Intelligence Center and monitors AI Coach operations. Modules: Strategy Command, Analytics Center, AI Operations, Intelligence Center, Strategy Builder Integration.

**Data Sources:** Strategy signals from Vikray, P&L from Rakshak and Vega, AI Coach inference metrics from Ollama, RAG knowledge base from ChromaDB.

### Layer 4: Risk & Execution

The safety layer. Monitors risk in real-time, tracks order execution from signal to fill, manages circuit breakers, and provides portfolio-level position and P&L visibility. Modules: Risk Center, Execution Monitor, Circuit Breakers, Portfolio Command.

**Data Sources:** Risk violations from Kavach and Rakshak, order flow from Vega, Suraksha risk scores, Durga circuit breaker states.

### Layer 5: Governance & Operations

The control layer. Provides comprehensive audit trail viewing, incident management workflow, user and system administration, and the auto-generated knowledge base. Modules: Audit Center, Incident Management, Administration, Knowledge Center.

**Data Sources:** Chitragupta audit events, incident records, user and role data from PostgreSQL, manifest-generated documentation.

---

## Narad Event Bus Architecture

Narad sits below all 5 layers as the fundamental communication backbone. Every inter-engine message, every metric update, every audit event flows through Narad.

```
[Engine 1] --> [Narad Topic: engine.metrics] --> [DXCC Subscriber]
[Engine 2] --> [Narad Topic: strategy.signals] --> [DXCC Subscriber]
[Kavach]   --> [Narad Topic: risk.violations] --> [DXCC Subscriber]
[Chitragupta] --> [Narad Topic: audit.events] --> [DXCC Subscriber]
```

**Key Properties:**
- Pub/Sub architecture with topic-based routing
- Schema Registry for event type validation (Avro/Protobuf)
- Exactly-once delivery semantics
- Dead Letter Queue (DLQ) for failed message handling
- Event replay capability for debugging and audit

---

## Plugin Framework Architecture

```
                    +-------------------------+
                    |    Plugin Registry      |
                    |  (manifest.yaml scan)   |
                    +-----------+-------------+
                                |
          +---------------------+---------------------+
          |                     |                     |
  +-------v------+    +--------v------+    +--------v------+
  | Health Card  |    | Config Form   |    | Docs Page     |
  | Auto-Gen     |    | Auto-Gen      |    | Auto-Gen      |
  +--------------+    +---------------+    +---------------+
          |                     |                     |
  +-------v------+    +--------v------+    +--------v------+
  | Prometheus   |    | PostgreSQL    |    | Markdown      |
  | Alert Rules  |    | Config Store  |    | Renderer      |
  +--------------+    +---------------+    +---------------+
```

### Manifest-Driven Auto-Generation

From a single `manifest.yaml`, DXCC automatically:

1. Creates the engine's health monitoring card with live CPU/Memory/Latency metrics
2. Populates the engine detail page with Narad topic subscriptions and publications
3. Generates configuration forms with type validation and default values
4. Renders auto-generated documentation from README and code comments
5. Registers Prometheus alert rules based on `health_checks` thresholds
6. Indexes documentation for RAG-based AI Coach knowledge queries

---

## Deployment Architecture

```
                    [Nginx Reverse Proxy]
                      /              \
                     /                \
            [DXCC Frontend]     [DXCC API Server]
            (Static Assets)     (Go Binary)
                     \                /
                      \              /
                    [Redis]    [PostgreSQL]
                         \        /
                     [Narad WS Gateway]
```

- Frontend served as static files via Nginx
- Backend compiled as single Go binary
- Redis for session state and widget cache
- PostgreSQL for user data, preferences, and configuration
- Narad WebSocket Gateway for real-time data

---

> **Next:** See [05-low-level-design.md](05-low-level-design.md) for component architecture and data flow details.
