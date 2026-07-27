# 21 — Troubleshooting

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Diagnostic Commands

```bash
mqctl cluster health                     # Overall cluster status
mqctl broker status --id 1               # Specific broker status
mqctl topic describe --name "feed.NSE.CM.tick"  # Topic details with ISR
mqctl group describe --group "strategy-arjun"   # Consumer group status
mqctl broker metrics --id 1              # Broker performance metrics
mqctl storage info --broker mq01-mum     # Storage utilization
```

## Common Issues

### Issue 1: Under-Replicated Partitions

**Symptoms:** `mq_under_replicated_partitions > 0` in Prometheus.

**Causes:**
- Broker down or unreachable
- Network partition between brokers
- Follower replication lagging due to slow disk

**Resolution:**
```bash
# Check which partitions are under-replicated
mqctl cluster partitions --under-replicated

# Check broker connectivity
mqctl broker ping --id 2

# Check follower replication lag
mqctl replica lag --topic "feed.NSE.CM.tick" --partition 0

# If a broker is down, bring it up
systemctl start mqd
```

### Issue 2: Consumer Lag Growing

**Symptoms:** `mq_consumer_lag` increasing monotonically.

**Causes:**
- Consumer processing slower than production rate
- Consumer crashed or paused
- Consumer stuck on a poisoned message

**Resolution:**
```bash
# Identify lagging consumer group
mqctl group lag --all | sort -k2 -rn | head -10

# Pause production to allow catch-up (if needed)
# Check consumer logs for errors
journalctl -u strategy@arjun -f

# Reset consumer offset to skip problematic message range
mqctl group reset-offset --group "strategy-arjun" \
    --topic "feed.NSE.CM.tick" --partition 0 --to-offset 1000000
```

### Issue 3: Leader Election Storm

**Symptoms:** `rate(mq_raft_leader_elections_total[5m]) > 5`

**Causes:**
- Inter-broker network latency spikes
- GC pauses on broker JVM/C++ allocator
- Disk I/O stalls causing heartbeat timeouts
- NTP/PTP clock skew between brokers

**Resolution:**
```bash
# Check inter-broker network latency
ping -c 100 mq02-mum | tail -1

# Check for disk I/O stalls
iostat -x 1 | grep nvme

# Check broker GC/allocation behavior
# Review Narad events for correlated anomalies

# Restart the broker experiencing most leader step-downs
systemctl restart mqd
```

### Issue 4: Disk Space Low

**Symptoms:** `mq_disk_usage_pct > 85`

**Resolution:**
```bash
# Check retention settings
mqctl topic describe --name "feed.NSE.CM.tick" | grep -i retention

# Reduce retention if needed (temporary)
mqctl topic alter --name "feed.NSE.CM.tick" --retention-ms 86400000  # 1 day

# Check for large topics
du -sh /data/mq/data/*/ | sort -rh | head -10

# Trigger manual log cleanup
mqctl storage cleanup --broker mq01-mum

# If urgent, expand storage by adding NVMe
```

### Issue 5: Broker Won't Start

**Symptoms:** `systemctl start mqd` fails.

**Resolution:**
```bash
# Check logs
journalctl -u mqd -n 50 --no-pager

# Common causes:
# 1. Port already in use
ss -tlnp | grep -E "9092|9093|9095|9192"

# 2. Corrupted RocksDB
# Move data and restart (will sync from other replicas)
systemctl stop mqd
mv /data/mq/data /data/mq/data.corrupted
systemctl start mqd
# Broker will rebuild from Raft snapshots

# 3. Insufficient memory for RocksDB block cache
free -h
# Reduce block_cache_mb in broker.yaml
```

### Issue 6: Schema Validation Failures

**Symptoms:** Producer errors: "Schema validation failed for topic X"

**Resolution:**
```bash
# Register missing schema
mqctl schema register --topic "my.topic" \
    --type protobuf --file /path/to/schema.proto

# Check schema compatibility
mqctl schema compatibility --topic "my.topic" --version 2

# If breaking change needed, change compatibility mode (temporarily)
mqctl schema alter --topic "my.topic" --compatibility NONE
```

## Diagnostic Data Collection

```bash
mqctl diag collect --broker mq01-mum --output /tmp/mq-diag-$(date +%Y%m%d).tar.gz
```

Includes: broker config, log files (last 1 hour), RocksDB stats, Raft state, network stats, OS metrics.
