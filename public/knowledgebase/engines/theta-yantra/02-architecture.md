# Theta Yantra — Architecture

**Version:** 3.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Architecture Overview

Theta Yantra is built around two specialized modules:

- **theta-yantra-pricing:** Theoretical pricing engine supporting multiple models: Black-Scholes (baseline), Binomial Tree, Monte Carlo simulation, and SABR stochastic volatility. Uses GPU acceleration (CUDA) for Monte Carlo paths and surface interpolation. Computes theoretical option prices and compares with market prices to detect mispricing.
- **theta-yantra-greeks:** Advanced Greeks computation module. Calculates standard Greeks (Delta, Gamma, Theta, Vega, Rho) plus higher-order Greeks (Vanna, Volga, Charm, Speed, Color, Zomma). Publishes results via REST API and persists to TimescaleDB for historical analysis.

## Data Flow

```
Ganesh (OHLC) ──┐
MQ (Market Data) ─┴──> theta-yantra-pricing ──> GPU (CUDA)
                              │                        │
                              ├──> theta-yantra-greeks ──> TimescaleDB
                              │
                              └──> REST API ──> TalkOptions, TalkDelta
```

1. Raw market data ingested from Ganesh and MQ
2. Pricing engine computes theoretical values using GPU acceleration
3. Greeks module calculates sensitivities and higher-order metrics
4. Results published to TalkOptions and TalkDelta via REST
