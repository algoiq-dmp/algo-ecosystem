# DXCC — Module Reference

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## Module 1: Executive Dashboard

**Layer:** L1 — Data & Connectivity
**Purpose:** Landing page for all users providing a high-level summary of the entire ecosystem.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| System health at a glance | All engine heartbeats via Narad | Green/Yellow/Red status matrix for all 18 engines |
| Today's P&L display | Rakshak + Vega | Realized + Unrealized P&L with sparkline trend |
| Active strategy count | Vikray | Live, dry-run, paused, error breakdown |
| Order flow summary | Vega | Placed, executed, rejected, pending counters |
| Top movers display | Suchak + Ganesh | Top 5 symbols by % change with Suraksha Score badge |
| Risk overview | Kavach + Rakshak | Violation count, high-risk symbols, limit utilization |
| Narad health | Narad | Messages/sec, DLQ depth, consumer lag |
| Recent alerts | AlertManager | Last 5 alerts with severity badges |
| Market status | Surya + Ganesh | Pre-open, Open, Close, Holiday state |
| AI Coach snapshot | Arjun / Krishna | Quick-ask chat box; latest insights |

---

## Module 2: Engine Registry & Health

**Layer:** L2 — Platform Services & Intelligence
**Purpose:** Discover, monitor, and manage all registered engines.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Engine auto-discovery | manifest.yaml scan | Dynamic registration; no code changes needed |
| Health monitoring | Prometheus + Narad heartbeats | CPU, Memory, P50/P95/P99 latency, error rate, uptime |
| Engine detail page | Engine APIs | Per-engine: health tab, Narad tab, config tab, logs tab, dependencies tab, docs tab |
| Health timeline | InfluxDB / Prometheus | Historical health trend with anomaly detection markers |
| Bulk operations | Engine APIs | Restart selected engines, scale replicas, pause/resume |
| Dependency graph | Engine manifests | Upstream/downstream engine health visualization |

---

## Module 3: Market Operations

**Layer:** L2 — Platform Services & Intelligence
**Purpose:** Real-time market data visualization and monitoring.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Market watch | Ganesh + Suchak | Configurable watchlist with LTP, change %, volume, OI, Suraksha Score |
| OHLC charts | Ganesh historical data | Interactive candlestick with RSI, MACD, Bollinger Bands, SMA, EMA overlays |
| Order book depth | Redis L2 data | Visual bid/ask depth chart with imbalance indicator |
| Tick tape | Feed Engine stream | Streaming tick-by-tick with color-coded price changes |
| Market breadth | Ganesh | Advances/declines, volume ratio, sector performance |
| Economic calendar | Static + API | Scheduled events with impact rating |

---

## Module 4: Intelligence Center

**Layer:** L3 — Strategy & Analysis
**Purpose:** AI-powered insights and decision support.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| AI Chat interface | Arjun (full) / Krishna (lite) | Conversational AI with context-aware responses |
| Strategy ideas | AI Coach recommendations | Market-condition-based strategy suggestions |
| Anomaly detection | AI Coach analysis | Flagged unusual patterns with severity and explanation |
| Sentiment analysis | News APIs | Sentiment scoring for tracked symbols |
| Pattern recognition | AI Coach (chart patterns) | Head & shoulders, triangles, flags with confidence scores |
| Knowledge Q&A | RAG over Knowledge Base | Natural language queries against platform documentation |

---

## Module 5: Strategy Command

**Layer:** L3 — Strategy & Analysis
**Purpose:** Complete strategy lifecycle management.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Strategy list | Vikray | All strategies with status, P&L, win rate, signals count |
| Strategy detail | Vikray + Vega | Performance tab, signals tab, orders tab, violations tab, config tab |
| Deploy wizard | Kuber Alpha | Guided multi-step: config -> dry-run -> review -> approval -> live |
| Backtest integration | Upload + comparison | Upload backtest results; compare with live performance |
| Strategy comparison | Analytics | Side-by-side multi-strategy performance |

---

## Module 6: Portfolio Command

**Layer:** L4 — Risk & Execution
**Purpose:** Real-time portfolio and position management.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Position matrix | Rakshak | All positions across strategies and symbols |
| P&L breakdown | Rakshak + Vega | Realized vs unrealized; by strategy, symbol, sector |
| Exposure analysis | Rakshak | Net, gross, beta-weighted exposure |
| Margin calculator | RMS (Talkoffice) | Real-time margin requirement |
| Position sizing | Risk parameters | Calculate optimal position size |
| Corporate action alerts | Surya | Upcoming splits, bonuses, dividends |

---

## Module 7: Risk Center

**Layer:** L4 — Risk & Execution
**Purpose:** Real-time risk monitoring and management.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Risk heatmap | Kavach | Strategy x Symbol matrix with color-coded utilization |
| Suraksha Score dashboard | Kavach | Per-symbol risk scores (0-100) with component breakdown |
| Violation feed | Kavach alerts | Real-time stream of violations with severity and action |
| Circuit breaker status | Durga | Market-wide, segment, symbol-level breaker states |
| Rule management | Kavach | CRUD interface for risk rules |
| Override management | Kavach + Audit | Request, approve, audit risk overrides |
| What-if analysis | Risk simulator | Simulate risk impact of proposed trades |

---

## Module 8: Execution Monitor

**Layer:** L4 — Risk & Execution
**Purpose:** Real-time order and execution tracking.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Order blotter | Vega | All orders with status, side, quantity, price, latency |
| Execution log | Vega | All fills with price, quantity, exchange order ID |
| Order lifecycle | Vega + Kavach | Full lifecycle: Signal -> Order -> Kavach -> Vega -> Exchange -> Fill |
| Latency monitor | Vega | E2E latency by component with breakdown |
| Rejected orders | Vega + Kavach | Orders rejected with reason code |
| Exchange connectivity | Vega | Connection status and heartbeat latency per exchange |

---

## Module 9: Audit Center

**Layer:** L5 — Governance & Operations
**Purpose:** Comprehensive audit trail viewer.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Audit search | Chitragupta | Full-text search by actor, action, resource, date, request ID |
| Audit timeline | Chitragupta | Chronological grouping of related events |
| User activity | Chitragupta | Per-user activity log with session tracking |
| Config change audit | Chitragupta | Before/after diffs for all configuration changes |
| Data access log | Chitragupta | Who accessed PII, API keys, strategies |
| Export | Chitragupta | CSV, JSON, signed PDF |
| Integrity verification | Chitragupta | Merkle tree hash chain verification and tamper detection |

---

## Module 10: Infrastructure Monitor

**Layer:** L1 — Data & Connectivity
**Purpose:** Platform infrastructure health and capacity monitoring.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Kubernetes cluster | K8s API | Node/pod status, resource utilization, events |
| Database health | Direct checks | PostgreSQL, Redis, ClickHouse, InfluxDB metrics |
| Network monitor | Network probes | Throughput, latency, error rate, connections |
| Storage monitor | Volume metrics | Disk usage per volume; capacity prediction |
| Cost dashboard | Cloud APIs | Spend per engine/environment; optimization recommendations |
| TLS certificates | Cert monitoring | Expiry tracking; auto-renewal status |
| Backup status | Backup systems | Last backup time, size, success/failure per database |

---

## Module 11: API Gateway Monitor

**Layer:** L2 — Platform Services & Intelligence
**Purpose:** Kraken API Gateway management and analytics.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Traffic dashboard | Kraken metrics | Requests/sec, error rate, P95 latency per endpoint |
| Consumer analytics | Kraken | Per-user, per-engine API usage; rate limit hits |
| Route management | Kraken | Active routes; add/modify/remove |
| Rate limit config | Kraken | Per-tier rate limits with live adjustment |
| WAF dashboard | Kraken WAF | Blocked requests; attack patterns; custom rules |
| API key management | Kraken | Issue, rotate, revoke API keys |

---

## Module 12: Notification Center

**Layer:** L1 — Data & Connectivity
**Purpose:** Centralized alert and notification management.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Alert inbox | AlertManager | All alerts with severity, status, ack, resolution |
| Alert rules | AlertManager | View, create, edit rules from DXCC UI |
| Silence management | AlertManager | Schedule and manage alert silences |
| Escalation policies | AlertManager | On-call schedules and escalation chains |
| Notification channels | Integrations | Slack, PagerDuty, email configuration |
| Alert history | AlertManager | Searchable history with trend analysis |

---

## Module 13: Incident Management

**Layer:** L5 — Governance & Operations
**Purpose:** SEV-0 to SEV-3 incident tracking and resolution.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Active incidents | PostgreSQL | All open incidents with severity, status, commander |
| Incident detail | PostgreSQL | Timeline, chat, affected services, resolution steps |
| Create incident | UI + API | Manual or auto-created from alert |
| Post-mortem | PostgreSQL | Post-incident review with action items |
| Incident analytics | PostgreSQL | MTTR, frequency, top affected services |

---

## Module 14: Knowledge Center

**Layer:** L5 — Governance & Operations
**Purpose:** Platform documentation and learning hub.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Documentation browser | KB files | Full Knowledge Base organized by topic |
| Search | KB index | Full-text search across all documentation |
| Engine docs | Auto-generated | Per-engine documentation from manifests |
| API reference | Swagger | Interactive API documentation |
| Event catalog | Schema Registry | Narad event schemas with sample payloads |
| Release notes | Versioned docs | Changelog with features and fixes |
| Tutorials | Authored content | Getting started guides, walkthroughs |
| Glossary | Curated | Platform terms and engine definitions |

---

## Module 15: Administration

**Layer:** L5 — Governance & Operations
**Purpose:** System-wide administration panel.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| User management | PostgreSQL | CRUD users; assign roles and permissions |
| Role management | PostgreSQL | Define RBAC roles with granular permissions |
| API key management | PostgreSQL | Issue, rotate, revoke keys per user/engine |
| Engine configuration | Engine APIs | View and edit config with versioning |
| System settings | PostgreSQL | Global platform settings |
| Billing & licensing | Internal | Usage tracking; license management |
| Audit configuration | PostgreSQL | Configure audit detail levels |
| SSO configuration | Keycloak | OIDC/SAML provider setup |

---

## Module 16: AI Operations

**Layer:** L3 — Strategy & Analysis
**Purpose:** AI Coach monitoring and management.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Coach health | Ollama metrics | Inference latency, token usage, error rate |
| Usage analytics | Ollama | Query volume, top users, popular topics |
| Quality metrics | Feedback | Hallucination rate, relevance scores, user feedback |
| Prompt management | Config store | View and version system prompts |
| KB status | ChromaDB | Last indexed, document count, chunk count |
| Model config | Config store | Model selection, temperature, context window |
| Memory management | ChromaDB | Per-user memory, purge options |
| Cost tracking | API billing | LLM API costs per day/week/month |

---

## Module 17: DevOps

**Layer:** L1 — Data & Connectivity
**Purpose:** CI/CD pipeline and deployment management.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Pipeline monitor | CI/CD system | All pipelines with status and duration |
| DORA metrics | Pipeline data | Deployment frequency, lead time, MTTR, change failure rate |
| Environment status | K8s + checks | Dev, QA, UAT, Prod health and version matrix |
| ArgoCD integration | ArgoCD API | App sync status; drift detection; manual sync |
| Container registry | Registry API | Image list; vulnerability scan results |
| Feature flags | LaunchDarkly | Runtime feature toggle management |
| Deployment history | CD system | All deployments with rollback capability |

---

## Module 18: Analytics Center

**Layer:** L3 — Strategy & Analysis
**Purpose:** Business intelligence and reporting.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Performance reports | ClickHouse | Strategy, desk, and overall P&L reporting |
| Risk reports | ClickHouse | Daily risk summary, limit utilization, violation trends |
| Execution quality | ClickHouse | Slippage, fill rate, venue analysis |
| Custom reports | ClickHouse | Drag-and-drop query builder |
| Scheduled reports | Report engine | Auto-generate and email daily/weekly/monthly |
| Data export | Export service | CSV, Excel, PDF export of any analytics data |

---

## Module 19: Ecosystem Timeline

**Layer:** L1 — Data & Connectivity
**Purpose:** Real-time chronological view of all platform events.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Unified event stream | Narad + APIs | All events in a single chronological feed |
| Filters | Client-side | By engine, event type, user, severity, time range |
| Correlation | Server-side | Auto-group related events (e.g., order lifecycle) |
| Replay | Elasticsearch | Replay a time window for debugging |
| Export | API | Export timeline segments for analysis |

---

## Module 20: Strategy Builder Integration

**Layer:** L3 — Strategy & Analysis
**Purpose:** Direct integration with Kuber Alpha strategy builder.

| Responsibility | Data Source | Key Features |
|---------------|-------------|--------------|
| Strategy IDE | Kuber Alpha | Visual strategy composition with drag-and-drop |
| Signal preview | Kuber Alpha | Preview signals before deployment |
| Greek integration | Talkdelta | Real-time Greeks overlay on strategy params |
| Version control | Git-backed | Strategy versioning with diff and rollback |
| Simulation | Manthan | Churn simulation before live deployment |

---

> **Next:** See [07-data-flow.md](07-data-flow.md) for complete data flow documentation.
