# DXCC — System Requirements

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## Frontend Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | React | 19.x | UI framework with concurrent rendering |
| Language | TypeScript | 5.x | Type-safe development |
| State Management | Zustand | 4.x | Lightweight client state |
| Server State | React Query (TanStack) | 5.x | REST API caching and synchronization |
| Data Grid | AG Grid | 31.x | High-performance table rendering with virtual scrolling |
| Charts | Lightweight Charts / D3.js | 4.x / 7.x | OHLC candlestick charts, time-series, heatmaps |
| WebSocket | Native WebSocket API | Browser | Real-time Narad event streaming |
| HTTP Client | Fetch API + React Query | — | REST API communication |
| Build Tool | Vite | 5.x | Fast HMR dev server and optimized production builds |
| Testing | Vitest | 1.x | Unit and integration tests |
| E2E Testing | Playwright | 1.x | End-to-end browser automation |
| CSS | CSS Modules + Design System | — | Scoped styles and consistent theming |
| Icons | Lucide React | — | Consistent iconography |
| Routing | React Router | 6.x | Client-side navigation |

### Browser Support

- Chrome 120+ (primary)
- Firefox 120+
- Edge 120+
- Safari 17+

### Development Environment

- Node.js 20.x LTS
- pnpm 8.x or npm 10.x
- VS Code with TypeScript and ESLint extensions

---

## Backend Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Language | Go | 1.22+ | High-performance backend with native concurrency |
| HTTP Router | Chi | 5.x | Lightweight, idiomatic HTTP routing |
| WebSocket | gorilla/websocket | 1.x | WebSocket upgrade and connection management |
| Authentication | Custom JWT | — | Token issuance, validation, refresh |
| Authorization | Open Policy Agent (OPA) | — | Policy-based authorization decisions |
| ORM | sqlc / pgx | — | Type-safe PostgreSQL queries |
| Cache Client | go-redis | 9.x | Redis operations for sessions and widget cache |
| Logging | slog (stdlib) | — | Structured logging |
| Metrics | Prometheus client | — | Application-level metrics export |
| Config | Viper | 1.x | Configuration management from file and env |

---

## Database Requirements

| Database | Version | Purpose |
|----------|---------|---------|
| PostgreSQL | 15+ | DXCC user data, preferences, dashboards, configurations, audit log metadata |
| Redis | 7+ | Session store, widget data cache, WebSocket connection state, rate limiting |
| Elasticsearch | 8+ | Audit log storage and full-text search (accessed via Chitragupta API) |

### PostgreSQL Extensions Required

- `pgcrypto` — for password hashing
- `uuid-ossp` — for UUID generation
- `pg_stat_statements` — for query performance monitoring

---

## Network Requirements

| Protocol | Usage | Endpoint |
|----------|-------|----------|
| WebSocket (WSS) | Persistent connection to Narad WS Gateway | `wss://narad-gateway/ws` |
| HTTPS | REST API calls, configuration CRUD, audit queries | `https://kraken-api-gateway/api/` |
| gRPC | Internal service-to-service | Internal cluster only |

### WebSocket Specifications

- **Authentication:** JWT token in connection URL query parameter; validated on every inbound message
- **Reconnection:** Exponential backoff starting at 1s, max 3s between attempts
- **Heartbeat:** Client sends ping every 10s; expects pong within 5s
- **Protocol:** JSON-encoded messages over WSS
- **Compression:** permessage-deflate extension enabled

### Firewall Rules

| Source | Destination | Port | Protocol |
|--------|-------------|------|----------|
| DXCC Frontend | Narad WS Gateway | 443 | WSS |
| DXCC Frontend | Kraken API Gateway | 443 | HTTPS |
| DXCC Backend | PostgreSQL | 5432 | TCP |
| DXCC Backend | Redis | 6379 | TCP |

---

## Hardware Requirements (Minimum)

### Frontend (Browser)

- Modern browser with WebSocket support
- 8GB RAM recommended for heavy table usage
- GPU acceleration recommended for chart rendering

### Backend Server

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 2 vCPU | 4 vCPU |
| Memory | 2 GB | 4 GB |
| Disk | 10 GB | 20 GB SSD |
| Network | 100 Mbps | 1 Gbps |

---

## Software Dependencies (Backend)

```go
// go.mod key dependencies
require (
    github.com/go-chi/chi/v5 v5.0.12
    github.com/gorilla/websocket v1.5.1
    github.com/golang-jwt/jwt/v5 v5.2.0
    github.com/redis/go-redis/v9 v9.4.0
    github.com/jackc/pgx/v5 v5.5.1
    github.com/spf13/viper v1.18.2
    github.com/prometheus/client_golang v1.18.0
)
```

---

> **Next:** See [04-high-level-architecture.md](04-high-level-architecture.md) for the 5-layer architecture design.
