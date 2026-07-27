# 18 — Suggested Hedge Legs
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
When neutrality drifts, Kavach recommends specific **hedge legs** — the exact instruments, quantities, and strikes to restore delta neutrality at optimal cost.
## Hedge Leg Types
### 1. Futures Hedge (Delta Only)
Fastest, cheapest delta neutralization:
- Buy/Sell index/stock futures
- No gamma/vega impact
- Cost: brokerage + spread
### 2. ATM Option Hedge (Delta + Gamma)
For gamma risk adjustment:
- Buy ATM calls to increase long gamma
- Sell ATM puts to reduce short gamma
### 3. OTM Option Hedge (Delta + Tail Risk)
For vega adjustment and tail protection:
- Buy OTM puts for crash protection
- Sell OTM calls for vega reduction
### 4. Synthetic Hedge
Combine options to create synthetic futures:
- Synthetic Long = Buy Call + Sell Put (same strike)
- Synthetic Short = Sell Call + Buy Put (same strike)
## Hedge Selection Algorithm
1. Calculate required delta adjustment
2. Check futures liquidity -> if deep, use futures
3. If gamma also needs adjustment -> use ATM options
4. If vega also needs adjustment -> use OTM options
5. Compare costs of 2-3 alternatives
6. Recommend cheapest that meets all constraints
## Cost Optimization
Kavach optimizes for:
- Min commission + spread + impact cost
- Max liquidity (Manthan score)
- Roll-friendly instruments (liquid far-month)
