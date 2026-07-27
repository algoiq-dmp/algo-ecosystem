# TalkDelta

**Version:** 5.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

Strategy dashboard and post-trade analytics platform running on ALGO IQ 4 (192.168.190.104).

## Description

TalkDelta is the strategy performance and post-trade analytics platform for the Algo IQ ecosystem. It receives trade confirmations, order updates, and position updates exclusively from Vega. The engine publishes APIs for delta calculations, portfolio analytics, strategy synchronization, and risk monitoring to downstream consumers including TalkDelta AI, Kavach, Chitragupta, and Kuber Alpha.

## Key Points

1. Live strategy monitoring with strategy-wise positions and MTM
2. Post-trade P&L tracking and execution statistics
3. Trade replay and performance visualization dashboards
4. Publishes delta calculation and portfolio analytics APIs
5. AI integration bridge to TalkDelta AI for intelligent insights

## Quick Links

- [Overview](./01-overview.md)
- [Architecture](./02-architecture.md)
- [API Reference](./03-api-reference.md)
- [Configuration](./04-configuration.md)
- [Deployment](./05-deployment.md)

## Technical Stack

- **Server:** ALGO IQ 4
- **Ports:** 3005, 3006
- **Databases:** PostgreSQL, TimescaleDB, Redis
- **Communication:** REST, MQ, WebSocket
- **Source Modules:** talkdelta-dashboard, talkdelta-analytics, talkdelta-api, talkdelta-stream
- **Status:** Production Ready (99.8% health)
