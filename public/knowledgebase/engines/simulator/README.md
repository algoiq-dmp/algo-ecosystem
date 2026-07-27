# Simulator

**Version:** 3.0.0 | **Owner:** QA | **Last Updated:** 2026-07-24

Backtesting platform for strategy validation running on ALGO IQ 4 (192.168.190.104).

## Description

The Simulator is the enterprise backtesting and paper trading platform for the Algo IQ ecosystem. It enables risk-free strategy testing by replaying minute-level trade data from TalkDelta API, minute OHLC historical data from Ganesh, live market broadcasts via MQ, and feed data through the Lakshmi engine. Strategies can be tested against historical scenarios before live deployment.

## Key Points

1. Historical backtesting with minute-level trade replay
2. Paper trading for live-market strategy validation
3. Comprehensive performance reports and metrics
4. Multi-source data integration (TalkDelta, Ganesh, MQ, Lakshmi)
5. Direct integration with Parikshak for test result generation

## Quick Links

- [Overview](./01-overview.md)
- [Architecture](./02-architecture.md)
- [API Reference](./03-api-reference.md)
- [Configuration](./04-configuration.md)
- [Deployment](./05-deployment.md)

## Technical Stack

- **Server:** ALGO IQ 4
- **Ports:** 3070
- **Databases:** PostgreSQL, TimescaleDB
- **Communication:** REST, MQ
- **Source Modules:** simulator-engine, simulator-api
- **Status:** Production Ready (99.0% health)
