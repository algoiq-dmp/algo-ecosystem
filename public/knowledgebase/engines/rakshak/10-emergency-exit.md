# 10 — Emergency Exit
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
The **Emergency Exit** module provides rapid, automated position liquidation when risk exceeds critical thresholds. It pre-computes exit strategies and executes them via KuberAlpha with priority routing.
## Trigger Conditions
| Trigger | Condition | Priority |
|---------|-----------|----------|
| Fat-Finger/Anomaly | P&L drop > 5% in 5 min | IMMEDIATE |
| Circuit Breaker | Market-wide circuit hit | IMMEDIATE |
| Neutrality Collapse | Kavach neutrality < 10% | IMMEDIATE |
| Risk Score Critical | Rakshak composite > 85 | HIGH |
| Broker Disconnect | Order connection lost | CRITICAL |
| Data Feed Loss | No price data > 60s | HIGH |
## Exit Strategy
For each open position, Rakshak pre-computes:
1. **Market Order Exit:** Fastest, some slippage. For emergencies.
2. **Limit Order Exit:** Better price, slower. For non-critical exits.
3. **Hedge-and-Hold:** Buy protective options instead of closing. For illiquid positions.
## Exit Priority Queue
| Priority | Position Type | Exit Method | Max Slippage |
|----------|--------------|-------------|-------------|
| 1 | Short options (unlimited risk) | Market order | 2% |
| 2 | Futures (leveraged) | Market order | 1% |
| 3 | Long options (limited risk) | Limit order | N/A |
| 4 | Cash equity | Limit order | 0.5% |
## Emergency Exit Flow
1. Trigger condition detected
2. Rakshak generates exit orders for all affected positions
3. Sends EXIT signal directly to KuberAlpha (bypasses normal queue)
4. KuberAlpha routes MARKET orders to exchange
5. Confirms fills back to Rakshak
6. Post-exit analysis: slippage, completeness, recovery plan
## Exit Lockout
After emergency exit, Rakshak enforces a cooldown:
- 15-minute trading lockout (prevent re-entry in panic)
- Review of what triggered the exit
- Manual override required to resume trading
