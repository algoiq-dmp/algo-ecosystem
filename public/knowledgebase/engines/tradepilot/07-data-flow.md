# TradePilot - Data Flow

**Version:** 2.2.0 | **Owner:** Operations | **Last Updated:** 2026-07-25


## Overview

The data flow describes how market data, configuration, and signals traverse through the system from ingestion to output. All data flows are designed for low latency with backpressure handling.

## Input Data Sources

### Primary Feeds
1. **Market Data (MQ):** Live tick/OHLC data from Surya via internal message queues.
2. **Options Data (TalkOptions):** Greeks, IV, and theoretical prices via REST API.
3. **Historical Data (Ganesh):** Minute-resolution OHLC for indicator computation.

### Secondary Feeds
- **Lakshmi (Live Prices):** Streaming price updates from exchange adapters.
- **TalkDelta:** Tick-level replay data for backtesting and simulation.

## Processing Pipeline

| Stage | Description | Latency Target |
|-------|-------------|---------------|
| Ingest | Consume from MQ / poll REST endpoints | < 10ms |
| Transform | Normalize, validate, and enrich data | < 5ms |
| Compute | Run strategy logic / business rules | < 50ms |
| Generate | Produce output signals / decisions | < 5ms |
| Dispatch | Route to Kuber Alpha / Narad | < 10ms |

## Output Channels

| Channel | Protocol | Consumer | Format |
|---------|----------|----------|--------|
| Kuber Alpha | MQ (AMQP) | Order executor | JSON |
| Narad | WebSocket | Monitoring dashboards | JSON |
| TimescaleDB | SQL | Audit/reporting | Row inserts |
| Suraksha | gRPC | Security audit stream | Protobuf |

## Error Flows

- **Invalid Input:** Malformed messages are routed to a dead-letter queue and logged.
- **Processing Failure:** Errors trigger automatic retry with exponential backoff (max 3 attempts).
- **Output Failure:** Undeliverable signals are persisted and retried on next dispatch cycle.

