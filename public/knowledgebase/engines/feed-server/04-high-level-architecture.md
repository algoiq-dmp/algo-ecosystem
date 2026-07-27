# 04 — High-Level Architecture

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Architectural Overview

The Feed Server follows a **pipeline architecture** with distinct stages connected by lock-free SPSC/MPSC queues. Each stage runs on a dedicated CPU core with thread pinning and DPDK polling-mode drivers.

## Architecture Diagram

See `diagrams/feed-server-architecture.drawio` for the detailed architecture diagram.

## Pipeline Stages

### Stage 0: NIC Poller (CPU 0-N)
- DPDK-based zero-copy packet reception from SR-IOV virtual functions
- Hardware timestamp extraction (PTP / IEEE 1588)
- RSS-based flow distribution across multiple RX queues
- Packet classification by exchange VLAN tag

### Stage 1: Protocol Decoder (CPU N+1 to N+M)
- Exchange-specific binary protocol parsers
- Message defragmentation and reassembly
- Sequence number extraction and validation
- Emits partially decoded `RawFeedMessage` structs

### Stage 2: Normalizer (CPU N+M+1 to N+M+K)
- Converts `RawFeedMessage` to `CanonicalMessage` (LCFM v3)
- Symbol resolution via in-memory symbol master cache
- Timestamp reconciliation (exchange time vs. local PTP time)
- Corporate action adjustment for derivatives

### Stage 3: Sequencer (CPU dedicated)
- Global monotonically increasing sequence number assignment
- Gap detection via sequence delta threshold
- Gap recovery trigger via TCP replay channel
- Feeds `SequencedCanonicalMessage` to ring buffer

### Stage 4: Ring Buffer (shared memory)
- Lock-free MPMC ring buffer, 60-second window
- Accessible via mmap from any process on the same host
- Each slot holds one `SequencedCanonicalMessage`
- Consumer tracking via atomic tail pointers

### Stage 5: MQ Publisher (CPU dedicated)
- Batched publish to MQ topics (one topic per exchange-segment)
- Zero-copy message passing to MQ via Unix domain sockets
- Backpressure signaling when downstream consumers lag
- Publish-side bandwidth throttling

## Inter-Process Communication

All inter-stage communication uses lock-free bounded queues implemented with C++ `std::atomic` and cache-line padding to prevent false sharing.
