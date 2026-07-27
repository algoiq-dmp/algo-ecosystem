# TalkDelta AI

**Version:** 1.4.0 | **Owner:** AI/ML | **Last Updated:** 2026-07-24

AI-powered decision engine for strategy optimization running on ALGO IQ 4 (192.168.190.104).

## Description

TalkDelta AI is the real-time AI signal generator for the Algo IQ ecosystem. It processes trade data from TalkDelta, market data from Lakshmi and MQ, exchange reference files from Surya, and options analytics from TalkOptions to generate AI-driven strategy signals. These signals feed directly into Kuber Alpha for strategy optimization and portfolio intelligence.

## Key Points

1. Real-time AI-driven signal generation from live trading and market data
2. Pattern recognition and ML models for trade opportunity detection
3. Strategy optimization recommendations based on historical performance
4. Portfolio intelligence and risk analysis insights
5. Powers Kuber Alpha's AI-guided decision-making

## Quick Links

- [Overview](./01-overview.md)
- [Architecture](./02-architecture.md)
- [API Reference](./03-api-reference.md)
- [Configuration](./04-configuration.md)
- [Deployment](./05-deployment.md)

## Technical Stack

- **Server:** ALGO IQ 4
- **Ports:** 3010
- **Databases:** MongoDB, Redis
- **Communication:** REST, MQ
- **Source Modules:** talkdelta-ai-engine, talkdelta-ai-ml, talkdelta-ai-api
- **Status:** Production Ready (99.5% health)
