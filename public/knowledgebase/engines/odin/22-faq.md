# 22 — FAQ

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## General

**Q: Why use dealer terminals instead of only direct exchange APIs?**
A: Direct exchange APIs (NSE NEAT, BSE BOLT) offer lower latency but have higher certification requirements and limited availability (not all brokers support them). Dealer terminals (ODIN Diet, Omnesys Nest) are universally available and provide a fallback path. ODIN routes through direct APIs when available and falls back to dealer terminals for resilience.

**Q: How does ODIN handle exchange holidays?**
A: ODIN detects market status from the Feed Server (via MQ) and enters a PAUSED state during holidays. Adapters remain connected but orders are not accepted. Attempts to send orders during holidays are rejected with `MARKET_CLOSED`.

**Q: Can I route orders for the same instrument through different paths?**
A: No. At any given moment, all orders for a given exchange+segment go through the same path (highest priority healthy adapter). This ensures consistent order state tracking.

## Order Management

**Q: What happens if an order is stuck in PENDING state?**
A: PENDING means the order has been sent to the exchange/adapter but no ACK has been received. After `routing.failover_timeout_ms` (default 500ms), ODIN considers the adapter failed and fails over to the secondary path. The original order may be in an unknown state at the exchange — ODIN queries for order status before re-submitting.

**Q: How are order modifications handled?**
A: Modification requests (price change, quantity increase/decrease) are validated like new orders. Only OPEN and PARTIALLY_FILLED orders can be modified. Quantity can only be increased (not decreased below filled quantity).

**Q: What is the maximum order-to-trade ratio?**
A: SEBI mandates a maximum order-to-trade ratio (typically 100:1 for algo trading). ODIN tracks this per client/algo and rejects orders when the ratio exceeds the limit.

## Reconciliation

**Q: When does reconciliation run?**
A: EOD reconciliation runs automatically at 15:45 IST daily. It can also be triggered manually with `odinctl reconcile --date YYYY-MM-DD`.

**Q: What happens if reconciliation finds discrepancies?**
A: A P2 alert is raised via Narad. The Execution desk investigates. Discrepancies must be resolved before the next trading day. Unresolved discrepancies are escalated to P1 at 08:00 IST the next day.

## Development

**Q: How do I add support for a new exchange or dealer terminal?**
A: Implement the `ExchangeAdapter` interface in a new shared library (e.g., `libodin_newadapter.so`). Register it in `config.yaml`. The Order Router will automatically pick it up. See `adapters/README.md` in the source tree for detailed documentation.

**Q: Can I test ODIN without connecting to a real exchange?**
A: Yes. Use the built-in exchange simulator: `odind --simulator --exchange NSE --segment CM`. The simulator accepts orders and returns realistic execution reports. It also generates mock EOD trade files for reconciliation testing.
