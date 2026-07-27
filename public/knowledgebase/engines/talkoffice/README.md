# TalkOffice

**Version:** 4.0.0 | **Owner:** Operations | **Last Updated:** 2026-07-24

OMS/RMS platform for real-time position, broker-wise, strategy-wise, and client-wise tracking running on ALGO IQ 19 (192.168.190.119).

## Description

TalkOffice is the centralized Order Management System (OMS) and Risk Management System (RMS) for the Algo IQ ecosystem. It receives trade confirmations exclusively through Vega and provides real-time position tracking, P&L monitoring, margin management, and exposure reporting across brokers, strategies, and clients.

## Key Points

1. Real-time position tracking across brokers, strategies, and clients
2. Live MTM calculation with continuous P&L updates
3. Margin management and exposure monitoring
4. Trade book and order book reconciliation
5. Centralized risk reporting for DXCC and audit trails for Chitragupta

## Quick Links

- [Overview](./01-overview.md)
- [Architecture](./02-architecture.md)
- [API Reference](./03-api-reference.md)
- [Configuration](./04-configuration.md)
- [Deployment](./05-deployment.md)

## Technical Stack

- **Server:** ALGO IQ 19
- **Ports:** 3080
- **Databases:** PostgreSQL
- **Communication:** REST, MQ, WebSocket
- **Source Modules:** talkoffice-oms, talkoffice-rms, talkoffice-dashboard
- **Status:** Production Ready (99.9% health)
