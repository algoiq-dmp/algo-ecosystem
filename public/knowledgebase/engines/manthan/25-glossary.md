# Manthan Engine — Glossary

**Version:** 1.0.0 | **Owner:** Market Intelligence | **Last Updated:** 2026-07-24

---

## A

| Term | Definition |
|---|---|
| **Anomaly Detection** | Statistical technique identifying data points or patterns that deviate significantly from expected behavior |
| **AUC-ROC** | Area Under the Receiver Operating Characteristic Curve — metric measuring regime classifier discrimination ability |

## B

| Term | Definition |
|---|---|
| **Bear Market** | Regime characterized by sustained price decline, high volatility, and negative sentiment |
| **Bull Market** | Regime characterized by sustained price appreciation, moderate volatility, and positive momentum |

## C

| Term | Definition |
|---|---|
| **Churning** | Market condition with high trading volume but minimal directional price movement; often a regime transition signal |
| **Classification Model** | Supervised ML model that assigns a market regime label to current market conditions |
| **Confidence Score** | Numeric value (0-100) indicating how certain Manthan is about its regime classification |
| **Correlation Matrix** | Pairwise correlation table across sectors/indices used to detect rotation and divergence |

## D

| Term | Definition |
|---|---|
| **Decision Tree** | ML model using a tree-like graph of decisions; used in Manthan's ensemble for regime classification |
| **Divergence** | Situation where price direction disagrees with an indicator (e.g., price rising, RSI falling) |

## E

| Term | Definition |
|---|---|
| **Ensemble Model** | Combining predictions from multiple ML models (decision tree, random forest, gradient boosting) for higher accuracy |
| **Equity Curve** | Visual plot of cumulative P&L over time; Manthan analyzes its shape for regime shifts |

## F

| Term | Definition |
|---|---|
| **Feature Importance** | Quantitative measure of how much each input feature contributes to the regime classification decision |
| **Feature Vector** | Array of numeric values representing market state at a point in time — input to the classification model |

## H

| Term | Definition |
|---|---|
| **High Volatility Regime** | Market state where price swings are large and unpredictable; strategies may reduce position sizes |
| **Historical Regime** | Archived regime classification label for a past time period; used for backtesting and model training |

## L

| Term | Definition |
|---|---|
| **Low Volatility Regime** | Market state characterized by small, predictable price movements; range-bound trading environment |
| **Label** | The ground-truth regime class assigned to a training sample (e.g., "trending-up", "mean-reverting", "volatile") |

## M

| Term | Definition |
|---|---|
| **Manthan** | Market Churning Intelligence Engine — classifies real-time market conditions into tradable regime labels |
| **Mean Reversion** | Regime where price tends to return to a historical average; suitable for range-bound strategies |
| **Momentum** | Rate of price change; high momentum signals trending regime, low momentum signals choppy market |
| **Multi-Timeframe** | Regime analysis across multiple bar intervals (5min, 15min, 1hr, daily) for layered classification |

## R

| Term | Definition |
|---|---|
| **Regime** | A distinct market condition defined by volatility, trend direction, and correlation characteristics |
| **Regime Shift** | Transition from one market regime to another; triggers strategy reconfiguration or risk adjustment |
| **Rotation** | Capital movement from one sector/index to another; detected by correlation and relative strength analysis |

## S

| Term | Definition |
|---|---|
| **Sector Analysis** | Per-sector regime classification (Banking, IT, Pharma, etc.) alongside broad market regime |
| **Signal Strength** | Magnitude indicator of how strongly the current market conforms to the classified regime |

## T

| Term | Definition |
|---|---|
| **Trending Regime** | Market state with persistent directional movement; breakout and trend-following strategies perform well |
| **Transition Probability** | Likelihood of moving from current regime to a different regime in the next time step |

## V

| Term | Definition |
|---|---|
| **VIX Proxy** | India VIX or computed implied volatility measure used as a key input feature for regime classification |
| **Volume Profile** | Distribution of traded volume across price levels; used to detect accumulation/distribution regimes |
