# TalkOptions — Overview

**Version:** 4.7.2 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## What Is TalkOptions?

TalkOptions is an enterprise-grade options analytics engine that serves as the centralized computation hub for all options-derived data in the Algo IQ ecosystem. It ingests raw market data (OHLC, live prices, BOD/EOD data) from Ganesh, MQ, and Surya, then computes and publishes over 150 REST API endpoints covering option chains, Greeks, implied volatility, open interest, PCR ratios, and Max Pain levels.

## Why Was It Built?

Before TalkOptions, each downstream engine independently computed options analytics, leading to inconsistent results and redundant computation. TalkOptions was built to provide a single source of truth for all options analytics, eliminating data inconsistency and reducing CPU load across the ecosystem.

## Business Objective

Provide accurate, real-time options analytics to power market screeners (Delta XI, VYUH, SpreadWatch), strategy dashboards (TalkDelta), call analytics (AALAP Calls), and simulation platforms (Simulator). Acts as the analytics backbone for all options-dependent decision-making.

## Scope

- 150+ REST API endpoints
- Options chain computation for all expiry series
- Greeks calculation (Binomial/Black-Scholes models)
- IV surface and volatility smile computation
- OI buildup and PCR trend analysis
- Max Pain and expiry analytics
