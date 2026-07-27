# SpreadWatch

**Version:** 2.8.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

Spread analytics for pairs trading and multi-leg strategies running on ALGO IQ 4 (192.168.190.104).

## Description

SpreadWatch is a dedicated spread analytics engine that detects spread, arbitrage, and pair trading opportunities in real time. It consumes market data from MQ and options analytics from TalkOptions to identify mispricing across calendar spreads, pair trades, and multi-leg option structures.

## Key Points

1. Real-time spread and arbitrage opportunity detection
2. Pairs trading analytics with cointegration tracking
3. Calendar spread monitoring and optimization
4. Multi-leg option spread analysis
5. Feeds Kuber Alpha and DXCC with spread signals

## Quick Links

- [Overview](./01-overview.md)
- [Architecture](./02-architecture.md)
- [API Reference](./03-api-reference.md)
- [Configuration](./04-configuration.md)
- [Deployment](./05-deployment.md)

## Technical Stack

- **Server:** ALGO IQ 4
- **Ports:** 3022
- **Databases:** TimescaleDB
- **Communication:** REST, MQ
- **Source Modules:** spreadwatch-engine, spreadwatch-api
- **Status:** Production Ready (99.5% health)
