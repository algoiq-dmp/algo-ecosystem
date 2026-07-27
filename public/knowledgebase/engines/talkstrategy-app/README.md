# TalkStrategy App

**Version:** 2.5.0 | **Owner:** Frontend | **Last Updated:** 2026-07-24

Middleware application connecting TalkStrategy API to Vega Order Processor running on ALGO IQ 6 (192.168.190.106).

## Description

TalkStrategy App is the middleware layer between the trade-firing API (TalkStrategy API) and the execution engine (Vega Order Processor). It receives validated trade requests from the API, routes them to the order processor for execution, and returns trade confirmations back through the API pipeline. It also provides a strategy management UI for execution monitoring and configuration.

## Key Points

1. Middleware routing between API and order processor
2. Guaranteed delivery with retry and acknowledgment
3. Trade confirmation back-propagation to API
4. Strategy management UI for execution monitoring
5. Configuration management for execution parameters

## Quick Links

- [Overview](./01-overview.md)
- [Architecture](./02-architecture.md)
- [API Reference](./03-api-reference.md)
- [Configuration](./04-configuration.md)
- [Deployment](./05-deployment.md)

## Technical Stack

- **Server:** ALGO IQ 6
- **Ports:** 3141
- **Databases:** None (stateless middleware)
- **Communication:** REST, WebSocket
- **Source Modules:** talkstrategy-app
- **Status:** Production Ready (99.8% health)
