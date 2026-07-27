# AALAP Calls

**Version:** 2.5.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

15 external real-time signal generating strategies running on ALGO IQ 4 (192.168.190.104).

## Description

AALAP Calls is the collective strategy engine comprising 15 independent real-time signal generating strategies. Each strategy consumes live data from Surya (exchange files), Lakshmi (live prices), and TalkOptions (options analytics) to detect opportunities and generate order signals. All signals are routed to Kuber Alpha for strategy activation.

## Key Points

1. 15 independent real-time strategy engines
2. Signal generation from live market and options data
3. Multi-leg execution support
4. Direct integration with Kuber Alpha for strategy activation
5. Diverse signal diversity across market conditions

## Quick Links

- [Overview](./01-overview.md)
- [Architecture](./02-architecture.md)
- [API Reference](./03-api-reference.md)
- [Configuration](./04-configuration.md)
- [Deployment](./05-deployment.md)

## Technical Stack

- **Server:** ALGO IQ 4
- **Ports:** 3030-3044
- **Databases:** TimescaleDB
- **Communication:** REST, MQ
- **Source Modules:** aalap-strategies, aalap-signals
- **Status:** Production Ready (99.5% health)
