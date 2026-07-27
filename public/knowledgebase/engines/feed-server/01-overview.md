# 01 — Overview

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## What is the Feed Server?

The Feed Server is a high-performance, low-latency exchange ingestion engine responsible for receiving real-time market data from equity, derivatives, currency, and commodity exchanges via dedicated lease line connections. It decodes, normalizes, timestamps, and publishes normalized market data messages to downstream Lakshmi components through MQ topics.

## Context in Lakshmi

Exchange lease lines feed into the Feed Server, which publishes normalized data to MQ for distribution to Strategy Engines, maintains a ring buffer for tick storage, and streams real-time data via Local WebSocket for HTML5 dashboards.

## Core Responsibilities

1. **Connection Management** — Maintain persistent TCP/UDP connections to exchange gateways with automatic reconnect and failover.
2. **Protocol Decoding** — Parse exchange-specific binary protocols (NSE NFMT, BSE BOLT, MCX xStream) into structured data.
3. **Normalization** — Convert exchange-native messages into the Lakshmi Canonical Feed Message (LCFM) schema.
4. **Sequencing** — Assign global sequence numbers and detect gaps or missing packets.
5. **Publishing** — Push normalized messages to MQ topics at wire speed.
6. **Replay** — Serve historical and recovery data via TCP replay channels for gap filling.

## Deployment Topology

Each production instance runs on bare-metal servers co-located in exchange data centers (Mumbai / Navi Mumbai). Feeds are received on dedicated SR-IOV NIC ports with DPDK kernel bypass for zero-copy packet processing.

## Supported Exchanges and Segments

| Exchange | Segments | Protocol | Feed Type |
|----------|----------|----------|-----------|
| NSE | CM, FO, CD | NFMT 2.0 | Multicast + TCP |
| BSE | CM, FO | BOLT Plus | Multicast + TCP |
| MCX | Commodity | xStream | TCP |
| NCDEX | Commodity | NCDEX Feed | TCP |

## Performance Characteristics

- Ingest-to-publish latency: < 50 microseconds (p99)
- Throughput: 1 million messages per second per feed
- Gap recovery: < 30 seconds for sequence jumps up to 100K
- Memory footprint: ~4 GB for ring buffer (last 60 seconds of all segments)

## High Availability

Each exchange feed pair runs in active-standby. The primary Feed Server process ingests the primary lease line; the standby ingests the secondary line and tracks sequence consistency. Failover is automatic when the primary misses 250ms of heartbeats.
