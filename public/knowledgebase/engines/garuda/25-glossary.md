---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 25 — Glossary

## A

**Adhoc Margin**
Additional margin rate imposed by exchanges on specific securities under GSM (Graded Surveillance Measure) or exchange directives. Typically 50-100% for GSM Stage II+.

**ATM (At-The-Money)**
An option whose strike price equals or is very close to the current price of the underlying asset.

---

## B

**Bhavcopy**
End-of-day file published by exchanges containing closing/settlement prices for all securities. Used for mark-to-market calculations.

**Black-Scholes Model**
Mathematical model used to price European-style options. Formula: `C = S₀N(d₁) - Ke^(-rT)N(d₂)` for calls; `P = Ke^(-rT)N(-d₂) - S₀N(-d₁)` for puts.

**Broker ID**
Unique identifier for each broker tenant in the Garuda multi-tenant architecture. All data is scoped and partitioned by `broker_id`.

**Butterfly**
Options strategy using three strike prices: Buy 1 low strike, Sell 2 middle strike, Buy 1 high strike (or reverse). Margin = max loss of structure.

---

## C

**Calendar Spread**
Offsetting positions in the same underlying across different expiry months. Benefit reduces total margin but is removed 3 days before near-month expiry.

**Calendar Spread Benefit**
Margin reduction for recognized calendar spreads: `Units × Benefit_Rate × Lot_Size`. Capped at margin of the covered leg.

**Call Option (CE)**
Grants the buyer the right (but not obligation) to buy the underlying at the strike price on or before expiry.

**Combined Commodity**
In SPAN, a group of related contracts (same underlying) within which scanning risk is computed. All NIFTY futures and options form one combined commodity.

**Composite Delta**
SPAN-calculated effective exposure to the underlying. Futures: 1.0. Options: Black-Scholes delta. Used for portfolio-level risk assessment and spread benefit calculation.

**Contract Master**
Exchange-published database of all listed securities: symbol, lot size, tick size, expiry dates, strike prices. Used for position validation.

**CP Code**
Clearing Participant code assigned by the exchange. Part of broker exchange configuration.

**Cross-Margining**
Offsetting margin across related positions in different markets (e.g., equity futures + equity cash market). Provides margin benefit when positions offset.

**CVA (Credit Valuation Adjustment)**
Adjustment to derivative pricing to account for counterparty credit risk.

---

## D

**Delivery Margin**
Escalated margin (40-50% of contract value) applied during the last week before contract expiry. Ensures the trader can take/give physical delivery.

**Delta (Δ)**
Rate of change of option price with respect to underlying price. Call delta: 0 to 1. Put delta: -1 to 0.

**Delta-Neutral**
Portfolio constructed so total delta equals zero, meaning it is insensitive to small underlying price changes.

---

## E

**ELM (Extreme Loss Margin)**
Standard exposure margin rate applied to all positions. ~2-3% for index derivatives, 5-20%+ for stocks.

**EOD (End of Day)**
Post-market batch process that computes final margins using settlement prices for regulatory and reconciliation purposes.

**Expected Shortfall (CVaR)**
Average loss beyond the VaR threshold. Measures expected loss in worst-case scenarios.

**Exposure Margin**
Additional margin beyond SPAN: `Position_Value × (ELM_Rate% + Adhoc_Rate%)`. Calculated on gross position value, not netted.

**Expiry Date**
The last trading day for a derivatives contract. Positions not closed by expiry may result in physical delivery (stock derivatives) or cash settlement (index derivatives).

---

## G

**Gamma (Γ)**
Rate of change of delta with respect to underlying price. Measures delta stability. Negative gamma positions become more short as price falls.

**Greeks**
Risk measures for options: Delta, Gamma, Theta, Vega, Rho. Quantify sensitivity to price, time, volatility, and interest rates.

**GSM (Graded Surveillance Measure)**
SEBI/Exchange mechanism to monitor unusually high price movement. Stage II+ attracts 50-100% additional adhoc margin.

---

## H

**Hedge Optimizer**
AI-powered engine that analyzes portfolio risk exposures and recommends offsetting trades to reduce margin requirements.

**Hedge Ratio**
The quantity of a hedging instrument needed to offset risk: `Hedge_Qty = -Delta_Portfolio / Delta_Hedge`.

---

## I

**Initial Margin**
Margin required to open a new position (typically SPAN + Exposure). Compare with Maintenance Margin (70-80% of initial).

**Inter-Commodity Spread Credit**
Credit for offsetting positions across different but correlated combined commodities. NIFTY ↔ BANKNIFTY with ρ = 0.85.

**Intraday Margin**
Margin computed with intraday prices (LTP) for positions intended to be squared off within the same session. May be lower than overnight margin.

**Iron Condor**
Neutral strategy: Sell OTM put spread + Sell OTM call spread. Profits when underlying stays within defined range. Defined risk, limited reward.

**ITM (In-The-Money)**
Call: underlying > strike. Put: underlying < strike. ITM options have intrinsic value.

---

## L

**Lot Size**
Standardized contract quantity. NIFTY: 50, BANKNIFTY: 30 (varies by exchange circular). Margin computed per lot.

**LTP (Latest Traded Price)**
Most recent traded price. Used for intraday margin calculations.

---

## M

**Maintenance Margin**
Minimum margin to be maintained while position is open. Typically 70-80% of Initial Margin. Breach triggers margin call.

**Margin Call**
Notification from broker requiring additional funds when available margin falls below required margin. Must be met within specified timeframe.

**Mark-to-Market (MTM)**
Daily settlement of unrealized profit/loss. MTM = (Closing Price - Trade Price) × Quantity × Lot Size. Profit credited; loss debited.

**Monte Carlo Simulation**
VaR method generating thousands of random price paths to estimate loss distribution. Used for 30-day margin forecasting.

**MTF (Multiplier Factor)**
Contract multiplier override. Defaults to lot size from contract master. Used for non-standard position sizes.

---

## N

**Net Option Value (NOV)**
`Market_Value_of_Long_Options - Market_Value_of_Short_Options`. Negative NOV (net short) is added to margin. Positive NOV may provide limited credit.

**NIFTY**
NSE benchmark index of 50 large-cap stocks. Most actively traded derivatives underlying in India.

---

## O

**OTM (Out-of-The-Money)**
Call: underlying < strike. Put: underlying > strike. OTM options have no intrinsic value, only time value.

---

## P

**Peak Margin**
Maximum margin requirement at any point during a trading day. SEBI mandates brokers collect peak margin upfront. Tracked at 15-minute intervals.

**Portfolio Benefit**
Cross-commodity correlation credit: `MIN(ρ × MIN(SPAN₁, SPAN₂), MAX(SPAN₁, SPAN₂) × 50%)`. Available for NIFTY-BANKNIFTY with ρ=0.85.

**Premium**
Option price: the amount buyer pays and seller receives. Premium received from short options is blocked until position closure.

**Price Scan Range (PSR)**
Maximum expected one-day price movement for an underlying. Set by exchange: ~3% for NIFTY, 4-5% for BANKNIFTY.

**PSR (see Price Scan Range)**

**Put Option (PE)**
Grants the buyer the right (but not obligation) to sell the underlying at the strike price on or before expiry.

---

## R

**RBAC (Role-Based Access Control)**
Six predefined roles: SuperAdmin, BrokerAdmin, RiskManager, Dealer, Viewer, APIUser. Fine-grained permissions at API endpoint level.

**Rho (ρ)**
Rate of change of option price with respect to risk-free interest rate. Generally small impact for short-dated options.

**Risk Array**
16-element array of P&L values for a position under each SPAN scenario. Scanning risk = MAX(0, -MIN(RiskArray)).

**RPO (Recovery Point Objective)**
Maximum acceptable data loss measured in time. Garuda target: <1 minute.

**RTO (Recovery Time Objective)**
Maximum acceptable time to restore service after failure. Garuda target: <5 minutes.

---

## S

**Scanning Risk**
Maximum loss across all 16 SPAN scenarios: `MAX(0, -MIN(combined_risk_array))`. Primary component of SPAN margin.

**SEBI (Securities and Exchange Board of India)**
Regulatory body governing Indian securities markets. All Garuda margin calculations comply with SEBI circulars.

**Short Option Minimum (SOM)**
Floor charge for net short option positions. `SOM = number_of_short_lots × minimum_charge × lot_size`. Applied even if scanning risk is lower.

**SPAN (Standardized Portfolio Analysis of Risk)**
Portfolio-based margin system developed by CME, adopted by Indian exchanges. Evaluates risk across 16 scenarios of price and volatility changes.

**SPAN File**
Exchange-published file containing PSR, VSR, composite deltas, spread charges for all underlyings. Updated 6x daily by NSE.

**Spot Month Charge**
Additional margin for positions in the spot expiry month. Applied on top of standard SPAN margin.

**Spread Benefit**
Margin reduction for recognized spread strategies (Bull Call, Bear Put, Iron Condor, Butterfly, etc.). Combined margin < sum of standalone margins.

**Stress Testing**
Evaluating portfolio margin under extreme market scenarios (±5%, ±10%, ±20% price shocks). Used for risk management, not regulatory margin.

---

## T

**Tender Period Margin**
Additional margin on commodity futures during physical delivery window. Applied when contract enters delivery period.

**Theta (Θ)**
Rate of time decay of option price. Option sellers benefit from positive theta (time erosion).

**TM Code**
Trading Member code assigned by exchange. Part of broker exchange configuration.

---

## U

**UCC (Unique Client Code)**
Exchange-assigned identifier mapping broker's internal client codes to exchange-recognized client identifiers.

**Underlying**
The asset on which a derivative contract is based. Examples: NIFTY index, RELIANCE stock, GOLD commodity.

---

## V

**VaR (Value at Risk)**
Statistical estimate of maximum potential loss over a specified horizon at a given confidence level. `VaR₁₋α = μ - zα × σ`.

**Vega (ν)**
Rate of change of option price with respect to implied volatility. Higher vega = more sensitive to volatility changes.

**Volatility Scan Range (VSR)**
Maximum expected one-day change in implied volatility. Used in SPAN scenario generation. Typically 20-25% of current volatility.

**VSR (see Volatility Scan Range)**

---

## W

**WCL (Worst Case Loss)**
Maximum potential loss under extreme stress scenarios: ±10% equity, ±15% commodity, ±8% currency. Used for risk reporting.

**Webhook**
HTTP callback mechanism for asynchronous event notifications (margin breaches, EOD completion, file processing status).
