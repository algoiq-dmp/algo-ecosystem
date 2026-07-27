# 21 — Troubleshooting

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Diagnostic Commands

```bash
odinctl adapter status                           # All adapter states
odinctl order status --order-id "ORDER_ID"       # Specific order state
odinctl order trace --client-order-id "CLORD001" # Full lifecycle trace
odinctl stats --exchange NSE --period today      # Order statistics
```

## Common Issues

### Issue 1: Adapter Stuck in CONNECTING State

**Symptoms:** `odin_adapter_status == 1` for > 30 seconds.

**Causes:**
- Exchange/dealer terminal server unreachable
- Firewall blocking port
- TLS/FIX handshake failure
- Invalid credentials

**Resolution:**
```bash
# Test network connectivity
telnet 192.168.10.100 9001

# Check adapter logs
grep "adapter.*nse_neat" /var/log/lakshmi/odin/odin.log | tail -20

# Verify credentials
odinctl adapter test-auth --adapter nse_neat_primary

# Restart adapter
odinctl adapter restart --adapter nse_neat_primary
```

### Issue 2: Orders Being Rejected

**Symptoms:** `odin_orders_rejected_total` increasing.

**Resolution:**
```bash
# Check rejection reasons
odinctl stats rejections --period today

# Common reasons and fixes:
# PRICE_OUTSIDE_BAND: order price outside exchange circuit filter
# INVALID_SYMBOL: symbol not in symbol master; check symbol spelling
# RMS_LIMIT_EXCEEDED: position/margin limit; check with risk desk
# RATE_LIMITED: client exceeding order rate; reduce order frequency
# LOT_SIZE_MISMATCH: quantity not in lot multiples
```

### Issue 3: EOD Reconciliation Discrepancies

**Symptoms:** `odin_reconciliation_status == 3`.

**Resolution:**
```bash
# View reconciliation report
odinctl reconcile report --date 2026-07-25 --format text

# Common discrepancy types:
# MISSING_IN_EXCHANGE: trade in ODIN but not in exchange file
#   → Check if order was simulated or routed to wrong exchange
# MISSING_IN_ODIN: trade in exchange file but not in ODIN
#   → Could be a manual trade placed directly on dealer terminal
#   → Or ODIN missed the execution report
# PRICE_MISMATCH: price differs between ODIN and exchange
#   → Investigate timestamp alignment issue

# Manual fix: import missing trade into ODIN
odinctl reconcile import-missing --date 2026-07-25 --exchange NSE
```

### Issue 4: High Order Routing Latency

**Symptoms:** `odin_order_routing_latency_ms` p99 > 10ms.

**Causes:**
- RMS engine slow to respond
- Network congestion to exchange
- Database write contention

**Resolution:**
```bash
# Check per-stage latency breakdown
odinctl diag latency-breakdown

# If RMS slow: check RMS engine health; enable RMS response caching
# If network: check exchange network path; traceroute to exchange IP
# If DB: check PostgreSQL slow query log
```

### Issue 5: Duplicate Orders

**Symptoms:** Exchange reports duplicate order error.

**Causes:**
- Adapter timeout but exchange accepted the order
- Retry mechanism re-submitting without checking first order state

**Resolution:**
```bash
# Check for duplicate client_order_ids
odinctl order find-duplicates --client "hanuman01" --date today

# If duplicate found, cancel the newer order
odinctl order cancel --order-id "DUPLICATE_ORDER_ID"

# Adjust adapter timeout settings if needed
odinctl config get --key routing.failover_timeout_ms
```
