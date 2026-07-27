# 02 — Architecture
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## System Architecture
Rakshak follows a **layered defense architecture** where each layer provides progressively stronger protection, from normal hedging to full emergency exit.
## Architecture Diagram
~~~
Normal Layer:    Hedge Requirements Calculation
                      | (risk escalates)
Enhanced Layer:  Dynamic Hedging + Tail Risk Monitoring
                      | (conditions worsen)
Active Layer:    Portfolio Protection + Gap/Overnight Limits
                      | (critical breach)
Emergency Layer: Emergency Exit + Disaster Protection
~~~
## Core Components
### 1. Hedge Requirement Calculator
Pre-trade and continuous: Calculates required hedge size based on position risk, volatility regime, and tail risk probability.
### 2. Risk Monitor
Continuously evaluates 5 risk categories:
- **Tail Risk:** Fat-tail event probability
- **Gap Risk:** Potential overnight/weekend gap size
- **Overnight Risk:** Exposure during closed market hours
- **Event Risk:** Impact of scheduled/unscheduled events
- **Liquidity Risk:** Ability to exit positions quickly
### 3. Dynamic Hedging Engine
Adjusts hedge ratios in real-time based on changing market conditions and Manthan intelligence.
### 4. Emergency Exit Engine
Pre-computes exit strategies for all positions. When triggered, sends priority orders to KuberAlpha for immediate execution.
### 5. Disaster Protection Module
Black swan scenario planning and pre-approved hedge overlays.
## Technology Stack
| Layer | Technology |
|-------|------------|
| Runtime | C++ (shared library with Kavach) |
| Event Calendar | PostgreSQL |
| Messaging | Redis Pub/Sub + Kafka |
| Monitoring | Prometheus + Grafana |
| Deployment | Kubernetes (2-replica) |
## Fault Tolerance
Rakshak is the last line of defense — it must never fail:
- Dual-redundant deployment (2 replicas, active-active)
- Emergency exit signals bypass normal message queues (direct TCP)
- Independent event calendar with offline cache
