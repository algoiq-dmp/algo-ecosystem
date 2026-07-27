# 25 — Glossary

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## A

**Active-Active:** A high-availability configuration where both instances of a service process data simultaneously. Contrast with active-standby.

**Active-Standby:** A high-availability configuration where one instance processes data while the other tracks state and takes over only on failover.

**Audit Trail:** A chronological record of all system activities, used for compliance verification and forensic analysis.

## B

**BOLT Plus:** BSE's enhanced trading and market data protocol, successor to BOLT (BSE On-Line Trading).

**Backpressure:** A flow control mechanism where a producer slows down when consumers cannot keep up.

## C

**Canonical Message:** A normalized, exchange-agnostic market data message conforming to the Lakshmi Canonical Feed Message (LCFM) schema.

**Colocation (Colo):** Placing trading servers in the same physical data center as the exchange matching engine to minimize network latency.

**Cross-Connect:** A direct physical fiber connection between two network endpoints within a data center.

## D

**DPDK (Data Plane Development Kit):** A set of libraries for fast packet processing in userspace, bypassing the Linux kernel network stack.

**Dark Fiber:** Unused optical fiber installed for future use; in trading, often used for dedicated point-to-point links.

## E

**Exchange Lease Line:** A dedicated, physically secured telecommunications circuit connecting a trading firm's server directly to an exchange gateway.

## F

**Feed Normalization:** The process of converting exchange-specific message formats into a unified canonical format.

**False Sharing:** A performance degradation in multi-core systems where cores invalidate each other's cache lines despite accessing different variables.

## G

**Gap (Sequence Gap):** A missing range of sequence numbers in a market data stream, indicating data loss.

**Gap Recovery:** The process of retrieving missed messages via a TCP replay channel to fill sequence gaps.

**Global Sequence Number:** A monotonically increasing number assigned by the Sequencer to uniquely identify each message across all exchanges.

## H

**HugePages:** Large memory pages (2MB or 1GB) used to reduce TLB misses and improve memory access performance for large data structures.

**Hardware Timestamp:** A timestamp applied by the network interface card at the moment a packet is received, providing sub-microsecond accuracy when synchronized with PTP.

## I

**Instrument Master:** A reference file provided by an exchange containing metadata for all tradable instruments (symbols, lot sizes, tick sizes, expiry dates, etc.).

## L

**LCFM (Lakshmi Canonical Feed Message):** The internal message schema used throughout Lakshmi for representing normalized market data. Current version: v3.

**Lcore:** A DPDK term for a logical CPU core used by a DPDK application for packet processing.

**Lease Line:** See Exchange Lease Line.

## M

**MQ (Message Queue):** The Lakshmi pub/sub message broker responsible for distributing messages between components.

**Merkle Tree:** A tree data structure where each non-leaf node is the hash of its child nodes, used for efficient and tamper-evident verification of large data sets.

**mTLS (Mutual TLS):** A TLS configuration where both client and server present certificates for mutual authentication.

## N

**NFMT (NSE Feed Message Transfer):** NSE's binary protocol for market data dissemination. Version 2.0 introduced in 2026.

**NUMA (Non-Uniform Memory Access):** A memory architecture where memory access time depends on the memory's location relative to the processor.

## P

**PTP (Precision Time Protocol, IEEE 1588):** A protocol for synchronizing clocks across a network to sub-microsecond accuracy.

**Parser:** A Feed Server component responsible for decoding exchange-specific binary feed protocols.

**Pipeline Stage:** A step in the feed processing pipeline (NIC Poller → Decoder → Normalizer → Sequencer → Ring Buffer → MQ Publisher).

## R

**Ring Buffer:** A fixed-size circular buffer in shared memory holding the most recent market data messages for high-speed access.

**RSS (Receive Side Scaling):** A NIC feature that distributes incoming packets across multiple RX queues using a hash function.

## S

**SR-IOV (Single Root I/O Virtualization):** A hardware feature allowing a single physical NIC to appear as multiple virtual functions, each directly accessible by a VM or process.

**Sequencer:** The Feed Server component that assigns global sequence numbers and detects gaps.

**SPSC Queue:** Single-Producer Single-Consumer lock-free queue used for inter-stage message passing.

**Suraksha:** The Lakshmi security and audit platform (encryption, key management, identity, audit anchoring).

## T

**TLB (Translation Lookaside Buffer):** A CPU cache for virtual-to-physical memory address translations. HugePages reduce TLB pressure.

**TCP Replay:** A service that provides missed market data messages over TCP, used for gap recovery.

## V

**VF (Virtual Function):** A virtual instance of a physical NIC created via SR-IOV, with direct hardware access.

**VLAN (Virtual LAN):** A logical network segment used to isolate traffic (e.g., exchange feeds on separate VLANs from management traffic).

## Z

**Zero-Copy:** A data transfer technique that avoids copying data between kernel space and userspace, typically using shared memory or DMA.
