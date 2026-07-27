---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 23 — Roadmap

## Current Version: v5.0.0 "Brahmastra"

Released July 24, 2026. Complete overhaul of the AI recommendation engine, SENSEX & BANKEX derivatives support, multi-broker portfolio aggregation, and real-time WebSocket streaming.

---

## v5.1 — "Sudarshana" (Q3 2026)

### GPU Acceleration
- Offload SPAN risk array computation to GPU via CUDA
- Target: 5x speedup for 100+ position portfolios
- Support for NVIDIA T4 in Kubernetes GPU node pool
- Mixed precision computation (FP16) for non-critical scenarios
- Fallback to CPU when GPU unavailable

### Enhanced VaR Methodologies
- Cornish-Fisher expansion for non-normal distributions
- Extreme Value Theory (EVT) for tail risk modeling
- Multi-horizon VaR: 1-day, 5-day, 10-day
- Backtesting framework with Kupiec and Christoffersen tests

### Alert Channel Expansion
- WhatsApp Business API integration for margin alerts
- Telegram bot integration for instant notifications
- In-app notification center with read/unread tracking
- Alert escalation rules: auto-escalate after configurable timeout

### Multi-Language UI
- Hindi, Gujarati, Marathi UI support
- RTL text rendering for multi-lingual dashboards
- Language auto-detection from browser preferences

---

## v5.2 — "Trishula" (Q4 2026)

### Multi-Exchange Cross-Margin
- Real-time cross-exchange margin netting (NSE + BSE combined portfolio)
- Support for multi-CCP margin offsetting
- Unified cross-exchange SPAN computation engine
- Regulatory approval tracking for cross-margining eligibility

### International Exchange Support
- CME (US derivatives): Equity indices, commodities, FX
- SGX (Singapore): Nifty futures, MSCI futures
- HKEX (Hong Kong): Equity index futures
- Custom exchange adapter framework for rapid new-exchange onboarding

### Advanced Greeks Engine
- Real-time portfolio Greeks: Delta, Gamma, Theta, Vega, Rho, Charm, Vanna
- Greeks surface visualization (3D plots)
- Gamma scalping strategy analysis
- Volatility surface modeling and skew analysis

### Bloomberg / Reuters Integration
- Bloomberg Terminal API integration for institutional clients
- Reuters Eikon data feed ingestion
- Cross-reference margin data with Bloomberg pricing
- Automated trade reconciliation

### Crypto Derivatives (IFSC / GIFT City Readiness)
- Margin computation for crypto derivatives (BTC, ETH futures)
- GIFT City IFSC exchange adapter framework
- Higher volatility models for crypto assets (PSR: 10-15%, VSR: 40-60%)
- Cold wallet / hot wallet balance integration

---

## v6.0 — "Vajra" (H1 2027)

### Broker SDK Marketplace
- Publishable Garuda SDK components for third-party developers
- Marketplace for custom exchange adapters, strategy modules, reporting templates
- Developer certification program
- Revenue sharing for marketplace contributors

### NLP Interface ("Ask Garuda")
- Natural Language Processing: "What is the margin for selling NIFTY strangle at 25000/24000?"
- Voice interface for margin queries
- Chatbot integration for Slack, MS Teams, WhatsApp
- Contextual code generation: "Write Python code to calculate margin for..."

### Reinforcement Learning Hedge Engine
- RL-based dynamic hedging strategies
- Continuous learning from market conditions
- Adaptive hedge ratios based on volatility regimes
- Backtesting against 5 years of historical data

### Blockchain Audit Trail
- Immutable audit records on Hyperledger Fabric
- Timestamped margin calculations with cryptographic proofs
- Smart contract-based regulatory reporting
- Tamper-evident audit logs for SEBI compliance

### Garuda Cloud SaaS (Fully Managed)
- Pay-per-use pricing model
- Auto-scaling managed infrastructure
- One-click deployment from marketplace
- Built-in disaster recovery and backups
- SLA-backed managed service

---

## Long-Term Vision (v7.0+, H2 2027+)

### Global Multi-Asset Platform
- Unified margin for equities, commodities, FX, crypto, and fixed income
- Real-time global risk aggregation across 20+ exchanges
- Basel III / FRTB-style risk measures for institutional clients

### AI-First Architecture
- Foundation model trained on 10+ years of margin data
- Predictive margin optimization at portfolio construction time
- Automated regulatory compliance checking
- Generative AI for strategy ideation and backtesting

### Open Protocol Standards
- Open Margin Calculation Protocol (OMCP) — industry standard API
- Standardized margin data exchange format
- Cross-vendor compatibility
- Open-source reference implementation

---

## Feature Deprecation Schedule

| Feature | Deprecated In | Removal Date | Replacement |
|---|---|---|---|
| API v2 endpoints | v5.0.0 (Jul 2026) | Dec 31, 2026 | API v3 |
| WebSocket v1 protocol | v5.0.0 (Jul 2026) | Dec 31, 2026 | WebSocket v2 (protobuf) |
| gRPC v1 (no mTLS) | v5.0.0 (Jul 2026) | Dec 31, 2026 | gRPC v2 (mandatory mTLS) |
| Legacy API Key format | v4.0.0 (Jan 2026) | Jun 30, 2026 | New format: garuda_key_* |
| Python 3.8-3.9 SDK | v5.0.0 (Jul 2026) | Mar 31, 2027 | Python 3.10+ |

## Platform Support Matrix (Planned)

| Component | v5.0 | v5.1 | v5.2 | v6.0 |
|---|---|---|---|---|
| .NET Version | 8.0 | 8.0 | 9.0 | 9.0 |
| PostgreSQL | 16 | 16 | 17 | 17 |
| Redis | 7.2 | 7.2 | 8.0 | 8.0 |
| Kafka | 3.7 | 3.8 | 4.0 | 4.0 |
| Kubernetes | 1.28 | 1.29 | 1.30 | 1.31 |
| Ubuntu LTS | 22.04/24.04 | 24.04 | 24.04 | 26.04 |

## Performance Roadmap Targets

| Metric | v5.0 | v5.1 Target | v5.2 Target | v6.0 Target |
|---|---|---|---|---|
| Single position calculation | 95µs | 20µs (GPU) | 15µs | 10µs |
| Max API throughput | 15K/s | 20K/s | 30K/s | 50K/s |
| SPAN file parse | 3.5s | 2s | 1s | 0.5s |
| EOD batch (100K clients) | 22s | 15s | 10s | 5s |
| Cache hit ratio | 96% | 97% | 98% | 99% |
| P99 API latency | 12ms | 8ms | 5ms | 3ms |
| Memory footprint (idle) | 1.8GB | 1.5GB | 1.2GB | 1.0GB |

## How to Influence the Roadmap

- **Feature requests**: Submit via Dashboard → Support → Feature Request
- **Upvote**: Community voting on public roadmap at garuda.dev/roadmap
- **Beta program**: Early access to v5.1 features — sign up via Developer Portal
- **Enterprise customization**: Contact sales for priority feature development
- **Monthly roadmap review**: Product team reviews community input on the 1st of each month
