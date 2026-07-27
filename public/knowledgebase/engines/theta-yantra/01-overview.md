# Theta Yantra — Overview

**Version:** 3.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## What Is Theta Yantra?

Theta Yantra is the advanced options analytics engine that provides sophisticated pricing models, higher-order Greeks, and volatility surface construction beyond what TalkOptions offers. It uses GPU-acceleration for compute-intensive calculations — including SABR and SVI stochastic volatility models, exotic option sensitivities, and multi-dimensional surface interpolation.

## Why Was It Built?

TalkOptions provides standard Black-Scholes Greeks and IV. Theta Yantra was built to handle advanced use cases: stochastic volatility modeling, exotic Greek sensitivities, and high-frequency volatility surface updates that require GPU-accelerated computation.

## Business Objective

Deliver advanced options analytics — theoretical pricing, advanced Greeks, and volatility surfaces — to TalkOptions and TalkDelta. Enable sophisticated trading strategies that depend on accurate volatility modeling and exotic sensitivities.

## Scope

- Advanced Greeks (Vanna, Volga, Charm, Speed, Color, Zomma)
- Theoretical pricing with Binomial, Monte Carlo, and stochastic models
- Volatility surface modeling (SABR, SVI parameterization)
- GPU-accelerated computation pipeline
- Real-time and historical options analytics delivery
