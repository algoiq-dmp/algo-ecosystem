# Chitragupta — Architecture

**Version:** 3.0.0 | **Owner:** Compliance | **Last Updated:** 2026-07-24

## Architecture Overview

Chitragupta is built on two core modules:

- **chitragupta-audit:** The audit event capture and storage module. Subscribes to Vega trade confirmations via MQ and TalkDelta trade data via REST. Validates, enriches (adds timestamps, hashes, sequence numbers), and persists events to both PostgreSQL (structured) and Elasticsearch (searchable). Chain-hashes events for tamper detection.
- **chitragupta-compliance:** Compliance reporting engine that generates standardized reports (daily trade summary, broker-wise activity, strategy performance, audit logs) for regulatory submissions. Manages archival policies and data retention.

## Data Flow

```
Vega (MQ: Trade Confirmations) ──┐
TalkDelta (REST: Trade Data)   ──┴──> chitragupta-audit ──> PostgreSQL (Structured)
                                            │                    │
                                            │                    └──> Elasticsearch (Searchable)
                                            │
                                            └──> chitragupta-compliance ──> Reports
```

1. Audit module captures events from Vega (MQ) and TalkDelta (REST)
2. Events validated, enriched, hashed, and sequenced
3. Dual-write to PostgreSQL (relational) and Elasticsearch (search)
4. Compliance module generates reports from stored audit data
