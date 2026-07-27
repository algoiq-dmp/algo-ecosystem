# Kavach Engine — Glossary

**Version:** 1.8.0 | **Owner:** Risk Operations | **Last Updated:** 2026-07-24

---

## A

| Term | Definition |
|---|---|
| **Alert** | Notification triggered when a monitored metric exceeds a configured threshold |
| **Alert Channel** | Delivery method for alerts — email, SMS, Slack, PagerDuty, webhook |
| **Alert Escalation** | Progressive notification of higher-level stakeholders when an alert remains unacknowledged |

## B

| Term | Definition |
|---|---|
| **Breach** | Event where a monitored metric exceeds its configured threshold value |

## C

| Term | Definition |
|---|---|
| **Circuit Breaker** | Automated mechanism that halts trading activity when predefined risk thresholds are exceeded |
| **Component Health** | Aggregated status (GREEN/YELLOW/RED) of an individual ecosystem component |
| **Critical Alert** | Highest severity notification requiring immediate operator action; typically triggers kill switch |

## D

| Term | Definition |
|---|---|
| **Dashboard** | Real-time visualization of system health, active alerts, and component statuses |
| **Degraded State** | Component operating with reduced functionality (YELLOW) due to partial failures |

## E

| Term | Definition |
|---|---|
| **Emergency Procedure** | Documented step-by-step workflow for operators responding to critical failure scenarios |
| **Escalation Policy** | Rules defining alert routing: who gets notified, in what order, and after what delay |

## F

| Term | Definition |
|---|---|
| **Failover** | Automatic switch to a redundant backup system when the primary system fails |
| **False Positive** | Alert triggered erroneously; no actual breach occurred — important metric for tuning thresholds |

## H

| Term | Definition |
|---|---|
| **Health Check** | Periodic probe (HTTP, TCP, gRPC) verifying that a component is running and responsive |
| **Health Metric** | Quantifiable measurement — CPU, memory, latency, error rate, connection count, queue depth |
| **Heartbeat** | Periodic signal from a component proving it is alive; absence triggers alert |

## K

| Term | Definition |
|---|---|
| **Kavach** | Circuit breaker and kill switch engine — monitors system health and can halt all trading within milliseconds |
| **Kill Switch** | Hard emergency stop that cancels all open orders, rejects new orders, and liquidates positions |

## L

| Term | Definition |
|---|---|
| **Latency Threshold** | Maximum acceptable response time for a health check; breach triggers alert |
| **Log-based Alert** | Alert generated from log pattern matching (e.g., ERROR rate exceeding threshold in 60s window) |

## M

| Term | Definition |
|---|---|
| **Metric** | Time-series data point monitored by Kavach (e.g., `vega.order.latency.p99`, `system.memory.used_percent`) |
| **Monitoring Interval** | Frequency at which Kavach polls or receives health metrics (default: 5 seconds) |

## N

| Term | Definition |
|---|---|
| **Notification** | Delivery of an alert to a configured channel after threshold breach is confirmed |
| **Notification Cooldown** | Minimum time between repeated notifications for the same alert to prevent alert fatigue |

## R

| Term | Definition |
|---|---|
| **Recovery Procedure** | Documented steps to restore normal operations after a kill switch or circuit breaker activation |
| **Redundancy** | Duplication of critical components (N+1) so that failure of one does not cause system outage |

## S

| Term | Definition |
|---|---|
| **Snooze** | Temporarily suppressing an alert for a configurable duration (e.g., during planned maintenance) |
| **Square-Off** | Emergency process of liquidating all open positions to zero; triggered by kill switch activation |

## T

| Term | Definition |
|---|---|
| **Threshold** | Numeric limit for a monitored metric; crossing it triggers an alert (e.g., latency > 100ms) |
| **Throttling** | Rate-limiting alert notifications to prevent flooding operators during cascading failures |
