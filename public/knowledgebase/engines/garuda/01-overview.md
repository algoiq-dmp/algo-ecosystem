---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 01 — Overview

## What is Garuda Margin Engine?

Garuda Margin Engine (GME) is an enterprise-grade, real-time margin calculation and risk intelligence platform purpose-built for Indian derivatives markets. It performs SPAN (Standardized Portfolio Analysis of Risk) margin computation, exposure margin calculation, and comprehensive portfolio risk assessment across multiple asset classes, brokers, and exchanges.

Named after Garuda — the divine eagle from Indian mythology known for its strength, speed, and sharp vision — the platform embodies high-speed computation, broad market visibility, and the power to lift heavy computational workloads.

## Why Garuda Was Built

Indian derivatives margin calculation is inherently complex:
- Parsing proprietary SPAN files published by NSE Clearing Corporation (updated 6x daily)
- Applying margining parameters: PSR, VSR, Composite Delta, Inter-Commodity Spread Credits
- Computing 11+ margin types simultaneously: SPAN, Exposure, Premium, NOV, Calendar Spread, Spread Benefit, Portfolio Benefit, Peak Margin, Intraday, Delivery, WCL
- Handling SEBI-mandated peak margin requirements
- Managing cross-exchange portfolio-level benefits

Most off-the-shelf RMS/OMS systems lack accurate SPAN calculation or deliver results with unacceptable latency. Brokerages often resort to manual calculations — leading to margin shortfalls, regulatory non-compliance, and suboptimal capital utilization. Garuda solves this completely.

## Business Objective

To become the industry-standard margin computation and risk intelligence platform for the global derivatives trading ecosystem, enabling financial institutions to manage regulatory margin requirements with zero friction, complete accuracy, and predictive foresight.

### Strategic Pillars

1. **Accuracy First** — Every margin identical to exchange-published margin within 0.01% tolerance
2. **Speed Without Compromise** — Real-time updates enabling high-frequency risk decisions
3. **Intelligence-Driven** — Shift from reactive to proactive margin management using AI/ML
4. **Universal Coverage** — All exchanges, all products, all margin types in a single API
5. **Developer-First** — SDKs in Python, Java, C#, Node.js with comprehensive documentation

## Scope

### In Scope
- SPAN Margin calculation for equity, commodity, and currency derivatives
- Exposure Margin (ELM + Adhoc) for cash and F&O segments
- Portfolio-level margin aggregation and cross-commodity netting
- Real-time intraday margin recomputation on price ticks
- End-of-day batch margin computation from exchange files
- Margin Intelligence: predictive analytics, VaR, stress testing, anomaly detection
- Hedge Optimizer: AI-based hedging strategy recommendations
- Multi-exchange support: NSE, BSE, MCX, NCDEX, MSEI, SGX
- RESTful APIs, WebSocket streaming, Webhook notifications
- Role-Based Access Control, audit logging, regulatory reporting

### Out of Scope
- Direct order routing and trade execution (broker OMS responsibility)
- Full-fledged RMS order-level controls
- Physical commodity delivery settlement
- Tax computation (STT, CTT, stamp duty)
- Client fund accounting and ledger management

## Target Users

| User | Primary Needs |
|---|---|
| **Brokerage Firms** | Real-time margin for 100K+ clients, SPAN/Exposure per client, shortfall alerts, EOD compliance reports |
| **Proprietary Trading Desks** | Ultra-low-latency margin (<1ms), strategy-level breakdown, real-time PnL + margin overlay |
| **Institutional Traders** | Portfolio-level optimization, calendar spread benefits, cross-product netting, scenario forecasting |
| **HNI / Ultra-HNI** | Strategy margin calculator, margin-to-capital ratio optimization, what-if analysis |
| **ISVs & Algo Platforms** | White-label integration via APIs and SDKs, embedded margin widgets |
| **Exchanges / CCPs** | Automated SPAN file validation, audit trails, discrepancy reporting, peak margin monitoring |
| **System Administrators** | Health dashboards, alerts, user management, log management, backup scheduling |

## Key Platform Statistics

| Metric | Target |
|---|---|
| API Throughput | 10,000+ req/sec sustained |
| P99 Margin Engine Latency | <50ms |
| Concurrent Positions | 100,000+ across brokers |
| WebSocket Connections | 50,000+ concurrent |
| Cache Hit Ratio | >95% |
| EOD Batch (100K clients) | <30 seconds |
| Reconciliation Tolerance | 0.01% vs exchange |

## Supported Asset Classes

| Class | Exchanges | Instruments |
|---|---|---|
| Equity Index Derivatives | NSE, BSE | NIFTY, BANKNIFTY, FINNIFTY, MIDCPNIFTY, SENSEX, BANKEX |
| Single Stock Derivatives | NSE, BSE | F&O stocks (200+ symbols) |
| Commodity Derivatives | MCX, NCDEX | Gold, Silver, Crude Oil, Natural Gas, Copper, Zinc, etc. |
| Currency Derivatives | NSE | USDINR, EURINR, GBPINR, JPYINR |

## Integration Partners

Pre-built adapters for: XTS (Symphony), ODIN (Thomson Reuters), NOW (NSE), NEST (Omnesys), Symphony Fintech, Trading Technologies (TT), and custom OMS/RMS platforms via REST/WebSocket/gRPC.
