# 21 — Troubleshooting

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Diagnostic Commands

### Quick Health Check

```bash
feeddctl status                          # All feeds overview
feeddctl status --exchange NSE --segment CM  # Specific feed
feeddctl health                          # Health check summary
feeddctl latency --exchange NSE          # Current latency stats
feeddctl gaps                            # Recent gap events
```

### Log Inspection

```bash
journalctl -u feedd@nse-cm-01 -f         # Follow service logs
journalctl -u feedd@nse-cm-01 --since "5 min ago" -p err  # Recent errors
tail -f /var/log/lakshmi/feedd/feedd.log # Application log
grep "GAP" /var/log/lakshmi/feedd/feedd.log  # Gap-related events
```

## Common Issues

### Issue 1: Feed Shows DISCONNECTED

**Symptoms:** `feeddctl status` shows state=DISCONNECTED for a feed.

**Possible Causes:**
1. Exchange gateway is down (market holiday, maintenance window)
2. Physical lease line fault (check with exchange NOC)
3. NIC port flapping (check `dmesg | grep -i link`)
4. DPDK port initialization failed

**Resolution:**
```bash
# Check exchange market status
curl -s https://www.nseindia.com/api/market-status

# Check DPDK port status
dpdk-devbind.py --status

# Check NIC link state
ip link show

# Restart feed connection
feeddctl reconnect --exchange NSE --segment CM
```

### Issue 2: Increasing Sequence Gaps

**Symptoms:** `feedd_gaps_detected_total` counter rising, gap recovery failing.

**Possible Causes:**
1. Multicast packet loss on exchange feed
2. Network congestion on lease line
3. CPU saturation causing RX ring drops
4. Exchange is replaying older data (market event)

**Resolution:**
```bash
# Check NIC RX drops
feeddctl nic-stats --port 0

# Check CPU utilization per core
top -H -p $(pidof feedd)

# Manually trigger gap recovery
feeddctl recover-gap --exchange NSE --segment CM
```

### Issue 3: High Latency

**Symptoms:** `feedd_latency_p99_us` exceeding 100 us.

**Possible Causes:**
1. CPU throttling (thermal or power management)
2. Another process stealing CPU time from feedd cores
3. MQ broker experiencing high load
4. Memory bandwidth contention

**Resolution:**
```bash
# Check for CPU throttling
turbostat --quiet --show PkgWatt,PkgTmp --interval 1

# Check for noisy neighbors on isolated cores
ps -eo pid,psr,comm | grep -E "^[[:space:]]*[0-9]+[[:space:]]+(8|9|1[0-5])"

# Check MQ broker health
mqctl cluster-health
```

### Issue 4: Ring Buffer Full

**Symptoms:** `feedd_ringbuf_utilization_pct` at 100%. Gaps may appear.

**Possible Causes:**
1. MQ consumers are slow or disconnected
2. MQ publish queue backed up
3. Ring buffer size too small for current message rate

**Resolution:**
```bash
# Check MQ consumer lag
mqctl consumer-lag --topic feed.NSE.CM.tick

# Increase ring buffer size (requires restart)
# Edit /etc/lakshmi/feedd/config.yaml → ring_buffer.size_gb = 32
systemctl restart feedd@nse-cm-01
```

### Issue 5: Audit Log Write Failures

**Symptoms:** Log entries: "Failed to flush audit batch: Suraksha unreachable".

**Possible Causes:**
1. Suraksha service is down
2. Network connectivity to Suraksha lost
3. Suraksha storage is full

**Resolution:**
```bash
# Check Suraksha health
curl -k https://suraksha.internal:50070/health

# Check spill file growth
ls -lh /var/spool/lakshmi/feedd/audit_spill/

# Manually drain spill files (once Suraksha is back)
feeddctl drain-audit-spill
```

## Diagnostic Data Collection

For escalated issues, collect the following and attach to the Jira ticket:

```bash
feeddctl diag --output /tmp/feedd-diag-$(date +%Y%m%d-%H%M%S).tar.gz
```

This collects: config, recent logs, metrics snapshot, NIC stats, DPDK stats, process info, and OS info into a single tarball.
