# 25 — Glossary

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## A

**Auto-Hedge:** Automatic generation of a closing order for a completed leg when the paired leg fails to execute. Prevents open/unhedged positions.

## B

**Backtesting:** Running a strategy against historical market data to evaluate performance before live deployment.

**Beta (Hedge Ratio):** The ratio at which two instruments are traded to create a market-neutral position. Leg2 quantity = Leg1 quantity / Beta.

## C

**Calendar Spread:** A strategy involving simultaneous buy and sell of futures contracts on the same underlying but different expiry months.

**Circuit Breaker:** An automatic risk control that pauses a strategy after a configurable number of consecutive losses.

**Cross-Exchange Arbitrage:** Exploiting price differences for the same instrument listed on different exchanges.

## F

**Fill Ratio:** The proportion of submitted orders that result in fills. Low fill ratio indicates orders priced too aggressively or market moving away.

**Fill Tracker:** Component that monitors execution reports and manages partial fills across both legs.

## H

**Hedge Ratio:** See Beta.

## I

**Inter-Commodity Spread:** A spread strategy involving two different but related commodities (e.g., gold vs silver).

## L

**Leg:** One side of a spread trade. A 2-leg strategy has Leg 1 (typically the "buy" side) and Leg 2 (typically the "sell" side).

**LTP (Last Traded Price):** The most recent price at which an instrument traded.

## M

**Mark-to-Market (MTM):** Valuing open positions at current market prices to calculate unrealized P&L.

**Market Impact:** The effect of a trade on the market price. Large orders can move prices unfavorably.

## O

**OCO (One-Cancels-Other):** An order linkage where filling one order automatically cancels the paired order. Used to prevent double-fills in spread strategies.

## P

**Pair Trade:** A market-neutral strategy involving a long position in one stock and a short position in a correlated stock.

**Partial Fill:** When only part of an order quantity is executed. Requires adjustment of the paired leg to maintain the hedge ratio.

## R

**Risk Veto:** Rejection of a trade signal by the Risk Validator due to violation of risk parameters (position limit, margin, etc.).

## S

**Signal:** A decision output from the strategy engine: ENTRY, EXIT, or HEDGE.

**Slippage:** The difference between the expected price of a trade and the price at which it is actually executed.

**Spread:** The price difference between two instruments, calculated as Price(Leg1) - Price(Leg2) * HedgeRatio.

**Strategy Instance:** A single running copy of a strategy definition with specific parameter values and a unique ID.

## V

**Vega:** The Lakshmi Strategy Definition Language and framework used to define and manage algorithmic trading strategies.

**Vega DSL:** Domain-Specific Language for defining trading strategies in Vega. C-like syntax with strategy-specific constructs.

## Z

**Z-Score:** A statistical measure indicating how many standard deviations a value is from the mean. Used in pair trading to identify extreme spread deviations.
