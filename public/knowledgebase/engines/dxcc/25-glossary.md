# DXCC — Glossary

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## A

**AG Grid**
High-performance JavaScript data grid used for all tables in DXCC. Supports virtual scrolling for datasets exceeding 100,000 rows without performance degradation. Licensed under AG Grid Enterprise for DXCC.

**AI Coach**
Domain-specific AI assistant bound to a Delta XI analytical engine. Each of the 6 analytical engines (Kohli, Rohit, Bumrah, Jadeja, Dhoni, Sachin) has a dedicated coach (Kapil83, Gavaskar83, Amarnath83, Binny83, Srikkanth83, Tendulkar83) running Q4_K_M Mistral-7B with 4096 token context.

**AlertManager**
Prometheus AlertManager integration that manages alert routing, silencing, inhibition, and notification delivery to Slack, PagerDuty, and email.

**ArgoCD**
GitOps continuous delivery tool for Kubernetes. DXCC integrates with ArgoCD to display application sync status, drift detection, and enable manual sync from the DevOps module.

**Audit Trail**
Immutable, append-only log of every system event and user action, recorded by Chitragupta. Uses Merkle tree hashing for integrity verification and is retained for a minimum of 10 years.

---

## C

**Chi Router**
Lightweight, idiomatic HTTP router for Go used by the DXCC API backend. Provides middleware chaining, route grouping, and standard `net/http` compatibility.

**Chitragupta**
The audit trail engine (Go). Records all Narad events in an immutable append-only ledger backed by Elasticsearch. Provides full-text audit search, Merkle tree integrity verification, and signed PDF export.

**Circuit Breaker (Durga)**
Market protection mechanism that halts trading at market-wide, segment-wide, or symbol levels when risk thresholds are breached. Triggered by Suraksha scores exceeding 95.

**Command Channel**
Narad feature allowing bi-directional request-response communication between engines. Used for configuration changes, restart commands, and other imperative operations.

---

## D

**Dead Letter Queue (DLQ)**
Narad feature that captures messages that fail to be processed after maximum retry attempts. DLQ depth is a key health indicator monitored in the Narad Monitor.

**Delta Neutralization**
Rakshak's automated hedging strategy that maintains portfolio delta near zero by executing offsetting trades. Monitored in the Risk Center.

**Delta XI**
The collective name for the 6-engine AI analytical cascade: Kohli (Probability), Rohit (YAMA Expiry), Bumrah (DPSE Surface), Jadeja (Volatility), Dhoni (Alpha Generation), Sachin (Insight Master).

**DORA Metrics**
DevOps Research and Assessment metrics: Deployment Frequency, Lead Time for Changes, Mean Time to Recovery (MTTR), Change Failure Rate. Tracked in the DevOps module.

**Drill-Down**
DXCC UX pattern where every widget, metric, chart point, and alert is clickable to navigate to deeper detail. Example: clicking P&L navigates to Portfolio Command with relevant filters applied.

---

## E

**Ecosystem Timeline**
Unified chronological view of all Narad events, API calls, and user actions. Supports filtering, correlation grouping, time-window replay, and segment export.

**Engine Manifest**
YAML file (`manifest.yaml`) that defines an engine's identity, UI configuration, health checks, configuration parameters, Narad topic subscriptions/publications, and documentation sources. Follows the `dxcc.io/v1` API schema.

**Executive Dashboard**
The landing page of DXCC. Displays system health summary, P&L, active strategies, order flow, top movers, risk overview, Narad health, recent alerts, market status, and AI Coach snapshot.

---

## G

**gRPC**
High-performance RPC framework used for internal service-to-service communication (e.g., Kuber Alpha to Talkoffice RMS). DXCC itself does not use gRPC directly but monitors gRPC health metrics.

---

## J

**JWT (JSON Web Token)**
RS256-signed token used for authentication and authorization. Contains user identity, role, permissions, and expiry. Validated on every REST API call and WebSocket message.

---

## K

**Kavach**
Risk approval engine that validates every order before execution. Checks position limits, margin requirements, circuit breaker status, and Suraksha scores. Rejects orders that fail validation.

**Kraken API Gateway**
The central API gateway for the Delta XI ecosystem. DXCC uses Kraken for REST API routing, rate limiting, WAF protection, and API key management.

**Kubernetes (K8s)**
Container orchestration platform. DXCC deploys as Kubernetes pods and monitors K8s cluster health in the Infrastructure Monitor.

---

## L

**Lightweight Charts**
TradingView's open-source charting library used for OHLC candlestick charts, line charts, and histogram displays. Chosen over D3 for its smaller bundle size and trading-specific features.

---

## M

**Manifest YAML**
See [Engine Manifest](#e).

**Merkle Tree**
Cryptographic data structure used by Chitragupta for audit trail integrity. Each audit record hashes into a leaf node; parent nodes hash their children. The root hash is published periodically. Any tampering breaks the hash chain.

**MFA (Multi-Factor Authentication)**
Secondary authentication factor required for Admin, Trader, and Quant roles. Enforced at the SSO provider level via TOTP authenticator apps.

**MTTR (Mean Time to Recovery)**
Average time to resolve an incident from detection to closure. Tracked in Incident Analytics as a key operational metric.

---

## N

**Narad Event Bus**
The central event-driven communication backbone for the entire Delta XI ecosystem. Built in Rust with the Tokio async runtime. Handles 100K messages per second with <5ms P99 routing latency. All inter-engine communication flows exclusively via Narad.

**Narad Monitor**
DXCC module that displays Narad health metrics: messages per second, DLQ depth, consumer lag, topic throughput, and overall event bus health.

**Narad WS Gateway**
WebSocket gateway that bridges Narad's internal NATS protocol to external WebSocket connections. DXCC connects to this gateway for real-time data.

**Notification Center**
Centralized DXCC module for alert management, including inbox, rule management, silence scheduling, escalation policies, and notification channel configuration.

---

## O

**OAuth2**
Authorization framework used for SSO integration. DXCC acts as an OAuth2 client to identity providers (Keycloak, Azure AD, Okta).

**OPA (Open Policy Agent)**
Policy engine used for fine-grained authorization decisions. DXCC queries OPA with user context, action, and resource; OPA evaluates Rego policies to return allow/deny.

---

## P

**Parikshak**
DXCC's testing certification program. All releases must pass Parikshak gates: unit test coverage (80%+), critical E2E paths passing, accessibility score (90+), performance budget, and security scan with no critical findings.

**Plugin Framework**
DXCC's engine auto-discovery system. Reads `manifest.yaml` files and automatically generates UI components (health cards, config forms, docs pages). The Plugin SDK provides hooks for custom module development.

**Plugin SDK**
Set of React hooks and components for building custom DXCC modules. Includes `useNaradSubscription`, `useApiQuery`, `useEngineHealth`, `useUserPermissions`, and the `DXCCUI` component library.

**PostgreSQL**
Primary relational database for DXCC. Stores user accounts, roles, permissions, dashboard layouts, user preferences, and audit metadata.

---

## R

**RAG (Retrieval-Augmented Generation)**
AI technique that combines knowledge base retrieval with LLM generation. The Intelligence Center uses RAG to answer user questions about the platform by searching the auto-indexed Knowledge Base and generating contextual responses.

**RBAC (Role-Based Access Control)**
Authorization model with 5 roles (Admin, Trader, Quant, Auditor, Viewer) and granular permissions in `action.resource` format. UI elements conditionally rendered; all actions validated server-side via OPA.

**Redis**
In-memory data store used by DXCC for session management, widget data cache, WebSocket connection state, rate limiting counters, and Narad message buffer.

---

## S

**Schema Registry**
Narad component that validates event schemas (Avro/Protobuf). Ensures all publishers and subscribers agree on event structure. DXCC's Knowledge Center provides an interactive event catalog powered by the Schema Registry.

**SEV (Severity Level)**
Incident severity classification: SEV-0 (critical, platform down), SEV-1 (major functionality broken), SEV-2 (minor functionality degraded), SEV-3 (cosmetic or non-impacting).

**SOP (Standard Operating Procedure)**
Documented runbook for operational tasks. DXCC Knowledge Center provides SOPs for market open (SOP-08), market close (SOP-09), incident response, engine restart, and other procedures.

**SSO (Single Sign-On)**
Authentication mechanism where users log in once via a corporate identity provider and gain access to DXCC without separate credentials. Supports OIDC (Keycloak, Azure AD, Okta) and SAML 2.0.

**Suraksha Score**
Composite risk score (0-100) calculated per symbol. Components: Vega Exposure (25%), Drawdown (20%), VaR (20%), Concentration (15%), Liquidity (10%), Churn (10%). Scores above 85 trigger warnings; above 95 trigger circuit breakers.

---

## T

**Talkdelta**
Greeks calculation engine that computes Black-Scholes option Greeks with sub-millisecond latency using AVX2 SIMD instructions. Provides real-time Greeks to Kuber Alpha via shared memory.

**TalkOffice**
Voice command and notification platform. Uses Whisper for speech-to-text and NLP for command parsing. Integrated with DXCC for voice-based queries and alert delivery.

---

## V

**Vega**
Order execution engine (C++20/Python) that routes approved orders to exchange via FIX protocol. Achieves <2ms execution latency. Tracked in DXCC's Execution Monitor.

**Vikray**
Strategy signal generation engine. Produces trading signals consumed by Kuber Alpha. Monitored in Strategy Command with full signal log and outcome tracking.

**Vite**
Next-generation frontend build tool used by DXCC. Provides fast HMR in development and optimized Rollup-based production builds with code splitting and tree shaking.

---

## W

**WebSocket (WSS)**
Persistent, full-duplex communication protocol used by DXCC for real-time Narad event streaming. All connections use TLS encryption (WSS). Heartbeat ping/pong every 10 seconds.

**Widget**
Self-contained UI component on the Executive Dashboard. Types include Metric Card, Status Grid, Time-series Chart, Data Table, Heatmap, and OHLC Chart. Widgets are draggable, resizable, addable, and removable per user.

---

## Z

**Zustand**
Lightweight React state management library. DXCC uses Zustand stores for Narad event state, engine health cache, user session, and dashboard layout. Chosen for its minimal API and excellent performance compared to Redux.

---

> **End of DXCC Documentation.** See [README.md](README.md) for the documentation index.
