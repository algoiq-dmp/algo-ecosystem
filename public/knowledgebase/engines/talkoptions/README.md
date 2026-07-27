# TalkOptions

**Version:** 4.7.2 | **Owner:** Analytics | **Last Updated:** 2026-07-24

Enterprise options analytics engine with 150+ REST APIs running on ALGO IQ 18 (192.168.190.118).

## Description

TalkOptions is the centralized options analytics engine for the Algo IQ ecosystem. It processes real-time market data from Ganesh and MQ to compute IV, Greeks, Open Interest, PCR, Option Chains, Max Pain, and volatility surfaces. The engine serves as a critical data backbone for downstream screeners and strategy engines.

## Key Points

1. 150+ REST APIs for options analytics and strategy data
2. Computes Greeks (Delta, Gamma, Theta, Vega, Rho) for all strikes
3. Real-time IV calculation with volatility surface modeling
4. PCR (Put-Call Ratio) and Max Pain analysis
5. Serves Delta XI, VYUH, SpreadWatch, TalkDelta, AALAP Calls, and Simulator

## Quick Links

- [Overview](./01-overview.md)
- [Architecture](./02-architecture.md)
- [API Reference](./03-api-reference.md)
- [Configuration](./04-configuration.md)
- [Deployment](./05-deployment.md)

## Technical Stack

- **Server:** ALGO IQ 18
- **Ports:** 8081, 8444
- **Databases:** PostgreSQL, InfluxDB
- **Communication:** REST, MQ
- **Source Modules:** talkoptions-core, talkoptions-api, talkoptions-analytics
- **Status:** Production Ready (99.8% health)
