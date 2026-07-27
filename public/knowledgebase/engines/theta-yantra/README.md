# Theta Yantra

**Version:** 3.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

Advanced options analytics engine for pricing and Greeks running on ALGO IQ 6 (192.168.190.106).

## Description

Theta Yantra is the advanced options analytics engine specializing in theoretical pricing, advanced Greeks calculation, and volatility surface modeling. It processes market data from Ganesh (OHLC) and MQ (live tick data) to deliver sophisticated options computations — including stochastic volatility models and exotic sensitivities — to TalkOptions and TalkDelta.

## Key Points

1. Advanced Greeks calculation beyond standard Black-Scholes
2. Theoretical option pricing with multiple models
3. Volatility surface construction and modeling
4. GPU-accelerated computation pipeline
5. Feeds TalkOptions and TalkDelta with advanced analytics

## Quick Links

- [Overview](./01-overview.md)
- [Architecture](./02-architecture.md)
- [API Reference](./03-api-reference.md)
- [Configuration](./04-configuration.md)
- [Deployment](./05-deployment.md)

## Technical Stack

- **Server:** ALGO IQ 6
- **Ports:** 3180
- **Databases:** TimescaleDB
- **Communication:** REST, MQ
- **Source Modules:** theta-yantra-pricing, theta-yantra-greeks
- **Status:** Production Ready (99.7% health)
