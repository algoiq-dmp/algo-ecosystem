# 20 — Testing

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Testing Strategy

MQ testing covers unit, integration, performance, fault injection, chaos, and upgrade compatibility.

## Unit Tests

**Framework:** GoogleTest + gMock
**Coverage target:** > 80% line coverage

| Suite | Location | Test Count |
|-------|----------|------------|
| Protocol codec | `tests/unit/protocol/` | 112 |
| Raft consensus | `tests/unit/raft/` | 203 |
| Storage engine | `tests/unit/storage/` | 156 |
| Consumer coordinator | `tests/unit/coordinator/` | 89 |
| ACL enforcement | `tests/unit/security/` | 67 |

### Example: Raft Leader Election Test

```cpp
TEST(RaftTest, ElectsLeaderWithQuorum) {
    RaftCluster cluster(3);
    cluster.start();
    cluster.wait_for_leader(Duration::seconds(5));
    auto leader = cluster.leader();
    ASSERT_TRUE(leader.has_value());
    ASSERT_EQ(cluster.followers().size(), 2);
}
```

## Integration Tests

### Test Scenarios
- 3-broker cluster bootstrap and health check
- Producer → Broker → Consumer (end-to-end)
- Multi-topic, multi-partition concurrent produce/consume
- Producer failover to new partition leader
- Consumer group rebalance with join/leave
- Schema registry enforcement (valid + invalid schemas)
- Cross-DC mirror: produce in DC1, verify consumption in DC2
- Topic configuration changes at runtime
- ACL enforcement across principals

## Performance Tests (CI)

Run on dedicated bare-metal servers matching production hardware specs:
- 30-minute sustained load at 8M msgs/sec
- 1-hour soak with p99 latency monitoring
- Consumer lag recovery after 10-minute producer outage
- Compaction impact on tail latency

## Jepsen-style Fault Injection

| Test | Description | Expected Outcome |
|------|-------------|-----------------|
| Kill leader | Kill partition leader process | New leader elected, no data loss |
| Network partition | Isolate 1 of 3 brokers | Partition available with 2-node quorum |
| Clock skew | Advance one broker clock by 5 seconds | Raft detects and adjusts; no split-brain |
| Disk full | Fill disk to 100% | Broker rejects writes; partitions fail over |
| Process pause | SIGSTOP broker for 10 seconds | Leader steps down; new leader elected |

## Chaos Testing

Weekly chaos engineering sessions (Saturday, 2 hours):
1. Random network latency injection (10-50ms) on inter-broker links
2. Random broker process kills (1 every 5 minutes)
3. NIC throughput throttling to 50%
4. Consumer process kill and recovery
5. Suraksha service outage simulation

## Upgrade Compatibility Tests

Before every release, test upgrade from N-1 and N-2 versions:
1. Deploy cluster with previous version
2. Create topics, produce messages at load
3. Perform rolling upgrade to new version
4. Verify no data loss, offset continuity, schema compatibility

## Running Tests Locally

```bash
# Unit tests
cd build && ctest -R mq_ -j$(nproc) --output-on-failure

# Integration tests (requires local 3-broker cluster)
./tests/integration/mq/run.sh --brokers 3

# Performance tests (requires dedicated hardware)
./tests/perf/mq/run_benchmarks.sh --duration 1800

# Jepsen tests
./tests/jepsen/mq/run.sh --nemesis kill-leader,partition,disk-full

# Chaos tests (manual trigger)
./tests/chaos/mq/chaos-saturday.sh
```
