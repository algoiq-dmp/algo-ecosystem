# 01 â€” Overview

## What is Ganesh?

Ganesh is the central OHLC data provider for the Algo-IQ ecosystem. It ingests real-time market ticks from Lakshmi, aggregates them into Open-High-Low-Close bars across five distinct timeframes, and serves as the **single source of truth for all historical price data** consumed by every downstream engine, simulator, and application.

## Why Ganesh Was Developed

Before Ganesh, each downstream engine independently computed OHLC bars from raw tick data, leading to:

- **Inconsistent bars** across engines due to varied aggregation logic.
- **Duplicated computation** wasting CPU and memory resources.
- **No historical adjustment** for corporate actions, causing backtest errors.
- **Absence of a unified pricing API** for multi-timeframe queries.

Ganesh solves these by centralizing bar construction and serving as the canonical pricing layer.

## Business Objective

Provide accurate, time-aligned, corporate-action-adjusted OHLC bars to every Algo-IQ consumer, enabling consistent backtesting, strategy building, and real-time trading decisions.

## Technical Objective

- Aggregate up to 350,000 ticks/second into real-time bars.
- Serve historical OHLC queries within 5ms for cached data, 50ms for cold storage.
- Maintain 99.9% uptime with automatic failover.
- Adjust all historical bars for corporate actions within 30 seconds of Surya notification.

## Scope

| In Scope | Out of Scope |
|---|---|
| Multi-timeframe OHLC bar generation | Real-time tick distribution (Lakshmi) |
| Historical bar storage and retrieval | Order execution |
| Corporate action adjustments | Strategy computation |
| REST API for bar queries | User authentication (delegated to Suraksha) |
| Gap detection and data validation | Market data cleansing at source |

## Target Users

| User Type | Interaction |
|---|---|
| **AI Engines** (Vega, Brahma, Garuda) | Query OHLC bars via REST API for strategy execution |
| **Simulator** | Retrieve historical bars for backtesting |
| **TalkOptions** | Access option-adjusted OHLC data |
| **TalkDelta** | Query delta-neutral pricing bars |
| **Suchak** | Pull OHLC data for alert generation |
| **Web Dashboard** | Display OHLC charts to end users |

## Benefits

- **Single pricing source** eliminates inconsistency across engines.
- **Corporate-action-aware** bars prevent backtest drift.
- **Sub-5ms hot reads** via Redis caching layer.
- **Five timeframe coverage** from intraday to daily.
- **Automatic gap detection** alerts operators to missing data.

## Inputs

| Source | Description | Protocol | Frequency |
|---|---|---|---|
| **Feed Server** (via Lakshmi) | Raw market ticks | AMQP (RabbitMQ) | 350K msg/s |
| **Surya** | Corporate action notifications | AMQP (RabbitMQ) | Event-driven |

## Outputs

| Consumer | Delivery Method | Data |
|---|---|---|
| All Engines (Vega, Brahma, Garuda) | REST API | Multi-TF OHLC bars |
| Simulator | REST API + Batch | Full historical bars |
| TalkOptions | REST API | Options-adjusted OHLC |
| TalkDelta | REST API | Delta-neutral OHLC |
| Suchak | REST API | OHLC for alert triggers |
