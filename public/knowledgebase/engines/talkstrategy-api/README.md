# TalkStrategy API

**Version:** 2.8.0 | **Owner:** Execution | **Last Updated:** 2026-07-24**

Trade-firing API receiving execution requests from strategies and engines running on ALGO IQ 6 (192.168.190.106).

## Description

TalkStrategy API is the standardized trade execution interface for the Algo IQ ecosystem. It receives trade execution requests from strategy engines (Kuber Alpha, Strategy Factory, AALAP Calls) and screening engines (Delta XI, VYUH, SpreadWatch, Suchak), validates them, and forwards validated orders to TalkStrategy App middleware for routing to the Vega order processor.

## Key Points

1. Unified trade-firing interface for all strategy and screening engines
2. Request validation with parameter and risk checks
3. Order forwarding to TalkStrategy App middleware
4. Execution status tracking and callback handling
5. Redis-backed request caching for fault tolerance

## Quick Links

- [Overview](./01-overview.md)
- [Architecture](./02-architecture.md)
- [API Reference](./03-api-reference.md)
- [Configuration](./04-configuration.md)
- [Deployment](./05-deployment.md)

## Technical Stack

- **Server:** ALGO IQ 6
- **Ports:** 3140
- **Databases:** Redis
- **Communication:** REST
- **Source Modules:** talkstrategy-api, talkstrategy-validator
- **Status:** Production Ready (99.9% health)
