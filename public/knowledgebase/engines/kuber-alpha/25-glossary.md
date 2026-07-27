# 25 — Glossary

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## A

**Aalap Calls**: Voice-based trading signal service. Human analysts + AI provide trade recommendations ingested by Kuber Alpha.

**Activation**: The process of matching a signal to a strategy and initiating the trade pipeline.

**Allocation Weight**: The percentage of total capital assigned to a specific strategy.

## B

**BRACKET Order**: A 3-legged order comprising an entry order, a stop-loss, and a take-profit target. All three are placed simultaneously.

**Budget**: The total capital pool available for deployment across all strategies.

## C

**Capital Allocator**: The Kuber Alpha component that distributes capital across strategies according to portfolio configuration.

**Central Strategy Hub**: Kuber Alpha's role as the central management point for all active trading strategies.

**Circuit Breaker**: An exchange-level mechanism that halts trading when price moves exceed limits. Kuber Alpha's Kill Switch also implements an internal circuit breaker.

**Confidence**: A 0.0–1.0 score indicating the signal source's certainty in the trade recommendation.

**Conversion**: Transforming a raw signal into a managed, risk-controlled order ready for execution.

**Cooldown**: Minimum time between successive entries for the same strategy.

**COVER Order**: An entry order with a mandatory stop-loss (no take-profit).

## D

**Delta XI**: Quantitative signal engine using statistical models and machine learning.

**Deployment Mode**: The operating mode of a strategy: PAPER, SHADOW, STAGED, or LIVE.

**Dispatch**: Sending a constructed order from Kuber Alpha to Vega for execution.

**Drawdown**: The peak-to-trough decline in strategy or portfolio equity.

## E

**Entry Signal**: A signal indicating a new position should be opened.

**Event Bus**: High-performance in-memory pub/sub system for intra-engine communication.

**Exit Signal**: A signal indicating an existing position should be closed.

## F

**Fill**: A confirmed trade execution at the exchange. Partial fills are possible.

**Free Capital**: Capital not currently allocated or deployed; available for new strategies.

## H

**Hedge**: A protective position (usually an option) attached to a primary trade to limit risk.

## K

**Kill Switch**: Layer 1 safety mechanism that halts all trading when margin exceeds 1.01%.

**Kuber Alpha**: The Central Strategy Hub — Layer 3 of the 5-layer architecture. Named after Kuber, the Hindu god of wealth.

## L

**Layer Architecture**: The 5-layer Algo-IQ design: Layer 5 (UI), Layer 4 (Signals), Layer 3 (Kuber Alpha), Layer 2 (Vega), Layer 1 (Kill Switch).

**LIVE**: Production deployment mode where real capital is traded.

## M

**Margin**: Collateral required by the broker to maintain open positions. Kill Switch triggers at 1.01% utilization.

**MQ (Message Queue)**: RabbitMQ-based messaging backbone for inter-engine communication.

**mTLS**: Mutual TLS — both client and server authenticate using certificates.

## O

**OCO (One-Cancels-Other)**: A pair of orders where filling one automatically cancels the other.

**Opportunity Conversion**: Kuber Alpha's core function — transforming raw signals into managed strategies.

## P

**PAPER**: Deployment mode using virtual capital for validation without real risk.

**Parikshak**: Enterprise testing engine that certifies strategies before Kuber Alpha deployment.

**Position Sizing**: Calculation of trade quantity based on capital, risk, and model.

## R

**Reconciliation**: Periodic comparison of Kuber Alpha's position state with Vega's confirmed positions.

**Risk Overlay**: The stop-loss, take-profit, and other protections added to every order.

## S

**SHADOW**: Deployment mode where the strategy runs silently in production without sending real orders.

**Signal**: A trade recommendation from a Layer 4 source containing instrument, direction, price, and confidence.

**Signal Ingestor**: The Kuber Alpha component that receives and validates incoming signals.

**STAGED**: Deployment mode with gradual capital increase (e.g., 25% → 50% → 100%).

**Strategy**: A complete set of trading rules created in Strategy Factory and deployed in Kuber Alpha.

## T

**TalkDelta AI**: AI-powered conversational trading engine using large language models for signal generation.

## V

**Vega**: Layer 2 execution engine handling broker connectivity and order routing.

**VYUH**: Multi-strategy portfolio orchestration engine providing coordinated signals.

## W

**WebSocket**: Protocol for real-time, bidirectional communication between Kuber Alpha and connected clients.
