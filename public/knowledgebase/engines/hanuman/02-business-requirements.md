# 02 — Business Requirements

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## BR-1: 2-Leg Strategy Support

The system MUST support execution strategies involving exactly two instruments (legs), with configurable hedge ratios and leg-level parameters.

## BR-2: Vega Framework Integration

All strategies MUST be defined using the Vega strategy definition language and managed through the Vega lifecycle (load, start, pause, resume, stop, unload).

## BR-3: Sub-100us Signal-to-Order

From the moment a spread crosses the entry threshold to the time paired orders are dispatched to ODIN, latency MUST be under 100 microseconds (p99).

## BR-4: Fill Ratio Maintenance

When one leg fills partially, the system MUST adjust the unfilled leg quantity to maintain the target hedge ratio. If adjustment is impossible (e.g., lot size constraints), the system MUST attempt to hedge the completed leg.

## BR-5: Pre-Trade Risk Checks

Before any order is dispatched, the system MUST validate: position limits, margin availability, maximum order value, maximum daily loss, and circuit breaker status.

## BR-6: Auto-Hedging on Leg Failure

If one leg of a strategy is completely filled and the other leg is rejected or times out, the system MUST automatically generate a hedge order (market order) to flatten the position on the completed leg.

## BR-7: Real-Time P&L

The system MUST calculate and publish real-time P&L per strategy instance, updated on every fill. P&L must include both realized (filled) and unrealized (open position mark-to-market) components.

## BR-8: Strategy Concurrency

A single Hanuman instance MUST support at least 500 concurrently running strategy instances across multiple instruments and strategy types.

## BR-9: Audit Trail

Every strategy decision (entry signal, order dispatch, fill, exit signal, hedge) MUST be logged with timestamp, instrument identifiers, quantities, prices, and decision rationale for regulatory audit.

## BR-10: Configurable Risk Controls

Strategy-level risk parameters (max position, max order value, max daily loss, max slippage) MUST be configurable per strategy and enforceable in real-time.
