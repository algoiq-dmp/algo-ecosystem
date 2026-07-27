# 12 — Installation

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Prerequisites

Before installation, ensure:
1. Hardware meets or exceeds the [System Requirements](03-system-requirements.md)
2. RHEL 9.4 or Rocky Linux 9.4 is installed with RT kernel
3. HugePages are configured: minimum 32 GB of 1G pages
4. DPDK 23.11 LTS is compiled and installed
5. SR-IOV is enabled in BIOS and VFs are created
6. Exchange lease line cross-connects are provisioned and tested

## HugePages Configuration

```bash
# Check current hugepage allocation
cat /proc/meminfo | grep Huge

# Configure 1G hugepages (persistent)
echo "vm.nr_hugepages = 32768" >> /etc/sysctl.d/99-hugepages.conf
sysctl -p /etc/sysctl.d/99-hugepages.conf

# Mount hugetlbfs
mkdir -p /dev/hugepages
mount -t hugetlbfs -o pagesize=1G none /dev/hugepages

# Add to fstab
echo "none /dev/hugepages hugetlbfs pagesize=1G 0 0" >> /etc/fstab
```

## DPDK Setup

```bash
# Bind NIC to DPDK-compatible driver (vfio-pci)
modprobe vfio-pci
dpdk-devbind.py --bind=vfio-pci 0000:17:00.0 0000:17:00.1

# Verify binding
dpdk-devbind.py --status
```

## Package Installation

```bash
# Add Lakshmi repository
cat > /etc/yum.repos.d/lakshmi.repo <<EOF
[lakshmi]
name=Lakshmi Repository
baseurl=https://artifacts.internal/lakshmi/el9/x86_64
gpgcheck=1
gpgkey=https://artifacts.internal/lakshmi/gpg.key
enabled=1
EOF

# Install Feed Server
dnf install -y lakshmi-feedd-2.8.0

# Verify installation
rpm -qa | grep feedd
feedd --version
```

## Post-Installation

```bash
# Create required directories
mkdir -p /var/log/lakshmi/feedd
mkdir -p /var/run/lakshmi
mkdir -p /opt/lakshmi/feedd/symbols

# Set permissions
chown -R lakshmi:lakshmi /var/log/lakshmi/feedd
chown -R lakshmi:lakshmi /opt/lakshmi/feedd

# Enable and start service
systemctl enable feedd@nse-cm-01
systemctl start feedd@nse-cm-01

# Check status
systemctl status feedd@nse-cm-01
feeddctl status
```

## Network Interface Configuration

The management interface should be on a separate NIC from the feed interfaces. Configure via NetworkManager or ifcfg files:

```bash
nmcli con add type ethernet ifname eno1 con-name mgmt-nic ip4 10.100.1.10/24 gw4 10.100.1.1
nmcli con up mgmt-nic
```

Feed interfaces are managed exclusively by DPDK and must NOT have OS-level IP configuration. ARP entries for exchange gateways are configured statically via `feedd.yaml`.

## Verification Checklist

- [ ] `feedd --version` returns v2.8.0
- [ ] `feeddctl status` shows `CONNECTED` for all configured feeds
- [ ] Prometheus metrics accessible at `:9090/metrics`
- [ ] `feedd_msgs_ingested_total` counter is incrementing
- [ ] No sequence gaps in first 60 seconds of operation
- [ ] Ring buffer is accessible via shared memory
- [ ] MQ topics are receiving published messages (verify via `mqctl topic-stats`)
