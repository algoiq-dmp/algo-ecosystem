---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 06 — Components

## Module Overview

Garuda Margin Engine is composed of seven primary modules, each with specific responsibilities in the margin calculation pipeline.

```
┌─────────────────────────────────────────────────────────────┐
│                    GARUDA MARGIN ENGINE                      │
├───────────┬───────────┬───────────┬───────────┬─────────────┤
│ Exchange  │ Strategy  │ Portfolio │ Real-time │ Hedge       │
│ Margin    │ Margin    │ Margin    │ Margin    │ Optimizer   │
│ Engine    │ Engine    │ Engine    │ Engine    │             │
├───────────┴───────────┴───────────┴───────────┴─────────────┤
│                        RMS Bridge                            │
├─────────────────────────────────────────────────────────────┤
│              Shared Services: Auth, Audit, Cache             │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Exchange Margin Engine

The core computational module handling all exchange-mandated margin types.

### Capabilities
- **SPAN Margin Calculation** — 16 risk scenarios per combined commodity, scanning risk charge, inter-month spread charge, short option minimum
- **Exposure Margin** — ELM (Extreme Loss Margin) + Adhoc margin for GSM securities
- **Premium Calculation** — Net premium receivable/payable across all option positions
- **Net Option Value** — Mark-to-market value of options at latest settlement price
- **Calendar Spread Benefit** — Benefit for offsetting positions across expiry months
- **Delivery Margin** — Escalated margin during last week before expiry (40-50% of contract value)
- **Peak Margin** — Intraday maximum margin tracking across 15-minute snapshots
- **Special Margin** — Exchange-directed additional margin for specific securities

### Exchange Coverage

| Exchange | Segments | SPAN File Source |
|---|---|---|
| NSE | Equity Cash, Equity F&O, Currency Derivatives | NSE Clearing FTP |
| BSE | Equity Cash, Equity F&O, Currency Derivatives | BSE FTP |
| MCX | Commodity Futures & Options | MCX FTP |
| NCDEX | Commodity Futures | NCDEX FTP |
| MSEI | Equity Derivatives | MSEI FTP |
| SGX | Nifty Futures (Phase 2) | SGX Data |

---

## 2. Strategy Margin Engine

Recognizes 50+ predefined options trading strategies and computes strategy-level margins.

### Pre-built Strategy Library

| Category | Strategies |
|---|---|
| **Directional** | Bull Call Spread, Bear Put Spread, Long Call, Long Put, Covered Call, Protective Put |
| **Neutral** | Short Straddle, Short Strangle, Iron Condor, Iron Butterfly, Short Gut |
| **Volatility** | Long Straddle, Long Strangle, Ratio Backspread |
| **Calendar** | Calendar Call Spread, Calendar Put Spread, Diagonal Spread |
| **Advanced** | Jade Lizard, Twisted Sister, Box Spread, Butterfly, Condor, Seagull |
| **Ratio** | Ratio Call Spread (1:2, 1:3), Ratio Put Spread, Christmas Tree |

### Strategy Recognition
The engine automatically identifies recognized strategies by analyzing position combinations:
1. Groups positions by underlying
2. Matches option combinations against strategy patterns
3. Computes strategy-level margin using max-loss methodology
4. Applies recognition benefits vs standalone margin

### Custom Strategy Builder
Supports up to 8 legs with real-time margin preview, Greeks computation, and payoff diagram generation.

---

## 3. Portfolio Margin Engine

Aggregates individual position margins into portfolio-level totals with cross-product netting.

### Capabilities
- **Portfolio-Level Aggregation** — Combine margins across all segments for a client
- **Cross-Product Netting** — NIFTY ↔ BANKNIFTY spread benefit (ρ = 0.85)
- **Client-Group Rollup** — Margin aggregation at team/desk/branch level
- **Family-Level Aggregation** — Client family margin consolidation
- **Portfolio VaR** — Value at Risk using Historical Simulation and Monte Carlo
- **Stress Testing** — Configurable scenario analysis (±5%, ±10%, ±20% shocks)
- **Peak Margin Tracking** — SEBI-compliant intraday peak monitoring
- **Margin Utilization** — Real-time utilization ratio vs available capital

---

## 4. Real-time Margin Engine

Handles intraday margin recalculation triggered by market data events.

### Architecture
```
Market Data WebSocket → Price Cache (Redis, 1s TTL) → Change Detector
    → Affected Positions Matcher → Margin Recalculator
    → Kafka (margin.updated) → Alert Evaluator → Notification Dispatcher
```

### Capabilities
- **Tick-by-Tick Recalculation** — Margin recomputed on every price change for affected positions
- **Position Impact Analysis** — Indexed lookup identifies all positions affected by a price change
- **Parallel Processing** — Client groups processed concurrently for maximum throughput
- **WebSocket Push** — Margin updates streamed to connected dashboards in real-time
- **Threshold Monitoring** — Configurable alert thresholds (85% warning, 95% critical)
- **Anomaly Detection** — Sudden margin spikes flagged for risk manager attention

---

## 5. Hedge Optimizer

AI-powered optimization engine suggesting capital-efficient hedging strategies.

### Optimization Goals
| Goal | Description |
|---|---|
| **MINIMIZE_MARGIN** | Find hedge trades that reduce total margin requirement most |
| **DELTA_NEUTRAL** | Neutralize directional risk regardless of margin impact |
| **COST_EFFICIENT** | Maximize margin-saved per rupee of hedge cost |

### Workflow
1. Compute portfolio Greeks (Delta, Gamma, Vega, Theta) at aggregate level
2. Identify risk concentrations and hedging gaps
3. Search for eligible hedge instruments (futures, options, spreads)
4. Simulate margin impact of each candidate hedge
5. Rank by cost-benefit ratio (margin_saved / hedge_cost)
6. Return top 3-5 recommendations with confidence scores

### Output
- Current portfolio Greeks (net delta, gamma, vega)
- Ranked recommendations with: action (BUY/SELL), instrument, quantity, hedge cost, margin after hedge, margin saved, savings %, cost-benefit ratio, new delta

---

## 6. RMS Bridge

Integration layer connecting Garuda to trading and risk management systems.

### Broker Platform Adapters

| Platform | Protocol | Status |
|---|---|---|
| XTS (Symphony) | TCP/IP Socket | Production |
| ODIN (Thomson Reuters) | TCP/IP Socket | Production |
| NOW (NSE) | TCP/IP Socket | Production |
| NEST (Omnesys) | TCP/IP Socket | Production |
| Symphony Fintech | REST + Socket | Production |
| Trading Technologies (TT) | FIX Protocol | Production |
| Custom / In-House | REST / WebSocket / gRPC | Custom Development |

### Capabilities
- Real-time position synchronization from trading platforms
- Margin result push to RMS for order-level validation
- Client code mapping (broker internal → exchange UCC)
- Bulk position import (CSV, up to 10M positions)
- Webhook notifications for margin breaches

---

## 7. Shared Services

### Authentication & Authorization
- OAuth 2.0 + JWT with 15-min access / 24h refresh token rotation
- API Keys with HMAC signature verification
- 6 RBAC roles: SuperAdmin, BrokerAdmin, RiskManager, Dealer, Viewer, APIUser
- MFA/TOTP, SAML 2.0 SSO, account lockout protection

### Audit Logging
- Immutable audit log for every margin computation event
- 7-year retention for regulatory compliance
- SIEM integration (Splunk, Azure Sentinel)
- Structured JSON log format with correlation IDs

### Caching
- Three-tier architecture: L1 in-memory → L2 Redis Cluster → L3 PostgreSQL
- SPAN parameters: 24h TTL. Market prices: 1s TTL
- Cache-aside pattern with write-through for critical updates
- Target hit ratio: >95% rolling 1h window
