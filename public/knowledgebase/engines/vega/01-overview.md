# 01 — Overview & Business Objectives

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Purpose

Vega solves the critical problem of **deterministic, auditable order execution** across multiple broker destinations. In the Algo-IQ ecosystem, strategy engines generate trade signals but require a specialized layer that can validate, enrich, route, and track orders through to exchange execution. Vega serves as this execution backbone.

---

## Business Objectives

| Objective | Measurement | Target |
|---|---|---|
| Order routing latency | P95 internal latency | < 500 µs |
| System availability | Monthly uptime | 99.99% |
| Broker failover time | Time to switch primary broker | < 2 seconds |
| Kill Switch activation | Time from breach to halt | < 100 ms |
| Order audit coverage | Percentage of orders logged | 100% |
| Concurrent order capacity | Active orders in-flight | 50,000 |

---

## Stakeholders

| Role | Interaction |
|---|---|
| **Strategy Teams** | Submit validated trade signals via TalkStrategy API |
| **Risk Management** | Monitor kill switch status and define margin thresholds |
| **Compliance** | Audit all order events via immutable log |
| **Operations** | Manage broker connectivity, credential rotation, and health monitoring |
| **Development** | Extend broker adapters, enhance pre-trade validation rules |

---

## Supported Order Types

| Order Type | Description | FIX Tag |
|---|---|---|
| **MARKET** | Execute immediately at best available price | `40=1` |
| **LIMIT** | Execute at specified price or better | `40=2` |
| **STOP** | Trigger a market order when stop price reached | `40=3` |
| **STOP LIMIT** | Trigger a limit order when stop price reached | `40=4` |
| **IOC** | Immediate or Cancel — partial fills allowed | `59=3` |
| **BRACKET** | Entry with attached profit target and stop loss | Proprietary |
| **COVER** | Bracket exit order (profit target or stop loss) | Proprietary |
| **OCO** | One Cancels Other — linked pair of orders | Proprietary |

---

## Product Roadmap

| Release | Features | Target |
|---|---|---|
| **6.4.0** | Greeksoft FIX session redundancy, Token rotation automation | Q3 2026 |
| **6.5.0** | Order slicing (TWAP/VWAP algos), Multi-leg order support | Q4 2026 |
| **7.0.0** | gRPC streaming for order updates, Pluggable broker SDK | Q1 2027 |

---

## Key Design Principles

1. **Determinism** — Every order event is traceable from signal to exchange acknowledgment
2. **Idempotency** — Duplicate signals do not create duplicate orders
3. **Fail-safe** — Kill switch is a hard circuit-breaker; no bypass path exists
4. **Broker agnosticism** — Core order logic is decoupled from broker-specific adapters
5. **Observability** — Every state transition emits metrics, logs, and audit events

---

## Integration Points

| Upstream | Downstream |
|---|---|
| Lakshmi (market data) | XTS (broker) |
| Strategy Factory (signals) | Greeksoft (broker) |
| Ganesh (symbol master) | Audit Store (compliance) |
| Parikshak (risk parameters) | Monitoring Stack (Prometheus/InfluxDB) |

---

## Constraints

- Must operate within BSE/NSE exchange trading hours (09:15–15:30 IST) for equity segments
- FIX logon/logoff must follow exchange session schedules
- Broker credential rotation must happen without order loss during market hours
- All order modifications and cancellations must propagate through FIX within regulatory TAT
- Maximum 2 concurrent broker connections per user per segment
