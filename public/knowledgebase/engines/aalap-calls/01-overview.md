# AALAP Calls — Overview

**Version:** 2.5.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## What Is AALAP Calls?

AALAP Calls is a collection of 15 production-grade trading strategies that run continuously, consuming live market and options data to generate real-time trading signals. Each strategy operates independently with its own logic, parameters, and signal generation frequency, providing signal diversity across market conditions.

## Why Was It Built?

A diversified portfolio of automated strategies reduces reliance on any single logic. AALAP Calls was built to provide Kuber Alpha with a broad spectrum of signal types — from momentum to mean-reversion to volatility-based — ensuring robust opportunity coverage.

## Business Objective

Generate diverse, high-quality trading signals from 15 independent strategies. Route all signals to Kuber Alpha for execution. Provide Vega with validated trade recommendations when strategies fire.

## Scope

- 15 independent strategy engines with unique logic
- Real-time signal generation from MQ, Ganesh OHLC, and TalkOptions analytics
- Signal routing to Kuber Alpha for strategy activation
- Strategy-specific performance tracking and logging
