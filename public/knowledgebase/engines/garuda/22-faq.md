---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 22 — Frequently Asked Questions

## Margin Concepts

### Q1: What is SPAN margin?
SPAN (Standardized Portfolio Analysis of Risk) is a portfolio-based margin system that evaluates overall risk across 16 predefined scenarios of price and volatility changes. Instead of evaluating each position in isolation, SPAN evaluates the entire portfolio.

### Q2: How many SPAN scenarios are there?
16 scenarios: 14 standard combinations of price moves (0, ±1/3, ±2/3, ±3/3 of Price Scan Range) with volatility changes (Up/Down), plus 2 extreme tail scenarios at ±2×PSR with 35% weight.

### Q3: What is Price Scan Range (PSR)?
The maximum expected one-day price movement for an underlying, set by the exchange. Typically 3% for NIFTY, 4-5% for BANKNIFTY, and higher for individual stocks.

### Q4: What is Volatility Scan Range (VSR)?
The maximum expected one-day change in implied volatility, used in SPAN scenario generation. Typically 20-25% of current volatility level.

### Q5: What is Exposure Margin (ELM)?
Extreme Loss Margin — an additional margin collected by exchanges to cover extreme price movements beyond SPAN coverage. Applied as a percentage of position value: ~2-3% for indices, 5-20%+ for stocks.

### Q6: What is the difference between ELM and Adhoc margin?
ELM is the standard exposure margin rate. Adhoc margin is an additional rate imposed on specific securities under GSM (Graded Surveillance Measure) or by exchange directive, typically 50-100% for GSM Stage II+.

### Q7: What is Net Option Value (NOV)?
The net market value of option positions: Long Option Value - Short Option Value. If NOV is negative (net short), it is added to margin. If positive (net long), it provides limited credit subject to exchange rules.

### Q8: What is Calendar Spread Benefit?
Margin reduction when holding opposite positions in the same underlying but different expiry months. The exchange recognizes reduced risk in calendar spreads. Benefit is removed 3 days before near-month expiry.

### Q9: What is Portfolio Benefit?
Cross-commodity netting benefit. When a portfolio has offsetting positions in correlated underlyings (e.g., Long NIFTY + Short BANKNIFTY with ρ=0.85), the combined margin is lower. Capped at 50% of the higher individual SPAN margin.

### Q10: What is Peak Margin?
The maximum margin requirement for a client at any point during a trading day. SEBI mandates that brokers must collect peak margin upfront. Garuda tracks peak at 15-minute snapshot intervals.

### Q11: What is Delivery Margin?
Additional margin (40-50% of contract value) applied during the last week before contract expiry, significantly higher than normal SPAN margin.

### Q12: What is Intraday Margin?
Margin calculated using intraday prices (LTP) instead of EOD settlement prices. Some brokers offer reduced intraday margins for positions squared off before market close.

---

## API Usage

### Q13: How do I authenticate API requests?
Use JWT Bearer tokens (obtained via `POST /v3/auth/login`) or API Keys (set in `X-API-Key` header). JWT tokens expire in 15 minutes; use refresh tokens (24h TTL) to renew.

### Q14: What are the rate limits?
Tiered: BASIC (100 req/sec, 10K/day), STANDARD (1K req/sec, 100K/day), ENTERPRISE (10K req/sec, unlimited). Rate limit headers included in every response.

### Q15: What response format does the API use?
JSON exclusively. Error responses follow RFC 7807 Problem Details format. All responses include `X-Request-ID` and latency headers.

### Q16: Is there a Swagger/OpenAPI specification?
Yes. Full OpenAPI 3.0 specification at `https://api.garuda.dev/swagger/v3/swagger.json`. Interactive Swagger UI at `https://api.garuda.dev/swagger`.

### Q17: Are there SDKs available?
Yes: Python (`pip install garuda-margin`), Java (Maven), C# (NuGet: `Garuda.Client`), Node.js (`npm install garuda-margin-client`), C++, Flutter, React, Angular.

### Q18: How do I use the WebSocket API?
Connect to `wss://ws.garuda.dev?token={jwt}`. Subscribe to channels: `margin.{clientCode}`, `alert.{brokerId}`. Messages delivered as JSON.

### Q19: What is the maximum request size?
10 MB for REST API. For bulk position uploads >10 MB, use the async batch endpoint with file upload.

### Q20: Can I test before production integration?
Yes. Sandbox at `https://sandbox.garuda.dev` with simulated market data, 10 RPS limit, free registration. Auto-resets every Sunday.

---

## Integration

### Q21: What trading platforms does Garuda integrate with?
Pre-built adapters for XTS, ODIN, NOW, NEST, Omnesys, Symphony Fintech, Trading Technologies (TT). Custom platforms via REST/WebSocket/gRPC APIs.

### Q22: How do I import positions in bulk?
CSV upload via Dashboard or `POST /v3/positions/bulk`. JSON payload also accepted. For datasets >1M positions, use async batch API with `job_id` polling.

### Q23: How are exchange files ingested?
Garuda polls SFTP servers at scheduled times (starting 4:00 PM IST). On file arrival, it parses, validates, and loads SPAN parameters and prices. Files refreshed 6x daily.

### Q24: How do I set up a new exchange segment?
Administration → Broker Management → select broker → Add Exchange. Configure TM Code, CP Code, SFTP credentials. Validate connectivity, then activate.

### Q25: What is the integration timeline for a new broker?
Basic setup: 1 day. Full integration with trading platform: 3-5 days. Custom configurations: 5-10 days. Dedicated onboarding engineer assigned for STANDARD tier and above.

---

## Installation & Deployment

### Q26: What are the minimum system requirements?
Production minimum: 32 vCPU (4 nodes × 8 vCPU), 64 GB RAM, 1 TB NVMe SSD, 10 Gbps network. Development: 8 vCPU, 16 GB RAM, 100 GB SSD.

### Q27: Can I install Garuda using Docker?
Yes. Docker Compose file provides full stack for development/small-scale. `docker compose up -d` for local deployment. Full Kubernetes for production.

### Q28: What cloud providers are supported?
Azure (AKS), AWS (EKS), GCP (GKE). Terraform modules provided for each. On-premises Kubernetes also supported.

### Q29: How do I upgrade Garuda?
Helm upgrade: `helm upgrade garuda garuda/garuda-margin-engine --version 5.0.1`. Database migrations run automatically. Blue-green deployment recommended for production.

### Q30: Is there a free trial?
Yes. 30-day sandbox access with full API, simulated data, 10 RPS limit. No credit card required.

---

## Security

### Q31: Is data encrypted?
Yes. In transit: TLS 1.3 (external) + mTLS (internal). At rest: AES-256-GCM for database, Redis, and blob storage. All secrets in Azure Key Vault / Vault.

### Q32: What authentication methods are supported?
OAuth 2.0 + JWT, API Keys with optional HMAC signing, MFA via TOTP, SAML 2.0 for enterprise SSO.

### Q33: Is there penetration testing?
Annual third-party pen test by CREST-certified firm. Monthly automated DAST (OWASP ZAP). Per-release manual review. Continuous bug bounty program.

### Q34: How is data privacy handled?
PII (PAN, email, phone) encrypted at rest and masked in logs. Data Processing Agreement available. Right-to-deletion supported for inactive accounts (<30 days grace period).

---

## Business

### Q35: What is the pricing model?
Tiered annual subscription: BASIC (INR 12L/annum, 100 users, 10K clients, 100 RPS), STANDARD (INR 24L/annum, 500 users, 100K clients, 1K RPS), ENTERPRISE (INR 48L/annum, unlimited). API-only: INR 50/1,000 calls.

### Q36: Can I white-label Garuda?
Yes. White-label option for ENTERPRISE tier. Custom branding (logo, colors, domain), custom email templates, custom report headers. Additional INR 8L/annum.

### Q37: What support plans are available?
Standard: Email, 8×5, 4-hour response. Premium: Phone + Email, 24×7, 1-hour response. Enterprise: Premium + quarterly health checks + on-site visits.

### Q38: What is the uptime SLA?
99.99% during market hours (9:15 AM – 3:30 PM IST). 99.95% overall. RTO <5 minutes for critical components.

### Q39: How do I get a demo?
Visit garuda.dev/demo to schedule a personalized demo. Live POC environment available for ENTERPRISE prospects (2-week evaluation).

### Q40: Who owns the data?
The broker/customer owns all data. Garuda does not access, share, or use customer data beyond providing the contracted service. DPA available.
