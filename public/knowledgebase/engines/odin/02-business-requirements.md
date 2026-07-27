# 02 — Business Requirements

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## BR-1: Multi-Exchange Order Routing

ODIN MUST route orders to NSE (CM, FO, CD), BSE (CM, FO), MCX, and NCDEX exchanges through configured dealer terminal APIs and direct exchange APIs.

## BR-2: Sub-5ms Order Routing

From MQ order reception to exchange API dispatch, latency MUST be under 5 milliseconds (p99). This excludes exchange-internal processing time.

## BR-3: Multi-Path Failover

Each exchange segment MUST have at least two routing paths (e.g., direct API + dealer terminal). If the primary path fails, ODIN MUST automatically fail over to the secondary path within 500ms.

## BR-4: Order Lifecycle Management

ODIN MUST track every order through its complete lifecycle: NEW → VALIDATED → PENDING → OPEN → PARTIALLY_FILLED → COMPLETE / REJECTED / CANCELLED. State transitions must be atomic and auditable.

## BR-5: Execution Report Normalization

Execution reports from heterogeneous sources (dealer terminals, direct APIs, exchange drop copies) MUST be normalized into a single canonical execution report format.

## BR-6: 100% Trade Reconciliation

At end of day, all trades executed through ODIN MUST be reconciled against exchange-provided trade files. Any discrepancy MUST be flagged and investigated before next trading day.

## BR-7: Order Modification and Cancellation

ODIN MUST support in-flight order modification (price, quantity) and cancellation. Modification and cancellation requests must be processed within the same latency SLA as new orders.

## BR-8: Circuit Breaker and RMS Integration

Before routing, every order MUST be validated against exchange circuit filters (price bands, quantity freeze limits) and RMS (Risk Management System) limits. Orders failing validation must be rejected with a descriptive reason code.

## BR-9: Audit Trail

Every order state transition MUST be logged with timestamp, source, destination, and all relevant order fields. Audit trail must be immutable and retained for 5 years.

## BR-10: Rate Limiting

ODIN MUST enforce per-client, per-exchange order rate limits to comply with exchange throttling policies and prevent accidental order floods.
