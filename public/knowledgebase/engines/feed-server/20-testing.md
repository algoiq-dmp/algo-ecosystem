# 20 — Testing

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Testing Strategy

The Feed Server testing strategy follows a multi-layered approach: unit, integration, performance, soak, chaos, and exchange certification.

## Unit Tests

**Framework:** GoogleTest (gtest) with gMock
**Coverage target:** > 85% line coverage on all non-DPDK code

### Key Test Suites

| Suite | Location | Test Count |
|-------|----------|------------|
| Protocol Decoders | `tests/unit/decoders/` | 245 |
| Normalizer (LCFM) | `tests/unit/normalizer/` | 178 |
| Sequencer | `tests/unit/sequencer/` | 92 |
| Ring Buffer | `tests/unit/ringbuf/` | 67 |
| MQ Bridge (mock) | `tests/unit/mq/` | 54 |

### Example: Sequencer Gap Detection Test

```cpp
TEST(SequencerTest, DetectsSingleGap) {
    Sequencer seq(SequencerConfig{});
    seq.process(CanonicalMsg{ .exchange_seq = 100 });
    EXPECT_EQ(seq.global_seq(), 1);
    // Inject gap: skip exchange_seq 101
    seq.process(CanonicalMsg{ .exchange_seq = 102 });
    EXPECT_TRUE(seq.has_pending_gap());
    EXPECT_EQ(seq.gap_start(), 101);
    EXPECT_EQ(seq.gap_end(), 101);
}
```

## Integration Tests

**Framework:** Custom Python harness with simulated exchange feed generators

### Test Scenarios
- All-exchange simultaneous feed ingestion (8 feeds)
- Gap recovery with 100K missing messages
- Instrument master hot reload during active feed
- MQ broker disconnect and reconnect
- Suraksha audit service outage
- Multi-instance active/standby failover
- Symbol mapping with corporate action adjustments (bonus, split, merger)

## Performance Tests

Run in CI on dedicated bare-metal test servers (not virtualized) with DPDK:

- **Micro-benchmarks:** Per-component latency using `rdtsc` measurement
- **Load test:** 2M msgs/sec sustained for 1 hour
- **Gap recovery performance:** 100K gap recovery time measurement
- **Memory bandwidth:** Intel PCM (Performance Counter Monitor) during sustained load

## Soak Tests

- **Duration:** 24 hours
- **Load:** 80% of max throughput (800K msgs/sec per feed)
- **Validation:** No sequence gaps, no message loss, no memory leaks, latency within SLA
- **Frequency:** Every release candidate

## Chaos Engineering

### Scenarios (Gremlin-based)
1. Kill primary feed process — verify standby takes over
2. Inject 10% packet loss on primary line — verify throughput degrades gracefully
3. Fill ring buffer to 100% — verify oldest slots are correctly overwritten
4. Simulate Suraksha outage — verify spill files are created and drained on recovery
5. NIC cable pull — verify server failover triggers
6. Network latency injection on MQ link — verify publish queue backpressure works

## Exchange Certification Tests

Before production deployment, each exchange requires certification:
- **NSE:** NFMT 2.0 certification suite (mandatory, renewed annually)
- **BSE:** BOLT Plus feed conformance test
- **MCX:** xStream vendor qualification

Run `certification/nse/run_cert.sh` to execute the NSE certification suite.

## Running Tests

```bash
# Unit tests
cd build && ctest --output-on-failure -j$(nproc)

# Integration tests (requires test MQ broker)
./tests/integration/run_all.sh

# Performance tests (requires bare metal with DPDK)
./tests/perf/run_benchmarks.sh --baseline v2.7.3

# Full CI suite
./ci/run_pipeline.sh --variant release
```
