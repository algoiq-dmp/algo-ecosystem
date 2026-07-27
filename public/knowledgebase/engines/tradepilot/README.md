# TradePilot

**Version:** 2.2.0 | **Owner:** Operations | **Last Updated:** 2026-07-24

Client onboarding and strategy approval platform ensuring SEBI/exchange compliance running on ALGO IQ 4 (192.168.190.104).

## Description

TradePilot is the mandatory compliance gateway for the Algo IQ ecosystem. It manages client onboarding with KYC verification and enforces a structured strategy approval workflow. Every strategy must pass TradePilot approval — including SEBI regulatory compliance verification and exchange regulatory checks — before deployment to production through Strategy Factory.

## Key Points

1. Mandatory client onboarding with KYC verification
2. Strategy approval workflow with audit trail
3. SEBI regulatory compliance verification
4. Exchange regulatory compliance checks
5. Governance and documentation for all approved strategies

## Quick Links

- [Overview](./01-overview.md)
- [Architecture](./02-architecture.md)
- [API Reference](./03-api-reference.md)
- [Configuration](./04-configuration.md)
- [Deployment](./05-deployment.md)

## Technical Stack

- **Server:** ALGO IQ 4
- **Ports:** 3160
- **Databases:** PostgreSQL
- **Communication:** REST
- **Source Modules:** tradepilot-onboarding, tradepilot-workflow
- **Status:** Production Ready (99.5% health)
