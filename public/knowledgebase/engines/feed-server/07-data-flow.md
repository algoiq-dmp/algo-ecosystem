# 07 — Data Flow

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Primary Data Flow (Tick Path)

```
Exchange Gateway
      │
      │ UDP Multicast / TCP (lease line)
      ▼
[DPDK NIC Poller] ── RawPacket ──► [Protocol Decoder]
                                        │
                              RawFeedMessage
                                        │
                                        ▼
                                  [Normalizer]
                                        │
                              CanonicalMessage (LCFM v3)
                                        │
                                        ▼
                                  [Sequencer]
                                        │
                           SequencedCanonicalMessage
                                │           │
                                ▼           ▼
                          [Ring Buffer]   [MQ Publisher]
                                │               │
                                │        MQ Topics (per exchange-segment)
                                │               │
                                ▼               ▼
                          [Replay Svc]   Strategy Engines, Dashboards

## Gap Recovery Flow

```
1. Sequencer detects gap (next_seq > expected_seq + 1)
2. Sequencer sends GapDetected event to Replay Service
3. Replay Service opens TCP connection to exchange replay server
4. Replay Service requests range [expected_seq, next_seq - 1]
5. Exchange replays missed messages over TCP
6. Replay Service pushes replayed messages through Normalizer → Sequencer
7. Sequencer fills gaps and updates sequence watermark
8. GapRecovered event emitted
```

## Market Status Change Flow

```
Exchange sends MARKET_STATUS message
    → Decoder parses status (PRE_OPEN, OPEN, CLOSE, AUCTION, HALT)
    → Normalizer maps to Lakshmi standard status enum
    → Sequencer assigns global seq, bypasses ring buffer for priority publish
    → MQ Publisher sends to "market.status" topic with high priority
    → All strategy engines receive within 100 us
```

## Instrument Master Sync Flow

```
1. At 08:00 IST daily: Feed Server pulls instrument master from exchange FTP
2. Parser validates instrument file CRC and signature
3. Normalizer loads symbol map (exchange symbol → Lakshmi symbol_id)
4. Diff against previous master: new symbols, delisted, corporate actions
5. Publish SymbolChangeEvent to "reference.instruments" MQ topic
6. Strategy engines reload symbol mappings
```

## Audit Data Flow

```
Every SequencedCanonicalMessage
    → Feed Audit component serializes to binary format
    → SHA-256 hash computed over each 10K message batch
    → Batch written to Suraksha encrypted storage
    → Merkle tree constructed at EOD for the day's 10K batches
    → Merkle root published to blockchain anchor (compliant timestamping)
```

## Backpressure Flow

When MQ publisher detects consumer lag exceeding threshold:
1. Publish rate is throttled to 50% of max throughput
2. Warning event sent to Narad monitoring
3. Ring buffer write rate adjusted (older slots may be overwritten)
4. If lag persists > 5 seconds, oldest consumers are disconnected
5. Narad alert escalated to P1
