# Delta XI

**Version:** 3.2.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

Market screeners for identifying trading opportunities running on ALGO IQ 4 (192.168.190.104).

## Description

Delta XI is a real-time signal generator that screens market data from Surya (exchange files), Lakshmi (live prices), and TalkOptions (options analytics) to discover potential trading opportunities. It generates screening signals and market alerts that feed into Kuber Alpha for strategy activation and DXCC for operational monitoring.

## Key Points

1. Real-time market screening with multi-condition filters
2. Signal generation for detected trading opportunities
3. Opportunity ranking and prioritization
4. Market alerts with configurable thresholds
5. Feeds Kuber Alpha and DXCC with actionable signals

## Quick Links

- [Overview](./01-overview.md)
- [Architecture](./02-architecture.md)
- [API Reference](./03-api-reference.md)
- [Configuration](./04-configuration.md)
- [Deployment](./05-deployment.md)

## Technical Stack

- **Server:** ALGO IQ 4
- **Ports:** 3020
- **Databases:** TimescaleDB
- **Communication:** REST, MQ
- **Source Modules:** delta-xi-scanner, delta-xi-signals, delta-xi-api
- **Status:** Production Ready (99.7% health)
