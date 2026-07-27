# 12 — Consumer: Vega
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
**Vega** is the options strategy management engine. It consumes Kavach's Greek monitoring for strategy optimization, strike selection, and adjustment execution.
## Data Consumed
| Kavach Output | Vega Application |
|---------------|-----------------|
| Live Greeks (all 4) | Options strategy health dashboard |
| Gamma Monitoring | Gamma scalp signal generation |
| Theta Tracking | Daily decay target monitoring |
| Vega Exposure | IV risk management |
| Adjustment Signals | Options-specific hedge recommendations |
## Vega-Specific Adjustments
When Kavach recommends an options-based hedge:
- **Strike Selection:** Vega uses Suchak S/R levels to pick optimal strikes
- **Expiry Selection:** Vega chooses between weekly/monthly based on theta efficiency
- **Ratio Adjustment:** Vega can recommend ratio spreads to fix gamma/vega at lower cost
## Strategy Optimization
Vega uses Kavach's Greek data to optimize strategies:
- Roll strikes when delta drifts beyond budget
- Widen strikes when gamma spikes
- Add legs for vega hedging
- Calendarize when theta decay slows
## Integration
Vega subscribes to Kavach's gRPC stream for real-time Greek updates per strategy and adjustment signals.
