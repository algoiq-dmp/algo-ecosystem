# Delta XI — Architecture

**Version:** 3.2.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Architecture Overview

Delta XI is structured around three modules:

- **delta-xi-scanner:** The core screening engine that evaluates each instrument against configured filter rules. Runs at sub-second frequency using live data from MQ and TalkOptions. Maintains instrument state in memory for efficient incremental evaluation.
- **delta-xi-signals:** Signal generation and ranking module. Converts scanner matches into structured signals with confidence scores, timestamps, and optimization metadata. Publishes to MQ for downstream consumption.
- **delta-xi-api:** REST API for screener configuration management, signal history queries, and real-time scanner status monitoring.

## Data Flow

```
MQ (Live Prices) ──────┐
Lakshmi (Price Feed) ──┤
TalkOptions (Greeks)  ──┤
Surya (Ref Files) ─────┴──> delta-xi-scanner ──> delta-xi-signals ──> Kuber Alpha / DXCC
                                  │
                                  └──> delta-xi-api ──> TimescaleDB
```

1. Scanner ingests multi-source live data
2. Applies screening rules in-memory
3. Signals module ranks and publishes matches
4. API serves configuration and history
