# 15 — Input: Lakshmi Live Prices
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## Overview
Kavach requires **Lakshmi tick-level data** for real-time Greek calculation. Every tick triggers a delta recomputation for all related option positions.
## Data Requirements
| Field | Greek | Criticality |
|-------|-------|-------------|
| Underlying LTP | Delta, Gamma | Critical |
| Option LTP | All Greeks (via BS model) | Critical |
| Bid/Ask | Realistic pricing | High |
| IV (from options) | Vega, Theta calculation | High |
| Time to expiry | Theta, Gamma | Critical |
| Interest rate | Rho (minor) | Low |
## Latency Requirements
- Max allowable tick-to-Greek latency: 25ms
- Target: < 10ms (C++ engine)
- Buffer for microbursts: 50ms
## Tick Processing
Each underlying tick triggers:
1. BS Greek recalculation for all options on that underlying
2. Strategy-level greek aggregation
3. Threshold comparison
4. Adjustment trigger evaluation (if needed)
## Throughput
Kavach handles 200+ underlying ticks/sec with 5000+ option positions active.
