---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 07 — Data Flow

## End-to-End Margin Calculation Flow

The diagram below illustrates the complete data flow from client request through margin calculation, intelligence analysis, and response delivery.

```
                              ┌─────────────────────────┐
                              │      CLIENT LAYER        │
                              │  Trading Platform / SDK  │
                              └────────────┬────────────┘
                                           │ 1. Authenticate
                                           ▼
                              ┌─────────────────────────┐
                              │      AUTH SERVICE        │
                              │  OAuth2 / JWT / API Key  │
                              └────────────┬────────────┘
                                           │ 2. Valid Token
                                           ▼
                              ┌─────────────────────────┐
                              │      API GATEWAY         │
                              │  Rate Limit + Route      │
                              └────────────┬────────────┘
                                           │ 3. POST /margin/calculate
                                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     MARGIN ENGINE CORE                        │
│                                                              │
│  ┌─────────────────┐                                        │
│  │ 4. Parse        │  Validate positions, check contract     │
│  │    Positions     │  master, resolve instrument types      │
│  └────────┬────────┘                                        │
│           ▼                                                  │
│  ┌─────────────────┐     ┌─────────────────────┐           │
│  │ 5. Load SPAN    │◀────│ Redis Cache (24h TTL)│           │
│  │    Parameters    │     │ ↓ miss              │           │
│  └────────┬────────┘     │ PostgreSQL           │           │
│           ▼              └─────────────────────┘           │
│  ┌─────────────────┐     ┌─────────────────────┐           │
│  │ 6. Load Market  │◀────│ Redis Cache (1s TTL) │           │
│  │    Prices        │     │ ↓ miss              │           │
│  └────────┬────────┘     │ Market Data WS       │           │
│           ▼              └─────────────────────┘           │
│  ┌─────────────────┐                                        │
│  │ 7. Calculate    │  SPAN: 16 scenarios, risk arrays       │
│  │    SPAN Margin   │  Exposure: ELM + Adhoc + GSM          │
│  └────────┬────────┘                                        │
│           ▼                                                  │
│  ┌─────────────────┐                                        │
│  │ 8. Apply        │  Calendar Spread Benefit               │
│  │    Benefits      │  Portfolio Benefit (cross-commodity)  │
│  └────────┬────────┘                                        │
│           ▼                                                  │
│  ┌─────────────────┐                                        │
│  │ 9. Compute      │  Long option value - short option value│
│  │    Net Option    │  Premium netting                      │
│  │    Value         │                                        │
│  └────────┬────────┘                                        │
│           ▼                                                  │
│  ┌─────────────────┐                                        │
│  │ 10. Aggregate   │  SPAN + Exposure - Benefits + NOV      │
│  │     Portfolio    │  Check Peak Margin                    │
│  └────────┬────────┘                                        │
│           ▼                                                  │
│  ┌─────────────────┐                                        │
│  │ 11. Validate    │  Reconciliation vs exchange ref        │
│  │     Result       │  Tolerance: 0.01%                     │
│  └────────┬────────┘                                        │
└───────────┼──────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────────┐
│                   INTELLIGENCE PIPELINE                        │
│                                                               │
│  ┌─────────────────┐    ┌──────────────────┐                │
│  │ 12. Margin      │    │ 12b. Hedge       │                │
│  │     Intelligence │    │     Optimizer    │                │
│  │  - ML Forecast   │    │  - Greek analysis│                │
│  │  - VaR Estimate  │    │  - Hedge search  │                │
│  │  - Stress Test   │    │  - Cost-benefit  │                │
│  │  - Risk Scoring  │    │  - Ranking       │                │
│  └────────┬────────┘    └────────┬─────────┘                │
│           └───────────┬──────────┘                           │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│                        RESPONSE                               │
│                                                               │
│  ┌─────────────────┐                                         │
│  │ 13. Return      │   {                                     │
│  │     Response     │     "total_margin": 245000.75,          │
│  │                 │     "span_margin": 142500.50,            │
│  │                 │     "exposure_margin": 87500.00,         │
│  │                 │     "net_option_value": -28000.00,       │
│  │                 │     "calendar_spread_benefit": 8500.00,  │
│  │                 │     "portfolio_benefit": 12000.00,       │
│  │                 │     "peak_margin": 268000.00,            │
│  │                 │     "recommendations": [...],            │
│  │                 │     "forecast": {...}                    │
│  │                 │   }                                      │
│  └─────────────────┘                                         │
│                                                               │
│  ┌─────────────────┐    ┌──────────────────┐                 │
│  │ 14. Publish     │───▶│ Kafka Event Bus  │                 │
│  │     Event       │    │ margin.calculated│                 │
│  └─────────────────┘    └──────────────────┘                 │
│                                                               │
│  ┌─────────────────┐    ┌──────────────────┐                 │
│  │ 15. Store       │───▶│ PostgreSQL DB    │                 │
│  │     Audit Log   │    │ audit_log table  │                 │
│  └─────────────────┘    └──────────────────┘                 │
└──────────────────────────────────────────────────────────────┘
```

## Detailed Step Descriptions

### Step 1-2: Authentication
Client authenticates via OAuth 2.0 client credentials flow or API key. Auth Service validates credentials, checks IP whitelist, verifies account status, and returns JWT access token (15-min TTL) + refresh token (24h TTL).

### Step 3: API Gateway
Gateway validates JWT, checks rate limits (per API key tier), routes request to Margin Engine. Returns 429 if rate limit exceeded.

### Step 4-6: Position Processing & Data Loading
Positions are validated against contract master. SPAN parameters loaded from Redis cache (24h TTL). On cache miss, loaded from PostgreSQL and cached. Market prices loaded from Redis (1s TTL), refreshed from WebSocket feed.

### Step 7: SPAN Calculation
For each combined commodity (grouped by underlying): build 16 risk scenarios, compute risk arrays per position, combine arrays within commodity, determine scanning risk (maximum loss), add inter-month spread charges, apply short option minimum floor.

### Step 8: Benefits Application
Calendar spread benefit: identify eligible pairs (same underlying, different expiry, opposite directions). Portfolio benefit: cross-commodity correlation credit (capped at 50% of max individual commodity SPAN).

### Step 9-10: Aggregation
Compute Net Option Value (long premium - short premium). Aggregate: SPAN + Exposure - Benefits + NOV. Apply exchange minimum margin floor. Update peak margin tracker.

### Step 11: Validation
Reconcile computed margin against exchange-published reference (0.01% tolerance). Flag discrepancies for manual review.

### Step 12: Intelligence Pipeline
Margin Intelligence: ML-based margin forecast (24h/7d/30d), VaR estimation (Historical/Parametric/Monte Carlo), stress testing. Hedge Optimizer: compute Greeks, identify hedging gaps, search for eligible instruments, simulate hedge impact, rank by cost-benefit ratio.

### Step 13-15: Response & Persistence
Return comprehensive margin result with breakdown and recommendations. Publish `margin.calculated` event to Kafka. Store immutable audit log in PostgreSQL.

## Real-time Recalculation Flow (Intraday)

```
Price Tick (Market Data WS)
    → Redis Price Cache Update
    → Change Detector (identifies price change > threshold)
    → Affected Positions Matcher (indexed DB lookup)
    → Group by Client Code
    → Parallel SPAN Recalculation per Client
    → WebSocket Push to Connected Clients
    → Alert Evaluator (check threshold breaches)
    → Notification Dispatcher (email/SMS/webhook)
```

## EOD Batch Processing Flow

```
3:45 PM IST Scheduler Trigger
    → Download Exchange Files (SFTP)
    → Validate File Format + Checksum
    → Parse SPAN Parameters + Bhavcopy
    → Update Database (effective next trading day)
    → Load All Broker Positions
    → Batch Margin Computation per Broker (parallel)
    → Reconcile vs Exchange-Published Margins
    → Generate EOD Reports (PDF/Excel/CSV)
    → Webhook Notifications to Brokers
    → Archive to Cold Storage (7-year retention)
```
