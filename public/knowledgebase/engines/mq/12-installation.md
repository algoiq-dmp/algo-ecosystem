# 12 — Installation

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Prerequisites

1. Hardware meets [System Requirements](03-system-requirements.md)
2. RHEL 9.4 or Rocky Linux 9.4 installed
3. NVMe drives formatted as XFS (optimized for RocksDB)
4. Network interfaces configured and tested
5. DNS resolution for all broker hostnames
6. Suraksha certificates provisioned for mTLS

## Storage Setup

```bash
# Create XFS filesystem (optimized for RocksDB large file I/O)
mkfs.xfs -f -m reflink=0 -d agcount=8 -l size=256m -n size=8192 /dev/nvme0n1

# Mount with recommended options
mkdir -p /data/mq
mount -o noatime,nodiratime,largeio,inode64,swalloc /dev/nvme0n1 /data/mq

# Add to fstab
echo "/dev/nvme0n1 /data/mq xfs noatime,nodiratime,largeio,inode64,swalloc 0 0" >> /etc/fstab
```

## Package Installation

```bash
# Install MQ broker
dnf install -y lakshmi-mq-5.1.3

# Install CLI tools
dnf install -y lakshmi-mqctl-5.1.3

# Verify
mqd --version
mqctl version
```

## Post-Installation

```bash
# Create data directories
mkdir -p /data/mq/{data,raft,config,tmp,checkpoints}

# Set permissions
chown -R lakshmi:lakshmi /data/mq

# Set broker ID (unique per node)
echo "1" > /data/mq/config/broker_id

# Configure broker
vim /etc/lakshmi/mq/broker.yaml

# Enable and start
systemctl enable mqd
systemctl start mqd

# Verify cluster formation (once all brokers are up)
mqctl cluster health
```

## Cluster Bootstrap

For a new cluster, brokers must be started in sequence:

```bash
# On mq01-mum (seed node):
systemctl start mqd

# Wait for broker to be ready
mqctl --broker mq01-mum:9095 broker status

# On mq02-mum (joins existing cluster):
# broker.yaml must list mq01-mum as seed
systemctl start mqd

# On mq03-mum:
systemctl start mqd

# Verify cluster
mqctl cluster health
# Expected: 3 brokers, all healthy
```

## Verification Checklist

- [ ] `mqd --version` returns v5.1.3
- [ ] `mqctl cluster health` shows all brokers (e.g., 3/3 healthy)
- [ ] `mqctl topic list` shows system topics (`__consumer_offsets`, `__cluster_metadata`)
- [ ] Prometheus metrics accessible at `:9192/metrics`
- [ ] Can create a test topic, produce, and consume messages
- [ ] Schema registry is accessible and responding
- [ ] Cross-DC mirroring is working (produce in DC1, consume in DC2)

## Test Produce/Consume

```bash
# Create test topic
mqctl topic create --name "test.install" --partitions 1 --replication 1

# Produce a test message (using echo + netcat to raw protocol)
echo "0000001a00000000..." | nc mq01-mum 9092

# Consume via CLI
mqctl consume --topic "test.install" --group "test-group" --max-messages 1

# Cleanup
mqctl topic delete --name "test.install"
```
