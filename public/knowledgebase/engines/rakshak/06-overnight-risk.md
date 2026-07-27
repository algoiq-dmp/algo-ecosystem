# 06 — Overnight Risk
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
**Overnight Risk** encompasses all risks specific to holding positions when markets are closed. Unlike intraday risk (managed by Kavach's delta hedging), overnight positions cannot be adjusted until the next open.
## Overnight Risk Components
### 1. Directional Risk
- Unhedged delta exposure during closed hours
- Gap between close and next open cannot be managed
### 2. Event Risk Amplification
- Events (earnings, policy) announced after market close
- Reaction only possible at next open
### 3. Liquidity Risk
- Opening auction may have wide spreads
- First few minutes often have poor liquidity
### 4. Time Decay Continuation
- Theta continues decaying over non-trading hours
- Options lose value without ability to adjust
## Overnight Position Limits
| Risk Profile | Max Position (as % of Day Position) |
|-------------|-------------------------------------|
| Conservative | 25% |
| Moderate | 50% |
| Aggressive | 75% |
| Hedge Fund | 100% (fully hedged for overnight) |
## Overnight Risk Score
Overnight_Risk = 0.35 × Gap_Risk + 0.25 × Event_Risk + 0.20 × Liquidity_Risk + 0.20 × Position_Size_Factor
| Score | Recommendation |
|-------|---------------|
| < 30 | Hold positions |
| 30-55 | Reduce by 25% |
| 55-75 | Reduce by 50% + add hedge |
| > 75 | Close all directional exposure |
## Weekend & Holiday Adjustments
- Weekend: 2x overnight risk factor
- 3-day weekend: 3x factor
- Extended holidays (Diwali, etc.): 4x factor
## Overnight Hedge Strategies
1. **Buy protective puts** at 1-2% OTM
2. **Sell futures** to neutralize delta
3. **Buy VIX futures** as volatility hedge
4. **Cross-asset hedge** in correlated global markets (SGX Nifty overnight)
