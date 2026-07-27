---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 24 — Release Notes

## Version History

| Version | Codename | Release Date | Status |
|---|---|---|---|
| **v5.0.0** | Brahmastra | July 24, 2026 | **Current Stable** |
| v4.0.0 | Sudarshana | April 15, 2026 | Stable (supported) |
| v3.0.0 | Trishula | January 10, 2026 | Stable (supported) |
| v2.5.0 | Vajra | October 5, 2025 | Maintenance only |
| v2.0.0 | Astra | June 20, 2025 | Maintenance only |
| v1.0.0 | Agni | November 15, 2024 | **End of Life** |

---

## v5.0.0 — Brahmastra (July 24, 2026)

### New Features

**Margin Intelligence v2**
Complete overhaul of the AI recommendation engine with multi-model ensemble architecture combining XGBoost for strategy selection, deep neural network for savings prediction, and gradient boosting for risk assessment. Key improvements: 87.3% top-5 strategy accuracy (up from 72%), mean absolute savings error reduced from Rs. 18,500 to Rs. 12,450, Bayesian confidence scoring with calibrated intervals. Weekly automatic model retraining.

**SENSEX & BANKEX Derivatives**
Full margin calculation for BSE derivatives including SENSEX and BANKEX futures and options. SPAN file ingestion for BSE parameters. Contract master and bhav copy support. All existing margin types available for BSE instruments.

**Multi-Broker Portfolio Aggregation**
Unified portfolio view across XTS, ODIN, NEST, NOW, Symphony, TT platforms. Normalized position data, deduplication, consolidated margin computation. Real-time synchronization via WebSocket.

**Real-time WebSocket Streaming (v2)**
Binary protobuf frames with optional JSON fallback. Automatic reconnection, message compression (permessage-deflate), authenticated connections. Average delivery latency under 5ms.

### Performance Improvements
- 50% faster SPAN calculation via SIMD-vectorized risk array computation
- Redis Cluster support (6 nodes: 3 master + 3 replica) for HA caching
- WebSocket compression reducing bandwidth by 75%
- TimescaleDB hypertables: 10x query improvement for historical data
- Connection pooling: 60% reduction in database connection overhead

### Bug Fixes
- Calendar spread benefit edge case for 3+ expiry partial overlaps
- Peak margin rounding precision (switched to DECIMAL(18,4) arithmetic)
- OAuth token refresh race condition (distributed Redis locking)
- Portfolio benefit for multi-expiry positions
- MCX SPAN file parsing for commodity contract specifications

### Breaking Changes
- API v2 endpoints deprecated (removal: Dec 31, 2026)
- WebSocket v1 protocol removed (migrate to v2 protobuf)
- Python SDK minimum version: 3.10+ (3.8/3.9 dropped)
- PostgreSQL 16+ required (from 15)
- Redis Cluster (6 nodes) replacing standalone

### Migration Guide: v4.0 → v5.0
1. Update API base URLs: `/v4/` → `/v5/`
2. Add `X-Garuda-Client` header to all requests
3. Switch to WebSocket v2 protocol
4. Update SDKs: Python 3.2.x, .NET 3.2.x, Java 3.2.x, Node 3.2.x
5. On-premise: upgrade PostgreSQL to 16.x, deploy Redis Cluster

---

## v4.0.0 — Sudarshana (April 15, 2026)

### New Features
- **Hedge Optimizer v1**: Strike/expiry optimization, BSM pricing with IV surfaces, margin-saved calculation, ROI analysis
- **50+ Trading Strategies**: Iron Condor, Iron Butterfly, Jade Lizard, Ratio Spread, Back Spread, Box Spread, Diagonal Spread
- **Strategy Backtesting**: 5 years historical data, configurable entry/exit rules, transaction costs, Sharpe ratio, max drawdown
- **gRPC API**: Internal service communication via gRPC + Protocol Buffers

### Improvements
- Margin calculation latency reduced 30% via algorithmic optimization
- API rate limits: 5,000 → 8,000 req/sec per client
- Kafka 3.7 with Kraft consensus (ZooKeeper removed)
- Enhanced audit logging with request/response body capture

### Bug Fixes
- Inter-commodity spread credit for non-qualifying underlyings
- Memory leak in long-running WebSocket connections
- Database connection exhaustion under sustained peak load

---

## v3.0.0 — Trishula (January 10, 2026)

### Major Release — Platform Redesign

### New Features
- **Margin Intelligence v1**: Decision tree strategy selection, portfolio risk scoring, capital efficiency analysis
- **Peak Margin Tracking**: SEBI-mandated intraday recording, configurable window tracking, regulatory reporting
- **Worst Case Loss (WCL)**: 6 predefined stress scenarios, configurable custom scenarios, P&L impact
- **Multi-User / Multi-Group**: Hierarchical user management, 5 RBAC roles, any-level portfolio aggregation
- **API v3**: RESTful redesign, comprehensive error handling, OpenAPI 3.1 specification

### Performance
- 3x portfolio-level improvement via parallelized scenario evaluation
- Sub-millisecond P99 for single-position calculations
- 10,000+ req/sec sustained (up from 3,500)

### Breaking Changes
- API v1 removed (migrate to v3)
- OAuth 2.0 + JWT (from API-key-only)
- Database schema changes (migration tool required)
- INI → YAML configuration format

---

## v2.0.0 — Astra (June 20, 2025)

### Features
- Portfolio Benefit optimization via combinatorial search
- Exposure Margin Engine with dynamic rates
- Premium Margin and Net Option Value computation
- Broker Integration Framework: XTS, ODIN, NOW adapters
- SDK Release: Python, .NET, Java, Node.js

### Breaking Changes
- Position model expanded (new required fields)
- Margin result structure changed (all components included)
- API key format changed (reissue required)

---

## Performance History

| Metric | v1.0 | v2.0 | v3.0 | v4.0 | v5.0 |
|---|---|---|---|---|---|
| Single position calc | 2.5ms | 800µs | 200µs | 120µs | 95µs |
| 100-position portfolio | 85ms | 35ms | 5ms | 3ms | 2ms |
| Max API throughput | 500/s | 3,500/s | 10,000/s | 12,000/s | 15,000/s |
| SPAN file parse | 45s | 15s | 8s | 5s | 3.5s |
| Cache hit ratio | — | 65% | 92% | 94% | 96% |
| P99 API latency | 450ms | 120ms | 18ms | 15ms | 12ms |
| Memory footprint | 4GB | 3.2GB | 2.1GB | 1.9GB | 1.8GB |
| Startup time | 90s | 45s | 22s | 18s | 14s |

## Supported Platform Matrix

| Component | v5.0 | v4.0 | v3.0 |
|---|---|---|---|
| Ubuntu 24.04 | Yes | No | No |
| Ubuntu 22.04 | Yes | Yes | Yes |
| RHEL 9 | Yes | Yes | Yes |
| RHEL 8 | Yes | Yes | Yes |
| Docker Engine | 24.0+ | 23.0+ | 20.10+ |
| Kubernetes | 1.28+ | 1.27+ | 1.25+ |
| PostgreSQL | 16.x | 16.x | 15.x |
| Redis | 7.2+ | 7.0+ | 7.0+ |
| Apache Kafka | 3.7+ | 3.6+ | 3.5+ |
