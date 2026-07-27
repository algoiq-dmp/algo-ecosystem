# Simulator — Overview

**Version:** 3.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

## What Is the Simulator?

The Simulator is a comprehensive backtesting and paper trading platform that allows strategies to be tested against historical market data before live deployment. It replays minute-level trades from TalkDelta API, consumes minute OHLC historical data from Ganesh, subscribes to live market broadcasts via MQ, and processes Feed Server data through the Lakshmi engine — providing the most realistic simulation environment possible.

## Why Was It Built?

Deploying untested strategies to production carries unacceptable financial risk. The Simulator was built to provide a near-production environment where strategies can be validated against real historical data, including actual trade fills, slippage, and market conditions.

## Business Objective

Enable risk-free strategy validation through realistic historical replay and paper trading. Generate comprehensive performance reports for Parikshak certification and DXCC approval workflows.

## Scope

- Minute-level historical trade replay from TalkDelta
- OHLC-based backtesting from Ganesh historical data
- Live market paper trading via MQ and Lakshmi
- Performance metrics: Sharpe ratio, max drawdown, win rate, P&L
- Integration with Parikshak for automated test result generation
