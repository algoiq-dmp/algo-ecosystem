---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 02 — Business Requirements

## Business Goals

| Goal ID | Objective | Success Metric |
|---|---|---|
| BG-01 | Deliver real-time margin calculation with <50ms P95 latency | 95% of calls under 50ms |
| BG-02 | 100% compliance with SEBI, NSE, BSE, MCX margin circulars | Zero regulatory deviations |
| BG-03 | Multi-tenant architecture supporting 100+ brokers on a single cluster | Broker onboarding <1 day |
| BG-04 | Reduce end-client margin call events by 40% via predictive analytics | Measured month-over-month |
| BG-05 | 99.99% system availability during market hours (9:15 AM – 3:30 PM IST) | SLA adherence tracking |
| BG-06 | Provide single API for EOD and intraday margin snapshots | API latency <200ms P95 |
| BG-07 | Real-time margin intelligence alerts to risk managers | Alert delivery <30 seconds |
| BG-08 | Plug-and-play exchange file parsers for all major Indian exchanges | New exchange <2 weeks |

## Business Problems Solved

| Problem | Impact Before Garuda | Garuda Solution |
|---|---|---|
| Manual margin miscalculation | Client disputes, regulatory penalties | Fully automated, exchange-validated computation engine |
| Delayed margin updates during volatile markets | Undetected shortfalls, risk breaches | Real-time tick-by-tick recalculation |
| Inability to forecast margin requirements | Surprise margin calls | ML-based 7-day margin forecasting |
| Fragmented margin across exchanges | Inefficient capital allocation | Unified portfolio view with cross-exchange netting |
| Manual exchange file processing | Late EOD reporting | Automated file ingestion and processing pipeline |
| Complex SPAN parameter interpretation | Requires trained risk analysts, high OPEX | Built-in SPAN simulator, parameter impact analyzer |
| No hedge optimization | Excess margin blocking, lower volumes | AI Hedge Optimizer suggesting capital-efficient alternatives |
| Audit and regulatory reporting burden | Manual compilation, error risk | One-click regulatory report generation |

## Functional Requirements

### FR-01: Multi-Exchange SPAN Margin Calculation
Compute SPAN margin for equity derivatives, commodity futures, and currency futures using exchange-published SPAN parameter files. Support all 16 SPAN risk scenarios including Price Scan Range, Volatility Scan Range, and Composite Delta scenarios. Automatically apply Short Option Minimum floor and Spot Month Charges.

### FR-02: Exposure Margin (Extreme Loss Margin)
Calculate exposure margin for cash equity positions (ELM + Adhoc) and derivatives positions using exchange-specified percentage rates. Support dynamic ELM rate updates via exchange circulars. Integrate GSM (Graded Surveillance Measure) stages for escalated adhoc margins.

### FR-03: Net Option Value Computation
Compute net option value at contract level and portfolio level. Short option positions add to margin requirement; long option positions provide credit subject to exchange rules. Track premium margins for both buying and selling positions.

### FR-04: Calendar Spread Benefit
Identify eligible calendar spread positions (same underlying, different expiry) and compute margin benefit as defined by exchange rules. Cap benefit at the margin of the covered leg. Withdraw benefit 3 days before near-month expiry per exchange regulations.

### FR-05: Portfolio-Level Margin Aggregation
Aggregate margins across all segments (Equity Cash, Equity F&O, Currency, Commodity). Apply portfolio benefit (cross-product netting) where applicable. Enforce 50% cap on cross-commodity portfolio benefit.

### FR-06: Real-Time Intraday Margin Recalculation
Recalculate margins on every price tick via WebSocket market data feed. Update margin utilization ratios and trigger alerts for shortfalls exceeding configurable thresholds (default: 85% warning, 95% critical).

### FR-07: Margin Intelligence Engine
Provide ML-based margin forecasting (24h, 7d, 30d horizon), VaR estimation using Historical Simulation and Monte Carlo methods, stress testing with user-defined scenarios (±5%, ±10%, ±20% price shocks), and anomaly detection for sudden margin spikes.

### FR-08: Hedge Optimizer
Analyze existing portfolio positions and recommend hedging strategies. Options: (a) Add offsetting futures, (b) Add option legs for recognized spreads, (c) Adjust strike selection. Display cost-of-hedge vs margin-saved analysis with confidence scoring.

### FR-09: Multi-Tenant Broker Management
Support 100+ independent broker tenants with complete data isolation. Each broker manages own users, clients, positions, and margin configurations. Super-admin dashboard for platform-wide oversight.

### FR-10: Regulatory Reporting
Generate SEBI-compliant reports: Peak Margin Report, EOD Margin Report, Client-wise Margin Utilization Report. Export in PDF, Excel, and CSV formats. 7-year retention for compliance.

## Non-Functional Requirements

### Performance

| Metric | Target |
|---|---|
| API Response Time (margin calc) | <200ms P95 |
| Margin Engine Core Latency | <50ms P99 |
| Throughput (position ingestion) | 10,000+ positions/sec |
| Concurrent WebSocket Connections | 50,000+ |
| Database Query Response | <50ms P99 |
| Kafka Message Processing | <10ms end-to-end |
| Cache Hit Ratio (Redis) | >95% rolling 1h window |

### Availability

- Market Hours Uptime: 99.99% (max 4.32 min/month downtime)
- Overall Uptime: 99.95%
- RTO: <5 minutes for critical components
- RPO: <1 minute data loss
- DR: Active-passive DR site with <15 minute failover

### Security

- Encryption in Transit: TLS 1.3, mTLS for service-to-service
- Encryption at Rest: AES-256-GCM, database TDE
- Authentication: OAuth 2.0 + JWT with 15-min access / 24h refresh token rotation
- Authorization: Fine-grained RBAC with API-level permissions
- API Security: API keys with HMAC signature, rate limiting, IP whitelisting
- Secret Management: Azure Key Vault / HashiCorp Vault

### Scalability

- Horizontal scaling via Kubernetes HPA (CPU + custom metrics)
- Per-broker logical sharding, time-based table partitioning
- Three-tier caching: L1 (in-memory) → L2 (Redis cluster) → L3 (PostgreSQL)
- Kafka partitioning by broker_id for parallel processing

## Business Benefits

| Benefit | Annual Impact |
|---|---|
| Reduction in margin-related client disputes | 70% decrease |
| Faster broker onboarding to new exchanges | 3 weeks → 1 day |
| Margin shortfall early detection | 95% detection rate (vs 60%) |
| Operational cost savings (manual computation) | 85% reduction |
| Capital efficiency via hedge optimization | 15-22% margin reduction |
| API integration time for partners | 6 weeks → 3 days |
