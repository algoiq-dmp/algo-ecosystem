# Chitragupta

**Version:** 3.0.0 | **Owner:** Compliance | **Last Updated:** 2026-07-24

Audit engine for compliance, reports, and trade logging running on ALGO IQ 6 (192.168.190.106).

## Description

Chitragupta is the enterprise audit and compliance engine for the Algo IQ ecosystem. It ingests trade data from TalkDelta and execution data from Vega to maintain a complete, immutable audit trail of all trading activity. The engine generates compliance reports, regulatory filings, and trade archives to meet SEBI and exchange requirements.

## Key Points

1. Complete trade audit logging with immutable records
2. Regulatory compliance reporting (SEBI, exchange)
3. Trade data archival for regulatory retention periods
4. Real-time audit event capture from Vega and TalkDelta
5. Elasticsearch-backed log search for forensic analysis

## Quick Links

- [Overview](./01-overview.md)
- [Architecture](./02-architecture.md)
- [API Reference](./03-api-reference.md)
- [Configuration](./04-configuration.md)
- [Deployment](./05-deployment.md)

## Technical Stack

- **Server:** ALGO IQ 6
- **Ports:** 3120
- **Databases:** PostgreSQL, Elasticsearch
- **Communication:** REST, MQ
- **Source Modules:** chitragupta-audit, chitragupta-compliance
- **Status:** Production Ready (99.8% health)
