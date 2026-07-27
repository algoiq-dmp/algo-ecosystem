---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 05 — Low-Level Design

## Core Class Architecture

The Garuda Margin Engine is built around five core computational classes that form the margin calculation pipeline. Each class operates on position data and SPAN parameters, producing intermediate results that are aggregated by the Portfolio Aggregator.

```
┌───────────────────┐    ┌───────────────────┐
│ SpanCalculator    │    │ ExposureCalculator │
│ - BuildSceanrios  │    │ - GetElmRate      │
│ - ComputeRiskArr  │    │ - GetAdhocRate    │
│ - ScanRisk        │    │ - IsGSMSecurity   │
│ - InterMthSprd    │    │ - IlliquidVarRate │
│ - ShortOptMin     │    └─────────┬─────────┘
└────────┬──────────┘              │
         │                         │
         └──────────┬──────────────┘
                    ▼
         ┌───────────────────┐
         │ PortfolioAggregatr│
         │ - Aggregate       │
         │ - CalSpreadBenefit│
         │ - PortfolioBenefit│
         │ - PeakMarginTrak  │
         └─────────┬─────────┘
                   │
      ┌────────────┼────────────┐
      ▼            ▼            ▼
┌───────────┐ ┌───────────┐ ┌───────────┐
│ Strategy  │ │ Hedge     │ │ Margin    │
│ Engine    │ │ Optimizer │ │ Intel.    │
└───────────┘ └───────────┘ └───────────┘
```

## 1. SpanCalculator

### Responsibility
Computes SPAN margin per combined commodity group using 16 risk scenarios defined by exchange parameters (PSR, VSR).

### Key Methods

| Method | Description |
|---|---|
| `Calculate(positions, params, prices) → SpanResult` | Main entry: computes total SPAN for a combined commodity |
| `BuildScenarioPrices(price, psr, vsr) → decimal[16][]` | Generates 16 price-volatility scenarios |
| `ComputeRiskArrays(positions, scenarios) → RiskArray[]` | P&L per position across all 16 scenarios |
| `ComputeScanningRisk(combinedArray) → decimal` | Max loss = MAX(0, -MIN(risk_array[1..16])) |
| `ComputeInterMonthSpread(arrays, params) → decimal` | Calendar spread charge = units × rate × lot_size |
| `ComputeShortOptionMinimum(positions, params) → decimal` | Floor for net short option positions |
| `ApplyCompositeDelta(positions, params) → decimal` | Net effective exposure to underlying |

### 16 SPAN Scenarios

| # | Price Change | Vol Change | Weight |
|---|---|---|---|
| 1 | 0 | +VSR | 1.00 |
| 2 | 0 | -VSR | 1.00 |
| 3 | +1/3 PSR | +VSR | 1.00 |
| 4 | +1/3 PSR | -VSR | 1.00 |
| 5 | -1/3 PSR | +VSR | 1.00 |
| 6 | -1/3 PSR | -VSR | 1.00 |
| 7 | +2/3 PSR | +VSR | 1.00 |
| 8 | +2/3 PSR | -VSR | 1.00 |
| 9 | -2/3 PSR | +VSR | 1.00 |
| 10 | -2/3 PSR | -VSR | 1.00 |
| 11 | +3/3 PSR | +VSR | 1.00 |
| 12 | +3/3 PSR | -VSR | 1.00 |
| 13 | -3/3 PSR | +VSR | 1.00 |
| 14 | -3/3 PSR | -VSR | 1.00 |
| 15 | +2×PSR | Unchanged | 0.35 |
| 16 | -2×PSR | Unchanged | 0.35 |

### SPAN Formula
```
SPAN = MAX(ScanningRisk + InterMonthSpreadCharge, ShortOptionMinimum) + SpotMonthCharge
```

## 2. ExposureCalculator

### Responsibility
Computes Exposure Margin (ELM + Adhoc) for all position types across exchanges.

### Key Methods

| Method | Description |
|---|---|
| `Calculate(positions, exchange, prices) → ExposureResult` | Total exposure across all positions |
| `GetElmRate(symbol, exchange) → decimal` | Base ELM rate (2-3% index, 5-20%+ stocks) |
| `GetAdhocRate(symbol, exchange) → decimal` | Additional adhoc for GSM securities |
| `GetIlliquidVarRate(symbol) → decimal` | VAR-based rate for illiquid securities |
| `IsGSMSecurity(symbol) → (bool, int stage)` | Check GSM stage (I-VI) |

### Exposure Formula
```
Exposure_Margin = Σ(Position_Value × (ELM_Rate% + Adhoc_Rate%))
Position_Value = |Quantity| × Lot_Size × Market_Price
```

## 3. StrategyMarginEngine

### Responsibility
Identifies recognized option strategies from individual positions and computes strategy-level margins, which may be lower than the sum of individual leg margins.

### Supported Strategies
50+ predefined strategies including: Straddle, Strangle, Butterfly, Condor, Calendar Spread, Ratio Spread (1:2, 1:3), Iron Condor, Iron Butterfly, Jade Lizard, Back Spread, Box Spread, Covered Call, Protective Put, Diagonal Spread.

### Key Methods

| Method | Description |
|---|---|
| `RecognizeStrategy(positions) → Strategy` | Identify strategy from position combinations |
| `CalculateStrategyMargin(strategy) → MarginResult` | Strategy-level margin with benefits |
| `GetMaxLoss(strategy) → decimal` | Maximum loss = width × lots - net premium |
| `BuildPayoffDiagram(strategy) → PayoffData` | P&L at various underlying prices |

## 4. HedgeOptimizer

### Responsibility
Analyzes portfolio risk exposures and recommends hedge trades to reduce margin requirements.

### Key Methods

| Method | Description |
|---|---|
| `OptimizeAsync(request) → HedgeOptimizationResult` | Generate ranked hedge recommendations |
| `ComputePortfolioGreeks(positions) → PortfolioGreeks` | Net Delta, Gamma, Vega, Theta |
| `FindHedgeCandidates(greeks, constraints) → List<Hedge>` | Find eligible hedge instruments |
| `SimulateHedgeImpact(portfolio, hedge) → MarginImpact` | Model margin effect of adding hedge |
| `CalculateHedgeRatio(delta, instrument) → decimal` | Optimal hedge quantity |
| `RankHedges(hedges, goal) → List<RankedHedge>` | Sort by MINIMIZE_MARGIN / DELTA_NEUTRAL / COST_EFFICIENT |

## 5. PortfolioAggregator

### Responsibility
Aggregates individual position margins into portfolio-level, client-level, and broker-level totals. Applies cross-product netting and tracks peak margins.

### Key Methods

| Method | Description |
|---|---|
| `Aggregate(span, exposure, benefits, nov) → PortfolioMargin` | Compute final total margin |
| `AggregateBySegment(span, exposure, segment) → decimal` | Segment-level rollup |
| `ComputePeakMargin(client, date) → decimal` | MAX intraday margin snapshot |
| `ApplyPortfolioBenefit(commodityMargins) → decimal` | Cross-commodity correlation credit |
| `ComputeCrossCommodityCredit(c1, c2, corr) → decimal` | ρ × MIN(SPAN_1, SPAN_2) |

### Portfolio Benefit Cap
```
Portfolio_Benefit = MIN(Correlation_Credit, MAX(SPAN_i) × 0.50)
Correlation_Credit = Σ Σ(ρ_ij × MIN(SPAN_i, SPAN_j))
```

### Final Margin Formula
```
Final_Margin = SPAN (after calendar benefit + portfolio benefit)
             + Exposure_Margin
             + Net_Option_Value
             + Delivery_Margin (if expiry week)
             + Special_Margin (exchange-directed)
```
