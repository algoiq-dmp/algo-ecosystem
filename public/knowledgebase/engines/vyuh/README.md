# VYUH

**Version:** 3.0.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

Stock analytics engine for intelligent stock selection and ranking running on ALGO IQ 4 (192.168.190.104).

## Description

VYUH is the stock analytics engine that provides intelligent stock selection, ranking, and opportunity scoring. It analyzes stock data from Surya, Lakshmi, and TalkOptions — combining fundamental, technical, and options-derived metrics — to generate ranked signals and opportunity scores for Kuber Alpha and DXCC.

## Key Points

1. Intelligent stock ranking based on multi-factor analysis
2. Trend detection and relative strength scoring
3. Sector analysis and rotation tracking
4. Fundamental analysis integration
5. Feeds Kuber Alpha with scored stock opportunities

## Quick Links

- [Overview](./01-overview.md)
- [Architecture](./02-architecture.md)
- [API Reference](./03-api-reference.md)
- [Configuration](./04-configuration.md)
- [Deployment](./05-deployment.md)

## Technical Stack

- **Server:** ALGO IQ 4
- **Ports:** 3021
- **Databases:** TimescaleDB
- **Communication:** REST, MQ
- **Source Modules:** vyuh-engine, vyuh-api
- **Status:** Production Ready (99.6% health)
