# 11 — Disaster Protection
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
**Disaster Protection** is Rakshak's final layer — planning for black swan events, market-wide circuit breakers, broker defaults, exchange outages, and systemic failures.
## Black Swan Scenarios
| Scenario | Probability | Portfolio Impact | Pre-Planned Response |
|----------|------------|-----------------|---------------------|
| Market-wide circuit (10%) | 1/3 years | -30% to -50% | Full exit into cash |
| Broker default | Very low | Variable | Pre-approved alternate broker |
| Exchange outage | 1/year | 0% (no trading) | Cross-exchange hedge (SGX Nifty) |
| Currency crisis | Low | -15% to -30% | FX hedge overlay |
| Geopolitical crisis | Low | -20% to -40% | Gold, USD, VIX hedge overlay |
## Disaster Hedge Overlay
A separate, always-on hedge layer:
- 2-5% of portfolio in VIX futures (long volatility)
- 1-3% in gold/oil for inflation/crisis hedge
- Pre-negotiated OTC put options with counter-party
## Circuit Breaker Protocol
When market-wide circuit breakers are hit:
| Stage | NIFTY Move | Time | Rakshak Action |
|-------|-----------|------|---------------|
| Stage 1 | ±10% | 45 min halt | Freeze all new orders; evaluate |
| Stage 2 | ±15% | 1h 45min halt | Initiate emergency exit for all short gamma |
| Stage 3 | ±20% | Full day halt | Full portfolio exit at reopen |
## Business Continuity
- **DR Site:** Secondary data center in different seismic zone
- **Failover:** Automatic if primary site unreachable for > 30s
- **Offline Mode:** Pre-approved hedge limits if all connections lost
- **Communication:** SMS/WhatsApp alerts to Risk team for any disaster trigger
## Disaster Recovery Test
Quarterly DR drill:
1. Simulate primary DC failure
2. Failover to DR site
3. Verify all positions and risk limits intact
4. Execute test trades from DR
5. Failback to primary
