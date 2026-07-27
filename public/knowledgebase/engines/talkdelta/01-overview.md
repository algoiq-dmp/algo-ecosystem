# TalkDelta — Overview

**Version:** 5.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## What Is TalkDelta?

TalkDelta is the unified strategy dashboard and post-trade analytics platform. It receives trade confirmations, order updates, and position updates exclusively from Vega (the execution engine) and combines them with market data from Ganesh, MQ, and options analytics from TalkOptions to provide comprehensive strategy performance analysis.

## Why Was It Built?

Traders needed a single pane of glass to monitor all running strategies in real time — positions, P&L, MTM, and execution quality. TalkDelta consolidates data from Vega, the execution backbone, and enriches it with market analytics.

## Business Objective

Enable real-time strategy monitoring, post-trade analytics, and risk visualization. Provide APIs for delta calculations and portfolio analytics that downstream engines (Kavach, Rakshak, Kuber Alpha, Delta XI, VYUH, SpreadWatch) consume for their own decision-making.

## Scope

- Live strategy dashboard with positions and MTM
- Post-trade P&L, execution statistics, and performance metrics
- Delta calculation API for strategy signal generation
- Portfolio analytics and risk monitoring APIs
- Trade replay and historical analysis
