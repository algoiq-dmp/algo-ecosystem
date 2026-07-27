# 05 — Low-Level Design

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## NIC Poller Design

The NIC poller uses DPDK's `rte_eth_rx_burst()` in a tight polling loop. No interrupts are used on the data path.

### RX Queue Configuration
- 8 RX queues per port, each pinned to a dedicated lcore
- RSS hash function: Toeplitz with symmetric key for flow consistency
- Descriptor ring size: 4096 entries per queue
- RX offloads: `DEV_RX_OFFLOAD_TIMESTAMP`, `DEV_RX_OFFLOAD_JUMBO_FRAME`

### Packet Processing
```
for each RX burst:
  for each mbuf in burst:
    extract VLAN tag → determine exchange
    extract hardware timestamp from mbuf
    push RawPacket to decoder queue (SPSC, lock-free)
    recycle mbuf to mempool
```

## Protocol Decoder — NSE NFMT 2.0

NSE NFMT messages are variable-length binary frames with a 16-byte header:
- **Message Length** (2 bytes, uint16 LE)
- **Message Type** (2 bytes, uint16 LE)
- **Sequence Number** (4 bytes, uint32 LE)
- **Timestamp** (8 bytes, uint64 LE, nanoseconds since epoch)

### Message Types Handled
| Type | Value | Description |
|------|-------|-------------|
| TRADE | 0x0101 | Trade execution |
| QUOTE | 0x0102 | Best bid/ask |
| MARKET_STATUS | 0x0201 | Market state change |
| SNAPSHOT_5 | 0x0305 | 5-level order book snapshot |
| INDEX | 0x0401 | Index value update |
| INSTRUMENT_INFO | 0x0501 | Instrument metadata |

### Decoder State Machine
```
IDLE → HEADER_RECEIVED → BODY_RECEIVED → VALIDATED → EMITTED → IDLE
                                  ↳ INVALID → DROPPED → IDLE
```

## Normalizer — LCFM v3 Schema

The Lakshmi Canonical Feed Message (LCFM) v3 is a flat, fixed-schema protobuf message:

```
message CanonicalMessage {
  uint64 global_seq = 1;
  uint64 exchange_seq = 2;
  fixed64 exchange_ts_ns = 3;
  fixed64 ptp_ts_ns = 4;
  Exchange exchange = 5;
  Segment segment = 6;
  uint32 symbol_id = 7;
  MessageType msg_type = 8;
  oneof payload {
    TradePayload trade = 10;
    QuotePayload quote = 11;
    OrderBookSnapshot ob_snap = 12;
    MarketStatusPayload status = 13;
    IndexPayload index = 14;
  }
}
```

## Ring Buffer Memory Layout

- Total size: 16 GB (configurable)
- Slot size: 256 bytes (cache-line aligned)
- Total slots: 67,108,864
- At 1M msgs/sec: approximately 67 seconds of history
- Layout: `[Header (64B)] [Slot 0 (256B)] [Slot 1 (256B)] ... [Slot N (256B)]`
- Header contains: write cursor, consumer cursor array (one per registered consumer)
