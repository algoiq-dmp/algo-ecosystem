# SpreadWatch — Overview

**Version:** 2.8.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## What Is SpreadWatch?

SpreadWatch is a real-time spread analytics engine focused on detecting mispricing and arbitrage conditions across pairs, calendar spreads, and multi-leg option strategies. It continuously monitors relationship dynamics between correlated instruments and flags deviations from historical norms.

## Why Was It Built?

Spread and arbitrage opportunities are fleeting — manual monitoring cannot capture them reliably. SpreadWatch automates detection by tracking spread relationships in real time, consuming market data from MQ and options analytics from TalkOptions to surface actionable opportunities.

## Business Objective

Identify and rank spread trading and arbitrage opportunities. Deliver time-sensitive signals to Kuber Alpha for strategy execution and to DXCC for operational awareness.

## Scope

- Pair spread monitoring with cointegration analysis
- Calendar spread pricing and mispricing detection
- Arbitrage opportunity identification (futures vs options, inter-strike)
- Real-time alerts for spread threshold breaches
- Historical spread data for backtesting
