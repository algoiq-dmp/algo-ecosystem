# 02 — Business Requirements

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## BR-1: Multi-Exchange Coverage

The system MUST ingest real-time market data from NSE (CM, FO, CD), BSE (CM, FO), MCX, and NCDEX exchanges simultaneously. Each exchange must have independent feed management with no cross-contamination of data streams.

## BR-2: Sub-Millisecond Ingestion

The system MUST process and publish normalized market data messages within 50 microseconds (p99) from wire-receive to MQ-publish, measured at the NIC hardware timestamp level.

## BR-3: 99.995% Feed Availability

Each feed must maintain 99.995% uptime during trading hours (09:15–15:30 IST), equating to no more than 5.4 seconds of downtime per trading day.

## BR-4: Zero Data Loss on Failover

Feed Server failover between primary and secondary lease lines MUST be lossless — no tick data may be dropped during a failover event. Sequence continuity must be verifiable via audit logging.

## BR-5: Normalized Canonical Output

All exchange-specific feed formats must be normalized into a single, versioned, self-describing message format (LCFM v3) before publishing to MQ. Downstream consumers must never receive raw exchange messages.

## BR-6: Gap Detection and Recovery

The system MUST detect sequence number gaps within 10ms, trigger automatic TCP replay recovery, and fill gaps within 30 seconds for gaps up to 100,000 messages.

## BR-7: Historical Replay for Backtesting

The Feed Server MUST support on-demand replay of stored tick data for any trading day in the last 90 days, serving replay data at 100x real-time speed minimum.

## BR-8: Regulatory Audit Trail

All ingested market data must be stored with verifiable timestamps for a minimum of 5 years to comply with SEBI audit trail requirements. Storage integrity must be cryptographically verifiable.

## BR-9: Bandwidth Governance

The system MUST enforce per-consumer bandwidth limits to prevent any single downstream component from saturating the MQ cluster. Limits are configurable per topic and per consumer group.

## BR-10: Multi-DC Deployment

Production must run across at least two geographically separated data centers (Mumbai DC1, Navi Mumbai DC2) with independent lease line circuits and synchronized feed state.
